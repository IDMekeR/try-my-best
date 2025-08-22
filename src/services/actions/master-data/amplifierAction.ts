import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getAmplifierList = createAsyncThunk('amplifier-list', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_all_amplifier`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addAmplifier = createAsyncThunk('add_amplifier', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/save_amplifier`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});