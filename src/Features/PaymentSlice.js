/**
 * Payments Redux Slice (Local/UI State)
 *
 * This slice manages *client-side* UI state for payments (e.g. showing a
 * generated receipt preview, and loading/error flags during a simulated
 * “processing” flow).
 *
 * IMPORTANT:
 * - This slice is NOT responsible for Firestore syncing.
 * - Firestore-synced payment history/ledger is handled by:
 *   - `PaymentLedgerSlice`.
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
    // Add new payment to the top of the payments list for display
    addPayment(state, action) {
      // Insert at beginning so newest payment appears first
      state.payments.unshift(action.payload)
    },

    // Update a payment's verification status (Pending → Verified or Declined)
    updatePaymentStatus(state, action) {
      const { id, status } = action.payload ?? {}
      // Find payment by ID and update its status
      const payment = state.payments.find((p) => p.id === id)
      if (payment) {
        payment.status = status
      }
    },

    // Clear the current receipt from state after user closes receipt modal
    clearCurrentReceipt(state) {
      state.currentReceipt = null
      state.loading = false
      state.error = null
    },

    // Called when payment processing starts - show loading spinner
    processPaymentStart(state) {
      state.loading = true
      state.error = null
    },

    // Called when payment is successfully processed - store receipt for display
    processPaymentSuccess(state, action) {
      state.loading = false
      state.error = null
      // action.payload contains the generated receipt object
      state.currentReceipt = action.payload
    },

    // Called when payment processing fails - store error for display to user
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


// Action creator for processing payments (generates receipt on client-side)
export const processPayment = (payload) => (dispatch) => {
  dispatch(processPaymentStart())

  // Extract payment details from payload
  const { tenantName, houseNumber, amount, type, month, referenceCode } = payload ?? {}

  // Validate that all required fields are present before generating receipt
  if (!tenantName || !houseNumber || !amount || !type || !month || !referenceCode) {
    dispatch(processPaymentFailure('Missing required payment details'))
    return
  }

  // Create receipt object with payment information and timestamp
  const receipt = {
    id: Date.now(),
    tenantName,
    houseNumber,
    amount,
    type,
    month,
    referenceCode,
    // Format current date/time for display on receipt
    createdAt: new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    status: 'Successful',
  }

  // Update state with generated receipt for display to user
  dispatch(processPaymentSuccess(receipt))
}

export default paymentSlice.reducer

