import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, isAdmin } from './utils/auth';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import BookReader from './components/BookReader';
import BookManagement from './components/BookManagement';

// Protected Route component
const ProtectedRoute = ({ children, requireAdmin = false }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }
  
  if (requireAdmin && !isAdmin()) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

// Dashboard component that shows different views based on role
const Dashboard = () => {
  const admin = isAdmin();
  
  return (
    <div>
      <Navbar />
      {admin ? <BookManagement /> : <BookReader />}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/"
          element={
            isAuthenticated() ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

