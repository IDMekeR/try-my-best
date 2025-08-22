import { createSlice } from '@reduxjs/toolkit';
import {
    generateCustomInvoice,
    getAwaitingInvoice,
    getInvoiceData,
    getInvoiceInfo,
    getInvoiceStatistics,
    proceedToInvPayment,
    updateInvoicePrice,
    approveInvoice,
    updatePaymentStatus,
    getInvoiceGraph,
    updateCreditPaymentStatus,
    getTransactionDetails,
    invoiceReassessment,
} from 'services/actions/invoiceAction';

interface InvoiceState {
    loading: boolean;
    invstatInfo: any;
    error: any;
    success: boolean;
    loading1: boolean;
    awaitingInfo: any;
    error1: any;
    success1: boolean;
    loading2: boolean;
    invoiceInfo: any;
    error2: any;
    success2: boolean;
    loading3: boolean;
    success3: boolean;
    error3: any;
    invoicePageInfo: any;
    loading4: boolean;
    error4: any;
    success4: boolean;
    updatePriceInfo: any;
    loading5: boolean;
    error5: any;
    success5: boolean;
    generateInvInfo: any;
    loading6: boolean;
    error6: any;
    success6: boolean;
    invPayInfo: any;
    loading7: boolean;
    error7: any;
    success7: boolean;
    approveInv: any;
    loading8: boolean;
    error8: any;
    success8: boolean;
    updateStatus: any;
    loading9: boolean;
    error9: any;
    success9: boolean;
    invgraphInfo: any;
    loading10: boolean;
    error10: any;
    success10: boolean;
    crdUpdateStauts: any;
    loading13: boolean;
    error13: any;
    transInfo: any;
    success13: boolean;
    //invoice reassessment
    loading14:boolean;
    success14:boolean;
    error14:any;
    invReassess:any;
}

const initialState: InvoiceState = {
    loading: false,
    invstatInfo: null,
    error: null,
    success: false,
    loading1: false,
    awaitingInfo: null,
    error1: null,
    success1: false,
    loading2: false,
    invoiceInfo: null,
    error2: null,
    success2: false,
    loading3: false,
    error3: null,
    success3: false,
    invoicePageInfo: null,
    loading4: false,
    error4: null,
    success4: false,
    updatePriceInfo: null,
    loading5: false,
    error5: null,
    success5: false,
    generateInvInfo: null,
    loading6: false,
    error6: null,
    success6: false,
    invPayInfo: null,
    loading7: false,
    error7: null,
    success7: false,
    approveInv: null,
    loading8: false,
    error8: null,
    success8: false,
    updateStatus: null,
    loading9: false,
    error9: null,
    success9: false,
    invgraphInfo: null,
    loading10: false,
    error10: null,
    success10: false,
    crdUpdateStauts: null,
    //transaction history
    loading13: false,
    error13: null,
    transInfo: null,
    success13: false,
    loading14:false,
    error14:false,
    invReassess:null,
    success14:false,
};

