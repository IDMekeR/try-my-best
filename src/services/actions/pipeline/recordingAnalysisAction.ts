import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

//recording analysis content
export const getAnalysisProcedures = createAsyncThunk('get_associate_analysisprocedures', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_associate_analysisprocedures/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveAnalysisProcedures = createAsyncThunk('save-recording-analysis', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_associate_analysisprocedures`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//interpretation content
export const getInterpretationFindings = createAsyncThunk('associate-interpretation-get', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_associate_Interpretation/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const saveInterpretFindings = createAsyncThunk('save-interpret-analysis', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_associate_Interpretation`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
//pdr service_request/get_pdrinfo
export const getPdrData = createAsyncThunk('get-pdr-info', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_pdrinfo/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// add_pdrinfo
export const savePdrInfo = createAsyncThunk('save-pdr-info', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_pdrinfo`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//get neurofeedback
export const getNeuroFeedback = createAsyncThunk('get-neuro-info', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_neurofeedback_ai/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveNeurofeedback = createAsyncThunk('save-neurofeedback', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_neurofeedback`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
//get adjunct
export const getAdjunct = createAsyncThunk('get-adjunct-info', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_adjuncttherapies/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveAdjunctTherapy = createAsyncThunk('save-adjtherapy', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_adjuncttherapies`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const savePhotobiomodulation = createAsyncThunk('add-photobiomodulation', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/add_photobiomodulation`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const getPhotobiomodulation = createAsyncThunk('get-photobiomodulation', async (id: any) => {
    try {
        const { data } = await ax.get(`service_request/get_photobiomodulation/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
