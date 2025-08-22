import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getLifestyleList = createAsyncThunk('lifestyle-list', async () => {
    try {
        const { data } = await ax.post(`patient/lifestyle_mdata/`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getRecommendedMedicList = createAsyncThunk('get-recomm-medication', async () => {
    try {
        const { data } = await ax.get(`md_management/get_templatemedicrefer`);
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getSupplementList = createAsyncThunk('get-supplement', async () => {
    try {
        const { data } = await ax.post(`patient/supplement_mdata/`);
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

//add
export const addLifestyle = createAsyncThunk('add_lifestyle', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/add-lifestyle/`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addSupplement = createAsyncThunk('add_supplement', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/add-supplement/`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addRecoMedication = createAsyncThunk('add-recom-medic', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`md_management/add_templatemedication`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//delete
export const deleteLifestyle = createAsyncThunk('delete-lifestyle', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/remove-lifestyle`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteRecoMedic = createAsyncThunk('delete-recomedic', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`md_management/delete_templatemedication`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteSupplement = createAsyncThunk('delete-supplement', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/remove-supplement`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
