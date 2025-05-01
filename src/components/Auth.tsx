// 'use client'
// import { useState } from 'react';
// import { ArrowRight, Book, Mail, Lock, User, Headphones, ChevronLeft, AlertTriangle, X } from 'lucide-react';
// import { API_BASE_URL } from '@/app/auth.tsx/page';

// // API service for authentication
// // const API_BASE_URL = 'http://localhost:8081/api';

// const authService = {
//   login: async (email, password) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/login`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ email, password })
//       });
      
//       if (!response?.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Login failed');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Login error:', error);
//       throw error;
//     }
//   },
  
//   signup: async (userData) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(userData)
//       });
      
//       if (!response?.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.message || 'Signup failed');
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error('Signup error:', error);
//       throw error;
//     }
//   }
// };

// export default function AuthModal({isModalOpen,setIsModalOpen,openModal,closeModal}) {
  
//   const [isLogin, setIsLogin] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [success, setSuccess] = useState(null);
  
//   // Login form state
//   const [loginData, setLoginData] = useState({
//     email: '',
//     password: '',
//     rememberMe: false
//   });
  
//   // Signup form state
//   const [signupData, setSignupData] = useState({
//     name: '',
//     email: '',
//     password: '',
//     confirmPassword: '',
//     agreeToTerms: false
//   });
  
//   // Form validation states
//   const [validationErrors, setValidationErrors] = useState({});
  
  
  
//   const resetForms = () => {
//     setLoginData({
//       email: '',
//       password: '',
//       rememberMe: false
//     });
//     setSignupData({
//       name: '',
//       email: '',
//       password: '',
//       confirmPassword: '',
//       agreeToTerms: false
//     });
//     setError(null);
//     setSuccess(null);
//     setValidationErrors({});
//     setIsLogin(true);
//   };
  
//   const handleLoginChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setLoginData({
//       ...loginData,
//       [name]: type === 'checkbox' ? checked : value
//     });
//     setError(null);
//   };
  
//   const handleSignupChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setSignupData({
//       ...signupData,
//       [name]: type === 'checkbox' ? checked : value
//     });
    
//     if (validationErrors[name]) {
//       setValidationErrors({
//         ...validationErrors,
//         [name]: null
//       });
//     }
//     setError(null);
//   };
  
//   const validateSignupForm = () => {
//     const errors = {};
    
//     if (!signupData.name.trim()) {
//       errors.name = 'Full name is required';
//     }
    
//     if (!signupData.email.trim()) {
//       errors.email = 'Email is required';
//     } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
//       errors.email = 'Email is invalid';
//     }
    
//     if (!signupData.password) {
//       errors.password = 'Password is required';
//     } else if (signupData.password.length < 8) {
//       errors.password = 'Password must be at least 8 characters';
//     }
    
//     if (signupData.password !== signupData.confirmPassword) {
//       errors.confirmPassword = 'Passwords do not match';
//     }
    
//     if (!signupData.agreeToTerms) {
//       errors.agreeToTerms = 'You must agree to terms and conditions';
//     }
    
//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };
  
//   const handleLoginSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
//     setIsLoading(true);
    
//     try {
//       if (!loginData.email || !loginData.password) {
//         throw new Error('Please enter both email and password');
//       }
      
//       const result = await authService.login(loginData.email, loginData.password);
//       setIsLoading(false);
//       setSuccess('Login successful! Redirecting...');
      
//       if (result.token) {
//         localStorage.setItem('authToken', result.token);
//         setTimeout(() => {
//           window.location.href = '/dashboard';
//         }, 1500);
//       }
//     } catch (err) {
//       setIsLoading(false);
//       setError(err.message || 'Login failed. Please try again.');
//     }
//   };
  
//   const handleSignupSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);
    
//     if (!validateSignupForm()) {
//       return;
//     }
    
//     setIsLoading(true);
    
//     try {
//       const userData = {
//         name: signupData.name,
//         email: signupData.email,
//         password: signupData.password
//       };
      
//       await authService.signup(userData);
//       setIsLoading(false);
//       setSuccess('Account created successfully! You can now log in.');
      
