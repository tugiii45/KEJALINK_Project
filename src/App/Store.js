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
    // User authentication state (login status, user profile, role)
    auth: authReducer,
    // Maintenance tickets submitted by tenants
    maintenance: maintenanceReducer,
    // Community notices/announcements posted by landlords
    notices: noticesReducer,
    // Local payment UI state during form submission
    payments: paymentsReducer,
    // Firestore-synced payment history (source of truth for ledger)
    paymentLedger: paymentLedgerReducer,
  },
});

