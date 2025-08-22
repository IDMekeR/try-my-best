import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getInvoiceStatistics = createAsyncThunk('account-invoice-statistics', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/get_invoice_statistics`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const getAwaitingInvoice = createAsyncThunk('awaiting-invoice', async () => {
    try {
        const { data } = await ax.get(`billing/waiting_for_invoice_new`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response.data;
        }
    }
});

export const getInvoiceData = createAsyncThunk('review-invoice', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/get_invoice_grid_new`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});
export const getInvoiceInfo = createAsyncThunk('get-invoice-info', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/invoice_info/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const updateInvoicePrice = createAsyncThunk('update-invoice-price', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/invoice_price_update`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const generateCustomInvoice = createAsyncThunk('generate-custom-invoice', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/generate_custom_invoice`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const proceedToInvPayment = createAsyncThunk('procedd-to-invoice-payment', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/pay_inv_payment`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const approveInvoice = createAsyncThunk('approve-invoice', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/approve_invoice_update`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const updatePaymentStatus = createAsyncThunk('update-payment-status', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/update_payment`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//invoice grpah
export const getInvoiceGraph = createAsyncThunk('get-invoice-graph', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/invoice_statistic`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//credit payment detial 
export const updateCreditPaymentStatus = createAsyncThunk('update-credit-payment-status', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/update_payment_detail`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getTransactionDetails = createAsyncThunk('get-transaction-history', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`billing/invoice_transaction/${id}`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// billing/invoice_reassessment
export const invoiceReassessment = createAsyncThunk('put-invoice-reassessment', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`billing/invoice_reassessment`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});