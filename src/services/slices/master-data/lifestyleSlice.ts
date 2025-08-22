import { createSlice } from '@reduxjs/toolkit';
import {
    addLifestyle,
    addRecoMedication,
    addSupplement,
    deleteLifestyle,
    deleteRecoMedic,
    deleteSupplement,
    getLifestyleList,
    getRecommendedMedicList,
    getSupplementList,
} from 'services/actions/master-data/lifestyleAction';

interface MasterState {
    loading: boolean;
    lifestyleInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    recomedicInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    suppInfo: any;
    error2: any;
    success2: boolean;
    //add
    loading4: boolean;
    addLifeInfo: any;
    error4: any;
    success4: boolean;
    loading6: boolean;
    addSuppInfo: any;
    error6: any;
    success6: boolean;
    loading11: boolean;
    success11: boolean;
    error11: any;
    addMedicInfo: any;
    //delete
    loading12: boolean;
    error12: any;
    delLyfInfo: any;
    success12: boolean;
    loading13: boolean;
    error13: any;
    delRecomedicInfo: any;
    success13: boolean;
    loading14: boolean;
    error14: any;
    delSuppInfo: any;
    success14: boolean;
}

const initialState: MasterState = {
    loading: false,
    lifestyleInfo: null,
    error: null,
    success: false,
    loading1: false,
    recomedicInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    suppInfo: null,
    error2: null,
    success2: false,
    //add
    loading4: false,
    addLifeInfo: null,
    error4: null,
    success4: false,
    loading6: false,
    addSuppInfo: null,
    success6: false,
    error6: null,
    loading11: false,
    addMedicInfo: null,
    error11: null,
    success11: false,
    //delete
    loading12: false,
    error12: null,
    delLyfInfo: null,
    success12: false,
    loading13: false,
    error13: null,
    delRecomedicInfo: null,
    success13: false,
    loading14: false,
    error14: null,
    delSuppInfo: null,
    success14: false,
};

const lifestyleSlice = createSlice({
    name: 'lifestyle-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getLifestyleList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getLifestyleList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.lifestyleInfo = payload;
                state.success = true;
            })
            .addCase(getLifestyleList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getRecommendedMedicList.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(getRecommendedMedicList.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.recomedicInfo = payload;
                state.success1 = true;
            })
            .addCase(getRecommendedMedicList.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getSupplementList.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(getSupplementList.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.suppInfo = payload;
                state.success2 = true;
            })
            .addCase(getSupplementList.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            //add
            .addCase(addLifestyle.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
            })
            .addCase(addLifestyle.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.addLifeInfo = payload;
                state.success4 = true;
            })
            .addCase(addLifestyle.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(addSupplement.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
            })
            .addCase(addSupplement.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.addSuppInfo = payload;
                state.success6 = true;
            })
            .addCase(addSupplement.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(addRecoMedication.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
            })
            .addCase(addRecoMedication.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.addMedicInfo = payload;
                state.success11 = true;
            })
            .addCase(addRecoMedication.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            //delete
            .addCase(deleteLifestyle.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
            })
            .addCase(deleteLifestyle.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.delLyfInfo = payload;
                state.success12 = true;
            })
            .addCase(deleteLifestyle.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            })
            .addCase(deleteRecoMedic.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
            })
            .addCase(deleteRecoMedic.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.delRecomedicInfo = payload;
                state.success13 = true;
            })
            .addCase(deleteRecoMedic.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            .addCase(deleteSupplement.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
            })
            .addCase(deleteSupplement.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.delSuppInfo = payload;
                state.success14 = true;
            })
            .addCase(deleteSupplement.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            });
    },
});

export default lifestyleSlice.reducer;
