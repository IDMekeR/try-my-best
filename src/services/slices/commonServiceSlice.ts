import { createSlice } from '@reduxjs/toolkit';
import { allPatientTag, getAllAccount, getAssociateCommon, getCountry, getState, saveAssociateCommon, addPntForm, verifyPntForm } from 'services/actions/commonServiceAction';

interface CommonState {
    loading1: boolean;
    allTagsInfo: any; // Define the type of userInfo
    error1: any; // Define the type of error
    success1: boolean;
    //country
    loading2: boolean;
    countryInfo: any;
    error2: any;
    success2: boolean;
    //state
    loading3: boolean;
    stateInfo: any;
    error3: any;
    success3: boolean;
    //account all
    loading4: boolean;
    allAccountInfo: any;
    error4: any;
    success4: boolean;
    //associate common
    loading5: boolean;
    error5: any;
    success5: boolean;
    commonInfo: any;
    loading6: boolean;
    error6: any;
    success6: boolean;
    saveCommonInfo: any;
    loading7: boolean;
    error7: any;
    success7: boolean;
    addpntInfo: any;
    loading8: boolean;
    error8: any;
    success8: boolean;
    pntaccInfo: any;
}

const initialState: CommonState = {
    loading1: false,
    allTagsInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    countryInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    stateInfo: null,
    error3: null,
    success3: false,
    loading4: false,
    allAccountInfo: null,
    error4: null,
    success4: false,
    loading5: false,
    error5: null,
    success5: false,
    commonInfo: null,
    loading6: false,
    error6: null,
    success6: false,
    saveCommonInfo: null,
    loading7: false,
    error7: null,
    success7: false,
    addpntInfo: null,
    loading8: false,
    error8: null,
    success8: false,
    pntaccInfo: null,
};

const commonSlice = createSlice({
    name: 'common-slices',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            //all patient tags
            .addCase(allPatientTag.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(allPatientTag.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.allTagsInfo = payload;
                state.success1 = true;
            })
            .addCase(allPatientTag.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getCountry.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(getCountry.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.countryInfo = payload;
                state.success2 = true;
            })
            .addCase(getCountry.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getState.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
            })
            .addCase(getState.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.stateInfo = payload;
                state.success3 = true;
            })
            .addCase(getState.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getAllAccount.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
            })
            .addCase(getAllAccount.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.allAccountInfo = payload;
                state.success4 = true;
            })
            .addCase(getAllAccount.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getAssociateCommon.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.commonInfo = null;
            })
            .addCase(getAssociateCommon.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.commonInfo = payload;
                state.success5 = true;
            })
            .addCase(getAssociateCommon.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(saveAssociateCommon.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.saveCommonInfo = null;
            })
            .addCase(saveAssociateCommon.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.saveCommonInfo = payload;
                state.success6 = true;
            })
            .addCase(saveAssociateCommon.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(addPntForm.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.addpntInfo = null;
            })
            .addCase(addPntForm.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.addpntInfo = payload;
                state.success7 = true;
            })
            .addCase(addPntForm.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(verifyPntForm.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.pntaccInfo = null;
            })
            .addCase(verifyPntForm.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.pntaccInfo = payload;
                state.success8 = true;
            })
            .addCase(verifyPntForm.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            });
    },
});

export default commonSlice.reducer;
