import { createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';
import { getFeed } from './feed-actions';

type TFeedState = {
  data: TOrdersData;
  loading: boolean;
  error?: string | null;
};

export const initialState: TFeedState = {
  data: {
    orders: [],
    total: 0,
    totalToday: 0
  },
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeedSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      });
  }
});

export const { getFeedSelector } = feedSlice.selectors;
