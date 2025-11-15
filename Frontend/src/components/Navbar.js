import React from 'react';
import { useNavigate } from 'react-router-dom';
import { removeToken, getUserRole, getUsername } from '../utils/auth';

const Navbar = () => {
  const navigate = useNavigate();
  const role = getUserRole();
  const username = getUsername();

  const handleLogout = () => {
    removeToken();
    navigate('/login');
  };

  return (
    <nav style={navbarStyle}>
      <div style={navContentStyle}>
        <h2 style={titleStyle}>Library Management System</h2>
        <div style={userInfoStyle}>
          {username && <span style={usernameStyle}>{username}</span>}
          <span style={roleStyle}>Role: {role.toUpperCase()}</span>
          <button onClick={handleLogout} style={logoutButtonStyle}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

const navbarStyle = {
  backgroundColor: '#333',
  color: 'white',
  padding: '1rem',
  marginBottom: '2rem',
};

const navContentStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '1200px',
  margin: '0 auto',
};

const titleStyle = {
  margin: 0,
  fontSize: '1.5rem',
};

const userInfoStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
};

const usernameStyle = {
  fontSize: '0.9rem',
};

const roleStyle = {
  fontSize: '0.9rem',
  padding: '0.25rem 0.5rem',
  backgroundColor: '#555',
  borderRadius: '4px',
};

const logoutButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
  fontSize: '0.9rem',
};

export default Navbar;

