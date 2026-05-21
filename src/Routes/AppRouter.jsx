/**
 * Application Router Configuration
 * 
 * Defines all routes and page layouts:
 * - Public routes: /login, /signup (anyone can access)
 * - Protected routes: /tenant-dashboard, /landlord-dashboard, /payment-dashboard, etc.
 *   (only accessible if user is authenticated - AppLayout checks this)
 * 
 * AppLayout component wraps protected routes and includes the Sidebar navigation.
 * Navigation guards redirect unauthenticated users back to /login
 */

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
import SignUpShim from './SignUpShim'
import TenantDashboard from '../Pages/TenantDashboard'
import LandlordDashboard from '../Pages/LandlordDashboard'
import ReportIssue from '../Pages/ReportIssue'
import TicketQueue from '../Pages/TicketQueue'
import PaymentDashboard from '../Pages/PaymentDashboard'
import TenantMaintenance from '../Pages/TenantMaintenance'



// Import Layout Components
import Sidebar from '../Components/Sidebar'

// Role-based route protection component
function RoleProtectedRoute({ requiredRole, children }) {
  const { user } = useSelector((state) => state.auth)
  const userRole = user?.role?.toLowerCase()
  const requiredRoleLower = requiredRole.toLowerCase()

  if (userRole !== requiredRoleLower) {
    return <Navigate to="/tenant-dashboard" replace />
  }

  return children
}

// 1) Shared Auth layout
function AppLayout() {
  const { isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div style={{ display: 'flex' }}>
      {/* Sidebar is fixed; keep main offset so content doesn't go under it */}
      <Sidebar />
      <main
        className="theme-bg theme-text"
        style={{
          flex: 1,
          padding: '20px',
          marginLeft: '16rem', // matches Sidebar w-64
          height: '100vh',
          overflowY: 'auto',
        }}
      >
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
    path: '/signup',
    element: <SignUpShim />,
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
        path: 'maintenance',
        element: <TenantMaintenance />,
      },

      {
        path: 'payment-dashboard',
        element: <PaymentDashboard />,
      },
      {
        path: 'report-issue',
        element: <ReportIssue />,
      },
      {
        path: 'landlord-dashboard',
        element: (
          <RoleProtectedRoute requiredRole="landlord">
            <LandlordDashboard />
          </RoleProtectedRoute>
        ),
      },
      {
        path: 'ticket-queue',
        element: (
          <RoleProtectedRoute requiredRole="landlord">
            <TicketQueue />
          </RoleProtectedRoute>
        ),
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

