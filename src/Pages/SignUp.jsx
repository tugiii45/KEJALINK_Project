/**
 * Sign Up / Registration Page
 * 
 * Allows new users (tenants or landlords) to create accounts.
 * 
 * On successful signup:
 * 1. Creates Firebase Auth user account (email/password)
 * 2. Saves user profile to Firestore with: uid, fullName, email, role, houseNumber
 * 3. Calls onSignUpSuccess callback (or redirects to login)
 * 
 * Note: Role determines which dashboard the user sees after login
 * - Tenant: /tenant-dashboard (see notices, submit maintenance, pay rent)
 * - Landlord: /landlord-dashboard (verify payments, manage tickets, post notices)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { auth, db } from '../../firebase';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

function SignUp({ onSignUpSuccess, onToggleToLogin }) {
  const navigate = useNavigate()
  // Prefer shim callbacks if provided; fall back to router navigation.
  const goToLogin = () => {
    if (typeof onToggleToLogin === 'function') return onToggleToLogin()
    navigate('/login')
  }
  
  // Form field state for sign up
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Tenant');              // User type: Tenant or Landlord
  const [houseNumber, setHouseNumber] = useState('');      // Only required for Tenants
  const [error, setError] = useState('');                  // Error message from Firebase
  const [loading, setLoading] = useState(false);           // Show loading spinner during signup

  // Handle form submission - create Firebase account and save profile
  const handleSignUp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Step 1: Create Firebase Auth account with email/password
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Step 2: Create user profile in Firestore with metadata
      const profileData = {
        uid: user.uid,
        fullName,
        email,
        role,
        // Store house number for Tenants, 'N/A' for Landlords
        houseNumber: role === 'Tenant' ? houseNumber.toUpperCase() : 'N/A',
        createdAt: new Date().toISOString()
      };

      // Save profile document to Firestore
      await setDoc(doc(db, 'users', user.uid), profileData);
      // Call success callback to redirect to dashboard
      onSignUpSuccess(profileData);
    } catch (err) {
      console.error(err);
      // Handle specific Firebase errors
      if (err.code === 'auth/email-already-in-use') {
        setError('This email address is already registered.');
      } else {
        setError(err.message.replace('Firebase: ', ''));
      }
    } finally {
      // Re-enable submit button whether signup succeeded or failed
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4" style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }}>
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-sm border border-gray-100 space-y-6" style={{ backgroundColor: 'var(--panel)', borderColor: 'var(--border)' }}>
        
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-blue-600">KEJALINK</h2>
          <p className="text-sm text-gray-400 mt-1">Create your account ledger profile</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              placeholder="e.g. Conrad"
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Account Role Type</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
            >
              <option value="Tenant">Tenant (Resident)</option>
              <option value="Landlord">Landlord (Property Owner)</option>
            </select>
          </div>

          {/* Only show house number field for Tenants (not Landlords) */}
          {role === 'Tenant' && (
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1">House / Unit Number</label>
              <input
                type="text"
                value={houseNumber}
                onChange={(e) => setHouseNumber(e.target.value)}
                required={role === 'Tenant'}
                placeholder="e.g. A4"
                className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all uppercase"
              />
            </div>
          )}

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
            {loading ? 'Creating Profile...' : 'Complete Registration'}
          </button>
        </form>

        {/* Clean, inline switcher footer */}
        <div className="text-center pt-2 border-t border-gray-50">
          <p className="text-xs text-gray-500">
            Already have an account?{' '}
            <button 
              onClick={goToLogin} 
              type="button" 
              className="text-blue-600 font-bold hover:underline focus:outline-none"
            >
              Sign in instead
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default SignUp;