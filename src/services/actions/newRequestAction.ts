import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';
import { updateProgress } from 'services/uploadIndicator';

export const getNewRequest = createAsyncThunk('get-new-requests', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/get_service_search`, payload);
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

export const getArchivedRequest = createAsyncThunk('get-archived-requests', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/get_service_search`, payload);
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

//patient/getpatientreq_phq/2148

export const getPhQuestionnaire = createAsyncThunk('get-phq', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/getpatientreq_phq/${id}`);
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

export const saveNewRequest = createAsyncThunk('save-new-req', async (formData: any, { dispatch, rejectWithValue }) => {
    try {
        let uploadprogress = 0;
        const { data } = await ax.post(`service_request/accountsaveServicerequest`, formData, {
            onUploadProgress: (progressEvent: any) => {
                uploadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(updateProgress(uploadprogress));
            },
        });
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

// patient/getpatientreq_phq/1554
export const getPhqQuesAns = createAsyncThunk('get-phq-ans', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/getpatientreq_phq/${id}`);
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

// get phq data
export const getPh8Data = createAsyncThunk('get-phq-data', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`md_management/publicphq_mdata`,payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
