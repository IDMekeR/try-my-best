import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getSymptomsList = createAsyncThunk('symptoms-list', async () => {
    try {
        const { data } = await ax.post(`patient/symptoms_mdata/`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
