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
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload; // action.payload should pass the user object containing the role
      state.loading = false;
      state.error = null;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload; // Sets error message if login fails
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.error = null;
    }
  }
});

export const { loginStart, loginSuccess, loginFailure, logout } = authSlice.actions;
export default authSlice.reducer;