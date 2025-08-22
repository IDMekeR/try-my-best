import { createSlice } from '@reduxjs/toolkit';
import {
    addAccount,
    addAccReportItems,
    addSpecialPrice,
    addUser,
    getAccBillingType,
    getAccountDetail,
    getAccountList,
    getAccountUser,
    getAccReportItems,
    getAccSpecialPrice,
    saveAccBillingType,
    addRequestCredit,
    getRequestCredit,
    saveCardDetails,
    approveAccount,
    saveAgreement
} from 'services/actions/accountAction';

interface AccountState {
    loading: boolean;
    accountInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    addAccInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    error2: any;
    userInfo: any;
    success2: boolean;
    loading3: boolean;
    success3: boolean;
    acctInfo: any;
    error3: any;
    loading4: boolean;
    error4: any;
    addUserInfo: any;
    success4: boolean;
    //account billing
    loading5: boolean;
    billingTypeInfo: any;
    error5: any;
    success5: boolean;
    loading6: boolean;
    specialPriceInfo: any;
    error6: any;
    success6: boolean;
    loading7: boolean;
    reportItemInfo: any;
    error7: any;
    success7: boolean;
    loading8: boolean;
    error8: any;
    success8: boolean;
    saveBillInfo: any;
    loading9: boolean;
    success9: boolean;
    error9: any;
    saveSpclPriceInfo: any;
    loading10: boolean;
    success10: boolean;
    error10: any;
    saveAccRptInfo: any;
    loading11: boolean;
    success11: boolean;
    error11: any;
    addReqCrd: any;
    loading12: boolean;
    success12: boolean;
    error12: any;
    getReqCrd: any;
    loading13: boolean;
    success13: boolean;
    error13: any;
    cardInfo: any;
    //acccount approve 
    loading14: boolean;
    error14: any;
    success14: boolean;
    approveAccInfo: any;
    // user agreement
    loading15: boolean;
    error15: any;
    success15: boolean;
    userAgree: any;
}
const initialState: AccountState = {
    loading: false,
    accountInfo: null,
    error: null,
    success: false,
    loading1: false,
    addAccInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    success2: false,
    error2: null,
    userInfo: null,
    loading3: false,
    success3: false,
    error3: null,
    acctInfo: null,
    loading4: false,
    error4: null,
    addUserInfo: null,
    success4: false,
    //account billing
    loading5: false,
    billingTypeInfo: null,
    error5: null,
    success5: false,
    loading6: false,
    specialPriceInfo: null,
    error6: null,
    success6: false,
    loading7: false,
    reportItemInfo: null,
    error7: null,
    success7: false,
    loading8: false,
    error8: null,
    success8: false,
    saveBillInfo: null,
    loading9: false,
    success9: false,
    error9: null,
    saveSpclPriceInfo: null,
    loading10: false,
    success10: false,
    error10: null,
    saveAccRptInfo: null,
    // add request credit
    loading11: false,
    success11: false,
    error11: null,
    addReqCrd: null,
    // get request credit
    loading12: false,
    success12: false,
    error12: null,
    getReqCrd: null,
    loading13: false,
    success13: false,
    error13: null,
    cardInfo: null,
    // approve account 
    loading14: false,
    error14: null,
    success14: false,
    approveAccInfo: null,
    // user agreement 
    loading15: false,
    error15: null,
    success15: false,
    userAgree: null,
};

const accountSlice = createSlice({
    name: 'account-slice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAccountList.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getAccountList.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.accountInfo = payload;
                state.success = true;
            })
            .addCase(getAccountList.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(addAccount.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(addAccount.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.addAccInfo = payload;
                state.success1 = true;
            })
            .addCase(addAccount.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getAccountUser.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
            })
            .addCase(getAccountUser.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.userInfo = payload;
                state.success2 = true;
            })
            .addCase(getAccountUser.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getAccountDetail.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
            })
            .addCase(getAccountDetail.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.acctInfo = payload;
                state.success3 = true;
            })
            .addCase(getAccountDetail.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(addUser.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
            })
            .addCase(addUser.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.addUserInfo = payload;
                state.success4 = true;
            })
            .addCase(addUser.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            //account billing
            .addCase(getAccBillingType.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
            })
            .addCase(getAccBillingType.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.billingTypeInfo = payload;
                state.success5 = true;
            })
            .addCase(getAccBillingType.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(getAccSpecialPrice.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
            })
            .addCase(getAccSpecialPrice.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.specialPriceInfo = payload;
                state.success6 = true;
            })
            .addCase(getAccSpecialPrice.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(getAccReportItems.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
            })
            .addCase(getAccReportItems.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.reportItemInfo = payload;
                state.success7 = true;
            })
            .addCase(getAccReportItems.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(saveAccBillingType.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
            })
            .addCase(saveAccBillingType.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.saveBillInfo = payload;
                state.success8 = true;
            })
            .addCase(saveAccBillingType.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(addSpecialPrice.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
            })
            .addCase(addSpecialPrice.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.saveSpclPriceInfo = payload;
                state.success9 = true;
            })
            .addCase(addSpecialPrice.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(addAccReportItems.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
            })
            .addCase(addAccReportItems.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.saveAccRptInfo = payload;
                state.success10 = true;
            })
            .addCase(addAccReportItems.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            // add request credit
            .addCase(addRequestCredit.pending, (state) => {
                state.loading11 = true;
                state.error11 = null;
                state.success11 = false;
            })
            .addCase(addRequestCredit.fulfilled, (state, { payload }) => {
                state.loading11 = false;
                state.addReqCrd = payload;
                state.success11 = true;
            })
            .addCase(addRequestCredit.rejected, (state, { payload }) => {
                state.loading11 = false;
                state.error11 = payload;
                state.success11 = false;
            })
            //get request credit
            .addCase(getRequestCredit.pending, (state) => {
                state.loading12 = true;
                state.error12 = null;
                state.success12 = false;
            })
            .addCase(getRequestCredit.fulfilled, (state, { payload }) => {
                state.loading12 = false;
                state.getReqCrd = payload;
                state.success12 = true;
            })
            .addCase(getRequestCredit.rejected, (state, { payload }) => {
                state.loading12 = false;
                state.error12 = payload;
                state.success12 = false;
            })
            .addCase(saveCardDetails.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
            })
            .addCase(saveCardDetails.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.cardInfo = payload;
                state.success13 = true;
            })
            .addCase(saveCardDetails.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            //approve account
            .addCase(approveAccount.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
                state.approveAccInfo = null;
            })
            .addCase(approveAccount.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.approveAccInfo = payload;
                state.success14 = true;
            })
            .addCase(approveAccount.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            })
            // user agreement
            .addCase(saveAgreement.pending, (state) => {
                state.loading15 = true;
                state.error15 = null;
                state.success15 = false;
                state.userAgree = null;
            })
            .addCase(saveAgreement.fulfilled, (state, { payload }) => {
                state.loading15 = false;
                state.userAgree = payload;
                state.success15 = true;
            })
            .addCase(saveAgreement.rejected, (state, { payload }) => {
                state.loading15 = false;
                state.error15 = payload;
                state.success15 = false;
            });
    },
});

export default accountSlice.reducer;
