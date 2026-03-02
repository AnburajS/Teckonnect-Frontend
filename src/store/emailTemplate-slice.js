// emailTemplate-slice.js
import { createSlice } from '@reduxjs/toolkit';

import {
  createEmailTemplates,
  getEmailTemplates,
  getEmailTemplatesList,
  triggerEmail,
  updateEmailTemplates,
} from './emailTemplateThunk';

const initialState = {
  status: null,
  message: null,
  templates: [],
  updateTemplates: [],
  loading: false,
  error: null,
  getEmailTemplate: {
    loading: false,
    error: null,
    data: [],
  },
  getEmailTemplateSingle: {
    loading: false,
    error: null,
    data: [],
  },
  triggerEmail: {
    loading: false,
    error: null,
    data: [],
  },
};

const emailTemplateSlice = createSlice({
  name: 'emailTemplate',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.templates = action.payload;
        state.status = 'success';
      })
      .addCase(createEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(updateEmailTemplates.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateEmailTemplates.fulfilled, (state, action) => {
        state.loading = false;
        state.updateTemplates = action.payload;
        state.status = 'success';
      })
      .addCase(updateEmailTemplates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getEmailTemplatesList.pending, (state) => {
        state.getEmailTemplate.loading = true;
        state.getEmailTemplate.error = null;
      })
      .addCase(getEmailTemplatesList.fulfilled, (state, action) => {
        state.getEmailTemplate.loading = false;
        state.getEmailTemplate.data = action.payload;
        state.status = 'success';
      })
      .addCase(getEmailTemplatesList.rejected, (state, action) => {
        state.getEmailTemplate.loading = false;
        state.getEmailTemplate.error = action.payload;
        state.status = 'failed';
      })
      .addCase(getEmailTemplates.pending, (state) => {
        state.getEmailTemplateSingle.loading = true;
        state.getEmailTemplateSingle.error = null;
      })
      .addCase(getEmailTemplates.fulfilled, (state, action) => {
        state.getEmailTemplateSingle.loading = false;
        state.getEmailTemplateSingle.data = action.payload;
        state.status = 'success';
      })
      .addCase(getEmailTemplates.rejected, (state, action) => {
        state.getEmailTemplateSingle.loading = false;
        state.getEmailTemplateSingle.error = action.payload;
        state.status = 'failed';
      })
      .addCase(triggerEmail.pending, (state) => {
        state.triggerEmail.loading = true;
        state.triggerEmail.error = null;
      })
      .addCase(triggerEmail.fulfilled, (state, action) => {
        state.triggerEmail.loading = false;
        state.triggerEmail.data = action.payload;
        state.status = 'success';
      })
      .addCase(triggerEmail.rejected, (state, action) => {
        state.triggerEmail.loading = false;
        state.triggerEmail.error = action.payload;
        state.status = 'failed';
      });
  },
});

export default emailTemplateSlice;
