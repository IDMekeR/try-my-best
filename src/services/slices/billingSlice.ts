import { createSlice } from '@reduxjs/toolkit';
import { getAccountWithCredit, getCreditPackage, getCreditPayDetail, getCreditPurchaseHistory, getRequestCredit, payCreditAmount, updateCreditDetails,
    getInvoiceExport
} from 'services/actions/billingAction';

interface BillingState {
    loading: boolean;
    accCreditInfo: any; // Define the type of userInfo
    error: any; // Define the type of error
    success: boolean;
    loading1: boolean;
    saveCrdInfo: any;
    error1: any;
    success1: boolean;
    //credit request
    loading2: boolean;
    error2: any;
    success2: boolean;
    creditReqInfo: any;
    loading3: boolean;
    error3: any;
    success3: boolean;
    purchaseHistoryInfo: any;
    // get package
    loading4: boolean;
    error4: any;
    success4: boolean;
    packageInfo: any;
    //getCreditPayDetail
    loading5: boolean;
    error5: any;
    success5: boolean;
    payCreditInfo: any;
    loading6:boolean;
    error6:any;
    success6:boolean;
    payInfo:any;
    //get invoice export
    loading7:boolean;
    error7:any;
    success7:any;
    invExport:any;
}

const initialState: BillingState = {
    loading: false,
    accCreditInfo: null,
    error: null,
    success: false,
    loading1: false,
    saveCrdInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    error2: null,
    success2: false,
    creditReqInfo: null,
    //my-credit-purcahse-history
    loading3: false,
    error3: null,
    success3: false,
    purchaseHistoryInfo: null,
    //get package
    loading4: false,
    error4: null,
    success4: false,
    packageInfo: null,
    loading5: false,
    error5: null,
    success5: false,
    payCreditInfo: null,
    loading6:false,
    error6:null,
    success6:false,
    payInfo:null,
    // invoice export
    loading7:false,
    error7:null,
    success7:false,
    invExport:null,
};

const billingSlice = createSlice({
    name: 'billing',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getAccountWithCredit.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.accCreditInfo = null;
            })
            .addCase(getAccountWithCredit.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.accCreditInfo = payload;
                state.success = true;
            })
            .addCase(getAccountWithCredit.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(updateCreditDetails.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.saveCrdInfo = null;
            })
            .addCase(updateCreditDetails.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.saveCrdInfo = payload;
                state.success1 = true;
            })
            .addCase(updateCreditDetails.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getRequestCredit.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.creditReqInfo = null;
            })
            .addCase(getRequestCredit.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.creditReqInfo = payload;
                state.success2 = true;
            })
            .addCase(getRequestCredit.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getCreditPurchaseHistory.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.purchaseHistoryInfo = null;
            })
            .addCase(getCreditPurchaseHistory.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.purchaseHistoryInfo = payload;
                state.success3 = true;
            })
            .addCase(getCreditPurchaseHistory.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(getCreditPackage.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.packageInfo = null;
            })
            .addCase(getCreditPackage.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.packageInfo = payload;
                state.success4 = true;
            })
            .addCase(getCreditPackage.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(getCreditPayDetail.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.payCreditInfo = null;
            })
            .addCase(getCreditPayDetail.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.payCreditInfo = payload;
                state.success5 = true;
            })
            .addCase(getCreditPayDetail.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(payCreditAmount.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.payInfo = null;
            })
            .addCase(payCreditAmount.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.payInfo = payload;
                state.success6 = true;
            })
            .addCase(payCreditAmount.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(getInvoiceExport.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.invExport = null;
            })
            .addCase(getInvoiceExport.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.invExport = payload;
                state.success7 = true;
            })
            .addCase(getInvoiceExport.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            });
    },
});

export default billingSlice.reducer;
