import { getOrdersApi } from '@api';
import { beforeEach, describe, expect, test } from '@jest/globals';
import { configureStore } from '@reduxjs/toolkit';
import { rootReducer } from '../store';
import { getUserOrders } from './user-orders-actions';
import mockOrders from '../../../mocks/orders.json';

jest.mock('@api', () => ({
  getOrdersApi: jest.fn()
}));

const mockedGetOrdersApi = getOrdersApi as jest.MockedFunction<
  typeof getOrdersApi
>;

function createStore() {
  return configureStore({ reducer: rootReducer });
}
describe('getUserOrders слайс', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('getUserOrders.pending работает корректно', () => {
    mockedGetOrdersApi.mockImplementation(() => new Promise(() => {}));
    const store = createStore();
    store.dispatch(getUserOrders());

    const state = store.getState().userOrders;
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual([]);
  });

  test('getUserOrders.rejected работает корректно', async () => {
    mockedGetOrdersApi.mockRejectedValue(new Error('Rejected'));
    const store = createStore();
    await store.dispatch(getUserOrders());

    const state = store.getState().userOrders;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Rejected');
    expect(state.orders).toEqual([]);
  });
  test('getUserOrders.fulfilled работает корректно', async () => {
    mockedGetOrdersApi.mockResolvedValue(mockOrders);
    const store = createStore();
    await store.dispatch(getUserOrders());

    const state = store.getState().userOrders;
    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.orders).toEqual(mockOrders);
  });
});
