import { createSlice } from '@reduxjs/toolkit';

const uploadSlice = createSlice({
    name: 'upload',
    initialState: {
        progress: 0,
        uploadReqProgress: 0,
        uploadDocProgress: 0,
        resultDocProgress: 0,
        uploadConsentProgress: 0,
        uploadAssDocProgress: 0,
    },
    reducers: {
        updateProgress: (state, action) => {
            state.progress = action.payload;
        },
        uploadRequestProgress: (state, action) => {
            state.uploadReqProgress = action.payload;
        },
        docUploadProgress: (state, action) => {
            state.uploadDocProgress = action.payload;
        },
        getUploadConsentProgress: (state, action) => {
            state.uploadConsentProgress = action.payload;
        },
        resultUploadProgress: (state, action) => {
            state.resultDocProgress = action.payload;
        },
        resetResultUploadProgress: (state) => {
            state.resultDocProgress = 0;
        },
        getUploadAssDocProgress: (state, action) => {
            state.uploadAssDocProgress = action.payload;
        },
    },
});

export const { updateProgress, uploadRequestProgress, docUploadProgress, resultUploadProgress, resetResultUploadProgress, getUploadConsentProgress, getUploadAssDocProgress } =
    uploadSlice.actions;
export default uploadSlice.reducer;
