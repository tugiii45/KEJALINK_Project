import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  notices: [
    {
      id: 1,
      title: 'Water Shortage Notice',
      message: 'Routine tank cleanups scheduled for Wednesday 8 AM to 4 PM. Please store water.',
      date: 'May 19, 2026',
      category: 'Utility',
      importance: 'high',
      isPinned: false
    }
  ]
};

const noticeSlice = createSlice({
  name: 'notices',
  initialState,
  reducers: {
    addNotice: (state, action) => {
      // If the landlord wants to pin this new notice, we unpin previous notices first (optional)
      if (action.payload.isPinned) {
        state.notices.forEach(notice => notice.isPinned = false);
      }
      // Add the new notice to the beginning of the array
      state.notices.unshift(action.payload);
    },
    togglePinNotice: (state, action) => {
      const noticeId = action.payload;
      state.notices.forEach(notice => {
        if (notice.id === noticeId) {
          notice.isPinned = !notice.isPinned;
        } else if (!notice.isPinned) {
          // If setting a single pinned item, keep others false
          notice.isPinned = false;
        }
      });
    }
  }
});

export const { addNotice, togglePinNotice } = noticeSlice.actions;
export default noticeSlice.reducer;