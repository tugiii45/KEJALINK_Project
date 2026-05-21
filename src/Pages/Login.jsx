/**
 * Login Page
 * 
 * Allows users (tenants or landlords) to sign in with email/password.
 * 
 * On successful login:
 * 1. Fetches user profile from Firestore (includes role and house number)
 * 2. Updates Redux auth state (so app knows user is logged in)
 * 3. Redirects to appropriate dashboard (/tenant-dashboard or /landlord-dashboard)
 * 
 * Important: AppRouter checks Redux auth.isAuthenticated to protect routes
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { auth, db } from '../../firebase';


import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { loginSuccess } from '../Features/AuthSlice'
import { signInWithGoogle } from '../Utils/googleSignIn'




function Login({ onLoginSuccess, onToggleToSignUp }) {
  // Redux hook to update global auth state after successful login
  const dispatch = useDispatch();
  // Router hook for programmatic navigation to dashboards
  const navigate = useNavigate()
  
  // Local state for form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');       // Display error messages to user
  const [loading, setLoading] = useState(false); // Disable button while submitting

  // Handle form submission: authenticate with Firebase and load user profile
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // If firebase isn't wired yet (auth/db are null), avoid runtime crashes.
    if (!auth || !db) {
      setError('Authentication is not configured (missing Firebase auth/db).');
      setLoading(false);
      return;
    }

    try {
      // Step 1: Authenticate with Firebase Auth (email/password)
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Fetch user's profile document from Firestore
      // This contains role (Tenant/Landlord) and houseNumber
      const userDocRef = doc(db, 'users', user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Profile found! Extract user data
        const profile = userDocSnap.data();

        // IMPORTANT: AppRouter checks Redux auth.isAuthenticated to allow navigation.
        // Must update Redux store, otherwise protected routes redirect back to /login
        if (typeof onLoginSuccess === 'function') onLoginSuccess(profile);
        dispatch(loginSuccess(profile)); // This unlocks protected routes

        // Step 3: Route to appropriate dashboard based on user role
        const role = profile?.role?.toLowerCase();
        console.log('Login profile role:', profile?.role, 'normalized:', role);
        if (role === 'tenant') {
          // Tenant goes to rental/maintenance dashboard
          navigate('/tenant-dashboard', { replace: true });
        } else if (role === 'landlord') {
          // Landlord goes to property management dashboard
          navigate('/landlord-dashboard', { replace: true });
        } else {
          console.log('Unknown role; redirecting to /.');
          navigate('/', { replace: true });
        }
      } else {
        setError('No structural profile ledger exists for this account.');
      }
    } catch (err) {
      // Handle Firebase authentication errors
      console.error(err);
      const code = err?.code;

      // Provide helpful error messages based on Firebase error codes
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password') {
        // Wrong password error
        setError('Incorrect email or password.');
      } else if (code === 'auth/user-not-found') {
        // No user account with this email
        setError('No account found for this email. Please sign up first.');
      } else if (code === 'auth/network-request-failed') {
        // Internet connection issue
        setError('Network error. Please check your internet connection and try again.');
      } else if (code === 'auth/too-many-requests') {
        // Too many failed login attempts - Firebase security measure
        setError('Too many attempts. Please wait a bit and try again.');
      } else {
        // Other Firebase errors
        setError(err?.message ? err.message.replace('Firebase: ', '') : 'Login failed.');
      }
    } finally {
      // Re-enable submit button whether login succeeded or failed
      setLoading(false);
    }
  };

  // Render login form UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      {/* Login card container */}
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
        
        {/* Header with app logo */}
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-blue-600">KEJALINK</h2>
          <p className="text-sm text-gray-400 mt-1">Sign in to manage your caretaker profile</p>
        </div>

        {/* Login form with email/password fields */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email input field */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="yourname@domain.com"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Password input field */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          {/* Error message display */}
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-xs font-medium rounded-xl border border-red-100">
              ⚠️ {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-blue-100 disabled:bg-blue-400"
          >
            {loading ? 'Verifying Credentials...' : 'Secure Access'}
          </button>

          <div className="pt-1">
            <button
              type="button"
              onClick={async () => {
                try {
                  setError('');
                  setLoading(true);
                  const profile = await signInWithGoogle();
                  dispatch(loginSuccess(profile));

                  const role = (profile?.role || '').toLowerCase();
                  if (role === 'tenant') navigate('/tenant-dashboard', { replace: true });
                  else if (role === 'landlord') navigate('/landlord-dashboard', { replace: true });
                  else navigate('/', { replace: true });
                } catch (e) {
                  setError(e?.message || 'Google login failed');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
              className="w-full py-3 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              <span aria-hidden="true">G</span>
              {loading ? 'Signing in...' : 'Sign in with Google'}
            </button>
          </div>

        </form>

        {/* Clean, inline switcher footer */}
        <div className="text-center pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-500">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')} 
              type="button" 
              className="text-blue-600 font-bold hover:underline focus:outline-none"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;