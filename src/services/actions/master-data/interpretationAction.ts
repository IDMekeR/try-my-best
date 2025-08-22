import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getAutomateInterpretationList = createAsyncThunk('interpretation_authmate', async () => {
    try {
        const { data } = await ax.post(`md_management/automate_mdata`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
