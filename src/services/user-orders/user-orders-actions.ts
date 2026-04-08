import { getOrdersApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getUserOrders = createAsyncThunk('userOrders/getAll', async () =>
  getOrdersApi()
);
