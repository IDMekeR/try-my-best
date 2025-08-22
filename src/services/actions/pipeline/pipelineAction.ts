import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';
import { resultUploadProgress, getUploadConsentProgress, getUploadAssDocProgress } from 'services/uploadIndicator';
import { getConsentDownloadProgress, getExcelDownloadProgress } from 'services/downloadIndicator';

export const getPipelineRequest = createAsyncThunk('get-pipe-requests', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/get_service_search`, payload);
        return data;
    } catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const uploadResultDocument = createAsyncThunk('upload-result-doc', async (formData: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(resultUploadProgress(0));
        let uploadprogress = 0;
        const { data } = await ax.post(`docrepo/resultupload`, formData, {
            onUploadProgress: (progressEvent: any) => {
                uploadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(resultUploadProgress(uploadprogress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const uploadAssociatedDocument = createAsyncThunk('docrepo/docupload', async (formData: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(getUploadAssDocProgress(0));
        let uploadProgress = 0;
        const { data } = await ax.post(`docrepo/docupload`, formData, {
            onUploadProgress: (progressEvent: any) => {
                uploadProgress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(getUploadAssDocProgress(uploadProgress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const getDocumentList = createAsyncThunk('download-result-doc', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`docrepo/doclist`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveArchiveRequest = createAsyncThunk('archive-requests', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/saverequestarchived`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// service_request/reqxl-export
export const exportRequest = createAsyncThunk('export-requests-details', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/reqxl-export`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// service_request/getaccountrequest/1554
export const getRequestInfo = createAsyncThunk('req-requests', async (id: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.get(`service_request/getaccountrequest/${id}`);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const saveClinicalHistory = createAsyncThunk('save-clinical-history', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`service_request/savedataset`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const uploadConsentForm = createAsyncThunk('upload-consent-form', async (formData: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(getUploadConsentProgress(0));
        let uploadprogress = 0;
        const { data } = await ax.post(`docrepo/consentdocupload`, formData, {
            onUploadProgress: (progressEvent: any) => {
                uploadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(getUploadConsentProgress(uploadprogress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// docrepo/consentdocdownload
export const downloadConsentForm = createAsyncThunk('download-consent-form', async (payload: any, { dispatch, rejectWithValue }) => {
    try {
        dispatch(getConsentDownloadProgress(0));
        let downloadprogress = 0;
        const { data } = await ax.post(`docrepo/consentdocdownload`, payload, {
            onDownloadProgress: (progressEvent: any) => {
                downloadprogress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(getConsentDownloadProgress(downloadprogress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// docrepo/mail-consult
export const sentConsentToPatient = createAsyncThunk('docrepo/mail-consult', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`docrepo/mail-consult`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// patient/requestmedication
export const getAssociatedMedicines = createAsyncThunk('patient/requestmedication', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`patient/requestmedication`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
// docrepo/updatedoc
export const updateAssDocument = createAsyncThunk('docrepo/updatedoc', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`docrepo/updatedoc`, payload);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

export const deleteAssDocument = createAsyncThunk('document-delete', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`docrepo/docdelete`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
export const documentDownload = createAsyncThunk('docu-download', async (payload: any, { dispatch, rejectWithValue }) => {
    try {
        getExcelDownloadProgress(0);
        let progress = 0;
        const { data } = await ax.post(`docrepo/docdownload`, payload, {
            onDownloadProgress: (progressEvent: any) => {
                progress = Math.round((progressEvent.loaded / progressEvent.total) * 100);
                dispatch(getExcelDownloadProgress(progress));
            },
        });
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});
