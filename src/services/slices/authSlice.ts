import { createSlice } from '@reduxjs/toolkit';
import {
    ChangePass, confirmPass, SendEmail, userLogin, VerifyToken, getUserProfile, changeDefaultPass, confirmPassword, mfaCodeVerify, mfaCodeReset, sendEmailCode, verifyEmailCode,
    signUpAccount, mfaEmailReset, verifyMfaReset
} from 'services/actions/authAction';

interface AuthState {
    loading: boolean;
    userInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    //confirm email
    loading1: boolean;
    resetInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    passInfo: any;
    error2: any;
    success2: boolean;
    //verify token
    loading3: boolean;
    tokenInfo: any;
    error3: any;
    success3: boolean;
    //reset pass
    loading4: boolean;
    resetpassInfo: any;
    error4: any;
    success4: boolean;
    //change password
    loading5: boolean;
    defaultPassInfo: any;
    error5: any;
    success5: boolean;
    // user profile
    loading6: boolean;
    userProfileInfo: any;
    error6: any;
    success6: boolean;
    //confirm passowrd
    loading7: boolean;
    conPass: any;
    error7: any;
    success7: boolean;
    //mfa 
    loading8: boolean;
    verifyMfa: any;
    error8: any;
    success8: boolean;
    //mfa reset 
    loading9: boolean;
    resetMfa: any;
    error9: any;
    success9: boolean;
    //email 
    loading10: boolean;
    emailCode: any;
    error10: any;
    success10: boolean;
    //email verify
    loading11: boolean;
    verifyEcode: any;
    error11: any;
    success11: boolean;
    //new account onboarding
    loading12: boolean;
    accountInfo: any;
    error12: any;
    success12: boolean;
    // send reset mail
    loading13: boolean;
    mailReset: any;
    error13: any;
    success13: boolean;
    // verify mfa reset
    loading14: boolean;
    verifyReset: any;
    error14: any;
    success14: boolean;
}
const initialState: AuthState = {
    loading: false,
    userInfo: null,
    error: null,
    success: false,
    //confirm email
    loading1: false,
    resetInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    passInfo: null,
    error2: null,
    success2: false,
    //verify token
    loading3: false,
    tokenInfo: null,
    error3: null,
    success3: false,
    //reset pass
    loading4: false,
    resetpassInfo: null,
    error4: null,
    success4: false,
    //changepass
    loading5: false,
    defaultPassInfo: null,
    error5: null,
    success5: false,
    //user profile 
    loading6: false,
    userProfileInfo: null,
    error6: null,
    success6: false,
    // comfirm passowrd
    loading7: false,
    conPass: null,
    error7: null,
    success7: false,
    //mfa verification
    loading8: false,
    verifyMfa: null,
    error8: null,
    success8: false,
    //mfa verfication
    loading9: false,
    resetMfa: null,
    error9: null,
    success9: false,
    //email verfication
    loading10: false,
    emailCode: null,
    error10: null,
    success10: false,
    //email verify
    loading11: false,
    verifyEcode: null,
    error11: null,
    success11: false,
    // new account onboarding
    loading12: false,
    accountInfo: null,
    error12: null,
    success12: false,
    // send mfa reset mail
    loading13: false,
    mailReset: null,
    error13: null,
    success13: false,
    // verify mfa reset
    loading14: false,
    verifyReset: null,
    error14: null,
    success14: false,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(userLogin.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(userLogin.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.userInfo = payload;
                state.success = true;
            })
            .addCase(userLogin.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            //resetpassword
            .addCase(SendEmail.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(SendEmail.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.resetInfo = payload;
                state.success1 = true;
            })
            .addCase(SendEmail.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            //changePassword
            .addCase(ChangePass.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(ChangePass.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.passInfo = payload;
                state.success2 = true;
            })
            .addCase(ChangePass.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            //reset-pass
            .addCase(confirmPass.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
            })
            .addCase(confirmPass.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.tokenInfo = payload;
                state.success3 = true;
            })
            .addCase(confirmPass.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            //verify token
            .addCase(VerifyToken.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
            })
            .addCase(VerifyToken.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.tokenInfo = payload;
                state.success4 = true;
            })
            .addCase(VerifyToken.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            //change default password
            .addCase(changeDefaultPass.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
            })
            .addCase(changeDefaultPass.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.defaultPassInfo = payload;
                state.success5 = true;
            })
            .addCase(changeDefaultPass.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            // user profile 
            .addCase(getUserProfile.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
            })
            .addCase(getUserProfile.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.userProfileInfo = payload;
                state.success6 = true;
            })
            .addCase(getUserProfile.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            //conform passowrd
            .addCase(confirmPassword.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
            })
            .addCase(confirmPassword.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.conPass = payload;
                state.success7 = true;
            })
            .addCase(confirmPassword.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            // mfa verification
            .addCase(mfaCodeVerify.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
            })
            .addCase(mfaCodeVerify.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.verifyMfa = payload;
                state.success8 = true;
            })
            .addCase(mfaCodeVerify.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            // mfa reset 
            .addCase(mfaCodeReset.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
            })
            .addCase(mfaCodeReset.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.resetMfa = payload;
                state.success9 = true;
            })
            .addCase(mfaCodeReset.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            // send code via email
            .addCase(sendEmailCode.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
            })
            .addCase(sendEmailCode.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.emailCode = payload;
                state.success10 = true;
            })
            .addCase(sendEmailCode.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            // verify email code
            .addCase(verifyEmailCode.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
            })
            .addCase(verifyEmailCode.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.verifyEcode = payload;
                state.success11 = true;
            })
            .addCase(verifyEmailCode.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            //new account onboarding
            .addCase(signUpAccount.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
                state.accountInfo = null;
            })
            .addCase(signUpAccount.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.accountInfo = payload;
                state.success12 = true;
            })
            .addCase(signUpAccount.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            })
            // send mfa reset mail
            .addCase(mfaEmailReset.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
                state.mailReset = null;
            })
            .addCase(mfaEmailReset.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.mailReset = payload;
                state.success13 = true;
            })
            .addCase(mfaEmailReset.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            // verify mfa  reset 
            .addCase(verifyMfaReset.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
                state.verifyReset = null;
            })
            .addCase(verifyMfaReset.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.verifyReset = payload;
                state.success14 = true;
            })
            .addCase(verifyMfaReset.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            });
    },
});

export default authSlice.reducer;
