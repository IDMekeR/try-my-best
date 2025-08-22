import { createSlice } from '@reduxjs/toolkit';
import { DashboardDetail, getNotification, menuDetails, getClearNotification } from 'services/actions/dashboardAction';

interface DashboardState {
    loading: boolean;
    accInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    //menu
    loading1: boolean;
    menuInfo: any;
    error1: any;
    success1: boolean;
    //notification
    loading2: boolean;
    notifyInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    notifyClearInfo: any;
    error3: any;
    success3: boolean;
}

const initialState: DashboardState = {
    loading: false,
    accInfo: null,
    error: null,
    success: false,
    //menu
    loading1: false,
    menuInfo: null,
    error1: null,
    success1: false,
    //notification
    loading2: false,
    notifyInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    notifyClearInfo: null,
    error3: null,
    success3: false,
};

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(DashboardDetail.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.accInfo = null;
            })
            .addCase(DashboardDetail.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.accInfo = payload;
                state.success = true;
            })
            .addCase(DashboardDetail.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(menuDetails.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.menuInfo = null;
            })
            .addCase(menuDetails.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.menuInfo = payload;
                state.success1 = true;
            })
            .addCase(menuDetails.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getNotification.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.notifyInfo = null;
            })
            .addCase(getNotification.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.notifyInfo = payload;
                state.success2 = true;
            })
            .addCase(getNotification.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getClearNotification.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.notifyClearInfo = null;
            })
            .addCase(getClearNotification.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.notifyClearInfo = payload;
                state.success3 = true;
            })
            .addCase(getClearNotification.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            });
    },
});

export default dashboardSlice.reducer;
