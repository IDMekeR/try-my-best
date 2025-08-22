import { createSlice } from '@reduxjs/toolkit';
import { getDatasetInformation, getReleasedDetails, getReleasedRequest, getResultDocDownload, getResultDocList, reassessmentReq, validateRequest } from 'services/actions/releasedReqAction';

interface RequestState {
    loading: boolean;
    releasedInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    resultDocInfo: any;
    success1: boolean;
    error1: any;
    loading2: boolean;
    datasetInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    rDocListInfo: any;
    error3: any;
    success3: boolean;
    loading4: boolean;
    resultData: any;
    error4: any;
    success4: boolean;
    loading5: boolean;
    reassReq: any;
    error5: any;
    success5: boolean;
    loading6: boolean;
    validateReq: any;
    error6: any;
    success6: boolean;
}

const initialState: RequestState = {
    loading: false,
    releasedInfo: null,
    error: null,
    success: false,
    loading1: false,
    resultDocInfo: null,
    success1: false,
    error1: null,
    loading2: false,
    datasetInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    rDocListInfo: null,
    error3: null,
    success3: false,
    loading4: false,
    resultData: null,
    error4: null,
    success4: false,
    loading5: false,
    reassReq: null,
    error5: null,
    success5: false,
    loading6: false,
    validateReq: null,
    error6: null,
    success6: false,
};

const releasedSlice = createSlice({
    name: 'released-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getReleasedRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.releasedInfo = null;
            })
            .addCase(getReleasedRequest.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.releasedInfo = payload;
                state.success = true;
                state.error = null;
            })
            .addCase(getReleasedRequest.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
                state.releasedInfo = null;
            })
            .addCase(getReleasedDetails.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.resultDocInfo = null;
            })
            .addCase(getReleasedDetails.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.resultDocInfo = payload;
                state.success1 = true;
                state.error1 = null;
            })
            .addCase(getReleasedDetails.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
                state.resultDocInfo = null;
            })
            .addCase(getDatasetInformation.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.datasetInfo = null;
            })
            .addCase(getDatasetInformation.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.datasetInfo = payload;
                state.success2 = true;
                state.error2 = null;
            })
            .addCase(getDatasetInformation.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
                state.datasetInfo = null;
            })
            .addCase(getResultDocList.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.rDocListInfo = null;
            })
            .addCase(getResultDocList.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.rDocListInfo = payload;
                state.success3 = true;
                state.error3 = null;
            })
            .addCase(getResultDocList.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
                state.rDocListInfo = null;
            })
            .addCase(getResultDocDownload.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.resultData = null;
            })
            .addCase(getResultDocDownload.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.resultData = payload;
                state.success4 = true;
                state.error4 = null;
            })
            .addCase(getResultDocDownload.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
                state.resultData = null;
            })
            .addCase(reassessmentReq.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.reassReq = null;
            })
            .addCase(reassessmentReq.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.reassReq = payload;
                state.success5 = true;
                state.error5 = null;
            })
            .addCase(reassessmentReq.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
                state.reassReq = null;
            })
            .addCase(validateRequest.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.validateReq = null;
            })
            .addCase(validateRequest.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.validateReq = payload;
                state.success6 = true;
                state.error6 = null;
            })
            .addCase(validateRequest.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
                state.validateReq = null;
            });
    },
});

export default releasedSlice.reducer;
