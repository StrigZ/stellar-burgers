import { test } from '@jest/globals';
import { initialState } from './feed-slice';

import { getFeedsApi } from '@api';
import { configureStore, SerializedError } from '@reduxjs/toolkit';
import { getFeed } from './feed-actions';
import { rootReducer } from '../store';

function createTestStore() {
  return configureStore({
    reducer: rootReducer
  });
}

jest.mock('@api', () => ({
  getFeedsApi: jest.fn()
}));

const mockedGetFeedsApi = getFeedsApi as jest.MockedFunction<
  typeof getFeedsApi
>;

test('при вызове экшена request isLoading меняется на true', async () => {
  const store = createTestStore();
  store.dispatch(getFeed());
  const state = store.getState().feed;
  expect(state.loading).toBe(true);
});
test('при вызове экшена success, isLoading меняется на false и полученные данные сохраняются в стор', async () => {
  const mockData: Awaited<ReturnType<typeof getFeedsApi>> = {
    success: true,
    orders: [],
    total: 10,
    totalToday: 10
  };
  mockedGetFeedsApi.mockResolvedValue(mockData);

  const store = createTestStore();
  await store.dispatch(getFeed());
  const state = store.getState().feed;

  expect(state.loading).toBe(false);
  expect(state.error).toBe(null);
  expect(state.data).toEqual(mockData);
});
test('при вызове экшена failed isLoading меняется на false и ошибка сохраняется в стор', async () => {
  const mockData: SerializedError & { success: false } = {
    success: false,
    message: 'error'
  };
  mockedGetFeedsApi.mockRejectedValue(mockData);

  const store = createTestStore();
  await store.dispatch(getFeed());
  const state = store.getState().feed;

  expect(state.loading).toBe(false);
  expect(state.error).toBe(mockData.message);
  expect(state.data).toEqual(initialState.data);
});
