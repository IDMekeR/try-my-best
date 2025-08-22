import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getAccountList = createAsyncThunk('accountlist', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/getAccount`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addAccount = createAsyncThunk('addaccountlist', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/saveAccount`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getAccountUser = createAsyncThunk('get-account-user-list', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/getUser`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// account/getAccount/${id}
export const getAccountDetail = createAsyncThunk('get-account-details-list', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`account/getAccount/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addUser = createAsyncThunk('add-user', async (payload: any, { rejectWithValue }) => {
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

export const getAccBillingType = createAsyncThunk('account-billing-type', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_billing_service/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getAccSpecialPrice = createAsyncThunk('account-special-price', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_creditprice/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getAccReportItems = createAsyncThunk('account-report-items', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_creditm/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveAccBillingType = createAsyncThunk('save-billing-type', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/set_billing_service`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addSpecialPrice = createAsyncThunk('add-special-price', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/save_Account_creditprice`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addAccReportItems = createAsyncThunk('add-report-items-acc', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/add_accountcredit`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// add request rcredit
export const addRequestCredit = createAsyncThunk('add-report-credit', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/add_requestcredit`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// get request credit

export const getRequestCredit = createAsyncThunk('get-request-credit', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_requestcredit/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//save card details
export const saveCardDetails = createAsyncThunk('save-card-details', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/autopay_submit`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// account/account_approve
export const approveAccount = createAsyncThunk('approve-account', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/account_approve`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// account/ save user agreement
export const saveAgreement = createAsyncThunk('user-agreement', async (payload: FormData, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/saveAccount_agreement`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
