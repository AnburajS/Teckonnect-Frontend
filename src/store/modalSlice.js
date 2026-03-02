import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  type: null,
  message: null,
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    showModal(state, action) {
      state.type = action.payload.type;
      state.message = action.payload.message;
    },
    hideModal(state) {
      state.type = null;
      state.message = null;
    },
  },
});

export const { showModal, hideModal } = modalSlice.actions;
export default modalSlice;
