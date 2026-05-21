import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { loginSuccess } from '../Features/AuthSlice'
import { signInWithGoogle } from '../Utils/googleSignIn'

function LandingPage() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      const profile = await signInWithGoogle()
      dispatch(loginSuccess(profile))

      const role = (profile?.role || '').toLowerCase()
      if (role === 'tenant') navigate('/tenant-dashboard', { replace: true })
      else if (role === 'landlord') navigate('/landlord-dashboard', { replace: true })
      else navigate('/', { replace: true })
    } catch (e) {
      alert(e?.message || 'Google login failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-12"
      style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}
    >
      <div className="max-w-6xl w-full">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-green-600/10 border border-green-200">
              <span className="inline-flex w-3.5 h-3.5 rounded-full bg-green-600" />
              <span className="text-sm font-bold text-green-600">KejaLink</span>
            </div>

            <h1 className="mt-5 text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              Community care, managed in one place.
            </h1>

            <p className="mt-4 text-slate-600 max-w-xl">
              KejaLink helps tenants and property owners stay on the same page—broadcast community notices,
              track maintenance requests, and keep payments organized.
            </p>

            <div className="mt-7 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="px-5 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-bold shadow-sm shadow-green-100"
              >
                Get started
              </button>
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="px-5 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold"
              >
                Create account
              </button>
            </div>

            <div className="mt-10 grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Notices</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">Broadcast & pin</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Maintenance</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">Track status</div>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Payments</div>
                <div className="mt-2 text-sm font-semibold text-slate-800">Verify & view</div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div
              className="absolute -inset-2 bg-gradient-to-r from-green-600/15 via-blue-600/10 to-emerald-400/15 rounded-[2rem] blur-xl"
              aria-hidden="true"
            />

            <div className="relative rounded-[2rem] bg-white border border-slate-200 shadow-sm p-7">
              <h2 className="text-lg font-bold text-slate-800">Welcome to KejaLink</h2>
              <p className="mt-2 text-sm text-slate-600">
                Sign in as a Tenant or Landlord to access your dashboard.
              </p>

              <div className="mt-6 space-y-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-sm font-bold text-slate-800">Tenant</div>
                  <div className="text-sm text-slate-600 mt-1">View notices, submit maintenance, and track progress.</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="text-sm font-bold text-slate-800">Landlord</div>
                  <div className="text-sm text-slate-600 mt-1">Manage tickets, post community notices, and verify payments.</div>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <span aria-hidden="true">G</span>
                  {loading ? 'Signing in...' : 'Continue with Google'}
                </button>

                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-colors"
                >
                  Continue to login
                </button>

                <p className="text-xs text-slate-500 mt-1">
                  No account yet?{' '}
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="text-blue-600 font-bold hover:underline"
                  >
                    Create one
                  </button>
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

