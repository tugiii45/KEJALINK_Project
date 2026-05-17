
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';


function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // 1. Grab the current user role from your Redux Auth state
  // Adjust 'auth' and 'user' to match your exact slice initial state structure
  const { user } = useSelector((state) => state.auth); 
  const role = user?.role || 'tenant'; // Fallback to tenant for testing

  const handleLogout = () => {
    // dispatch(logout());
    navigate('/login');
  };

  return (
    <aside>
      <h2>KejaLink</h2>
      <p>Role: {role}</p>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {role === 'tenant' ? (
          <>
            <NavLink to="/tenant-dashboard">Dashboard</NavLink>
            <NavLink to="/report-issue">Report Issue</NavLink>
          </>
        ) : (
          <>
            <NavLink to="/landlord-dashboard">Overview</NavLink>
            <NavLink to="/ticket-queue">Ticket Queue</NavLink>
          </>
        )}
      </nav>

      <hr />
      <button onClick={handleLogout}>Logout</button>
    </aside>
  );
}

export default Sidebar;