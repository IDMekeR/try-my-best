import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getReportComparison = createAsyncThunk('update_Prepost_report', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`datahub_report/update_Prepost_report`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getComparisonReport = createAsyncThunk('get-comp-report', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`datahub_report/Prepost_report`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
