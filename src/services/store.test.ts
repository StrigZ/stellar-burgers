import { expect, test } from '@jest/globals';
import { rootReducer } from './store';

test('rootReducer должен правильно инициализироваться', () => {
  const initialState = rootReducer(undefined, { type: '@@INIT' });

  expect(initialState).toBeDefined();

  expect(initialState).toHaveProperty('user');
  expect(initialState).toHaveProperty('userOrders');
  expect(initialState).toHaveProperty('feed');
  expect(initialState).toHaveProperty('ingredients');
  expect(initialState).toHaveProperty('order');
  expect(initialState).toHaveProperty('burgerConstructor');
});
