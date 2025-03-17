// src/components/superadmin/Layout.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const SuperAdminLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/api/superadmin/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, clear local storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      delete axios.defaults.headers.common['Authorization'];
      navigate('/login');
    }
  };

  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`bg-gray-800 text-white w-64 space-y-6 py-7 px-2 absolute inset-y-0 left-0 transform ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } md:relative md:translate-x-0 transition duration-200 ease-in-out`}
      >
        <div className="flex items-center space-x-2 px-4">
          <span className="text-2xl font-extrabold">Admin Panel</span>
        </div>

        <nav>
          <Link
            to="/superadmin/dashboard"
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
              location.pathname === '/superadmin/dashboard' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7m-9 2v8m0 0H5a2 2 0 01-2-2v-5a2 2 0 012-2h3m10 0h3a2 2 0 012 2v5a2 2 0 01-2 2h-3m0 0v-8"
              />
            </svg>
            Dashboard
          </Link>
          <Link
            to="/superadmin/users"
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
              location.pathname === '/superadmin/users' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87M17 11a4 4 0 11-8 0 4 4 0 018 0z"
              />
            </svg>
            Manage Users
          </Link>
          <Link
            to="/superadmin/admins"
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
              location.pathname === '/superadmin/admins' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {/* Using a shield-like icon */}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"
              />
            </svg>
            Manage Admins
          </Link>
          <Link
            to="/superadmin/profile"
            className={`block py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white ${
              location.pathname === '/superadmin/profile' ? 'bg-gray-700' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5.121 17.804A9 9 0 1118.363 6.182M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            My Profile
          </Link>
          <button
            onClick={handleLogout}
            className="block w-full text-left py-2.5 px-4 rounded transition duration-200 hover:bg-gray-700 hover:text-white"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 inline mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H7a2 2 0 01-2-2V7a2 2 0 012-2h4a2 2 0 012 2v1"
              />
            </svg>
            Logout
          </button>
        </nav>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-md h-16 flex items-center justify-between px-6">
          <button onClick={toggleSidebar} className="md:hidden text-gray-500 focus:outline-none">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="flex items-center">
            <span className="text-gray-700 mr-2">{user.name}</span>
            <div className="h-8 w-8 rounded-full bg-gray-400 flex items-center justify-center text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SuperAdminLayout;
