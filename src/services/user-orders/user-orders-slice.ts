import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { getUserOrders } from './user-orders-actions';

type TUserOrdersState = {
  orders: TOrder[];
  loading: boolean;
  error?: string | null;
};

const initialState: TUserOrdersState = {
  orders: [],
  loading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState,
  reducers: {},
  selectors: {
    getUserOrdersSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      });
  }
});

export const { getUserOrdersSelector } = userOrdersSlice.selectors;
