import { createSlice } from "@reduxjs/toolkit";

const initialState = { status: null, message: null };

const errorHanldingSlice = createSlice({
  name: "errorHandling",
  initialState,
  reducers: {
    logout(state, action) {
      
    },
  },
});
export const errorHanldingActions = errorHanldingSlice.actions;
export default errorHanldingSlice;
