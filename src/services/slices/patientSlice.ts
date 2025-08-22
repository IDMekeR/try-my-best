import { createSlice } from '@reduxjs/toolkit';
import {
    addPatient,
    deletePatient,
    getAccPntList,
    getCodeList,
    getDosageList,
    getMedicationList,
    getPatient,
    getPatientList,
    getPntAssRequestList,
    getPntMedication,
} from 'services/actions/patientAction';

interface PatientState {
    loading: boolean;
    patientInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    addPntInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    rmvPntInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    pntInfo: any;
    success3: boolean;
    error3: any;
    loading4: boolean;
    assReqInfo: any;
    success4: boolean;
    error4: any;
    loading5: boolean;
    pntMedicInfo: any;
    success5: boolean;
    error5: any;
    //third party api
    loading6: boolean;
    medicListInfo: any;
    success6: boolean;
    error6: any;
    loading7: boolean;
    dosageInfo: any;
    error7: any;
    success7: boolean;
    loading8: boolean;
    error8: any;
    codeInfo: any;
    success8: boolean;
    //get patient by account
    loading9: boolean;
    error9: any;
    success9: boolean;
    accPntInfo: any;
}

const initialState: PatientState = {
    loading: false,
    patientInfo: null,
    error: null,
    success: false,
    loading1: false,
    addPntInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    rmvPntInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    pntInfo: null,
    success3: false,
    error3: null,
    loading4: false,
    assReqInfo: null,
    error4: null,
    success4: false,
    loading5: false,
    pntMedicInfo: null,
    success5: false,
    error5: null,
    //third party medication api
    loading6: false,
    medicListInfo: null,
    success6: false,
    error6: null,
    loading7: false,
    dosageInfo: null,
    error7: null,
    success7: false,
    loading8: false,
    error8: null,
    codeInfo: null,
    success8: false,
    loading9: false,
    error9: null,
    success9: false,
    accPntInfo: null,
};

const PatientSlice = createSlice({
    name: 'patient',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getPatientList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.patientInfo = null;
            })
            .addCase(getPatientList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.patientInfo = payload;
                state.success = true;
                state.error = null;
            })
            .addCase(getPatientList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.patientInfo = null;
                state.success = false;
            })
            .addCase(addPatient.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.addPntInfo = null;
            })
            .addCase(addPatient.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.addPntInfo = payload;
                state.error1 = null;
                state.success1 = true;
            })
            .addCase(addPatient.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.addPntInfo = null;
                state.success1 = false;
            })
            .addCase(deletePatient.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.rmvPntInfo = null;
            })
            .addCase(deletePatient.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.rmvPntInfo = payload;
                state.success2 = true;
                state.error2 = null;
            })
            .addCase(deletePatient.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.rmvPntInfo = null;
                state.success2 = false;
            })
            .addCase(getPatient.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.pntInfo = null;
            })
            .addCase(getPatient.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.pntInfo = payload;
                state.success3 = true;
                state.error3 = null;
            })
            .addCase(getPatient.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.pntInfo = null;
                state.success3 = false;
            })
            .addCase(getPntAssRequestList.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.assReqInfo = null;
            })
            .addCase(getPntAssRequestList.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.assReqInfo = payload;
                state.error4 = null;
                state.success4 = true;
            })
            .addCase(getPntAssRequestList.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.assReqInfo = null;
                state.success4 = false;
            })
            .addCase(getPntMedication.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
            })
            .addCase(getPntMedication.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.pntMedicInfo = payload;
                state.success5 = true;
            })
            .addCase(getPntMedication.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            //third party api for medication
            .addCase(getMedicationList.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.medicListInfo = null;
            })
            .addCase(getMedicationList.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.medicListInfo = payload;
                state.error6 = null;
                state.success6 = true;
            })
            .addCase(getMedicationList.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.medicListInfo = null;
                state.success6 = false;
            })
            .addCase(getDosageList.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.dosageInfo = null;
            })
            .addCase(getDosageList.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.dosageInfo = payload;
                state.success7 = true;
            })
            .addCase(getDosageList.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
                state.dosageInfo = null;
            })
            .addCase(getCodeList.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.codeInfo = null;
            })
            .addCase(getCodeList.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.codeInfo = payload;
                state.success8 = true;
            })
            .addCase(getCodeList.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(getAccPntList.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.accPntInfo = null;
            })
            .addCase(getAccPntList.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.accPntInfo = payload;
                state.success9 = true;
                state.error9 = null;
            })
            .addCase(getAccPntList.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            });
    },
});

export default PatientSlice.reducer;
