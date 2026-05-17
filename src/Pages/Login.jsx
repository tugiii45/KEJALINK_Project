import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { loginSuccess } from '../Features/AuthSlice'



function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // Component states
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('tenant')

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!email || !password) {
      alert('Please fill in all fields')
      return
    }

    // Simulating an API response structure
    const dummyUser = {
      email,
      role,
      name: role === 'tenant' ? 'Jane Tenant' : 'John Landlord',
    }

    const dummyToken = 'mock-jwt-token-kejalink'

    // Dispatching to the Redux store
    dispatch(loginSuccess(dummyUser))

    // Redirect user dynamically based on selected role
    if (role === 'Landlord' || role === 'landlord') {
      navigate('/landlord')
    } else {
      navigate('/tenant')
    }
  }


  return (
    <>
      <div className='login-container'>
        <div className='login-card'>
          <h1 className='brand-logo'>KEJALINK</h1>
          <p className='brand-tagline'>Seamless Property & Tenant Management</p>

          {/* Role Selector (Dropdown) */}
          <div className='role-selector'>
            <label htmlFor="role" style={{ display: 'block', marginBottom: 6 }}>
              Select role
            </label>
            <select
              id="role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              style={{ padding: 10, width: '100%' }}
            >
              <option value="tenant">Tenant</option>
              <option value="landlord">Landlord</option>
            </select>
          </div>
        </div>
      </div>

      {/* Form handling login */}
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Sign In as {role.charAt(0).toUpperCase() + role.slice(1)}
        </button>
      </form>
    </>
  )
}

export default Login




    

  


