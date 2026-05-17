import { createSlice } from '@reduxjs/toolkit'

const InitialState = {
  tickets: [], // Stores the list of all maintenance issues
  loading: false, // Tracks if the data is being fetched or not
  error: null, // Stores any error messages from failed actions
}

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState: InitialState,
  reducers: {
    // Starting the process of fetching or submitting tickets
    setLoading(state, action) {
      state.loading = action.payload
    },

    // Sets an error message if something goes wrong
    setError(state, action) {
      state.error = action.payload
      state.loading = false
    },

    // Populates the state with tickets fetched from the database
    setTickets(state, action) {
      state.tickets = action.payload
      state.loading = false
      state.error = null
    },

    // Adds a newly reported tenant issue straight into the local state array
    addTicket(state, action) {
      state.tickets.push(action.payload)
    },

    // Allows landlord to change a ticket status
    updateTicketStatus(state, action) {
      const { id, status } = action.payload
      const existingTicket = state.tickets.find((ticket) => ticket.id === id)

      if (existingTicket) {
        existingTicket.status = status
      }
    },
  },
})

// Export actions for use in my React components
export const {
  setLoading,
  setError,
  setTickets,
  addTicket,
  updateTicketStatus,
} = maintenanceSlice.actions

export default maintenanceSlice.reducer
