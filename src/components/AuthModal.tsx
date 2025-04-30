'use client';

import { useState } from 'react';
import { ArrowRight, Mail, Lock, User, ChevronLeft, X, AlertTriangle, Check } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function AuthModal() {

  const { login, register, isAuthenticated, isLoading, error: authError } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginView, setIsLoginView] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { user } = useAuth()

  
  // Form states
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const openModal = () => {
    setIsOpen(true);
    resetForms();
  };

  const closeModal = () => {
    setIsOpen(false);
    resetForms();
  };

  const resetForms = () => {
    setLoginData({ email: '', password: '' });
    setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
    setError(null);
    setSuccess(null);
    setValidationErrors({});
  };

  const validateRegisterForm = () => {
    const errors: Record<string, string> = {};
    
    if (!registerData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!registerData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(registerData.email)) {
      errors.email = 'Invalid email format';
    }
    
    if (!registerData.password) {
      errors.password = 'Password is required';
    } else if (registerData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (registerData.password !== registerData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    try {
      await login(loginData.email, loginData.password);
      closeModal();
    } catch (err) {
      setError(authError || 'Login failed. Please try again.');
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateRegisterForm()) return;
    
    try {
      await register(registerData.name, registerData.email, registerData.password);
      setSuccess('Registration successful! You can now login.');
      setTimeout(() => {
        setIsLoginView(true);
        setRegisterData({ name: '', email: '', password: '', confirmPassword: '' });
      }, 2000);
    } catch (err) {
      setError(authError || 'Registration failed. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    if (isLoginView) {
      setLoginData(prev => ({ ...prev, [name]: value }));
    } else {
      setRegisterData(prev => ({ ...prev, [name]: value }));
      
      // Clear validation error when user types
      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  if (isAuthenticated) return null;

  return (
    <>
    {/* {JSON.stringify(user)} */}
      {!user ? <button 
        onClick={openModal}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
      >
        Sign In / Sign Up
      </button> :
      <button  onClick={() => router.push("/profile")} className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              <User size={20} />
            </button>}

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="p-6 relative">
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>

              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isLoginView ? 'Sign In' : 'Create Account'}
                </h2>
                <p className="text-gray-600 mt-1">
                  {isLoginView 
                    ? 'Sign in to access your account' 
                    : 'Join our community today'
                  }
                </p>
              </div>

              {error && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
                  <AlertTriangle size={18} />
                  <p className="text-sm">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-center gap-2">
                  <Check size={18} />
                  <p className="text-sm">{success}</p>
                </div>
              )}

              {isLoginView ? (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={loginData.email}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="password"
                        name="password"
                        value={loginData.password}
                        onChange={handleInputChange}
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Signing In...' : 'Sign In'}
                    </button>
                  </div>
                </form>
              ) : (
                <form onSubmit={handleRegisterSubmit} className="space-y-4">
                  <div className="space-y-1">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={registerData.name}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          validationErrors.name ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                    {validationErrors.name && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="register-email" className="block text-sm font-medium text-gray-700">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="email"
                        id="register-email"
                        name="email"
                        value={registerData.email}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          validationErrors.email ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    {validationErrors.email && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="register-password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="register-password"
                        name="password"
                        value={registerData.password}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          validationErrors.password ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="••••••••"
                        required
                        minLength={8}
                      />
                    </div>
                    {validationErrors.password && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Lock size={16} className="text-gray-400" />
                      </div>
                      <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={registerData.confirmPassword}
                        onChange={handleInputChange}
                        className={`block w-full pl-10 pr-3 py-2 border ${
                          validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
                        placeholder="••••••••"
                        required
                      />
                    </div>
                    {validationErrors.confirmPassword && (
                      <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
                    )}
                  </div>

                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    >
                      {isLoading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={() => setIsLoginView(!isLoginView)}
                  className="w-full flex items-center justify-center text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  {isLoginView ? (
                    <>
                      Don't have an account? Sign up
                      <ArrowRight size={16} className="ml-1" />
                    </>
                  ) : (
                    <>
                      <ChevronLeft size={16} className="mr-1" />
                      Already have an account? Sign in
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}