//       setTimeout(() => {
//         setIsLogin(true);
//         setSignupData({
//           name: '',
//           email: '',
//           password: '',
//           confirmPassword: '',
//           agreeToTerms: false
//         });
//       }, 2000);
//     } catch (err) {
//       setIsLoading(false);
//       setError(err.message || 'Signup failed. Please try again.');
//     }
//   };
  
//   const toggleAuthMode = () => {
//     setIsLogin(!isLogin);
//     setError(null);
//     setSuccess(null);
//     setValidationErrors({});
//   };
  
//   return (
//     <>
//       {/* Trigger Button */}
//       {/* <button
//         onClick={openModal}
//         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
//       >
//         Sign In / Sign Up
//       </button> */}
      
//       {/* Modal Overlay */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//           <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto relative">
//             {/* Close Button */}
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
//             >
//               <X size={24} />
//             </button>
            
//             {/* Modal Content */}
//             <div className="p-6">
//               <div className="sm:mx-auto sm:w-full mb-6">
//                 <div className="flex justify-center">
//                   <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center">
//                     <Headphones className="text-white" size={24} />
//                   </div>
//                 </div>
//                 <h2 className="mt-3 text-center text-2xl font-bold text-gray-900">Audiobook Library</h2>
//                 <p className="mt-1 text-center text-gray-500">
//                   {isLogin ? 'Sign in to your account' : 'Create a new account'}
//                 </p>
//               </div>

//               {error && (
//                 <div className="mb-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-md flex items-center gap-2">
//                   <AlertTriangle size={18} />
//                   <p className="text-sm">{error}</p>
//                 </div>
//               )}
              
//               {success && (
//                 <div className="mb-4 bg-green-50 border border-green-200 text-green-700 p-3 rounded-md">
//                   <p className="text-sm">{success}</p>
//                 </div>
//               )}
              
//               {isLogin ? (
//                 <form className="space-y-6" onSubmit={handleLoginSubmit}>
//                   {/* Login Form Fields (same as before) */}
//                   <div>
//                     <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                       Email address
//                     </label>
//                     <div className="mt-1 relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Mail size={16} className="text-gray-400" />
//                       </div>
//                       <input
//                         id="email"
//                         name="email"
//                         type="email"
//                         autoComplete="email"
//                         required
//                         value={loginData.email}
//                         onChange={handleLoginChange}
//                         className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="you@example.com"
//                       />
//                     </div>
//                   </div>

//                   <div>
//                     <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//                       Password
//                     </label>
//                     <div className="mt-1 relative">
//                       <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                         <Lock size={16} className="text-gray-400" />
//                       </div>
//                       <input
//                         id="password"
//                         name="password"
//                         type="password"
//                         autoComplete="current-password"
//                         required
//                         value={loginData.password}
//                         onChange={handleLoginChange}
//                         className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                         placeholder="••••••••"
//                       />
//                     </div>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div className="flex items-center">
//                       <input
//                         id="remember-me"
//                         name="rememberMe"
//                         type="checkbox"
//                         checked={loginData.rememberMe}
//                         onChange={handleLoginChange}
//                         className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
//                       />
//                       <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
//                         Remember me
//                       </label>
//                     </div>

//                     <div className="text-sm">
//                       <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
//                         Forgot your password?
//                       </a>
//                     </div>
//                   </div>

//                   <div>
//                     <button
//                       type="submit"
//                       disabled={isLoading}
//                       className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                     >
//                       {isLoading ? 'Signing in...' : 'Sign in'}
//                     </button>
//                   </div>
//                 </form>
//               ) : (
//                 <form className="space-y-6" onSubmit={handleSignupSubmit}>
//                 <div>
//                   <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                     Full name
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <User size={16} className="text-gray-400" />
//                     </div>
//                     <input
//                       id="name"
//                       name="name"
//                       type="text"
//                       autoComplete="name"
//                       required
//                       value={signupData.name}
//                       onChange={handleSignupChange}
//                       className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
//                         validationErrors.name ? 'border-red-300' : 'border-gray-300'
//                       } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
//                       placeholder="John Doe"
//                     />
//                   </div>
//                   {validationErrors.name && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.name}</p>
//                   )}
//                 </div>
  
