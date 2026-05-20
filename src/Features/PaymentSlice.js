/**
 * Payments Redux Slice (Local State)
 * 
 * Handles UI state for payment form submission and receipts.
 * NOT used for syncing from Firestore - that's handled by PaymentLedgerSlice.
 * This slice is for managing the current receipt preview and loading states.
 * 
 * Use this for: form submission feedback, receipt display, error handling
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  currentReceipt: null,
  // Sample payment data - shows the structure that will be used
  payments: [
    {
      id: 'KL-482910',                    // Unique transaction ID
      tenantName: 'Conrad',               // Full name of tenant who paid
      houseNumber: 'A4',                  // Unit/apartment number
      amount: 25000,                      // Amount in KES (Kenyan Shillings)
      type: 'Rent',                       // Payment type: Rent, Water Bill, Service Charge
      month: 'May 2026',                  // Month/period the payment covers
      referenceCode: 'TFX94KLD2',         // M-PESA transaction code
      date: '05/19/2026',                 // Date payment was submitted
      time: '10:30 AM',                   // Time payment was submitted
      status: 'Pending Verification',     // Status: Pending Verification, Verified, or Declined
    },
    {
      id: 'KL-219843',
      tenantName: 'Alex Kiprop',
      houseNumber: 'B1',
      amount: 3200,
      type: 'Water Bill',
      month: 'April 2026',
      referenceCode: 'RDH45JKS1',
      date: '05/12/2026',
      time: '02:15 PM',
      status: 'Verified',
    },
  ],
}


const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
    addPayment(state, action) {
      // Add newest payment to the top of the ledger
      state.payments.unshift(action.payload)
    },

    updatePaymentStatus(state, action) {
      const { id, status } = action.payload ?? {}
      const payment = state.payments.find((p) => p.id === id)
      if (payment) {
        payment.status = status
      }
    },

    clearCurrentReceipt(state) {
      state.currentReceipt = null
      state.loading = false
      state.error = null
    },


    processPaymentStart(state) {
      state.loading = true
      state.error = null
    },

    processPaymentSuccess(state, action) {
      state.loading = false
      state.error = null
      state.currentReceipt = action.payload
    },

    processPaymentFailure(state, action) {
      state.loading = false
      state.error = action.payload ?? 'Payment failed'
    },
  },
})

export const {
  addPayment,
  updatePaymentStatus,
  clearCurrentReceipt,
  processPaymentStart,
  processPaymentSuccess,
  processPaymentFailure,
} = paymentSlice.actions


// Lightweight action creator (no async middleware needed)
export const processPayment = (payload) => (dispatch) => {
  dispatch(processPaymentStart())

  // Simple receipt generation (client-side)
  const { tenantName, houseNumber, amount, type, month, referenceCode } = payload ?? {}

  // Minimal validation
  if (!tenantName || !houseNumber || !amount || !type || !month || !referenceCode) {
    dispatch(processPaymentFailure('Missing required payment details'))
    return
  }

  const receipt = {
    id: Date.now(),
    tenantName,
    houseNumber,
    amount,
    type,
    month,
    referenceCode,
    createdAt: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    // you can extend this later with transaction status
    status: 'Successful',
  }

  dispatch(processPaymentSuccess(receipt))
}

export default paymentSlice.reducer

