import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  loginUserApi,
  registerUserApi,
  getUserApi,
  updateUserApi,
  logoutApi,
  type TRegisterData,
  type TLoginData
} from '@api';
import { TUser } from '@utils-types';
import { RootState } from '../store';
import { setCookie } from '../../utils/cookie';

export const loginUser = createAsyncThunk<
  {
    user: TUser;
    accessToken: string;
  },
  TLoginData,
  { state: RootState }
>('user/loginUser', async (loginData, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(loginData);

    const { accessToken, refreshToken } = res;
    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return res;
  } catch {
    return rejectWithValue('Ошибка при авторизации пользователя');
  }
});

export const registerUser = createAsyncThunk<
  {
    user: TUser;
    accessToken: string;
  },
  TRegisterData,
  { state: RootState }
>('user/registerUser', async (registerData, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(registerData);

    const { accessToken, refreshToken } = res;
    localStorage.setItem('refreshToken', refreshToken);
    setCookie('accessToken', accessToken);

    return res;
  } catch {
    return rejectWithValue('Ошибка при регистрации пользователя');
  }
});

export const getUser = createAsyncThunk<TUser, void, { state: RootState }>(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const res = await getUserApi();

      return res.user;
    } catch {
      return rejectWithValue('Ошибка при авторизации пользователя');
    }
  }
);

export const updateUser = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  async (userData, { rejectWithValue }) => {
    try {
      const res = await updateUserApi(userData);

      return res.user;
    } catch {
      return rejectWithValue('Ошибка при обновлении данных пользователя');
    }
  }
);

export const logoutUser = createAsyncThunk<void, void>(
  'user/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
    } catch {
      return rejectWithValue('Ошибка при обновлении выходе пользователя');
    } finally {
      localStorage.removeItem('refreshToken');
      setCookie('accessToken', '', { expires: new Date(0) });
    }
  }
);
