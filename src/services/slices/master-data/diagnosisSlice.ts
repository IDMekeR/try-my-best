import { createSlice } from '@reduxjs/toolkit';
import {
    addDiagnosis,
    addMarker,
    addSymptoms,
    deleteDiagnosis,
    deleteMarker,
    deleteSymptoms,
    getDiagnosisList,
    getMarkerList,
    getSymptomsList,
} from 'services/actions/master-data/diagnosisAction';

interface AccountState {
    loading: boolean;
    diagnosisInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    symptomsInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    markerInfo: any;
    error2: any;
    success2: boolean;
    //add
    loading3: boolean;
    addDiagInfo: any;
    error3: any;
    success3: boolean;
    loading5: boolean;
    addMarkInfo: any;
    error5: any;
    success5: boolean;
    loading7: boolean;
    addSympInfo: any;
    error7: any;
    success7: boolean;
    //delete
    loading8: boolean;
    rmvDiagInfo: any;
    success8: boolean;
    error8: any;
    loading9: boolean;
    rmvMarkerInfo: any;
    success9: boolean;
    error9: any;
    loading10: boolean;
    rmvSympInfo: any;
    success10: boolean;
    error10: any;
}
const initialState: AccountState = {
    loading: false,
    diagnosisInfo: null,
    error: null,
    success: false,
    loading1: false,
    symptomsInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    markerInfo: null,
    error2: null,
    success2: false,
    //add
    loading3: false,
    addDiagInfo: null,
    error3: null,
    success3: false,
    loading5: false,
    addMarkInfo: null,
    error5: null,
    success5: false,
    loading7: false,
    addSympInfo: null,
    error7: null,
    success7: false,
    //delete
    loading8: false,
    rmvDiagInfo: null,
    success8: false,
    error8: null,
    loading9: false,
    rmvMarkerInfo: null,
    success9: false,
    error9: null,
    loading10: false,
    rmvSympInfo: null,
    success10: false,
    error10: null,
};

const diagnosisSlice = createSlice({
    name: 'diagnosis-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getDiagnosisList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getDiagnosisList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.diagnosisInfo = payload;
                state.success = true;
            })
            .addCase(getDiagnosisList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getSymptomsList.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(getSymptomsList.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.symptomsInfo = payload;
                state.success1 = true;
            })
            .addCase(getSymptomsList.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getMarkerList.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(getMarkerList.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.markerInfo = payload;
                state.success2 = true;
            })
            .addCase(getMarkerList.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            //add
            .addCase(addDiagnosis.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
            })
            .addCase(addDiagnosis.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.addDiagInfo = payload;
                state.success3 = true;
            })
            .addCase(addDiagnosis.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(addMarker.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
            })
            .addCase(addMarker.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.addMarkInfo = payload;
                state.success5 = true;
            })
            .addCase(addMarker.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(addSymptoms.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
            })
            .addCase(addSymptoms.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.addSympInfo = payload;
                state.success7 = true;
            })
            .addCase(addSymptoms.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            //delete
            .addCase(deleteDiagnosis.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
            })
            .addCase(deleteDiagnosis.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.rmvDiagInfo = payload;
                state.success8 = true;
            })
            .addCase(deleteDiagnosis.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(deleteMarker.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
            })
            .addCase(deleteMarker.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.rmvMarkerInfo = payload;
                state.success9 = true;
            })
            .addCase(deleteMarker.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(deleteSymptoms.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
            })
            .addCase(deleteSymptoms.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.rmvSympInfo = payload;
                state.success10 = true;
            })
            .addCase(deleteSymptoms.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            });
    },
});

export default diagnosisSlice.reducer;
