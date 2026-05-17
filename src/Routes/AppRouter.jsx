import React from 'react'
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
} from 'react-router-dom'
import { useSelector } from 'react-redux'

// Import Pages
import Login from '../Pages/Login'
import TenantDashboard from '../Pages/TenantDashboard'
import LandlordDashboard from '../Pages/LandlordDashboard'
import ReportIssue from '../Pages/ReportIssue'
import TicketQueue from '../Pages/TicketQueue'

// Import Layout Components
import Sidebar from '../Components/Sidebar'

// 1) Shared Auth layout
function AppLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{ flex: 1, padding: '20px' }}>
        <Outlet />
      </main>
    </div>
  )
}

// 2) Router configuration
const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/login" replace />,
      },
      {
        path: 'tenant-dashboard',
        element: <TenantDashboard />,
      },
      {
        path: 'report-issue',
        element: <ReportIssue />,
      },
      {
        path: 'landlord-dashboard',
        element: <LandlordDashboard />,
      },
      {
        path: 'ticket-queue',
        element: <TicketQueue />,
      },
      {
        path: '*',
        element: <h2>404 - Page Not Found</h2>,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
])

// 3) Named export for App.jsx
export { router }

export default function AppRouter() {
  return <RouterProvider router={router} />
}

