import { createSlice } from '@reduxjs/toolkit';
import { getArchivedRequest, getNewRequest, getPhqQuesAns, getPhQuestionnaire, saveNewRequest,getPh8Data } from 'services/actions/newRequestAction';

interface RequestState {
    loading: boolean;
    newReqInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    archiveInfo: any; // Define the type of userInfo
    error1: any; // Define the type of error
    success1: boolean;
    loading2: boolean;
    error2: any;
    phqData: any;
    success2: boolean;
    loading3: boolean;
    error3: any;
    saveReqInfo: any;
    success3: boolean;
    loading4: boolean;
    error4: any;
    success4: boolean;
    phqAnsInfo: any;
    loading5: boolean;
    error5: any;
    success5: boolean;
    ph8Data: any;
}

const initialState: RequestState = {
    loading: false,
    newReqInfo: null,
    error: null,
    success: false,
    loading1: false,
    archiveInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    error2: null,
    phqData: null,
    success2: false,
    loading3: false,
    success3: false,
    saveReqInfo: null,
    error3: null,
    loading4: false,
    error4: null,
    phqAnsInfo: null,
    success4: false,
    loading5: false,
    error5: null,
    success5: false,
    ph8Data: false,
};

const newRequestSlice = createSlice({
    name: 'new-request-information',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getNewRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.newReqInfo = null;
            })
            .addCase(getNewRequest.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.newReqInfo = payload;
                state.success = true;
            })
            .addCase(getNewRequest.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getArchivedRequest.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.archiveInfo = null;
            })
            .addCase(getArchivedRequest.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.archiveInfo = payload;
                state.success1 = true;
            })
            .addCase(getArchivedRequest.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getPhQuestionnaire.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(getPhQuestionnaire.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.phqData = payload;
                state.success2 = true;
            })
            .addCase(getPhQuestionnaire.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(saveNewRequest.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
            })
            .addCase(saveNewRequest.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.saveReqInfo = payload;
                state.success3 = true;
            })
            .addCase(saveNewRequest.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getPhqQuesAns.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.phqAnsInfo = null;
            })
            .addCase(getPhqQuesAns.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.phqAnsInfo = payload;
                state.success4 = true;
            })
            .addCase(getPhqQuesAns.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getPh8Data.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.ph8Data = null;
            })
            .addCase(getPh8Data.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.ph8Data = payload;
                state.success5 = true;
            })
            .addCase(getPh8Data.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            });
    },
});

export default newRequestSlice.reducer;
