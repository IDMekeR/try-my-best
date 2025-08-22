import {createSlice} from '@reduxjs/toolkit';
import { create } from 'domain';

import { getAmplifierList, addAmplifier} from 'services/actions/master-data/amplifierAction';

interface AmplifierState {
    loading: boolean;
    amplifierInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    addAmplifierInfo: any;
    error1: any;
    success1: boolean;
}

const initialState: AmplifierState = { 
    loading: false,
    amplifierInfo: null,
    error: null,
    success: false,

    loading1: false,
    addAmplifierInfo: null,
    error1: null,
    success1: false,
}

const amplifierSlice = createSlice({
    name: 'amplifier-slice',
    initialState,
    reducers: {},
    extraReducers : (builder) => {
        builder
        .addCase(getAmplifierList.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.success = false;
        })
        .addCase(getAmplifierList.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.amplifierInfo = payload;
            state.success = true;
        })
        .addCase(getAmplifierList.rejected, (state, { payload }) => {
            state.loading = false;
            state.error = payload;
            state.success = false;
        })
        .addCase(addAmplifier.pending, (state) => {
            state.loading1 = true;
            state.error1 = null;
            state.success1 = false;
        })
        .addCase(addAmplifier.fulfilled, (state, { payload }) => {
            state.loading1 = false;
            state.addAmplifierInfo = payload;
            state.success1 = true;
        })
        .addCase(addAmplifier.rejected, (state, { payload }) => {
            state.loading1 = false;
            state.error1 = payload;
            state.success1 = false;
        })
    }
})

export default amplifierSlice.reducer;