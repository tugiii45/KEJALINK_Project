
/**
 * Sidebar Navigation Component
 * 
 * Main navigation bar shown on all protected pages (after login).
 * Displays different navigation links based on user role.
 * 
 * TENANT ROUTES:
 * - /tenant-dashboard: Home/overview
 * - /payment-dashboard: Pay rent and view payment history
 * - /report-issue: Report maintenance problems
 * 
 * LANDLORD ROUTES:
 * - /landlord-dashboard: Property overview and management
 * - /ticket-queue: View all maintenance tickets
 * - /payment-dashboard: Verify tenant payments
 * 
 * Features:
 * - Displays current user role
 * - Active link highlighting (green background)
 * - Logout button that redirects to /login
 * - Responsive design
 */

import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logout } from '../Features/AuthSlice'


function Sidebar() {
  const navigate = useNavigate()

  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)
  const role = user?.role || 'tenant'

  const handleLogout = () => {
    // Dispatch logout action to clear auth state from Redux
    dispatch(logout())
    // Small delay to ensure Redux state updates, then redirect to landing page
    setTimeout(() => {
      navigate('/', { replace: true })
    }, 100)
  }





  return (
    <aside
      className="fixed top-0 bottom-0 left-0 w-64 bg-white border-r border-slate-200 px-4 py-6 flex flex-col"
      style={{ 
        boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)',
        backgroundColor: 'var(--panel)',
        borderColor: 'var(--border)',
        color: 'var(--text)'
      }}
    >
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900" style={{ color: 'var(--text)' }}>KejaLink</h2>
            <p className="text-sm text-slate-600 mt-1" style={{ color: 'var(--muted)' }}>Role: {role}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                // Get current theme from DOM attribute
                const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark'
                // Apply theme to document element
                document.documentElement.setAttribute('data-theme', next)
                // Persist theme preference to localStorage for next session
                try {
                  localStorage.setItem('theme', next)
                } catch {}
              }}
              className="px-2.5 py-2 rounded-lg text-xs font-semibold bg-slate-100 hover:bg-slate-200 border border-slate-200 transition-colors"
              style={{ 
                backgroundColor: 'var(--bg)',
                borderColor: 'var(--border)',
                color: 'var(--text)'
              }}
              aria-label="Toggle dark/light theme"
            >
              {typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark' ? '🌙 Dark' : '☀️ Light'}
            </button>
          </div>
        </div>
      </div>

      <nav className="flex flex-col gap-2">
        {role === 'tenant' ? (
          <>
            {/* Tenant Dashboard - Home overview */}
            <NavLink
              to="/tenant-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Dashboard
            </NavLink>

            {/* Payment Dashboard - Pay rent and view payment history */}
            <NavLink
              to="/payment-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Payments
            </NavLink>

            {/* Report Issue - Submit new maintenance requests */}
            <NavLink
              to="/report-issue"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Report Issue
            </NavLink>
          </>
        ) : (
          <>
            {/* Landlord Dashboard - Overview and management hub */}
            <NavLink
              to="/landlord-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Overview
            </NavLink>
            {/* Ticket Queue - View all tenant maintenance requests */}
            <NavLink
              to="/ticket-queue"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Ticket Queue
            </NavLink>

            {/* Payment Dashboard - Verify tenant payments and ledger */}
            <NavLink
              to="/payment-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border cursor-pointer ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Payments
            </NavLink>
          </>
        )}
      </nav>

      <div className="mt-auto">
        <hr className="my-6 border-slate-200" />
        <button
          onClick={handleLogout}
          className="w-full px-3 py-2 rounded-lg text-sm font-semibold text-red-700 bg-red-50 border border-red-200 hover:bg-red-100 transition-colors"
        >
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar

