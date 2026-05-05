import { test } from '@jest/globals';

import { getIngredientsApi } from '@api';
import { configureStore, SerializedError } from '@reduxjs/toolkit';
import { getIngredients } from './ingredients-actions';
import { initialState } from './ingredients-slice';
import { rootReducer } from '../store';

function createTestStore() {
  return configureStore({
    reducer: rootReducer
  });
}

jest.mock('@api', () => ({
  getIngredientsApi: jest.fn()
}));

const mockedGetIngredientsApi = getIngredientsApi as jest.MockedFunction<
  typeof getIngredientsApi
>;

beforeEach(() => {
  jest.clearAllMocks();
});

test('при вызове экшена request isLoading меняется на true', async () => {
  const store = createTestStore();
  store.dispatch(getIngredients());
  const state = store.getState().ingredients;
  expect(state.loading).toBe(true);
});
test('при вызове экшена success, isLoading меняется на false и полученные данные сохраняются в стор', async () => {
  const mockData: Awaited<ReturnType<typeof getIngredientsApi>> = [];
  mockedGetIngredientsApi.mockResolvedValue(mockData);

  const store = createTestStore();
  await store.dispatch(getIngredients());
  const state = store.getState().ingredients;

  expect(state.loading).toBe(false);
  expect(state.error).toBe(null);
  expect(state.data).toEqual(mockData);
});
test('при вызове экшена failed isLoading меняется на false и ошибка сохраняется в стор', async () => {
  const mockData: SerializedError & { success: false } = {
    success: false,
    message: 'error'
  };
  mockedGetIngredientsApi.mockRejectedValue(mockData);

  const store = createTestStore();
  await store.dispatch(getIngredients());
  const state = store.getState().ingredients;

  expect(state.loading).toBe(false);
  expect(state.error).toBe(mockData.message);
  expect(state.data).toEqual(initialState.data);
});
