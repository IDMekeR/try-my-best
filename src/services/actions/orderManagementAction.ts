import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

import { resultUploadProgress } from 'services/uploadIndicator';

export const adminSaveOrder = createAsyncThunk('adminSaveOrder', async (payload: FormData, { dispatch, rejectWithValue }) => {
    try {
        dispatch(resultUploadProgress(0));
        let uploadprogress = 0;
        const { data } = await ax.post(`service_request/adminsaveServicerequest`, payload, {
            onUploadProgress: (progressEvent: any) => {
                uploadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(resultUploadProgress(uploadprogress));
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
export const accountSaveOrder = createAsyncThunk('accountSaveOrder', async (payload: FormData, { dispatch, rejectWithValue }) => {
    try {
        dispatch(resultUploadProgress(0));
        let uploadprogress = 0;
        const { data } = await ax.post(`service_request/accountsaveServicerequest`, payload, {
            onUploadProgress: (progressEvent: any) => {
                uploadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(resultUploadProgress(uploadprogress));
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
export const sendMail = createAsyncThunk('sendMail', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`docrepo/mail-consult`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
