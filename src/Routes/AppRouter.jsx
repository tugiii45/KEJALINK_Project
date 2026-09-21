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

import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  useLocation,
} from 'react-router-dom'
import { useState } from 'react'
import { useSelector } from 'react-redux'

// Import Pages
import Login from '../Pages/Login'
import SignUpShim from './SignUpShim'
import LandingPage from '../Pages/LandingPage'
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
  // Get user object from Redux auth state
  const { user, isAuthenticated } = useSelector((state) => state.auth)

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />
  }

  // Convert user role to lowercase for case-insensitive comparison
  const userRole = user?.role?.toLowerCase()
  const requiredRoleLower = requiredRole.toLowerCase()

  // If user's role doesn't match the required role, redirect to tenant dashboard
  if (userRole !== requiredRoleLower) {
    return <Navigate to="/tenant-dashboard" replace />
  }

  // User has the correct role, render the protected content
  return children
}

// 1) Shared Auth layout
function AppLayout() {
  // Check if user is authenticated from Redux store
  const { isAuthenticated } = useSelector((state) => state.auth)
  const location = useLocation()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  // Allow the public landing page at '/' even when not authenticated.
  if (!isAuthenticated && location.pathname !== '/') {
    return <Navigate to="/login" replace />
  }

  if (!isAuthenticated) {
    return <Outlet />
  }

  // Authenticated users get the full layout with Sidebar + main content
  return (
    <div className="app-shell" style={{ display: 'flex' }}>
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <button
        type="button"
        className="mobile-menu-button"
        onClick={() => setIsSidebarOpen(true)}
        aria-label="Open navigation menu"
        aria-expanded={isSidebarOpen}
      >
        <span aria-hidden="true">☰</span>
      </button>
      {isSidebarOpen && (
        <button
          type="button"
          className="mobile-sidebar-backdrop"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close navigation menu"
        />
      )}
      <main
        className="app-main theme-bg theme-text"
        style={{
          flex: 1,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Child routes render here (e.g., tenant-dashboard, landlord-dashboard) */}
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
        element: <LandingPage />,
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

export default function AppRouter() {
  return <RouterProvider router={router} />
}

