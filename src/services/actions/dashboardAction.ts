import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

// account/dashboard
export const DashboardDetail = createAsyncThunk('account-dashboard', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/dashboard`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

// auth/menuservice
export const menuDetails = createAsyncThunk('menu-details', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/menuservice`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const getNotification = createAsyncThunk('get-notification', async () => {
    try {
        const { data } = await ax.get(`datahub_report/get_notification`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getClearNotification = createAsyncThunk('get-clear-notification', async (payload:any) => {
    try {
        const { data } = await ax.post(`datahub_report/getclear_notification`, payload);
        return data;
    } catch (error:any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
