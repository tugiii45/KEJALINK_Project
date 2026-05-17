import React from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './Routes/AppRouter.jsx'

function App() {
  return <RouterProvider router={router} />
}

export default App

