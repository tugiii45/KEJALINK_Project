import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'

import { loginSuccess } from '../Features/AuthSlice'

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('tenant')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email.trim() || !password) {
      alert('Please fill in all fields')
      return
    }

    const dummyUser = {
      email: email.trim(),
      role,
      name: role === 'tenant' ? 'Jane Tenant' : 'John Landlord',
    }

    dispatch(loginSuccess(dummyUser))

    if (role === 'landlord') navigate('/landlord-dashboard')
    else navigate('/tenant-dashboard')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-6">
        <div className="hidden md:flex flex-col justify-between rounded-2xl bg-gradient-to-br from-green-600 to-emerald-500 p-8 text-white overflow-hidden">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight">KEJALINK</h1>
            <p className="mt-3 text-white/90">
              Seamless Property & Tenant Management
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-white/90">
              Fast access for tenants and landlords
            </div>
            <ul className="mt-4 space-y-2 text-white/90 text-sm">
              <li>• Submit maintenance requests</li>
              <li>• Track ticket status</li>
              <li>• Broadcast community notices</li>
            </ul>
          </div>
        </div>

        <div className="rounded-2xl bg-white border border-slate-200 shadow-sm p-7">
          <h2 className="text-xl font-bold text-slate-900">Sign in</h2>
          <p className="text-sm text-slate-600 mt-1">
            Choose your role and continue.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div className="form-group">
              <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                Select role
              </label>
              <select
                id="role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="tenant">Tenant</option>
                <option value="landlord">Landlord</option>
              </select>
            </div>

            <div className="form-group">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-slate-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div className="form-group">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full rounded-lg border border-slate-300 p-2.5 focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <button
              type="submit"
              className="w-full rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 transition-colors"
            >
              Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
            </button>
          </form>

          <div className="mt-5 text-xs text-slate-500">
            Demo login (uses mock data). No real authentication is performed.
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login

