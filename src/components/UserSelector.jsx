// src/components/UserSelector.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserSelector = ({ onSelectUser, onClose }) => {
  const [users, setUsers] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [error, setError] = useState(null);

  // Fetch users and admins
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log("Fetching users and admins...");
        
        // Get users
        const usersResponse = await axios.get('/api/uusers');
        console.log("Users response:", usersResponse.data);
        
        // Get admins
        const adminsResponse = await axios.get('/api/superadmin/admins');
        console.log("Admins response:", adminsResponse.data);
        
        setUsers(usersResponse.data.data || []);
        setAdmins(adminsResponse.data.data || []);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        console.error('Error details:', error.response?.data);
        setError("Failed to load users. Please try again.");
        setLoading(false);
        
        // Fallback to test data if API fails
        setUsers([
          { id: 1, name: 'Test User 1', email: 'user1@example.com' },
          { id: 2, name: 'Test User 2', email: 'user2@example.com' }
        ]);
        
        setAdmins([
          { id: 101, name: 'Admin 1', email: 'admin1@example.com' },
          { id: 102, name: 'Admin 2', email: 'admin2@example.com' }
        ]);
      }
    };

    fetchUsers();
  }, []);

  // Handle user selection
  const handleSelectUser = (user, userType) => {
    console.log("User selected:", user, userType);
    onSelectUser(user.id, userType);
  };

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter admins based on search query
  const filteredAdmins = admins.filter(admin => 
    admin.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[80vh] flex flex-col">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold">New Conversation</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div className="p-4 border-b border-gray-200">
          <input
            type="text"
            placeholder="Search users..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === 'users' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Users
          </button>
          <button
            className={`flex-1 py-2 text-center font-medium ${
              activeTab === 'admins' 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('admins')}
          >
            Admins
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center p-8">
              <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          ) : error ? (
            <div className="p-8 text-center">
              <p className="text-red-500">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                Retry
              </button>
            </div>
          ) : activeTab === 'users' ? (
            filteredUsers.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No users found
              </div>
            ) : (
              <ul>
                {filteredUsers.map(user => (
                  <li 
                    key={user.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectUser(user, 'user')}
                  >
                    <div className="p-4 border-b border-gray-200 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                        {user.name?.charAt(0).toUpperCase() || '?'}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{user.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">{user.email || 'No email'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          ) : (
            filteredAdmins.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No admins found
              </div>
            ) : (
              <ul>
                {filteredAdmins.map(admin => (
                  <li 
                    key={admin.id}
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleSelectUser(admin, 'superadmin')}
                  >
                    <div className="p-4 border-b border-gray-200 flex items-center">
                      <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-800 font-bold">
                        {admin.name?.charAt(0).toUpperCase() || 'A'}
                      </div>
                      <div className="ml-3">
                        <h3 className="font-medium">{admin.name || 'Unknown'}</h3>
                        <p className="text-sm text-gray-500">{admin.email || 'No email'}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default UserSelector;