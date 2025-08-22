import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getGlobalSearch = createAsyncThunk('search-global-data', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/advancesearchsp`, payload);
        return data;
    } catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const amazonSearchTable = createAsyncThunk('amazonsearchtable', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/advancesearchsp`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const amazonSearch = createAsyncThunk('amazonsearch', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`search_eeg/customadsearch`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
