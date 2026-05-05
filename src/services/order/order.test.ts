import { describe, test, expect, beforeEach } from '@jest/globals';
import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { configureStore } from '@reduxjs/toolkit';
import { getOrderById, makeOrder } from './order-actions';
import { rootReducer } from '../store';
import mockBun from '../../../mocks/bun.json';
import mockIngredients from '../../../mocks/ingredients.json';
import mockOrders from '../../../mocks/orders.json';

jest.mock('@api', () => ({
  getOrderByNumberApi: jest.fn(),
  orderBurgerApi: jest.fn()
}));

const mockedGetOrderByNumberApi = getOrderByNumberApi as jest.MockedFunction<
  typeof getOrderByNumberApi
>;
const mockedOrderBurgerApi = orderBurgerApi as jest.MockedFunction<
  typeof orderBurgerApi
>;

function createTestStore() {
  return configureStore({
    reducer: rootReducer,
    preloadedState: {
      burgerConstructor: {
        bun: mockBun,
        ingredients: mockIngredients
      }
    }
  });
}

describe('order thunks', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('при вызове экшена request isLoading и isOrdering меняются на true', () => {
    mockedGetOrderByNumberApi.mockImplementation(() => new Promise(() => {}));
    mockedOrderBurgerApi.mockImplementation(() => new Promise(() => {}));
    const store = createTestStore();

    store.dispatch(getOrderById(0));
    store.dispatch(makeOrder());

    const state = store.getState().order;
    expect(state.loading).toBe(true);
    expect(state.isOrdering).toBe(true);
  });

  test('при успешном выполнении данные сохраняются, флаги сбрасываются', async () => {
    const orderData: Awaited<ReturnType<typeof getOrderByNumberApi>> = {
      success: true,
      orders: mockOrders
    };
    const newOrderData: Awaited<ReturnType<typeof orderBurgerApi>> = {
      success: true,
      name: 'test',
      order: {
        ...mockOrders[0],
        owner: { name: '', createdAt: '', email: '', updatedAt: '' },
        price: 0
      }
    };

    mockedGetOrderByNumberApi.mockResolvedValue(orderData);
    mockedOrderBurgerApi.mockResolvedValue(newOrderData);

    const store = createTestStore();
    await store.dispatch(getOrderById(0));
    await store.dispatch(makeOrder());

    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.order).toEqual(orderData.orders[0]);

    expect(state.isOrdering).toBe(false);
    expect(state.orderingError).toBeNull();
    expect(state.orderModalData).toEqual(newOrderData.order);
  });

  test('при ошибке флаги сбрасываются, ошибки сохраняются', async () => {
    mockedGetOrderByNumberApi.mockRejectedValue(new Error('Rejected'));
    mockedOrderBurgerApi.mockRejectedValue(new Error('Rejected'));

    const store = createTestStore();
    await store.dispatch(getOrderById(0));
    await store.dispatch(makeOrder());

    const state = store.getState().order;

    expect(state.loading).toBe(false);
    expect(state.error).toBe('Rejected');
    expect(state.order).toBeNull();
    expect(state.isOrdering).toBe(false);
    expect(state.orderingError).toBe('Rejected');
    expect(state.orderModalData).toBeNull();
  });
});
