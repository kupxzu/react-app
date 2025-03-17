// src/components/user/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import UserLayout from './Layout';

const Dashboard = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        // Fetch the stored user from localStorage instead of making a request
        // since our backend doesn't provide a dedicated user profile endpoint
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(storedUser);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user info:', err);
        setError('Failed to load user information. Please try again.');
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const dashboardContent = (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Welcome, {user.name || 'User'}</h1>
        <p className="text-gray-600">Here's an overview of your account</p>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <p>{error}</p>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center text-blue-500 text-2xl font-bold mr-4">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-800">{user.name || 'N/A'}</h2>
                <p className="text-blue-600">{user.email || 'N/A'}</p>
                <span
                  className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full mt-1 ${
                    user.status
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}
                >
                  {user.status ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-medium text-gray-800 mb-3">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Phone Number</p>
                  <p className="text-gray-700 font-medium">{user.phone || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Member Since</p>
                  <p className="text-gray-700 font-medium">{formatDate(user.created_at)}</p>
                </div>
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="text-gray-700 font-medium">{user.address || 'No address provided'}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to="/user/profile" 
                className="block p-3 rounded-lg bg-blue-50 hover:bg-blue-100 transition duration-200 flex items-center"
              >
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-blue-800">Edit Profile</p>
                  <p className="text-sm text-blue-600">Update your personal information</p>
                </div>
              </Link>
              
              <div className="block p-3 rounded-lg bg-green-50 hover:bg-green-100 transition duration-200 flex items-center cursor-pointer">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-green-800">View Calendar</p>
                  <p className="text-sm text-green-600">Check your upcoming events</p>
                </div>
              </div>
              
              <div className="block p-3 rounded-lg bg-purple-50 hover:bg-purple-100 transition duration-200 flex items-center cursor-pointer">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-purple-800">Documents</p>
                  <p className="text-sm text-purple-600">Access your documents</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Recent Activity Card */}
          <div className="bg-white rounded-lg shadow-md p-6 md:col-span-3">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="border-t border-gray-200">
              <div className="py-3 flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Login</p>
                  <p className="text-sm text-gray-500">Last login: {new Date().toLocaleDateString()} {new Date().toLocaleTimeString()}</p>
                </div>
              </div>
              <div className="py-3 flex items-center border-t border-gray-200">
                <div className="bg-green-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Account Created</p>
                  <p className="text-sm text-gray-500">{formatDate(user.created_at)}</p>
                </div>
              </div>
              <div className="py-3 flex items-center border-t border-gray-200">
                <div className="bg-yellow-100 p-2 rounded-full mr-3">
                  <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-gray-800">Profile Updated</p>
                  <p className="text-sm text-gray-500">{formatDate(user.updated_at)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );

  return <UserLayout>{dashboardContent}</UserLayout>;
};

export default Dashboard;