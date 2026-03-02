import { createSlice } from "@reduxjs/toolkit";

const initialState = { logo: null };

const stateSlice = createSlice({
    name: "storeState",
    initialState,
    reducers: {
        updateState(state, action) {
            state.logo = action.payload;
        },
    },
});
export const storeStateActions = stateSlice.actions;
export default stateSlice;
