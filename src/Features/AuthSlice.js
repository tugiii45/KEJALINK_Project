/**
 * Authentication Redux Slice
 * 
 * Manages user login/logout state and authentication status.
 * Stores user information (name, email, role: 'Tenant'/'Landlord', house number, uid)
 * Controls navigation restrictions - pages check if isAuthenticated is true
 */

import { createSlice } from '@reduxjs/toolkit';

// Initial state: user is logged out with no profile
const initialState = {
  isAuthenticated: false,
  user: null, // This will hold { id, username, role: 'tenant' | 'landlord' }
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when login request starts (show loading spinner)
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Called when login succeeds - store user data and mark as authenticated
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      // action.payload should contain { uid, email, username, role: 'tenant' | 'landlord', houseNumber }
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    // Called when login fails - store error message for display to user
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Error message describing login failure
    },
    // Called on logout - clear all user data and reset to initial state
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;