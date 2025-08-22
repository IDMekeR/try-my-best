import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getAccountWithCredit = createAsyncThunk('billing/get_credit_used_account', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_credit_used_account/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const updateCreditDetails = createAsyncThunk('update-credot', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/add_credits`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// getRequestCredit
export const getRequestCredit = createAsyncThunk('req-credit', async (id: any, { rejectWithValue }) => {
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

//my-credit-purchase-history
export const getCreditPurchaseHistory = createAsyncThunk('my-credit-purchase-history', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_credit_purhistory/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getCreditPackage = createAsyncThunk('billing/buy-credit', async () => {
    try {
        const { data } = await ax.get(`billing/get_credit_package`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

// billing // my-credit // get billing payment
export const getCreditPayDetail = createAsyncThunk('billing/get_billing_payment', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/get_billingpayment/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// billing / proceed to paymemt
export const payCreditAmount = createAsyncThunk('proceed-to-payment', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/credit_payment`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//get imvoice export 
export const getInvoiceExport = createAsyncThunk('invoice-export', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/invoice_export`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});