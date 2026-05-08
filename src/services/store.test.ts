import { expect, test } from '@jest/globals';
import { rootReducer } from './store';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { orderSlice } from './order/order-slice';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { feedSlice } from './feed/feed-slice';
import { userOrdersSlice } from './user-orders/user-orders-slice';
import { userSlice } from './user/user-slice';

test('initializes the state correctly', () => {
  const initAction = { type: '@@INIT' };
  const state = rootReducer(undefined, initAction);

  expect(state).toEqual({
    burgerConstructor: burgerConstructorSlice.reducer(undefined, initAction),
    order: orderSlice.reducer(undefined, initAction),
    ingredients: ingredientsSlice.reducer(undefined, initAction),
    feed: feedSlice.reducer(undefined, initAction),
    userOrders: userOrdersSlice.reducer(undefined, initAction),
    user: userSlice.reducer(undefined, initAction)
  });
});

test('handles unknown action correctly', () => {
  const fakeAction = { type: 'UNKNOWN_ACTION' };
  const state = rootReducer(undefined, fakeAction);
  expect(state).toEqual({
    burgerConstructor: burgerConstructorSlice.reducer(undefined, fakeAction),
    order: orderSlice.reducer(undefined, fakeAction),
    ingredients: ingredientsSlice.reducer(undefined, fakeAction),
    feed: feedSlice.reducer(undefined, fakeAction),
    userOrders: userOrdersSlice.reducer(undefined, fakeAction),
    user: userSlice.reducer(undefined, fakeAction)
  });
});
