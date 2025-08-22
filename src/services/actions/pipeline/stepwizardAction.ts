import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const getRequestAssMarkers = createAsyncThunk('interpretation-requests', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getinterpretationmakers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const getNonAssociateMarkers = createAsyncThunk('unselectmarker', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getnonexitmarkers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// addinterpretationmarkers
export const saveAssociateMarker = createAsyncThunk('add-interpret-mark', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/addinterpretationmarkers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const removeInterpretationMarker = createAsyncThunk('remove-interpret', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/removeinterpretationmarkers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const saveIn = createAsyncThunk('unselectmarker', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getnonexitmarkers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// docrepo/doclist_edf/1554
export const getEdfDocList = createAsyncThunk('edf-doc-list', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`docrepo/doclist_edf/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// docrepo/automate_ratiodoclist/1918
export const getResultRatio = createAsyncThunk('ratio-result-file', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`docrepo/automate_ratiodoclist/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveInterpretationMarker = createAsyncThunk('save-interpret', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/saveinterpretationmarkers`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// service_request/getresultinfo
export const getResultInfo = createAsyncThunk('get-result-info', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getresultinfo`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// service_request/getresultinfosplited
export const getTopoResultInfo = createAsyncThunk('get-result-info-topography', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/getresultinfosplited`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getWizardSteps = createAsyncThunk('getwizardsteps', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/get_wizard_pipelinestage/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// /patient/remove-pnttag/691
export const removeRequestTag = createAsyncThunk('remove-ass-tag', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.delete(`patient/remove-pnttag/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getAllRequestTag = createAsyncThunk('pnttagall', async () => {
    try {
        const { data } = await ax.get(`patient/pnttag-all`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});
// /patient/savePatientTags
export const saveRequestTag = createAsyncThunk('save-req-tag', async (payload: any) => {
    try {
        const { data } = await ax.post(`patient/savePatientTags`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});

export const saveAdditionalReportItems = createAsyncThunk('save-additional-report-items', async (payload: any) => {
    try {
        const { data } = await ax.post(`billing/SaveCommendSet`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});

// add_edf_job
export const startEdfJob = createAsyncThunk('start-edf-job', async (payload: any) => {
    try {
        const { data } = await ax.post(`automate/add_edf_job`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});
// service_request/savestatusdatase
export const releaseRequest = createAsyncThunk('start-released-request', async (payload: any) => {
    try {
        const { data } = await ax.post(`service_request/savestatusdataset`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});

export const getDataset = createAsyncThunk('getDataset', async (id: any) => {
    try {
        const { data } = await ax.get(`service_request/getdataset/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});


export const addPntDetail = createAsyncThunk('addontdetail', async (payload: any) => {
    try {
        const { data } = await ax.post(`patient/addtemp_pnt`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response;
        }
    }
});