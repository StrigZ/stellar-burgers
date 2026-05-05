/**
 * @jest-environment jsdom
 */

import { describe, test, expect, beforeEach } from '@jest/globals';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi
} from '@api';
import { configureStore } from '@reduxjs/toolkit';
import {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser
} from './user-actions';
import { rootReducer } from '../store';
import { TUser } from '@utils-types';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
};
Object.defineProperty(global, 'localStorage', { value: localStorageMock });

let cookieValue = '';
Object.defineProperty(document, 'cookie', {
  get: () => cookieValue,
  set: (val: string) => {
    cookieValue = val;
  },
  configurable: true
});

jest.mock('@api', () => ({
  loginUserApi: jest.fn(),
  registerUserApi: jest.fn(),
  getUserApi: jest.fn(),
  updateUserApi: jest.fn(),
  logoutApi: jest.fn()
}));

const mockedLoginUserApi = loginUserApi as jest.MockedFunction<
  typeof loginUserApi
>;
const mockedRegisterUserApi = registerUserApi as jest.MockedFunction<
  typeof registerUserApi
>;
const mockedGetUserApi = getUserApi as jest.MockedFunction<typeof getUserApi>;
const mockedUpdateUserApi = updateUserApi as jest.MockedFunction<
  typeof updateUserApi
>;
const mockedLogoutUserApi = logoutApi as jest.MockedFunction<typeof logoutApi>;

function createStore() {
  return configureStore({ reducer: rootReducer });
}

const mockUser: TUser = { email: 'test@test.com', name: 'Test' };

describe('user thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    cookieValue = '';
  });

  describe('loginUser', () => {
    test('pending устанавливает userRequest: true', () => {
      mockedLoginUserApi.mockImplementation(() => new Promise(() => {}));
      const store = createStore();
      store.dispatch(loginUser({ email: '', password: '' }));
      expect(store.getState().user.userRequest).toBe(true);
    });

    test('fulfilled сохраняет пользователя, ставит isAuth и isUserChecked', async () => {
      const response = {
        success: true,
        user: mockUser,
        accessToken: 'access123',
        refreshToken: 'refresh456'
      };
      mockedLoginUserApi.mockResolvedValue(response);
      const store = createStore();

      await store.dispatch(loginUser({ email: '', password: '' }));
      const state = store.getState().user;

      expect(state.userRequest).toBe(false);
      expect(state.user).toEqual(response.user);
      expect(state.isAuth).toBe(true);
      expect(state.isUserChecked).toBe(true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'refresh456'
      );
      expect(cookieValue).toContain('accessToken=access123');
    });

    test('rejected сбрасывает userRequest, ставит isUserChecked', async () => {
      mockedLoginUserApi.mockRejectedValue(new Error('Rejected'));
      const store = createStore();
      await store.dispatch(loginUser({ email: '', password: '' }));
      const state = store.getState().user;
      expect(state.userRequest).toBe(false);
      expect(state.isUserChecked).toBe(true);
      expect(state.isAuth).toBe(false);
    });
  });

  describe('registerUser', () => {
    test('fulfilled работает как loginUser', async () => {
      const response = {
        success: true,
        user: mockUser,
        accessToken: 'access123',
        refreshToken: 'refresh456'
      };
      mockedRegisterUserApi.mockResolvedValue(response);
      const store = createStore();
      await store.dispatch(registerUser({ email: '', password: '', name: '' }));
      expect(store.getState().user.isAuth).toBe(true);

      expect(localStorage.setItem).toHaveBeenCalledWith(
        'refreshToken',
        'refresh456'
      );
      expect(cookieValue).toContain('accessToken=access123');
    });
  });

  describe('getUser', () => {
    test('fulfilled сохраняет пользователя и активирует isAuth', async () => {
      const response = {
        success: true,
        user: mockUser,
        accessToken: 'token',
        refreshToken: 'token'
      };
      mockedGetUserApi.mockResolvedValue(response);
      const store = createStore();
      await store.dispatch(getUser());
      const state = store.getState().user;
      expect(state.user).toEqual(mockUser);
      expect(state.isAuth).toBe(true);
      expect(state.isUserChecked).toBe(true);
    });

    test('rejected сбрасывает авторизацию полностью', async () => {
      mockedGetUserApi.mockRejectedValue(new Error('not authed'));
      const store = createStore();
      await store.dispatch(getUser());
      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.isUserChecked).toBe(true);
    });
  });

  describe('updateUser', () => {
    test('fulfilled обновляет пользователя, не меняет isAuth', async () => {
      const response = {
        success: true,
        user: { email: 'new', name: 'new' },
        accessToken: 'token',
        refreshToken: 'token'
      };
      mockedUpdateUserApi.mockResolvedValue(response);
      const store = createStore();
      await store.dispatch(updateUser({ email: 'new', name: 'new' }));
      expect(store.getState().user.user).toEqual(response.user);
      expect(store.getState().user.isAuth).toBe(false);
    });
  });

  describe('logoutUser', () => {
    test('fulfilled очищает пользователя и сбрасывает авторизацию', async () => {
      const response = {
        success: true
      };
      mockedLogoutUserApi.mockResolvedValue(response);
      const store = createStore();

      await store.dispatch(logoutUser());
      const state = store.getState().user;
      expect(state.user).toBeNull();
      expect(state.isAuth).toBe(false);
      expect(state.isUserChecked).toBe(true);

      expect(localStorage.removeItem).toHaveBeenCalledWith('refreshToken');
      expect(cookieValue).toContain('accessToken=;');
    });
  });
});
