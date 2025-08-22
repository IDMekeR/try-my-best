import { createSlice } from '@reduxjs/toolkit';
import {
    getDocumentList,
    exportRequest,
    getPipelineRequest,
    getRequestInfo,
    saveArchiveRequest,
    uploadResultDocument,
    saveClinicalHistory,
    uploadConsentForm,
    downloadConsentForm,
    sentConsentToPatient,
    getAssociatedMedicines,
    uploadAssociatedDocument,
    updateAssDocument,
    deleteAssDocument,
    documentDownload,
} from 'services/actions/pipeline/pipelineAction';

interface RequestState {
    loading: boolean;
    pipelineInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    //upload result document;
    loading1: boolean;
    uploadResInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    docListInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    error3: any;
    archiveInfo: any;
    success3: boolean;
    loading4: boolean;
    error4: any;
    exportReqInfo: any;
    success4: boolean;
    loading5: boolean;
    error5: any;
    success5: boolean;
    requestInfo: any;
    //saveclinicalhistory
    loading6: boolean;
    error6: any;
    clinicInfo: any;
    success6: boolean;
    loading7: boolean;
    error7: any;
    consentInfo: any;
    success7: boolean;
    loading8: boolean;
    success8: boolean;
    error8: any;
    consentDocInfo: any;
    loading9: boolean;
    error9: any;
    mailsentInfo: any;
    success9: boolean;
    loading10: boolean;
    success10: boolean;
    error10: any;
    assMedicInfo: any;
    //upload associated document
    loading11: boolean;
    success11: boolean;
    uploadAssDocInfo: any;
    error11: any;
    loading12: boolean;
    success12: boolean;
    updateDocInfo: any;
    error12: any;
    loading13: boolean;
    success13: boolean;
    error13: any;
    delDocInfo: any;
    loading14: boolean;
    success14: boolean;
    error14: any;
    downloadInfo: any;
}

const initialState: RequestState = {
    loading: false,
    pipelineInfo: null,
    error: null,
    success: false,
    loading1: false,
    uploadResInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    docListInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    error3: null,
    archiveInfo: null,
    success3: false,
    loading4: false,
    error4: null,
    exportReqInfo: null,
    success4: false,
    loading5: false,
    success5: false,
    error5: null,
    requestInfo: null,
    loading6: false,
    error6: null,
    clinicInfo: null,
    success6: false,
    loading7: false,
    success7: false,
    error7: null,
    consentInfo: null,
    loading8: false,
    error8: null,
    consentDocInfo: null,
    success8: false,
    loading9: false,
    success9: false,
    mailsentInfo: null,
    error9: null,
    loading10: false,
    error10: null,
    assMedicInfo: null,
    success10: false,
    loading11: false,
    success11: false,
    error11: null,
    uploadAssDocInfo: null,
    loading12: false,
    error12: null,
    updateDocInfo: null,
    success12: false,
    loading13: false,
    error13: null,
    success13: false,
    delDocInfo: null,
    loading14: false,
    success14: false,
    error14: null,
    downloadInfo: null,
};

const pipelineSlice = createSlice({
    name: 'pipe-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPipelineRequest.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getPipelineRequest.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.pipelineInfo = payload;
                state.success = true;
            })
            .addCase(getPipelineRequest.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(uploadResultDocument.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.uploadResInfo = null;
            })
            .addCase(uploadResultDocument.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.uploadResInfo = payload;
                state.success1 = true;
            })
            .addCase(uploadResultDocument.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getDocumentList.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.docListInfo = null;
            })
            .addCase(getDocumentList.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.docListInfo = payload;
                state.success2 = true;
            })
            .addCase(getDocumentList.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(saveArchiveRequest.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.archiveInfo = null;
            })
            .addCase(saveArchiveRequest.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.archiveInfo = payload;
                state.success3 = true;
            })
            .addCase(saveArchiveRequest.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(exportRequest.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.exportReqInfo = null;
            })
            .addCase(exportRequest.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.exportReqInfo = payload;
                state.success4 = true;
            })
            .addCase(exportRequest.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getRequestInfo.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.requestInfo = null;
            })
            .addCase(getRequestInfo.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.requestInfo = payload;
                state.success5 = true;
            })
            .addCase(getRequestInfo.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(saveClinicalHistory.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
            })
            .addCase(saveClinicalHistory.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.clinicInfo = payload;
                state.success6 = true;
            })
            .addCase(saveClinicalHistory.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(uploadConsentForm.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.consentInfo = null;
            })
            .addCase(uploadConsentForm.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.consentInfo = payload;
                state.success7 = true;
            })
            .addCase(uploadConsentForm.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(downloadConsentForm.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.consentDocInfo = null;
            })
            .addCase(downloadConsentForm.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.consentDocInfo = payload;
                state.success8 = true;
            })
            .addCase(downloadConsentForm.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(sentConsentToPatient.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.mailsentInfo = null;
            })
            .addCase(sentConsentToPatient.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.mailsentInfo = payload;
                state.success9 = true;
            })
            .addCase(sentConsentToPatient.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(getAssociatedMedicines.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
                state.assMedicInfo = null;
            })
            .addCase(getAssociatedMedicines.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.assMedicInfo = payload;
                state.success10 = true;
            })
            .addCase(getAssociatedMedicines.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            .addCase(uploadAssociatedDocument.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
                state.uploadAssDocInfo = null;
            })
            .addCase(uploadAssociatedDocument.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.uploadAssDocInfo = payload;
                state.success11 = true;
            })
            .addCase(uploadAssociatedDocument.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            .addCase(updateAssDocument.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
                state.updateDocInfo = null;
            })
            .addCase(updateAssDocument.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.updateDocInfo = payload;
                state.success12 = true;
            })
            .addCase(updateAssDocument.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            })
            .addCase(deleteAssDocument.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
                state.delDocInfo = null;
            })
            .addCase(deleteAssDocument.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.delDocInfo = payload;
                state.success13 = true;
            })
            .addCase(deleteAssDocument.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            .addCase(documentDownload.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
                state.downloadInfo = null;
            })
            .addCase(documentDownload.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.downloadInfo = payload;
                state.success14 = true;
            })
            .addCase(documentDownload.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            });
    },
});

export default pipelineSlice.reducer;
