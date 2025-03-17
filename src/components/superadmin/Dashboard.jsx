// src/components/superadmin/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import SuperAdminLayout from './Layout';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    totalAdmins: 0,
    activeAdmins: 0,
    inactiveAdmins: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [usersResponse, adminsResponse] = await Promise.all([
          axios.get('/api/uusers'),
          axios.get('/api/superadmin/admins')
        ]);
        const users = usersResponse.data.data || [];
        const admins = adminsResponse.data.data || [];
  
        // Calculate stats
        const activeUsers = users.filter(user => user.status);
        const inactiveUsers = users.filter(user => !user.status);
        const activeAdmins = admins.filter(admin => admin.status);
        const inactiveAdmins = admins.filter(admin => !admin.status);
  
        setStats({
          totalUsers: users.length,
          activeUsers: activeUsers.length,
          inactiveUsers: inactiveUsers.length,
          totalAdmins: admins.length,
          activeAdmins: activeAdmins.length,
          inactiveAdmins: inactiveAdmins.length
        });
  
        // Sort and set recent users
        const sortedUsers = [...users].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setRecentUsers(sortedUsers.slice(0, 5));
  
        setLoading(false);
      } catch (err) {
        console.error('Error fetching stats:', err);
        setError('Failed to fetch dashboard data. Please try again.');
        setLoading(false);
      }
    };
  
    fetchStats();
  }, []);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getPercentage = (part, total) => {
    if (total === 0) return 0;
    return Math.round((part / total) * 100);
  };

  const dashboardContent = (
    <>
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-600">Welcome to your super admin dashboard</p>
      </div>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded shadow" role="alert">
          <div className="flex">
            <div className="py-1">
              <svg className="w-6 h-6 mr-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
              </svg>
            </div>
            <div>
              <p className="font-bold">Error</p>
              <p>{error}</p>
            </div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Users stats card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-blue-500 to-blue-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Total Users</h3>
                    <p className="text-4xl font-bold text-white mt-1">{stats.totalUsers}</p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-3 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <p className="text-sm text-gray-500 mb-2">User activity rate</p>
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-4">
                    <div className="bg-green-500 h-4 rounded-full" style={{ width: `${getPercentage(stats.activeUsers, stats.totalUsers)}%` }}></div>
                  </div>
                  <span className="ml-2 text-sm font-medium text-gray-700">{getPercentage(stats.activeUsers, stats.totalUsers)}%</span>
                </div>
                <Link to="/superadmin/users" className="mt-4 inline-block text-sm text-blue-500 hover:underline">
                  View all users →
                </Link>
              </div>
            </div>

            {/* Admin stats card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-purple-500 to-purple-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Administrators</h3>
                    <p className="text-4xl font-bold text-white mt-1">{stats.totalAdmins}</p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-3 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Active</span>
                  <span className="text-sm font-medium text-gray-700">
                    {stats.activeAdmins} ({getPercentage(stats.activeAdmins, stats.totalAdmins)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                  <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${getPercentage(stats.activeAdmins, stats.totalAdmins)}%` }}></div>
                </div>
                <Link to="/superadmin/admins" className="mt-2 inline-block text-sm text-blue-500 hover:underline">
                  Manage administrators →
                </Link>
              </div>
            </div>

            {/* Quick actions card */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-5 bg-gradient-to-r from-yellow-500 to-yellow-600">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-white">Quick Actions</h3>
                    <p className="text-sm text-white mt-1">Common management tasks</p>
                  </div>
                  <div className="bg-white bg-opacity-30 p-3 rounded-full">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-4 bg-white">
                <div className="space-y-2">
                  <Link
                    to="/superadmin/users"
                    className="block p-2 bg-blue-50 hover:bg-blue-100 rounded-md flex items-center text-blue-700 transition-colors duration-150"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      ></path>
                    </svg>
                    Manage Users
                  </Link>
                  <Link
                    to="/superadmin/admins"
                    className="block p-2 bg-purple-50 hover:bg-purple-100 rounded-md flex items-center text-purple-700 transition-colors duration-150"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      ></path>
                    </svg>
                    Manage Admins
                  </Link>
                  <Link
                    to="/superadmin/profile"
                    className="block p-2 bg-green-50 hover:bg-green-100 rounded-md flex items-center text-green-700 transition-colors duration-150"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                      ></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    My Profile
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">Recent Users</h3>
            </div>
            <div className="p-5">
              {recentUsers.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {recentUsers.map((user) => (
                        <tr key={user.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}
                            >
                              {user.status ? 'Active' : 'Inactive'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <Link to={`/superadmin/users?user=${user.id}`} className="text-indigo-600 hover:text-indigo-900 mr-3">
                              View
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500">No users found</p>
              )}
              <div className="mt-4 text-right">
                <Link to="/superadmin/users" className="text-blue-500 hover:text-blue-700 font-medium text-sm">
                  View all users →
                </Link>
              </div>
            </div>
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-5 border-b border-gray-200">
              <h3 className="text-xl font-semibold text-gray-800">System Overview</h3>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-indigo-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Total Accounts</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.totalUsers + stats.totalAdmins}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-green-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">Active Accounts</p>
                      <p className="text-2xl font-bold text-gray-800">{stats.activeUsers + stats.activeAdmins}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center">
                    <div className="bg-yellow-100 p-3 rounded-full mr-4">
                      <svg className="w-6 h-6 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <div>
                      <p className="text-gray-500 text-sm">System Status</p>
                      <p className="text-green-500 font-semibold">All Systems Operational</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );

  return <SuperAdminLayout>{dashboardContent}</SuperAdminLayout>;
};

export default Dashboard;
