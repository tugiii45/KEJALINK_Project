import { createSlice } from '@reduxjs/toolkit';
import React from 'react'

const InitialState = {
    notices: [],  //Holds the array of broadcast announcements
    loading: false, //Tracks if notices are loading from the server
    error: null  // Catches any loading errors
};

const NoticeSlice = createSlice({
    name: "notices",
    InitialState, 
    reducers: {
        setLoading(state, action) {
            state.loading = action.payload;
            
        },

        setError(state, action) {
            state.error = action.payload;
            state.loading = false;
        },

        //Fills the state with notices fetched from your database
        setNotices(state, action) {
            state.notices = action.payload;
            state.loading = false;
            state.error = null;
        },

        //Allows a landlord to postr a brand new notice
        addNotice(state, action) {
            state.notices.unshift(action.payload); // Unshift puts the newest notice at the top of the list
        },

        //Allows a landlord to delete a notice
        deleteNotice(state, action) {
            state.notices = state.notices.filter(notice => notice.id !== notice.id);
        }, 
        
    },
});

//Export the actions for my components for use in my react components

export const { setLoading, setError, setNotices, addNotice, deleteNotice } = NoticeSlice.actions;
export default NoticeSlice.reducer
