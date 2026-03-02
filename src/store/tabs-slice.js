import { createSlice } from "@reduxjs/toolkit";

const initialState = { config: [], activeTab:null };

const tabsSlice = createSlice({
  name: "tabs",
  initialState,
  reducers: {
    updateTabsconfig(state, action) {
      state.config = action.payload.config;
    },
    tabOnChange(state, action) {
      state.activeTab = action.payload.tabInfo;
    }
  },
});
export const TabsActions = tabsSlice.actions;
export default tabsSlice;
