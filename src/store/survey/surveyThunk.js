import { createAsyncThunk } from '@reduxjs/toolkit';

import { showModal } from '../modalSlice';
import { URL_CONFIG } from '../../constants/rest-config';
import { httpHandler } from '../../http/http-interceptor';

// Async thunk to call the API
export const getPendingSurvey = createAsyncThunk(
  'survey/pending',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpHandler({
        url: URL_CONFIG.PENDING_SURVEY,
        method: 'get',
        isLoader: false,
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
      }

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);
