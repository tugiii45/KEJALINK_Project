import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  currentReceipt: null,
}

const paymentSlice = createSlice({
  name: 'payments',
  initialState,
  reducers: {
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

