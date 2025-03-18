// src/components/ForgotPassword.jsx
import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('user'); // Default to regular user
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState(1); // 1: Email input, 2: Verification code
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);
  const inputRefs = useRef([]);

  // Handle sending verification code
  const handleSendCode = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/forgot-password', {
        email,
        user_type: userType
      });

      setMessage({
        type: 'success',
        text: 'Verification code sent! Please check your email.'
      });
      setStep(2); // Move to verification code step
    } catch (error) {
      console.error('Forgot password error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to send verification code. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle verification code input change
  const handleCodeChange = (index, value) => {
    if (value.length > 1) {
      value = value.charAt(0);
    }
    
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  // Handle key down for backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  // Handle paste event for verification code
  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim();
    
    // Only process if it looks like a 6-digit code
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split('');
      setVerificationCode(digits);
      
      // Focus the last input
      inputRefs.current[5].focus();
    }
  };

  // Handle verification code submission
  const handleVerifyCode = async (e) => {
    e.preventDefault();
    const code = verificationCode.join('');
    
    // Validate complete code
    if (code.length !== 6) {
      setMessage({
        type: 'error',
        text: 'Please enter the complete 6-digit verification code.'
      });
      return;
    }

    setIsVerifying(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/verify-code-and-reset', {
        email,
        verification_code: code
      });

      // Set the new password from response
      setNewPassword(response.data.data.new_password);
      
      setMessage({
        type: 'success',
        text: 'Password reset successful! Your new password is:'
      });
      setStep(3); // Move to success step
    } catch (error) {
      console.error('Verification error:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to verify code. Please try again.'
      });
    } finally {
      setIsVerifying(false);
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Left side - Branding */}
      <div className="hidden md:flex md:w-1/2 bg-indigo-600 justify-center items-center p-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-6">
            {step === 1 && "Forgot Password?"}
            {step === 2 && "Verify Your Identity"}
            {step === 3 && "Password Reset Complete"}
          </h1>
          <p className="text-indigo-100 text-lg mb-8">
            {step === 1 && "Don't worry! It happens to the best of us. We'll help you reset your password."}
            {step === 2 && "Please enter the verification code we sent to your email."}
            {step === 3 && "Your password has been reset successfully!"}
          </p>
          <div className="w-48 h-48 mx-auto bg-indigo-500 rounded-full flex items-center justify-center">
            {/* Icon changes based on step */}
            {step === 1 && (
              <svg className="w-32 h-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            )}
            {step === 2 && (
              <svg className="w-32 h-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            )}
            {step === 3 && (
              <svg className="w-32 h-32 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {step === 1 && "Reset Your Password"}
              {step === 2 && "Enter Verification Code"}
              {step === 3 && "Password Reset Successful"}
            </h2>
            <p className="text-gray-600">
              {step === 1 && "Enter your email address and we'll send you a verification code"}
              {step === 2 && "Check your email for the 6-digit verification code"}
              {step === 3 && "Your password has been reset successfully"}
            </p>
          </div>

          {message.text && step !== 3 && (
            <div className={`p-4 mb-6 rounded ${message.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' : 'bg-red-50 border-l-4 border-red-500 text-red-700'}`}>
              {message.text}
            </div>
          )}

          {/* Step 1: Email Form */}
          {step === 1 && (
            <form onSubmit={handleSendCode} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 block w-full rounded-lg border-gray-300 bg-gray-50 py-3 text-gray-900 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                    placeholder="you@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Account Type
                </label>
                <div className="flex space-x-4">
                  <div className="flex items-center">
                    <input
                      id="user-type-user"
                      name="user-type"
                      type="radio"
                      checked={userType === 'user'}
                      onChange={() => setUserType('user')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="user-type-user" className="ml-2 block text-sm text-gray-700">
                      Regular User
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="user-type-admin"
                      name="user-type"
                      type="radio"
                      checked={userType === 'superadmin'}
                      onChange={() => setUserType('superadmin')}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                    />
                    <label htmlFor="user-type-admin" className="ml-2 block text-sm text-gray-700">
                      Admin
                    </label>
                  </div>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 2: Verification Code Form */}
          {step === 2 && (
            <form onSubmit={handleVerifyCode} className="space-y-6">
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Verification Code
                </label>
                <p className="text-sm text-gray-500 mb-4">
                  Enter the 6-digit code we sent to {email}
                </p>
                <div className="flex justify-between space-x-2" onPaste={handlePaste}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <input
                      key={index}
                      ref={(el) => (inputRefs.current[index] = el)}
                      type="text"
                      maxLength="1"
                      value={verificationCode[index]}
                      onChange={(e) => handleCodeChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm"
                      required
                    />
                  ))}
                </div>
                <div className="mt-4 text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setVerificationCode(['', '', '', '', '', '']);
                      setMessage({ type: '', text: '' });
                    }}
                    className="text-sm text-indigo-600 hover:text-indigo-500"
                  >
                    Didn't receive the code? Send again
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  {isVerifying ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Verifying...
                    </>
                  ) : (
                    'Verify & Reset Password'
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Step 3: Success Screen */}
          {step === 3 && (
            <div className="space-y-6 text-center">
              <div className="bg-green-50 rounded-lg p-6 mb-4">
                <svg className="mx-auto h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="mt-3 text-lg font-medium text-green-800">Password Reset Successful</h3>
                <p className="mt-2 text-sm text-green-600">Your password has been reset successfully</p>
              </div>
              
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h4 className="font-medium text-gray-700 mb-2">Your New Password</h4>
                <div className="bg-white p-3 rounded border border-dashed border-gray-300 font-mono text-lg text-indigo-600">
                  {newPassword}
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Please save this password in a secure location. You may want to change it after logging in.
                </p>
              </div>
              
              <div>
                <button
                  type="button"
                  onClick={handleLoginRedirect}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                >
                  Go to Login
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Remember your password?{' '}
              <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
                Back to Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;