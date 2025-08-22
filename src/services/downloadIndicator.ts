import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    downloadProgress: 0,
    reqDownProgress: 0,
    docDownProgress: 0,
    resultDownProgress: 0,
    consentDownProgress: 0,
    excelDownProgress: 0,
};

const downloadSlice = createSlice({
    name: 'download',
    initialState,
    reducers: {
        setDownloadProgress: (state, action) => {
            state.downloadProgress = action.payload;
        },
        resetDownloadProgress: (state) => {
            state.downloadProgress = 0; // Reset download progress to 0%
        },
        setReqDownProgress: (state, action) => {
            state.reqDownProgress = action.payload;
        },
        setDocDownProgress: (state, action) => {
            state.docDownProgress = action.payload;
        },
        setResultDownProgress: (state, action) => {
            state.resultDownProgress = action.payload;
        },
        resetResultDownloadProgress: (state,action) => {
            state.resultDownProgress = action.payload; // Reset download progress to 0%
        },
        getConsentDownloadProgress: (state, action) => {
            state.consentDownProgress = action.payload; // Reset download progress to 0%
        },
        getExcelDownloadProgress: (state, action) => {
            state.excelDownProgress = action.payload; // Reset download progress to 0%
        },
    },
});

export const {
    setDownloadProgress,
    setReqDownProgress,
    getConsentDownloadProgress,
    setDocDownProgress,
    setResultDownProgress,
    resetDownloadProgress,
    resetResultDownloadProgress,
    getExcelDownloadProgress,
} = downloadSlice.actions;
export default downloadSlice.reducer;
