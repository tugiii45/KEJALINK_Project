/**
 * Payment Ledger Redux Slice (Firestore Synced)
 * 
 * This is the source of truth for all payments (from Firestore).
 * Payments are synced in real-time from the Firestore 'payments' collection.
 * IMPORTANT: This is what the PaymentDashboard displays to both tenants and landlords.
 * 
 * Tenants see: only their own payments (filtered by tenantUid or houseNumber)
 * Landlords see: all payments from all tenants
 */

import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  loading: false,
  error: null,
  payments: [],
}

const paymentLedgerSlice = createSlice({
  name: 'paymentLedger',
  initialState,
  reducers: {
    // Called when Firestore payment data is being fetched
    paymentLedgerLoading(state) {
      state.loading = true
      state.error = null
    },
    // Called when Firestore payment data successfully loaded
    paymentLedgerLoaded(state, action) {
      state.loading = false
      state.error = null
      // action.payload is the array of payment records from Firestore
      state.payments = action.payload ?? []
    },
    // Called when payment data fetch fails
    paymentLedgerError(state, action) {
      state.loading = false
      state.error = action.payload ?? 'Failed to load payments'
    },
    // Insert or update a single payment from real-time Firestore listener
    upsertPaymentFromServer(state, action) {
      const payment = action.payload
      if (!payment?.id) return
      // Check if this payment already exists in state
      const idx = state.payments.findIndex((p) => p.id === payment.id)
      if (idx >= 0) {
        // Update existing payment
        state.payments[idx] = payment
      } else {
        // Add new payment to beginning of list
        state.payments.unshift(payment)
      }
    },
  },
})

export const {
  paymentLedgerLoading,
  paymentLedgerLoaded,
  paymentLedgerError,
  upsertPaymentFromServer,
} = paymentLedgerSlice.actions

export default paymentLedgerSlice.reducer

