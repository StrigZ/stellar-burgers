import { createSlice } from '@reduxjs/toolkit';
import { TNewOrder, TOrder } from '@utils-types';
import { getOrderById, makeOrder } from './order-actions';

type TOrderState = {
  order: TOrder | null;
  loading: boolean;
  error?: string | null;

  orderModalData: TNewOrder | null;

  isOrdering: boolean;
  orderingError?: string | null;
};

const initialState: TOrderState = {
  order: null,
  loading: false,
  error: null,
  orderModalData: null,
  isOrdering: false,
  orderingError: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    closeOrderModal: (state) => {
      state.orderModalData = null;
      state.isOrdering = false;
    }
  },
  selectors: {
    getOrdersSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })

      .addCase(makeOrder.pending, (state) => {
        state.isOrdering = true;
        state.orderingError = null;
        state.orderModalData = null;
      })
      .addCase(makeOrder.rejected, (state, action) => {
        state.isOrdering = false;
        state.orderingError = action.error.message;
        state.orderModalData = null;
      })
      .addCase(makeOrder.fulfilled, (state, action) => {
        state.isOrdering = false;
        state.orderModalData = action.payload;
      });
  }
});

export const { getOrdersSelector } = orderSlice.selectors;
export const { closeOrderModal } = orderSlice.actions;
