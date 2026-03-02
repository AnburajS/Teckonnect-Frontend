import { createAsyncThunk } from '@reduxjs/toolkit';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import { showModal } from './modalSlice';

// Async thunk to call the API
export const createEmailTemplates = createAsyncThunk(
  'emailTemplate/create',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpHandler({
        url: URL_CONFIG.CREATEEMAILTEMPLATE,
        method: 'post',
        isLoader: true,
        payload: payload,
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
        dispatch(
          showModal({
            type: 'success',
            message:
              response?.data?.message || 'Template created successfully!',
          })
        );
      }

      return response.data;
    } catch (error) {
      dispatch(
        showModal({
          type: 'danger',
          message: error?.response?.data?.message || 'Something went wrong',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const updateEmailTemplates = createAsyncThunk(
  'emailTemplate/update',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpHandler({
        url: `${URL_CONFIG.UPDATEEMAILTEMPLATE}?id=${payload.id}`,
        method: 'put',
        isLoader: true,
        payload: payload,
        params: { id: payload.id },
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
        dispatch(
          showModal({
            type: 'success',
            message:
              response?.data?.message || 'Template created successfully!',
          })
        );
      }

      return response.data;
    } catch (error) {
      dispatch(
        showModal({
          type: 'danger',
          message: error?.response?.data?.message || 'Something went wrong',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getEmailTemplatesList = createAsyncThunk(
  'emailTemplate/get',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpHandler({
        url: `${URL_CONFIG.GETEMAILTEMPLATELIST}`,
        method: 'get',
        isLoader: true,
        // payload: payload,
        // params: { id: payload.id },
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
        // dispatch(
        //   showModal({
        //     type: 'success',
        //     message:
        //       response?.data?.message || 'Template created successfully!',
        //   })
        // );
      }

      return response.data;
    } catch (error) {
      dispatch(
        showModal({
          type: 'danger',
          message: error?.response?.data?.message || 'Something went wrong',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const getEmailTemplates = createAsyncThunk(
  'emailTemplate/getOne',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // ('payload', payload);
      const response = await httpHandler({
        url: `${URL_CONFIG.GETEMAILTEMPLATE}`,
        method: 'get',
        isLoader: true,
        // payload: payload,
        params: { id: payload.id },
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
        // dispatch(
        //   showModal({
        //     type: 'success',
        //     message:
        //       response?.data?.message || 'Template created successfully!',
        //   })
        // );
      }

      return response.data;
    } catch (error) {
      dispatch(
        showModal({
          type: 'danger',
          message: error?.response?.data?.message || 'Something went wrong',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);

export const triggerEmail = createAsyncThunk(
  'emailTemplate/trigger',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      const response = await httpHandler({
        url: `${URL_CONFIG.TRIGGEREMAILTEMPLATE}`,
        method: 'post',
        isLoader: true,
        payload: payload,
        // params: { id: payload.id },
      });
      if (response?.data?.status === 400) {
        dispatch(
          showModal({
            type: 'danger',
            message: response?.data?.message || 'Something went wrong',
          })
        );
      } else {
        dispatch(
          showModal({
            type: 'success',
            message: response?.data?.message || 'Mail Send successfully!',
          })
        );
      }

      return response.data;
    } catch (error) {
      dispatch(
        showModal({
          type: 'danger',
          message: error?.response?.data?.message || 'Something went wrong',
        })
      );
      return rejectWithValue(error.message);
    }
  }
);
