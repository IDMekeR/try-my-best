import { createSlice } from '@reduxjs/toolkit';
import { getAutomateInterpretationList } from 'services/actions/master-data/interpretationAction';

interface InterpretationState {
    loading: boolean;
    autoInterpetData: any;
    error: any;
    success: any;
}

const initialState: InterpretationState = {
    loading: false,
    autoInterpetData: null,
    error: null,
    success: false,
};

const interpretationSlice = createSlice({
    name: 'interpretation-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAutomateInterpretationList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAutomateInterpretationList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.autoInterpetData = payload;
                state.success = true;
            })
            .addCase(getAutomateInterpretationList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            });
    },
});

export default interpretationSlice.reducer;
