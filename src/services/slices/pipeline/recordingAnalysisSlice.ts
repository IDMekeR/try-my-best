import { createSlice } from '@reduxjs/toolkit';
import {
    getAdjunct,
    getAnalysisProcedures,
    getInterpretationFindings,
    getNeuroFeedback,
    getPdrData,
    getPhotobiomodulation,
    saveAdjunctTherapy,
    saveAnalysisProcedures,
    saveInterpretFindings,
    saveNeurofeedback,
    savePdrInfo,
    savePhotobiomodulation,
} from 'services/actions/pipeline/recordingAnalysisAction';

interface RecState {
    loading: boolean;
    success: boolean;
    error: any;
    recFields: any;
    loading1: boolean;
    success1: boolean;
    error1: any;
    saveRecFields: any;
    //interpretation
    loading2: boolean;
    error2: any;
    success2: boolean;
    intFields: any;
    loading3: boolean;
    error3: any;
    success3: boolean;
    saveIntFields: any;
    //pdr
    loading4: boolean;
    error4: any;
    success4: boolean;
    pdrInfo: any;
    loading5: boolean;
    error5: any;
    success5: boolean;
    savePdrData: any;
    //save associate common
    //neuro
    loading6: boolean;
    error6: any;
    neuroFields: any;
    success6: boolean;
    loading7: boolean;
    error7: any;
    saveNeuroInfo: any;
    success7: boolean;
    //adjunct
    loading8: boolean;
    error8: any;
    success8: boolean;
    adjunctFields: any;
    loading9: boolean;
    error9: any;
    success9: boolean;
    saveAdjunctInfo: any;
    //pbm
    loading10: boolean;
    success10: boolean;
    error10: any;
    pbmInfo: any;
    loading11: boolean;
    success11: boolean;
    error11: any;
    savePbmInfo: any;
}

const initialState: RecState = {
    loading: false,
    success: false,
    error: null,
    recFields: null,
    loading1: false,
    error1: null,
    success1: false,
    saveRecFields: null,
    loading2: false,
    error2: null,
    success2: false,
    intFields: null,
    loading3: false,
    error3: null,
    success3: false,
    saveIntFields: null,
    loading4: false,
    error4: null,
    success4: false,
    pdrInfo: null,
    loading5: false,
    error5: null,
    success5: false,
    savePdrData: null,
    loading6: false,
    error6: null,
    success6: false,
    neuroFields: null,
    loading7: false,
    error7: null,
    success7: false,
    saveNeuroInfo: null,
    loading8: false,
    error8: null,
    success8: false,
    adjunctFields: null,
    loading9: false,
    error9: null,
    success9: false,
    saveAdjunctInfo: null,
    loading10: false,
    error10: null,
    success10: false,
    pbmInfo: null,
    loading11: false,
    error11: null,
    success11: false,
    savePbmInfo: null,
};
const recordingAnalysisSlice = createSlice({
    name: 'pipe-wizard-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAnalysisProcedures.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.recFields = null;
            })
            .addCase(getAnalysisProcedures.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.recFields = payload;
                state.success = true;
            })
            .addCase(getAnalysisProcedures.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(saveAnalysisProcedures.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.saveRecFields = null;
            })
            .addCase(saveAnalysisProcedures.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.saveRecFields = payload;
                state.success1 = true;
            })
            .addCase(saveAnalysisProcedures.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getInterpretationFindings.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.intFields = null;
            })
            .addCase(getInterpretationFindings.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.intFields = payload;
                state.success2 = true;
            })
            .addCase(getInterpretationFindings.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(saveInterpretFindings.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.saveIntFields = null;
            })
            .addCase(saveInterpretFindings.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.saveIntFields = payload;
                state.success3 = true;
            })
            .addCase(saveInterpretFindings.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getPdrData.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.pdrInfo = null;
            })
            .addCase(getPdrData.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.pdrInfo = payload;
                state.success4 = true;
            })
            .addCase(getPdrData.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(savePdrInfo.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.savePdrData = null;
            })
            .addCase(savePdrInfo.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.savePdrData = payload;
                state.success5 = true;
            })
            .addCase(savePdrInfo.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(getNeuroFeedback.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.neuroFields = null;
            })
            .addCase(getNeuroFeedback.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.neuroFields = payload;
                state.success6 = true;
            })
            .addCase(getNeuroFeedback.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(saveNeurofeedback.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.saveNeuroInfo = null;
            })
            .addCase(saveNeurofeedback.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.saveNeuroInfo = payload;
                state.success7 = true;
            })
            .addCase(saveNeurofeedback.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(getAdjunct.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.adjunctFields = null;
            })
            .addCase(getAdjunct.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.adjunctFields = payload;
                state.success8 = true;
            })
            .addCase(getAdjunct.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(saveAdjunctTherapy.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.saveAdjunctInfo = null;
            })
            .addCase(saveAdjunctTherapy.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.saveAdjunctInfo = payload;
                state.success9 = true;
            })
            .addCase(saveAdjunctTherapy.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(getPhotobiomodulation.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
                state.pbmInfo = null;
            })
            .addCase(getPhotobiomodulation.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.saveAdjunctInfo = payload;
                state.pbmInfo = true;
            })
            .addCase(getPhotobiomodulation.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            .addCase(savePhotobiomodulation.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
                state.savePbmInfo = null;
            })
            .addCase(savePhotobiomodulation.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.savePbmInfo = payload;
                state.success11 = true;
            })
            .addCase(savePhotobiomodulation.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            });
    },
});
export default recordingAnalysisSlice.reducer;
