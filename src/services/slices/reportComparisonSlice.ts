import { createSlice } from '@reduxjs/toolkit';
import { getComparisonReport, getReportComparison } from 'services/actions/reportComparisonAction';

interface ReportState {
    loading: boolean;
    reportReqInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    cmpData: any;
    error1: any;
    success1: boolean;
}

const initialState: ReportState = {
    loading: false,
    reportReqInfo: null,
    error: null,
    success: false,
    loading1: false,
    success1: false,
    cmpData: null,
    error1: null,
};

const reportSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReportComparison.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.reportReqInfo = null;
            })
            .addCase(getReportComparison.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.reportReqInfo = payload;
                state.success = true;
            })
            .addCase(getReportComparison.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getComparisonReport.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.cmpData = null;
            })
            .addCase(getComparisonReport.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.cmpData = payload;
                state.success1 = true;
            })
            .addCase(getComparisonReport.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            });
    },
});

export default reportSlice.reducer;
