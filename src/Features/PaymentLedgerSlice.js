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
    paymentLedgerLoading(state) {
      state.loading = true
      state.error = null
    },
    paymentLedgerLoaded(state, action) {
      state.loading = false
      state.error = null
      state.payments = action.payload ?? []
    },
    paymentLedgerError(state, action) {
      state.loading = false
      state.error = action.payload ?? 'Failed to load payments'
    },
    upsertPaymentFromServer(state, action) {
      const payment = action.payload
      if (!payment?.id) return
      const idx = state.payments.findIndex((p) => p.id === payment.id)
      if (idx >= 0) state.payments[idx] = payment
      else state.payments.unshift(payment)
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

