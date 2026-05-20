/**
 * SignUp Router Wrapper (Shim)
 * 
 * This component bridges between React Router navigation and the SignUp component's
 * callback-based interface. It handles navigation without page refreshes.
 * 
 * Why? The SignUp component expects callbacks (onSignUpSuccess, onToggleToLogin),
 * but we use React Router for navigation. This shim converts between the two.
 */

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Thin wrapper so we can pass the original props expected by Signup.jsx
// while using router-based navigation.
import SignUp from '../Pages/Signup'

export default function SignUpShim() {
  const navigate = useNavigate()
  const [toggleKey, setToggleKey] = useState(0)

  // If Signup.jsx calls onSignUpSuccess, just return to login.
  const onSignUpSuccess = () => {
    navigate('/login', { replace: true })
  }

  const onToggleToLogin = () => {
    setToggleKey((k) => k + 1)
    navigate('/login', { replace: true })
  }

  // Reset component if user clicks toggle multiple times.
  useEffect(() => {}, [toggleKey])

  return (
    <SignUp
      key={toggleKey}
      onSignUpSuccess={onSignUpSuccess}
      onToggleToLogin={onToggleToLogin}
    />
  )
}

