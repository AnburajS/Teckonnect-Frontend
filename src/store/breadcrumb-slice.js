import { createSlice } from "@reduxjs/toolkit";

const initialState = { breadCrumbArr: [], title: null };

const breadCrumbSlice = createSlice({
  name: "breadcrumb",
  initialState,
  reducers: {
    updateBreadCrumb(state, action) {
      state.breadCrumbArr = action.payload.breadcrumbArr;
      state.title = action.payload.title;
    },
  },
});
export const BreadCrumbActions = breadCrumbSlice.actions;
export default breadCrumbSlice;
