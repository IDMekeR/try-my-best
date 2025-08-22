import { createSlice } from '@reduxjs/toolkit';
import {
    addEdfSetting,
    cancelEdfJobs,
    getAllJobs,
    getEdfProcessing,
    getEdfSetting,
    getEdfStepResult,
    getErrorJobs,
    getXlsxData,
    resetEdfJobs,
    submitArtifactStatus,
    getEnableEdfAnalyzer,
    getEdfAnalyzerJobs,
    getEdfAnalyzerTopos
} from 'services/actions/jobManagerAction';

interface SearchState {
    loading: boolean;
    edfSettingInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    addEdfInfo: any;
    success1: boolean;
    error1: any;
    loading2: boolean;
    edfStatusInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    success3: boolean;
    error3: any;
    allJobInfo: any;
    loading4: boolean;
    success4: boolean;
    error4: any;
    jobErrorInfo: any;
    loading5: boolean;
    edfProcessInfo: any;
    error5: any;
    success5: boolean;
    loading6: boolean;
    stepResultInfo: any;
    error6: any;
    success6: boolean;
    loading7: boolean;
    success7: boolean;
    error7: any;
    xlsxInfo: any;
    //cancel and reset job
    loading8: boolean;
    success8: boolean;
    error8: any;
    cancelJobInfo: any;
    loading9: boolean;
    success9: boolean;
    error9: any;
    resetJobInfo: any;
    loading10: boolean;
    success10: boolean;
    error10: any;
    edfAnalyzerInfo: any;
    loading11: boolean;
    success11: boolean;
    error11: any;
    edfAnalyzerInfos: any;
    loading12: boolean;
    success12: boolean;
    error12: any;
    edfTopoInfos: any;
}

const initialState: SearchState = {
    loading: false,
    edfSettingInfo: null,
    error: null,
    success: false,
    loading1: false,
    addEdfInfo: null,
    success1: false,
    error1: null,
    loading2: false,
    edfStatusInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    success3: false,
    error3: null,
    allJobInfo: null,
    loading4: false,
    error4: null,
    jobErrorInfo: null,
    success4: false,
    loading5: false,
    edfProcessInfo: null,
    error5: null,
    success5: false,
    loading6: false,
    stepResultInfo: null,
    success6: false,
    error6: null,
    loading7: false,
    success7: false,
    error7: null,
    xlsxInfo: null,
    //cancel and reset job
    loading8: false,
    success8: false,
    error8: null,
    cancelJobInfo: null,
    loading9: false,
    success9: false,
    error9: null,
    resetJobInfo: null,
    loading10: false,
    success10: false,
    error10: null,
    edfAnalyzerInfo: null,
    loading11: false,
    success11: false,
    error11: null,
    edfAnalyzerInfos: null,
    loading12: false,
    success12: false,
    error12: null,
    edfTopoInfos: null,
    
};

const jobManagerSlice = createSlice({
    name: 'job-manager',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getEdfSetting.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.edfSettingInfo = null;
            })
            .addCase(getEdfSetting.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.edfSettingInfo = payload;
                state.success = true;
            })
            .addCase(getEdfSetting.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(addEdfSetting.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.addEdfInfo = null;
            })
            .addCase(addEdfSetting.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.addEdfInfo = payload;
                state.success1 = true;
            })
            .addCase(addEdfSetting.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(submitArtifactStatus.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(submitArtifactStatus.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.edfStatusInfo = payload;
                state.success2 = true;
            })
            .addCase(submitArtifactStatus.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getAllJobs.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.allJobInfo = null;
            })
            .addCase(getAllJobs.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.allJobInfo = payload;
                state.success3 = true;
            })
            .addCase(getAllJobs.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getErrorJobs.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.jobErrorInfo = null;
            })
            .addCase(getErrorJobs.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.jobErrorInfo = payload;
                state.success4 = true;
            })
            .addCase(getErrorJobs.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getEdfProcessing.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
            })
            .addCase(getEdfProcessing.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.edfProcessInfo = payload;
                state.success5 = true;
            })
            .addCase(getEdfProcessing.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(getEdfStepResult.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.stepResultInfo = null;
            })
            .addCase(getEdfStepResult.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.stepResultInfo = payload;
                state.success6 = true;
            })
            .addCase(getEdfStepResult.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(getXlsxData.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.xlsxInfo = null;
            })
            .addCase(getXlsxData.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.xlsxInfo = payload;
                state.success7 = true;
            })
            .addCase(getXlsxData.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(cancelEdfJobs.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.cancelJobInfo = null;
            })
            .addCase(cancelEdfJobs.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.cancelJobInfo = payload;
                state.success8 = true;
            })
            .addCase(cancelEdfJobs.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(resetEdfJobs.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.resetJobInfo = null;
            })
            .addCase(resetEdfJobs.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.resetJobInfo = payload;
                state.success9 = true;
            })
            .addCase(resetEdfJobs.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(getEnableEdfAnalyzer.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
                state.edfAnalyzerInfo = null;
            })
            .addCase(getEnableEdfAnalyzer.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.edfAnalyzerInfo = payload;
                state.success10 = true;
            })
            .addCase(getEnableEdfAnalyzer.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            .addCase(getEdfAnalyzerJobs.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
                state.edfAnalyzerInfos = null;
            })
            .addCase(getEdfAnalyzerJobs.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.edfAnalyzerInfos = payload;
                state.success11 = true;
            })
            .addCase(getEdfAnalyzerJobs.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            .addCase(getEdfAnalyzerTopos.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
                state.edfTopoInfos = null;
            })
            .addCase(getEdfAnalyzerTopos.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.edfTopoInfos = payload;
                state.success12 = true;
            })
            .addCase(getEdfAnalyzerTopos.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            });
    },
});

export default jobManagerSlice.reducer;
