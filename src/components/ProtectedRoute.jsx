// src/components/ProtectedRoute.jsx
import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRole }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  
  useEffect(() => {
    // Check if user is authenticated and has correct role
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');
    
    if (token && userRole === allowedRole) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [allowedRole]);
  
  // Show loading state while checking authentication
  if (isAuthenticated === null) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }
  
  // If authenticated and has proper role, render the child routes
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;