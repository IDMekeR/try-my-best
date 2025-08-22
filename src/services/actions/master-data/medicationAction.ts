import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getMedicationList = createAsyncThunk('medication-list', async () => {
    try {
        const { data } = await ax.get(`patient/medic_mdata/`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
