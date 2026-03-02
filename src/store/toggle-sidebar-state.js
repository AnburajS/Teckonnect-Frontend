import { createSlice } from "@reduxjs/toolkit";

const initialState = { isToggle: false };

const toggleSidebarStateSlice = createSlice({
  name: "toggleState",
  initialState,
  reducers: {
    updateToggleSidebarState(state, actions) {
      state.isToggle = actions.payload.isToggle;
    }
  },
});
export const toggleSidebarActions = toggleSidebarStateSlice.actions;
export default toggleSidebarStateSlice;
