import React from 'react'
import { createSlice } from '@reduxjs/toolkit'

const InitialState= {
    user: null,
    isAuthenticated: false,
    token: null

}

const authSlice = createSlice({
    name: "auth",
    InitialState,
    reducers: {
        login(state, action) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
            state.token = action.payload.token;
        },
        logout(state) {
            state.user = null;
            state.isAuthenticated = false;
            state.token = null;
        },
    },
}); 

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;