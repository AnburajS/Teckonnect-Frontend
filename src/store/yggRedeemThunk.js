import { createAsyncThunk } from '@reduxjs/toolkit';
import { URL_CONFIG } from '../constants/rest-config';
import { httpHandler } from '../http/http-interceptor';
import { showModal } from './modalSlice';

// Async thunk to call the API

export const getYggBrandList = createAsyncThunk(
  'yggRedeem/yggbrands',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // ('payload', payload);
      const response = await httpHandler({
        url: `${URL_CONFIG.YGGBRANDLIST}`,
        method: 'get',
        isLoader: true,
        // payload: payload,
        params: { currencyCode: payload.currencyCode },
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
      const allBrands = Array.isArray(response?.data?.data)
        ? response.data.data.reduce((acc, item) => {
            if (Array.isArray(item.brand_details)) {
              return acc.concat(item.brand_details);
            }
            return acc;
          }, [])
        : [];
      const extractUniqueCategories = (products) => {
        const seen = new Set();

        const categories = products?.flatMap((product) =>
          (product.categories || []).filter((cat) => {
            const key = `${cat.id}-${cat.name}`;
            if (!seen.has(key)) {
              seen.add(key);
              return true;
            }
            return false;
          })
        );

        // Add 'All' category at index 0
        const allCategory = {
          id: 0,
          name: 'All',
        };
        categories?.unshift(allCategory);

        return categories; // 👈 Return as array of objects
      };
      return {
        ...response?.data,
        data: {
          product: allBrands,
          productType: extractUniqueCategories(allBrands),
        },
      };
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

export const getCountryMappingList = createAsyncThunk(
  'yggRedeem/YggCountryList',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // ('payload', payload);
      const response = await httpHandler({
        url: `${URL_CONFIG.YGGCOUNTRYMAPPING}`,
        method: 'get',
        isLoader: true,
        // payload: payload,
        // params: { currencyCode: payload.currencyCode },
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

export const brandSyncByCountry = createAsyncThunk(
  'yggRedeem/brandSyncByCountry',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // ('payload', payload);
      const response = await httpHandler({
        url: `${URL_CONFIG.YGGBRANDSYNC}`,
        method: 'post',
        isLoader: false,
        payload: payload,
        // params: { currencyCode: payload.currencyCode },
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
export const getSyncInfo = createAsyncThunk(
  'yggRedeem/syncinfo',
  async (payload, { rejectWithValue, dispatch }) => {
    try {
      // ('payload', payload);
      console.log(payload);
      const response = await httpHandler({
        url: `${URL_CONFIG.YGG_Info}?code=${payload.code}`,
        method: 'get',
        isLoader: true,
        // payload: payload,
        // params: { code: payload.currencyCode },
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
