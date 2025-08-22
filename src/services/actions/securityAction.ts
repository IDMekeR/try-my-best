import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getUserRoles = createAsyncThunk('get-user-roles', async () => {
    try {
        const { data } = await ax.post(`account/getusergroups`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getAllUsers = createAsyncThunk('get-all-userss', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/getalluser`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveUser = createAsyncThunk('add-all-user', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/generate_user`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// get individual user data 

export const getUserData = createAsyncThunk('get-user', async (id: any) => {
    try {
        const { data } = await ax.get(`account/getUser/${id}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});