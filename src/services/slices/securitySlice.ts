import { createSlice } from '@reduxjs/toolkit';
import { getAllUsers, getUserRoles, saveUser,getUserData } from 'services/actions/securityAction';

interface SecurityState {
    loading: boolean;
    roleInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    success1: boolean;
    error1: any;
    allUserInfo: any;
    //add user
    loading2: boolean;
    success2: boolean;
    error2: any;
    addUserInfo: any;
    // get individual user 
    loading3: boolean;
    success3: boolean;
    error3: any;
    getUserInfo: any;
}

const initialState: SecurityState = {
    loading: false,
    roleInfo: null,
    error: null,
    success: false,
    loading1: false,
    error1: null,
    success1: false,
    allUserInfo: null,
    loading2: false,
    error2: null,
    success2: false,
    addUserInfo: null,
    // individual user 
    loading3: false,
    error3: null,
    success3: false,
    getUserInfo: null,
};

const securitySlice = createSlice({
    name: 'security',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getUserRoles.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getUserRoles.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.roleInfo = payload;
                state.success = true;
            })
            .addCase(getUserRoles.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getAllUsers.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.allUserInfo = null;
            })
            .addCase(getAllUsers.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.allUserInfo = payload;
                state.success1 = true;
            })
            .addCase(getAllUsers.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
                state.allUserInfo = null;
            })
            .addCase(saveUser.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.allUserInfo = null;
            })
            .addCase(saveUser.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.allUserInfo = payload;
                state.success2 = true;
            })
            .addCase(saveUser.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
                state.allUserInfo = null;
            })
            //get individual user 
            .addCase(getUserData.pending, (state) => {
                state.loading3 = true;
                state.error3= null;
                state.success3 = false;
                state.getUserInfo = null;
            })
            .addCase(getUserData.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.getUserInfo = payload;
                state.success3 = true;
            })
            .addCase(getUserData.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
                state.getUserInfo = null;
            });
    },
});

export default securitySlice.reducer;
