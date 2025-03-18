// src/components/Messenger.jsx
import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import UserSelector from './UserSelector';

const Messenger = () => {
  // State variables
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserSelector, setShowUserSelector] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Fetch conversations on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Fetch all conversations
  const fetchConversations = async () => {
    try {
      setLoading(true);
      console.log("Fetching conversations...");
      const response = await axios.get('/api/conversations');
      console.log("Conversations response:", response.data);
      setConversations(response.data.data || []);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  // Open a conversation
  const openConversation = async (userId, userType) => {
    try {
      setLoading(true);
      console.log("Opening conversation with user:", userId, userType);
      
      const response = await axios.post('/api/conversations', {
        user_id: userId,
        user_type: userType
      });
      
      console.log("Conversation opened:", response.data);
      
      if (response.data.status === 'success') {
        setActiveConversation(response.data.data.conversation);
        setMessages(response.data.data.messages || []);
        
        // Mark messages as read
        markMessagesAsRead(response.data.data.conversation.id);
      }
    } catch (error) {
      console.error('Error opening conversation:', error);
      console.error('Error details:', error.response?.data);
    } finally {
      setLoading(false);
      setShowUserSelector(false); // Hide the user selector after selecting
    }
  };

  // Send a message
  const sendMessage = async (e) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !activeConversation) {
      console.log("Cannot send: empty message or no active conversation");
      return;
    }
    
    try {
      console.log("Sending message:", newMessage);
      console.log("To conversation:", activeConversation.id);
      
      const formData = new FormData();
      formData.append('conversation_id', activeConversation.id);
      formData.append('message', newMessage);
      
      const response = await axios.post('/api/messages', formData);
      console.log("Message sent response:", response.data);
      
      if (response.data.status === 'success') {
        // Add message to the list
        setMessages(prevMessages => [...prevMessages, response.data.data]);
        
        // Reset form
        setNewMessage('');
        
        // Refetch conversations to update the list
        fetchConversations();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      console.error('Error details:', error.response?.data);
    }
  };

  // Mark messages as read
  const markMessagesAsRead = async (conversationId) => {
    try {
      const response = await axios.post('/api/messages/read', {
        conversation_id: conversationId
      });
      console.log("Messages marked as read:", response.data);
      
      // Refetch conversations to update unread counts
      fetchConversations();
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Filter conversations by search query
  const filteredConversations = conversations.filter(conv => 
    conv.other_user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.other_user?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left sidebar - Conversations list */}
      <div className="w-1/3 border-r border-gray-300 bg-white flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Messages</h2>
            <button
              onClick={() => {
                console.log("+ button clicked");
                setShowUserSelector(true);
              }}
              className="p-2 rounded-full hover:bg-gray-100 text-indigo-600"
              title="New Conversation"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
            </button>
          </div>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <svg
              className="absolute right-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading && conversations.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <svg
                className="animate-spin h-8 w-8 text-indigo-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="text-center p-4 text-gray-500">
              No conversations found
            </div>
          ) : (
            filteredConversations.map((conversation) => (
              <div
                key={conversation.id}
                className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                  activeConversation && activeConversation.id === conversation.id
                    ? 'bg-indigo-50'
                    : ''
                }`}
                onClick={() => {
                  console.log("Opening existing conversation:", conversation.id);
                  openConversation(
                    conversation.other_user.id,
                    conversation.other_user.role === 'superadmin' ? 'superadmin' : 'user'
                  );
                }}
              >
                <div className="flex items-center">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                      {conversation.other_user?.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    {conversation.unread_count > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-5 h-5 text-white text-xs flex items-center justify-center">
                        {conversation.unread_count}
                      </div>
                    )}
                  </div>
                  <div className="ml-4 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold">{conversation.other_user?.name}</h3>
                      <span className="text-xs text-gray-500">
                        {formatDate(conversation.last_message_at)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">
                      {conversation.lastMessage
                        ? conversation.lastMessage.message
                        : 'Start a conversation'}
                    </p>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right side - Active conversation */}
      <div className="w-2/3 flex flex-col">
        {activeConversation ? (
          <>
            {/* Conversation header */}
            <div className="p-4 border-b border-gray-300 bg-white flex items-center">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-bold">
                {activeConversation.other_user?.name?.charAt(0).toUpperCase() || '?'}
              </div>
              <div className="ml-3">
                <h3 className="font-semibold">{activeConversation.other_user?.name}</h3>
                <p className="text-xs text-gray-500">
                  {activeConversation.other_user?.email}
                </p>
              </div>
            </div>

            {/* Messages area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <svg className="w-16 h-16 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                  </svg>
                  <p>No messages yet</p>
                  <p className="text-sm">Send a message to start the conversation</p>
                </div>
              ) : (
                <>
                  {messages.map((msg, index) => {
                    const isCurrentUser = msg.sender_id.toString() === (activeConversation?.other_user?.id?.toString() || '') ? false : true;
                    const showDate = index === 0 || 
                      new Date(msg.created_at).toDateString() !== 
                      new Date(messages[index - 1].created_at).toDateString();
                    
                    return (
                      <div key={msg.id || index}>
                        {showDate && (
                          <div className="flex justify-center my-4">
                            <div className="bg-gray-200 rounded-full px-4 py-1 text-xs text-gray-600">
                              {formatDate(msg.created_at)}
                            </div>
                          </div>
                        )}
                        <div className={`flex mb-4 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-3/4 rounded-lg p-3 ${isCurrentUser ? 'bg-indigo-100' : 'bg-white border border-gray-200'}`}>
                            <p className="text-gray-800">{msg.message}</p>
                            <div className="flex justify-end mt-1">
                              <span className="text-xs text-gray-500">
                                {formatTime(msg.created_at)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef}></div>
                </>
              )}
            </div>

            {/* Message input */}
            <div className="bg-white border-t border-gray-300 p-4">
              <form onSubmit={sendMessage} className="flex items-end space-x-2">
                <div className="flex-1 relative">
                  <textarea
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full py-2 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                    rows="1"
                    style={{ minHeight: '44px', maxHeight: '120px' }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage(e);
                      }
                    }}
                  ></textarea>
                </div>
                <button
                  type="submit"
                  className="p-2 rounded-full bg-indigo-600 hover:bg-indigo-700 transition-colors text-white"
                  disabled={!newMessage.trim()}
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                  </svg>
                </button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <svg className="w-24 h-24 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
            </svg>
            <h3 className="text-xl font-semibold mb-2">Your Messages</h3>
            <p className="text-center max-w-md px-4">
              Select a conversation from the list or start a new one to begin messaging
            </p>
          </div>
        )}
      </div>
      
      {/* User Selector Modal */}
      {showUserSelector && (
        <UserSelector 
          onSelectUser={(userId, userType) => {
            console.log("User selected:", userId, userType);
            openConversation(userId, userType);
          }}
          onClose={() => {
            console.log("User selector closed");
            setShowUserSelector(false);
          }}
        />
      )}
    </div>
  );
};

export default Messenger;