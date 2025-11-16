import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { isAuthenticated } from '../utils/auth';

const Register = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/dashboard', { replace: true });
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    username: '',
    fullname: '',
    email: '',
    address: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

    // Reset related errors
    setErrors({
      password: '',
      confirmPassword: '',
    });

    setError('');
    setSuccess('');
  };

  const validatePasswords = () => {
    const newErrors = {};

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validatePasswords()) {
      return;
    }

    setLoading(true);

    try {
      const sendData = { ...formData };
      delete sendData.confirmPassword;

      await registerUser(sendData);

      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={formContainerStyle}>
        <h2 style={titleStyle}>Register</h2>

        {error && <div style={errorStyle}>{error}</div>}
        {success && <div style={successStyle}>{success}</div>}

        <form onSubmit={handleSubmit} style={formStyle}>

          {/* Username */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Username:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Full Name */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Full Name:</label>
            <input
              type="text"
              name="fullname"
              value={formData.fullname}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Email */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email:</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Address */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Address:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Phone Number */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Phone Number:</label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          {/* Password */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password:</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {errors.password && (
              <p style={fieldErrorStyle}>{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Retype Password:</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              style={inputStyle}
            />
            {errors.confirmPassword && (
              <p style={fieldErrorStyle}>{errors.confirmPassword}</p>
            )}
          </div>

          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p style={linkStyle}>
          Already have an account?{' '}
          <a href="/login" style={linkAnchorStyle}>
            Login here
          </a>
        </p>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '100vh',
  backgroundColor: '#f5f5f5',
  padding: '2rem',
};

const formContainerStyle = {
  backgroundColor: 'white',
  padding: '2rem',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  width: '100%',
  maxWidth: '500px',
};

const titleStyle = {
  marginTop: 0,
  marginBottom: '1.5rem',
  textAlign: 'center',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const inputGroupStyle = {
  marginBottom: '1rem',
};

const labelStyle = {
  display: 'block',
  marginBottom: '0.5rem',
  fontWeight: '500',
};

const inputStyle = {
  width: '100%',
  padding: '0.75rem',
  border: '1px solid #ddd',
  borderRadius: '4px',
  fontSize: '1rem',
  boxSizing: 'border-box',
};

const fieldErrorStyle = {
  color: 'red',
  marginTop: '0.4rem',
  fontSize: '0.9rem',
};

const buttonStyle = {
  padding: '0.75rem',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  fontSize: '1rem',
  cursor: 'pointer',
  marginTop: '1rem',
};

const errorStyle = {
  backgroundColor: '#f8d7da',
  color: '#721c24',
  padding: '0.75rem',
  borderRadius: '4px',
  marginBottom: '1rem',
};

const successStyle = {
  backgroundColor: '#d4edda',
  color: '#155724',
  padding: '0.75rem',
  borderRadius: '4px',
  marginBottom: '1rem',
};

const linkStyle = {
  textAlign: 'center',
  marginTop: '1rem',
};

const linkAnchorStyle = {
  color: '#007bff',
  textDecoration: 'none',
};

export default Register;