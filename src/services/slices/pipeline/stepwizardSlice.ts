import { createSlice } from '@reduxjs/toolkit';
import {
    getAllRequestTag,
    getDataset,
    getEdfDocList,
    getNonAssociateMarkers,
    getRequestAssMarkers,
    getResultInfo,
    getResultRatio,
    getTopoResultInfo,
    getWizardSteps,
    releaseRequest,
    removeInterpretationMarker,
    removeRequestTag,
    saveAdditionalReportItems,
    saveAssociateMarker,
    saveInterpretationMarker,
    saveRequestTag,
    startEdfJob,
    addPntDetail
} from 'services/actions/pipeline/stepwizardAction';

interface RequestState {
    loading: boolean;
    success: boolean;
    error: any;
    assMarkerInfo: any;
    loading1: boolean;
    success1: boolean;
    error1: any;
    edfDocInfo: any;
    loading2: boolean;
    success2: boolean;
    error2: any;
    ratioResultInfo: any;
    loading3: boolean;
    success3: boolean;
    error3: any;
    saveMarkerInfo: any;
    loading4: boolean;
    success4: boolean;
    error4: any;
    resultInfo: any;
    loading5: boolean;
    error5: any;
    success5: boolean;
    topoResultInfo: any;
    loading6: boolean;
    error6: any;
    stepsInfo: any;
    success6: boolean;
    loading7: boolean;
    error7: any;
    success7: boolean;
    tagInfo: any;
    loading8: boolean;
    error8: any;
    success8: boolean;
    reqTagInfo: any;
    loading9: boolean;
    error9: any;
    success9: boolean;
    saveTagInfo: any;
    loading10: boolean;
    error10: any;
    saveItemInfo: any;
    success10: boolean;
    loading11: boolean;
    success11: boolean;
    error11: any;
    saveJobInfo: any;
    loading12: boolean;
    success12: boolean;
    error12: any;
    unMarkerInfo: any;
    loading13: boolean;
    success13: boolean;
    error13: any;
    saveMarkInfo: any;
    loading14: boolean;
    error14: any;
    success14: boolean;
    rmvMarkInfo: any;
    loading15: boolean;
    error15: any;
    releaseReqInfo: any;
    success15: boolean;
    loading16: boolean;
    error16: any;
    success16: boolean;
    datasetInfo: any;
    loading17: boolean;
    error17: any;
    success17: boolean;
    pntInfo: any;
}

const initialState: RequestState = {
    loading: false,
    success: false,
    error: null,
    assMarkerInfo: null,
    loading1: false,
    success1: false,
    error1: null,
    edfDocInfo: null,
    loading2: false,
    error2: null,
    success2: false,
    ratioResultInfo: null,
    loading3: false,
    success3: false,
    error3: null,
    saveMarkerInfo: null,
    //template api calls
    loading4: false,
    error4: null,
    success4: false,
    resultInfo: null,
    loading5: false,
    error5: null,
    success5: false,
    topoResultInfo: null,
    //step details
    loading6: false,
    error6: null,
    stepsInfo: null,
    success6: false,
    //tags
    loading7: false,
    error7: null,
    tagInfo: null,
    success7: false,
    loading8: false,
    error8: null,
    success8: false,
    reqTagInfo: null,
    loading9: false,
    error9: null,
    saveTagInfo: null,
    success9: false,
    loading10: false,
    error10: null,
    saveItemInfo: null,
    success10: false,
    loading11: false,
    error11: null,
    saveJobInfo: null,
    success11: false,
    //non associated markers
    loading12: false,
    error12: null,
    success12: false,
    unMarkerInfo: null,
    loading13: false,
    error13: null,
    success13: false,
    saveMarkInfo: null,
    loading14: false,
    error14: null,
    success14: false,
    rmvMarkInfo: null,
    //release request
    loading15: false,
    error15: null,
    releaseReqInfo: null,
    success15: false,
    loading16: false,
    error16: null,
    datasetInfo: null,
    success16: false,
    loading17: false,
    error17: null,
    success17: false,
    pntInfo: null,
};

