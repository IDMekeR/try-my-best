import { createSlice } from '@reduxjs/toolkit';
import { getMedicationList } from 'services/actions/patientAction';

interface MedicationState {
    loading: boolean;
    medicationInfo: any;
    error: any;
    success: boolean;
}

const initialState: MedicationState = {
    loading: false,
    medicationInfo: null,
    error: null,
    success: false,
};

const medicationSlice = createSlice({
    name: 'medication-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getMedicationList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getMedicationList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.medicationInfo = payload;
                state.success = true;
            })
            .addCase(getMedicationList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            });
    },
});

export default medicationSlice.reducer;
