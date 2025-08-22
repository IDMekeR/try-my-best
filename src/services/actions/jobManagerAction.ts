import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';
import { resetDownloadProgress, setDownloadProgress } from 'services/downloadIndicator';

export const getEdfSetting = createAsyncThunk('get-edf-setting', async () => {
    try {
        const { data } = await ax.post(`md_management/jobconfig_mdata`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.response.data;
        }
    }
});

export const addEdfSetting = createAsyncThunk('add-edf-setting', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`md_management/add-jobconfig`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const submitArtifactStatus = createAsyncThunk('get-edf-setting-status', async (id: number, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`automate/steps_checking/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const getAllJobs = createAsyncThunk('get-edf-alljobs-status', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_reqjobs`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const getErrorJobs = createAsyncThunk('get-edf-error-jobs', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_reqjobs`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

// automate/get_edf_analyzerjobs
export const getEdfAnalyzerJobs = createAsyncThunk('get-edf-analyzer-jobs', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_edf_analyzerjobs`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});
// automate/get_edf_job_update_new
export const getEdfProcessing = createAsyncThunk('get-edf-processing-details', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_edf_job_update_new`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});
// automate/get_step_out
export const getEdfStepResult = createAsyncThunk('get-edf-step-result', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/get_step_out`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});
// automate/get_step_out
export const getXlsxData = createAsyncThunk('get-xlsx-step-result', async (payload: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(resetDownloadProgress());
        let progress = 0;
        const response = await ax.post(`automate/get_step_out`, payload, {
            onDownloadProgress: (progressEvent: any) => {
                progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(setDownloadProgress(progress));
            },
        });
        return response.data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const cancelEdfJobs = createAsyncThunk('cancel-edf-jobs', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/edfjob_cancel`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const resetEdfJobs = createAsyncThunk('reset-edf-jobs', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`automate/edfjob_reset`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});


export const getEnableEdfAnalyzer = createAsyncThunk('get-edf-analyzer', async (payload: any) => {
    try {
        const { data } = await ax.post(`automate/cars_job`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return error.response.data;
        } else {
            return error.message;
        }
    }
});

export const getEdfAnalyzerTopos = createAsyncThunk('get-edf-analyzer-topography', async (id: any) => {
    try {
        const { data } = await ax.get(`automate/cars_path_info/${id}`);
        return data;
    } catch (error: any) {
        if (error?.response && error?.response.data) {
            return error?.response.data;
        } else {
            return error?.message;
        }
    }
});