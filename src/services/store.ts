import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { ingredientsSlice } from './ingredients/ingredients-slice';
import { feedSlice } from './feed/feed-slice';
import { orderSlice } from './order/order-slice';
import { userOrdersSlice } from './user-orders/user-orders-slice';
import { burgerConstructorSlice } from './burger-constructor/burger-constructor-slice';
import { userSlice } from './user/user-slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  feedSlice,
  orderSlice,
  userOrdersSlice,
  burgerConstructorSlice,
  userSlice
); // Заменить на импорт настоящего редьюсера

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
