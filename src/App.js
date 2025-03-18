// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import NotFound from './components/NotFound';
import ForgotPassword from './components/ForgotPassword';
import Messenger from './components/Messenger';

// SuperAdmin components
import SuperAdminDashboard from './components/superadmin/Dashboard';
import SuperAdminProfile from './components/superadmin/Profile';
import SuperAdminUsersList from './components/superadmin/UsersList';
import SuperAdminsList from './components/superadmin/AdminsList';

// User components
import UserDashboard from './components/user/Dashboard';
import UserProfile from './components/user/Profile';

import axios from 'axios';

// Set base URL for API requests
axios.defaults.baseURL = 'http://localhost:8000'; // Adjust based on your API URL
axios.defaults.headers.common['Accept'] = 'application/json';

// Set token from localStorage if it exists
const token = localStorage.getItem('token');
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        
        {/* SuperAdmin routes */}
        <Route path="/superadmin" element={<ProtectedRoute allowedRole="superadmin" />}>
          <Route path="dashboard" element={<SuperAdminDashboard />} />
          <Route path="users" element={<SuperAdminUsersList />} />
          <Route path="profile" element={<SuperAdminProfile />} />
          <Route path="admins" element={<SuperAdminsList />} />
          <Route path="messages" element={<Messenger />} />
        </Route>
        
        {/* User routes */}
        <Route path="/user" element={<ProtectedRoute allowedRole="user" />}>
          <Route path="dashboard" element={<UserDashboard />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="messages" element={<Messenger />} />
        </Route>
        
        {/* 404 Not Found */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;