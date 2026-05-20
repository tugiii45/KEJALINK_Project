
import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

function Sidebar() {
  const navigate = useNavigate()

  const { user } = useSelector((state) => state.auth)
  const role = user?.role || 'tenant'

  const handleLogout = () => {
    navigate('/login')
  }

  return (
    <aside
      className="h-full w-64 bg-white border-r border-slate-200 px-4 py-6 flex flex-col"
      style={{ boxShadow: '0 1px 2px rgba(15, 23, 42, 0.06)' }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">KejaLink</h2>
        <p className="text-sm text-slate-600 mt-1">Role: {role}</p>
      </div>

      <nav className="flex flex-col gap-2">
        {role === 'tenant' ? (
          <>
            <NavLink
              to="/tenant-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/payment-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Payments
            </NavLink>

            <NavLink
              to="/report-issue"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
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
            <NavLink
              to="/landlord-dashboard"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Overview
            </NavLink>
            <NavLink
              to="/ticket-queue"
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  isActive
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-white border-transparent text-slate-700 hover:bg-slate-50 hover:border-slate-200'
                }`
              }
            >
              Ticket Queue
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

