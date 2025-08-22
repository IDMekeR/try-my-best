import { createSlice } from '@reduxjs/toolkit';
import { getSymptomsList } from 'services/actions/master-data/diagnosisAction';

interface SymptomsState {
    loading: boolean;
    symptomsInfo: any;
    error: any;
    success: any;
}

const initialState: SymptomsState = {
    loading: false,
    symptomsInfo: null,
    error: null,
    success: false,
};

const symptomsSlice = createSlice({
    name: 'symptoms-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getSymptomsList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getSymptomsList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.symptomsInfo = payload;
                state.success = true;
            })
            .addCase(getSymptomsList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            });
    },
});

export default symptomsSlice.reducer;
