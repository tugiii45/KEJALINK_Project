/**
 * Main App Component
 * 
 * Root component that sets up routing for the entire application.
 * Routes are defined in AppRouter.jsx and included here via RouterProvider.
 * This component doesn't render much itself - it just provides routing context.
 */

import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/AppRouter.jsx'

function App() {
  return <RouterProvider router={router} />
}

export default App