//                 <div>
//                   <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700">
//                     Email address
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Mail size={16} className="text-gray-400" />
//                     </div>
//                     <input
//                       id="signup-email"
//                       name="email"
//                       type="email"
//                       autoComplete="email"
//                       required
//                       value={signupData.email}
//                       onChange={handleSignupChange}
//                       className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
//                         validationErrors.email ? 'border-red-300' : 'border-gray-300'
//                       } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
//                       placeholder="you@example.com"
//                     />
//                   </div>
//                   {validationErrors.email && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
//                   )}
//                 </div>
  
//                 <div>
//                   <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700">
//                     Password
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock size={16} className="text-gray-400" />
//                     </div>
//                     <input
//                       id="signup-password"
//                       name="password"
//                       type="password"
//                       autoComplete="new-password"
//                       required
//                       value={signupData.password}
//                       onChange={handleSignupChange}
//                       className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
//                         validationErrors.password ? 'border-red-300' : 'border-gray-300'
//                       } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
//                       placeholder="••••••••"
//                     />
//                   </div>
//                   {validationErrors.password && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
//                   )}
//                 </div>
  
//                 <div>
//                   <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
//                     Confirm password
//                   </label>
//                   <div className="mt-1 relative">
//                     <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                       <Lock size={16} className="text-gray-400" />
//                     </div>
//                     <input
//                       id="confirm-password"
//                       name="confirmPassword"
//                       type="password"
//                       autoComplete="new-password"
//                       required
//                       value={signupData.confirmPassword}
//                       onChange={handleSignupChange}
//                       className={`appearance-none block w-full pl-10 pr-3 py-2 border ${
//                         validationErrors.confirmPassword ? 'border-red-300' : 'border-gray-300'
//                       } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500`}
//                       placeholder="••••••••"
//                     />
//                   </div>
//                   {validationErrors.confirmPassword && (
//                     <p className="mt-1 text-sm text-red-600">{validationErrors.confirmPassword}</p>
//                   )}
//                 </div>
  
//                 <div className="flex items-center">
//                   <input
//                     id="agree-terms"
//                     name="agreeToTerms"
//                     type="checkbox"
//                     checked={signupData.agreeToTerms}
//                     onChange={handleSignupChange}
//                     className={`h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded ${
//                       validationErrors.agreeToTerms ? 'border-red-300' : ''
//                     }`}
//                   />
//                   <label htmlFor="agree-terms" className="ml-2 block text-sm text-gray-700">
//                     I agree to the <a href="#" className="text-blue-600 hover:text-blue-500">Terms of Service</a> and <a href="#" className="text-blue-600 hover:text-blue-500">Privacy Policy</a>
//                   </label>
//                 </div>
//                 {validationErrors.agreeToTerms && (
//                   <p className="mt-1 text-sm text-red-600">{validationErrors.agreeToTerms}</p>
//                 )}
  
//                 <div>
//                   <button
//                     type="submit"
//                     disabled={isLoading}
//                     className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
//                   >
//                     {isLoading ? 'Creating account...' : 'Create account'}
//                   </button>
//                 </div>
//               </form>
//               )}

//               <div className="mt-6">
//                 <div className="relative">
//                   <div className="absolute inset-0 flex items-center">
//                     <div className="w-full border-t border-gray-300" />
//                   </div>
//                   <div className="relative flex justify-center text-sm">
//                     <span className="px-2 bg-white text-gray-500">
//                       {isLogin ? 'New to Audiobook Library?' : 'Already have an account?'}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="mt-6">
//                   <button
//                     type="button"
//                     onClick={toggleAuthMode}
//                     className="w-full flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                   >
//                     {isLogin ? (
//                       <>
//                         Create a new account
//                         <ArrowRight size={16} className="ml-2" />
//                       </>
//                     ) : (
//                       <>
//                         <ChevronLeft size={16} className="mr-2" />
//                         Back to sign in
//                       </>
//                     )}
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }