import { getFeedsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';

export const getFeed = createAsyncThunk('feed/getAll', async () =>
  getFeedsApi()
);
