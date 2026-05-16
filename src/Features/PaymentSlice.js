import { createSlice } from '@reduxjs/toolkit';
import React from 'react'

const InitialState = {
    invoiceHistory: [], //List of all generated bills and invoices
    paymentHistory: [], //Records of successful transactions
    loading: false, //Tracks loading states for transatctions
    error: null, //Stores payment/billing error messages

};

const PaymentSlice = createSlice({
    name: "payments",
    InitialState,
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload

        },

        //Loads all bills/invoices for the current user
        setInvoices(state, action) {
            state.invoiceHistory = action.payload
            state.loading = false;
            state.error = null

        },

        //Loads past transactions/receipt history
        setPayments(state, action) {
            state.paymentHistory = action.payload
            state.loading = false;
            state.error = null
        },

        //Records a new payment made by a tenant
        makePayment(state, action) {
            state.paymentHistory.unshift(action.payload) // Unshift puts the newest payment at the top of the list
          }  
    },

});

//Export actions for use in my React components
export const { setLoading, setInvoices, setPayments, makePayment } = PaymentSlice.actions;
export default PaymentSlice.reducer
    