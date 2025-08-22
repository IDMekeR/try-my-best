import { createSlice } from '@reduxjs/toolkit';
import { getGlobalSearch, amazonSearchTable, amazonSearch } from 'services/actions/searchAction';

interface SearchState {
    loading: boolean;
    searchInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    amazonSrchTbl: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    amazonSrch: any;
    error2: any;
    success2: boolean;
}

const initialState: SearchState = {
    loading: false,
    searchInfo: null,
    error: null,
    success: false,
    //amazon search
    loading1: false,
    amazonSrchTbl: null,
    error1: null,
    success1: false,
    loading2: false,
    amazonSrch: null,
    error2: null,
    success2: false,
};

const searchSlice = createSlice({
    name: 'search',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // search
            .addCase(getGlobalSearch.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getGlobalSearch.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.searchInfo = payload;
                state.success = true;
            })
            .addCase(getGlobalSearch.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            // amazon-table
            .addCase(amazonSearchTable.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(amazonSearchTable.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.amazonSrchTbl = payload;
                state.success1 = true;
            })
            .addCase(amazonSearchTable.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            //amazon-search
            .addCase(amazonSearch.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(amazonSearch.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.amazonSrch = payload;
                state.success2 = true;
            })
            .addCase(amazonSearch.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            });
    },
});

export default searchSlice.reducer;
