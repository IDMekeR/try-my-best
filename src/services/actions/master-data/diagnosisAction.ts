import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getDiagnosisList = createAsyncThunk('diagnosis-list', async () => {
    try {
        const { data } = await ax.post(`patient/diagnosis_mdata/`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getSymptomsList = createAsyncThunk('symptoms_master', async () => {
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

export const getMarkerList = createAsyncThunk('marker_master', async () => {
    try {
        const { data } = await ax.post(`service_request/marker_mdata`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
//add
export const addDiagnosis = createAsyncThunk('add_diagnosis', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/add-diagnosis/`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addMarker = createAsyncThunk('add_marker', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/save-marker`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addSymptoms = createAsyncThunk('add-symptoms', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/add-symptoms/`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//delete patient/remove-diagnosis
export const deleteDiagnosis = createAsyncThunk('delete-diagnosis', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/remove-diagnosis`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteMarker = createAsyncThunk('delete-marker', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/remove-marker`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteSymptoms = createAsyncThunk('delete-symptoms', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/remove-symptoms`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
