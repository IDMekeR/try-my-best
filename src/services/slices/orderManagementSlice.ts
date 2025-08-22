import { createSlice } from '@reduxjs/toolkit';
import { accountSaveOrder, adminSaveOrder, sendMail } from 'services/actions/orderManagementAction';

interface OrderState {
    loading: boolean;
    adSaveOrder: any;
    error: any;
    success: boolean;
    //send mail
    loading1: boolean;
    sendEmail: any;
    error1: any;
    success1: boolean;
    //account order
    loading2: boolean;
    addAccSaveOrder: any;
    error2: any;
    success2: boolean;
}

const initialState: OrderState = {
    loading: false,
    adSaveOrder: null,
    error: null,
    success: false,
    //send mail
    loading1: false,
    sendEmail: null,
    error1: null,
    success1: false,
    //account save order
    loading2: false,
    addAccSaveOrder: null,
    error2: false,
    success2: false,
};

const orderSlice = createSlice({
    name: 'order-management',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(adminSaveOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.success = false;
                state.adSaveOrder = null;
            })
            .addCase(adminSaveOrder.fulfilled, (state, { payload }) => {
                state.loading = false;
                state.adSaveOrder = payload;
                state.success = true;
            })
            .addCase(adminSaveOrder.rejected, (state, { payload }) => {
                state.loading = false;
                state.error = payload;
                state.success = false;
            })

            .addCase(sendMail.pending, (state) => {
                state.loading1 = true;
                state.error1 = null;
                state.success1 = false;
                state.sendEmail = null;
            })
            .addCase(sendMail.fulfilled, (state, { payload }) => {
                state.loading1 = false;
                state.sendEmail = payload;
                state.success1 = true;
            })
            .addCase(sendMail.rejected, (state, { payload }) => {
                state.loading1 = false;
                state.error1 = payload;
                state.success1 = false;
            })
            .addCase(accountSaveOrder.pending, (state) => {
                state.loading2 = true;
                state.error2 = null;
                state.success2 = false;
                state.addAccSaveOrder = null;
            })
            .addCase(accountSaveOrder.fulfilled, (state, { payload }) => {
                state.loading2 = false;
                state.addAccSaveOrder = payload;
                state.success2 = true;
            })
            .addCase(accountSaveOrder.rejected, (state, { payload }) => {
                state.loading2 = false;
                state.error2 = payload;
                state.success2 = false;
            });
    },
});

export default orderSlice.reducer;
