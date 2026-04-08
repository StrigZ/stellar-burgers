import { getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TNewOrder, TOrder } from '@utils-types';
import { RootState } from '../store';

export const getOrderById = createAsyncThunk(
  'order/getById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await getOrderByNumberApi(id);

      if (!res.success) {
        return rejectWithValue('Не удалось получить заказ.');
      }

      if (res.orders.length === 0) {
        return rejectWithValue('Заказ не найден');
      }

      return res.orders[0];
    } catch (error) {
      return rejectWithValue('Не удалось получить заказ.');
    }
  }
);

export const makeOrder = createAsyncThunk<
  TNewOrder,
  void,
  { state: RootState }
>('order/makeOrder', async (_, { rejectWithValue, getState }) => {
  const {
    burgerConstructor: { bun, ingredients }
  } = getState();

  if (!bun || ingredients.length === 0) {
    return rejectWithValue('Не удалось создать заказ.');
  }

  const burgerData = [bun._id, ...ingredients.map(({ _id }) => _id), bun._id];

  try {
    const res = await orderBurgerApi(burgerData);
    if (!res.success) {
      return rejectWithValue('Ошибка создания заказа');
    }

    return { ...res.order };
  } catch (error) {
    return rejectWithValue('Не удалось создать заказ.');
  }
});
