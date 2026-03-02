// emailTemplate-slice.js
import { createSlice } from '@reduxjs/toolkit';

import { getPendingSurvey } from './surveyThunk';

const initialState = {
  status: null,
  message: null,

  loading: false,
  error: null,
  getPendingSurvey: {
    loading: false,
    error: null,
    data: [],
  },
};

const surveySlice = createSlice({
  name: 'survey',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPendingSurvey.pending, (state) => {
        state.getPendingSurvey.loading = true;
        state.getPendingSurvey.error = null;
      })
      .addCase(getPendingSurvey.fulfilled, (state, action) => {
        state.getPendingSurvey.loading = false;
        state.getPendingSurvey.data = action.payload;
        state.status = 'success';
      })
      .addCase(getPendingSurvey.rejected, (state, action) => {
        state.getPendingSurvey.loading = false;
        state.getPendingSurvey.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default surveySlice;