const invoiceSlice = createSlice({
    name: 'invoice',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getInvoiceStatistics.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
            })
            .addCase(getInvoiceStatistics.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.invstatInfo = payload;
                state.success = true;
            })
            .addCase(getInvoiceStatistics.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })
            .addCase(getAwaitingInvoice.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
            })
            .addCase(getAwaitingInvoice.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.awaitingInfo = payload;
                state.success1 = true;
            })
            .addCase(getAwaitingInvoice.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(getInvoiceData.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.invoiceInfo = null;
            })
            .addCase(getInvoiceData.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.invoiceInfo = payload;
                state.success2 = true;
            })
            .addCase(getInvoiceData.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            })
            .addCase(getInvoiceInfo.pending, (state) => {
                state.loading3 = true;
                state.error3 = null;
                state.success3 = false;
                state.invoicePageInfo = null;
            })
            .addCase(getInvoiceInfo.fulfilled, (state, { payload }) => {
                state.loading3 = false;
                state.invoicePageInfo = payload;
                state.success3 = true;
            })
            .addCase(getInvoiceInfo.rejected, (state, { payload }) => {
                state.loading3 = false;
                state.error3 = payload;
                state.success3 = false;
            })
            .addCase(updateInvoicePrice.pending, (state) => {
                state.loading4 = true;
                state.error4 = null;
                state.success4 = false;
                state.updatePriceInfo = null;
            })
            .addCase(updateInvoicePrice.fulfilled, (state, { payload }) => {
                state.loading4 = false;
                state.updatePriceInfo = payload;
                state.success4 = true;
            })
            .addCase(updateInvoicePrice.rejected, (state, { payload }) => {
                state.loading4 = false;
                state.error4 = payload;
                state.success4 = false;
            })
            .addCase(generateCustomInvoice.pending, (state) => {
                state.loading5 = true;
                state.error5 = null;
                state.success5 = false;
                state.generateInvInfo = null;
            })
            .addCase(generateCustomInvoice.fulfilled, (state, { payload }) => {
                state.loading5 = false;
                state.generateInvInfo = payload;
                state.success5 = true;
            })
            .addCase(generateCustomInvoice.rejected, (state, { payload }) => {
                state.loading5 = false;
                state.error5 = payload;
                state.success5 = false;
            })
            .addCase(proceedToInvPayment.pending, (state) => {
                state.loading6 = true;
                state.error6 = null;
                state.success6 = false;
                state.invPayInfo = null;
            })
            .addCase(proceedToInvPayment.fulfilled, (state, { payload }) => {
                state.loading6 = false;
                state.invPayInfo = payload;
                state.success6 = true;
            })
            .addCase(proceedToInvPayment.rejected, (state, { payload }) => {
                state.loading6 = false;
                state.error6 = payload;
                state.success6 = false;
            })
            .addCase(approveInvoice.pending, (state) => {
                state.loading7 = true;
                state.error7 = null;
                state.success7 = false;
                state.approveInv = null;
            })
            .addCase(approveInvoice.fulfilled, (state, { payload }) => {
                state.loading7 = false;
                state.approveInv = payload;
                state.success7 = true;
            })
            .addCase(approveInvoice.rejected, (state, { payload }) => {
                state.loading7 = false;
                state.error7 = payload;
                state.success7 = false;
            })
            .addCase(updatePaymentStatus.pending, (state) => {
                state.loading8 = true;
                state.error8 = null;
                state.success8 = false;
                state.updateStatus = null;
            })
            .addCase(updatePaymentStatus.fulfilled, (state, { payload }) => {
                state.loading8 = false;
                state.updateStatus = payload;
                state.success8 = true;
            })
            .addCase(updatePaymentStatus.rejected, (state, { payload }) => {
                state.loading8 = false;
                state.error8 = payload;
                state.success8 = false;
            })
            .addCase(getInvoiceGraph.pending, (state) => {
                state.loading9 = true;
                state.error9 = null;
                state.success9 = false;
                state.invgraphInfo = null;
            })
            .addCase(getInvoiceGraph.fulfilled, (state, { payload }) => {
                state.loading9 = false;
                state.invgraphInfo = payload;
                state.success9 = true;
            })
            .addCase(getInvoiceGraph.rejected, (state, { payload }) => {
                state.loading9 = false;
                state.error9 = payload;
                state.success9 = false;
            })
            .addCase(updateCreditPaymentStatus.pending, (state) => {
                state.loading10 = true;
                state.error10 = null;
                state.success10 = false;
                state.crdUpdateStauts = null;
            })
            .addCase(updateCreditPaymentStatus.fulfilled, (state, { payload }) => {
                state.loading10 = false;
                state.crdUpdateStauts = payload;
                state.success10 = true;
            })
            .addCase(updateCreditPaymentStatus.rejected, (state, { payload }) => {
                state.loading10 = false;
                state.error10 = payload;
                state.success10 = false;
            })
            .addCase(getTransactionDetails.pending, (state) => {
                state.loading13 = true;
                state.error13 = null;
                state.success13 = false;
                state.transInfo = null;
            })
            .addCase(getTransactionDetails.fulfilled, (state, { payload }) => {
                state.loading13 = false;
                state.transInfo = payload;
                state.success13 = true;
            })
            .addCase(getTransactionDetails.rejected, (state, { payload }) => {
                state.loading13 = false;
                state.error13 = payload;
                state.success13 = false;
            })
            .addCase(invoiceReassessment.pending, (state) => {
                state.loading14 = true;
                state.error14 = null;
                state.success14 = false;
                state.invReassess = null;
            })
            .addCase(invoiceReassessment.fulfilled, (state, { payload }) => {
                state.loading14 = false;
                state.invReassess = payload;
                state.success14 = true;
            })
            .addCase(invoiceReassessment.rejected, (state, { payload }) => {
                state.loading14 = false;
                state.error14 = payload;
                state.success14 = false;
            });
    },
});

export default invoiceSlice.reducer;
