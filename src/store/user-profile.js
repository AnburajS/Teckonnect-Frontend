import { createSlice } from "@reduxjs/toolkit";

const initialState = { isToggle: false };

const userProfileStateSlice = createSlice({
  name: "toggleState",
  initialState,
  reducers: {
    updateState(state, action) {
      state = action.payload;
    }
  },
});
export const userProfile = userProfileStateSlice.actions;
export default userProfileStateSlice;
