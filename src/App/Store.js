/**
 * Redux Store Configuration
 * 
 * This is the central state management hub for the entire application.
 * It combines multiple Redux slices (feature states) into one store.
 * 
 * Slices included:
 * - auth: User authentication state (login, logout, user info, role)
 * - maintenance: Maintenance tickets and repair requests
 * - notices: Community notices from landlords
 * - payments: Local payment state during form submission
 * - paymentLedger: Firestore-synced payment history (tenant and landlord view)
 */

import { configureStore } from '@reduxjs/toolkit'

import authReducer from '../Features/AuthSlice'
import maintenanceReducer from '../Features/MaintenanceSlice'
import noticesReducer from '../Features/NoticeSlice'
import paymentsReducer from '../Features/PaymentSlice'
import paymentLedgerReducer from '../Features/PaymentLedgerSlice'

// Configure and export the Redux store with all reducers
export const store = configureStore({
  reducer: {
    auth: authReducer,
    maintenance: maintenanceReducer,
    notices: noticesReducer,
    payments: paymentsReducer,
    paymentLedger: paymentLedgerReducer,

  },
});

