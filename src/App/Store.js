import { configureStore } from '@reduxjs/toolkit'
import React from 'react'
import authReducer from '../Features/AuthSlice'
import maintenanceReducer from '../Features/MaintenanceSlice'
import noticesReducer from '../Features/NoticeSlice'
import paymentsReducer from '../Features/PaymentSlice'


export const store = configureStore({
  reducer: {
    auth: authReducer,
    maintenance: maintenanceReducer,
    notices: noticesReducer,
    payments: paymentsReducer

  },
});