const stepwizardSlice = createSlice({
    name: 'pipe-wizard-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getRequestAssMarkers.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.assMarkerInfo = null;
            })
            .addCase(getRequestAssMarkers.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.assMarkerInfo = payload;
                state.success = true;
            })
            .addCase(getRequestAssMarkers.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getEdfDocList.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.edfDocInfo = null;
            })
            .addCase(getEdfDocList.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.edfDocInfo = payload;
                state.success1 = true;
            })
            .addCase(getEdfDocList.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getResultRatio.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.ratioResultInfo = null;
            })
            .addCase(getResultRatio.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.ratioResultInfo = payload;
                state.success2 = true;
            })
            .addCase(getResultRatio.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(saveInterpretationMarker.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.saveMarkerInfo = null;
            })
            .addCase(saveInterpretationMarker.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.saveMarkerInfo = payload;
                state.success3 = true;
            })
            .addCase(saveInterpretationMarker.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getResultInfo.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.resultInfo = null;
            })
            .addCase(getResultInfo.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.resultInfo = payload;
                state.success4 = true;
            })
            .addCase(getResultInfo.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getTopoResultInfo.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.topoResultInfo = null;
            })
            .addCase(getTopoResultInfo.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.topoResultInfo = payload;
                state.success5 = true;
            })
            .addCase(getTopoResultInfo.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(getWizardSteps.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.stepsInfo = null;
            })
            .addCase(getWizardSteps.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.stepsInfo = payload;
                state.success6 = true;
            })
            .addCase(getWizardSteps.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(removeRequestTag.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.tagInfo = null;
            })
            .addCase(removeRequestTag.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.tagInfo = payload;
                state.success7 = true;
            })
            .addCase(removeRequestTag.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(getAllRequestTag.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.reqTagInfo = null;
            })
            .addCase(getAllRequestTag.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.reqTagInfo = payload;
                state.success8 = true;
            })
            .addCase(getAllRequestTag.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(saveRequestTag.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.saveTagInfo = null;
            })
            .addCase(saveRequestTag.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.saveTagInfo = payload;
                state.success9 = true;
            })
            .addCase(saveRequestTag.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(saveAdditionalReportItems.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
                state.saveItemInfo = null;
            })
            .addCase(saveAdditionalReportItems.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.saveItemInfo = payload;
                state.success10 = true;
            })
            .addCase(saveAdditionalReportItems.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            .addCase(startEdfJob.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
                state.saveJobInfo = null;
            })
            .addCase(startEdfJob.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.saveJobInfo = payload;
                state.success11 = true;
            })
            .addCase(startEdfJob.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            .addCase(getNonAssociateMarkers.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
                state.unMarkerInfo = null;
            })
            .addCase(getNonAssociateMarkers.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.unMarkerInfo = payload;
                state.success12 = true;
            })
            .addCase(getNonAssociateMarkers.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            })
            .addCase(saveAssociateMarker.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
                state.saveMarkInfo = null;
            })
            .addCase(saveAssociateMarker.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.saveMarkInfo = payload;
                state.success13 = true;
            })
            .addCase(saveAssociateMarker.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            .addCase(removeInterpretationMarker.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
                state.rmvMarkInfo = null;
            })
            .addCase(removeInterpretationMarker.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.rmvMarkInfo = payload;
                state.success14 = true;
            })
            .addCase(removeInterpretationMarker.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            })
            .addCase(releaseRequest.pending, (state) => {
                state.loading15 = true;
                state.error15 = null;
                state.success15 = false;
                state.releaseReqInfo = null;
            })
            .addCase(releaseRequest.fulfilled, (state, { payload }) => {
                state.loading15 = false;
                state.releaseReqInfo = payload;
                state.success15 = true;
            })
            .addCase(releaseRequest.rejected, (state, { payload }) => {
                state.loading15 = false;
                state.error15 = payload;
                state.success15 = false;
            })
            .addCase(getDataset.pending, (state) => {
                state.loading16 = true;
                state.error16 = null;
                state.success16 = false;
                state.datasetInfo = null;
            })
            .addCase(getDataset.fulfilled, (state, { payload }) => {
                state.loading16 = false;
                state.datasetInfo = payload;
                state.success16 = true;
            })
            .addCase(getDataset.rejected, (state, { payload }) => {
                state.loading16 = false;
                state.error16 = payload;
                state.success16 = false;
            })
            .addCase(addPntDetail.pending, (state) => {
                state.loading17 = true;
                state.error17 = null;
                state.success17 = false;
                state.pntInfo = null;
            })
            .addCase(addPntDetail.fulfilled, (state, { payload }) => {
                state.loading17 = false;
                state.pntInfo = payload;
                state.success17 = true;
            })
            .addCase(addPntDetail.rejected, (state, { payload }) => {
                state.loading17 = false;
                state.error17 = payload;
                state.success17 = false;
            });
    },
});

export default stepwizardSlice.reducer;
