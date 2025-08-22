import { createAsyncThunk } from '@reduxjs/toolkit';
import { ax } from 'services/apiService';

export const userLogin = createAsyncThunk('user-login', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/login`, payload);
        localStorage.setItem('token', true.toString());
        localStorage.setItem('userid', data.data.userid);
        sessionStorage.setItem('userid', data.data.userid);
        sessionStorage.setItem('role', data.data.role);
        sessionStorage.setItem('accountid', data.data.user_acctid);
        sessionStorage.setItem('firstname', data.data.firstname);
        sessionStorage.setItem('lastname', data.data.lastname);
        sessionStorage.setItem('username', data.data.username);
        sessionStorage.setItem('password', data.data.password);
        return data;
    } catch (error: any) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//auth/password_reset
export const SendEmail = createAsyncThunk('auth-send-email', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/password_reset`, payload);
        // store user's token in local storage
        return data;
    } catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//change password
export const ChangePass = createAsyncThunk('auth-change-pass', async (payload: any, { rejectWithValue }) => {
    try {
        // configure header's Content-Type as JSON
        const { data } = await ax.put(`auth/change-password`, payload);
        // store user's token in local storage
        return data;
    } catch (error: any) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//confirm reset password
export const confirmPass = createAsyncThunk('auth/confirm-pass', async (payload:any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/password_reset/confirm/`, payload);
        // store user's token in local storage
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//verify token
export const VerifyToken = createAsyncThunk('auth/verify-token', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/reset-password/verify-token`, payload);
        // store user's token in local storage
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//user profilecall
export const getUserProfile = createAsyncThunk('account-user-profile', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/UserProfileCall`, payload);
        // store user's token in local storage
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const changeDefaultPass = createAsyncThunk('default-pass-user-profile', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/login_auth`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

export const confirmPassword = createAsyncThunk('auth/confirm-password', async (payload:any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/password_reset/password_reset_confirm`, payload);
        // store user's token in local storage
        return data;
    } catch (error) {
        // return custom error message from API if any
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//mfa authentication
export const mfaCodeVerify = createAsyncThunk('mfa-verify', async (payload:any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/mfa_verify`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

//mfa reset 
export const mfaCodeReset = createAsyncThunk('mfa-reset', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/mfa_reset`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

// email authentication
export const sendEmailCode = createAsyncThunk('send-email', async (payload:any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/login_with_otp`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

// email authentication verification
export const verifyEmailCode = createAsyncThunk('email-verify', async (payload:any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/validate_otp`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.response.data);
        }
    }
});

// logout api
export const userLogout = createAsyncThunk('logout', async () => {
    try {
        const { data } = await ax.get(`auth/logout`);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            // return rejectWithValue(error.response.data)
        } else {
            // return rejectWithValue(error.message)
        }
    }
});

export const signUpAccount = createAsyncThunk('signup-new-account', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`account/saveAccount_public`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

//mfa reset with  email
export const mfaEmailReset = createAsyncThunk('mfa-reset-code', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/mfa_reset_with_otp`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});

// verify mfa reset 
export const verifyMfaReset = createAsyncThunk('verify-mfa-reset', async (payload: any, { rejectWithValue }) => {
    try {
        const { data } = await ax.post(`auth/mfa_validate_otp`, payload);
        return data;
    } catch (error) {
        if (error.response && error.response.data) {
            return rejectWithValue(error.response.data);
        } else {
            return rejectWithValue(error.message);
        }
    }
});