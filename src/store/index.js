import { configureStore } from '@reduxjs/toolkit';
import breadCrumbSlice from './breadcrumb-slice';
import loginSlice from './login-slice';
import sharedDataSlice from './shared-data-slice';
import tabsSlice from './tabs-slice';
import errorHanldingSlice from './error-handling';
import toggleSidebarStateSlice from './toggle-sidebar-state';
import stateSlice from './state';
import userProfile from './user-profile';
import emailTemplate from './emailTemplate-slice';
import modalSlice from './modalSlice';
import yggTemplateSlice from './yggRedeem-slice';
import surveySlice from './survey/surveySlice';

const store = configureStore({
  reducer: {
    login: loginSlice.reducer,
    breadcrumb: breadCrumbSlice.reducer,
    sharedData: sharedDataSlice.reducer,
    tabs: tabsSlice.reducer,
    errorHandling: errorHanldingSlice.reducer,
    toggleState: toggleSidebarStateSlice.reducer,
    storeState: stateSlice.reducer,
    userProfile: userProfile.reducer,
    emailTemplate: emailTemplate.reducer,
    ygg: yggTemplateSlice.reducer,
    modal: modalSlice.reducer,
    survey: surveySlice.reducer,
  },
});

export default store;
