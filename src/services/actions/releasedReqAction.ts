import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';
import { resetResultDownloadProgress, setResultDownProgress } from 'services/downloadIndicator';

export const getReleasedRequest = createAsyncThunk('get-released-requests', async (payload: any, { rejectWithValue }) => {
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

export const getResultDocDownload = createAsyncThunk('result-download', async (payload: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(resetResultDownloadProgress(0));
        let progress = 0;
        const { data } = await ax.post(`docrepo/resultdownload`, payload, {
            onDownloadProgress: (progressEvent: any) => {
                progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(setResultDownProgress(progress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

export const getReleasedDetails = createAsyncThunk('result-data-download', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getresultinfo`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

export const getDatasetInformation = createAsyncThunk('getDataset', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/getdataset/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

// get result document, docrepo/automate_ratiodoclist/1258
export const getResultDocList = createAsyncThunk('result-docu-list', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`docrepo/automate_ratiodoclist/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

// reassesment request
export const reassessmentReq = createAsyncThunk('reasses-request', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/reassessment`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

// validate release request
export const validateRequest = createAsyncThunk('validate-release-request', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getreq_validation`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});
