import { createSlice } from "@reduxjs/toolkit";

const initialState = { showForgotPWModule: false };

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    toggleModules(state) {
      state.showForgotPWModule = !state.showForgotPWModule;
    },
  },
});
export const loginActions = loginSlice.actions;
export default loginSlice;
