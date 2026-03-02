// emailTemplate-slice.js
import { createSlice } from '@reduxjs/toolkit';

import {
  brandSyncByCountry,
  getCountryMappingList,
  getSyncInfo,
  getYggBrandList,
} from './yggRedeemThunk';

const initialState = {
  status: null,
  message: null,
  loading: false,
  error: null,
  getYggBrandList: {
    loading: false,
    error: null,
    data: [],
  },
  getCountryMappingList: {
    loading: false,
    error: null,
    data: [],
  },
  brandSyncByCountry: {
    loading: false,
    error: null,
    data: [],
  },
  getSyncInfo: {
    loading: false,
    error: null,
    data: {},
    modelOpen: false,
  },
};

const yggTemplateSlice = createSlice({
  name: 'YGG',
  initialState,
  reducers: {
    closeSyncInfoModal: (state) => {
      state.getSyncInfo.modelOpen = false;
    },
  },
  extraReducers: (builder) => {
    builder

      .addCase(getYggBrandList.pending, (state) => {
        state.getYggBrandList.loading = true;
        state.getYggBrandList.error = null;
      })
      .addCase(getYggBrandList.fulfilled, (state, action) => {
        state.getYggBrandList.loading = false;
        state.getYggBrandList.data = action.payload;
        state.status = 'success';
      })
      .addCase(getYggBrandList.rejected, (state, action) => {
        state.getYggBrandList.loading = false;
        state.getYggBrandList.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getCountryMappingList.pending, (state) => {
        state.getCountryMappingList.loading = true;
        state.getCountryMappingList.error = null;
      })
      .addCase(getCountryMappingList.fulfilled, (state, action) => {
        state.getCountryMappingList.loading = false;
        state.getCountryMappingList.data = action.payload;
        state.status = 'success';
      })
      .addCase(getCountryMappingList.rejected, (state, action) => {
        state.getCountryMappingList.loading = false;
        state.getCountryMappingList.error = action.payload;
        state.status = 'failed';
      })
      .addCase(brandSyncByCountry.pending, (state) => {
        state.brandSyncByCountry.loading = true;
        state.brandSyncByCountry.error = null;
      })
      .addCase(brandSyncByCountry.fulfilled, (state, action) => {
        state.brandSyncByCountry.loading = false;
        state.brandSyncByCountry.data = action.payload;
        state.status = 'success';
      })
      .addCase(brandSyncByCountry.rejected, (state, action) => {
        state.brandSyncByCountry.loading = false;
        state.brandSyncByCountry.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getSyncInfo.pending, (state) => {
        state.getSyncInfo.loading = true;
        state.getSyncInfo.error = null;
      })
      .addCase(getSyncInfo.fulfilled, (state, action) => {
        state.getSyncInfo.loading = false;
        state.getSyncInfo.data = action.payload;
        state.getSyncInfo.modelOpen = true;
        state.status = 'success';
      })
      .addCase(getSyncInfo.rejected, (state, action) => {
        state.getSyncInfo.loading = false;
        state.getSyncInfo.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default yggTemplateSlice;
export const { closeSyncInfoModal } = yggTemplateSlice.actions;
