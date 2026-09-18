/**
 * Main App Component
 * 
 * Root component that sets up routing for the entire application.
 * Routes are defined in AppRouter.jsx and included here via RouterProvider.
 * This component doesn't render much itself - it just provides routing context.
 */

import AppRouter from './Routes/AppRouter.jsx'

function App() {
  return <AppRouter />
}

export default App

