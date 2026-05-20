/**
 * Authentication Gateway Component
 * 
 * Toggle between Login and SignUp forms.
 * Displays appropriate form based on isNewUser state.
 * 
 * This component is NO LONGER USED in the main app routing,
 * but kept for reference. The app now uses AppRouter with separate /login and /signup routes.
 * 
 * Props:
 * - onUserAuthenticated: Callback when user successfully logs in or signs up
 */

import React, { useState } from 'react'
import Login from '../Pages/Login'
import SignUp from '../Pages/Signup'

function AuthGateway({ onUserAuthenticated }) {
  const [isNewUser, setIsNewUser] = useState(false)

  return (
    <div>
      {isNewUser ? (
        <SignUp onSignUpSuccess={onUserAuthenticated} onToggleToLogin={() => setIsNewUser(false)} />
      ) : (
        <Login onLoginSuccess={onUserAuthenticated} onToggleToSignUp={() => setIsNewUser(true)} />
      )}
    </div>
  )
}

export default AuthGateway

