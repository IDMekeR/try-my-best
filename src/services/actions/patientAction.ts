import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax, axs } from 'services/apiService';

const base_url1 = 'https://clinicaltables.nlm.nih.gov/api/rxterms/v3/search?terms';

export const getPatientList = createAsyncThunk('listOfpatient', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/getPatient`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const addPatient = createAsyncThunk('addPatient', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/addpatient`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deletePatient = createAsyncThunk('delete-patient', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/deletepatient`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// patient/getPatient/2023
export const getPatient = createAsyncThunk('get-patient', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/getPatient/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getPntAssRequestList = createAsyncThunk('get-patient-ass-req', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/patientreqinfo/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getPntMedication = createAsyncThunk('get-pnt-medication', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/getmedication/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//third party api for medication
export const getMedicationList = createAsyncThunk('get-third-party-medication', async (value: any, { rejectWithValue }) => {
    try {
        const { data } = await axs.get(`${base_url1}=${value}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getDosageList = createAsyncThunk('get-third-party-dosage', async (value: any, { rejectWithValue }) => {
    try {
        const { data } = await axs.get(`${base_url1}=${value}&ef=STRENGTHS_AND_FORMS,RXCUIS`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getCodeList = createAsyncThunk('get-third-party-code', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await axs.get(`${base_url1}=${payload.value}&ef=STRENGTHS_AND_FORMS=${payload.value1},RXCUIS`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getAccPntList = createAsyncThunk('patientypes', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`patient/getPatientacctview/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response);
        }
    }
});
