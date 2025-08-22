import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

// patient/pnttag-all
export const allPatientTag = createAsyncThunk('pnttagall', async () => {
    try {
        const { data } = await ax.get(`patient/pnttag-all`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});

export const getCountry = createAsyncThunk('get-country', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/getcountrystates`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

export const getState = createAsyncThunk('get-state', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/getcountrystates`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});

export const getAllAccount = createAsyncThunk('get-all-account', async () => {
    try {
        const { data } = await ax.get(`account/getAccountAll`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});

// service_request/getassociatecommon
export const getAssociateCommon = createAsyncThunk('get-associated', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getassociatecommon_ai`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});
// saveassociatecommon
export const saveAssociateCommon = createAsyncThunk('saveassociatecommon', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/saveassociatecommon`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//add-public patient intake form patient/publicpatient_intakeform
export const addPntForm = createAsyncThunk( 'add-pnt-intake-form',async (formData: any, { rejectWithValue }) => {
        try {
            const { data } = await ax.post(`patient/publicrequest_intakeform`, formData)
            return data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);

//public patient verify account/getpublicaccount
export const verifyPntForm = createAsyncThunk('verify-pnt-form',async (payload : any, { rejectWithValue }) => {
        try {
            const { data } = await ax.post( `account/getpublicaccount`, payload )
            return data;
        } catch (error :any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data)
            } else {
                return rejectWithValue(error.message)
            }
        }
    }
);

