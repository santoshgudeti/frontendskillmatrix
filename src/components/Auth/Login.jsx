import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faSpinner, faCheckCircle, faUser, faLock, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';
import WelcomeModal from '../modals/WelcomeModal';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [loggedInUserName, setLoggedInUserName] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axiosInstance.post(
        '/login',
        { email, password },
        { withCredentials: true }
      );
      setLoggedInUserName(res.data.user?.fullName || '');
      // Store user data to check if admin
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setShowWelcome(true); // Show welcome modal
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleWelcomeClose = () => {
    setShowWelcome(false);
    // Check if user is admin and redirect accordingly
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAdmin) {
      navigate('/dashboard/admin');
    } else {
      navigate('/dashboard/upload');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Loading Overlay */}
      {loading && (
        <motion.div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="card-glass p-8 text-center">
            <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg font-semibold text-gray-700">Logging in, please wait...</p>
          </div>
        </motion.div>
      )}

      <WelcomeModal show={showWelcome} onClose={handleWelcomeClose} userName={loggedInUserName} />

      <motion.div 
        className="card-glass max-w-md w-full"
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        {/* Header */}
        <div className="text-center mb-8 p-6">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
              <FontAwesomeIcon icon={faUser} className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back</h2>
            <p className="text-gray-600">Sign in to your SkillMatrix ATS account</p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6 px-6 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          role="form"
          aria-label="Login form"
          noValidate
        >
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern pl-10 w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Enter your email"
                required
                aria-required="true"
                aria-describedby="email-help"
                autoComplete="username"
              />
              <div id="email-help" className="sr-only">
                Enter the email address associated with your account
              </div>
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-modern pl-10 pr-12 w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Enter your password"
                required
                aria-required="true"
                aria-describedby="password-help"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
              </button>
              <div id="password-help" className="sr-only">
                Enter your account password. Use the toggle button to show or hide your password.
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 focus:ring-4 focus:ring-primary-300 focus:outline-none ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'btn-primary hover:scale-105 hover:shadow-xl'
            }`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
            aria-describedby="submit-help"
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin aria-hidden="true" />
                <span>Processing...</span>
                <span className="sr-only">Please wait while we sign you in</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} aria-hidden="true" />
                <span>Sign In</span>
              </div>
            )}
          </motion.button>
          
          <div id="submit-help" className="sr-only">
            Click to sign in to your account. This may take a few moments.
          </div>
        </motion.form>

        {/* Footer Links */}
        <motion.div 
          className="mt-6 mb-6 space-y-4 text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link 
            to="/forgot-password" 
            className="block text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Forgot password?
            <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
          </Link>
          
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Don't have an account?</span>
            <Link 
              to="/Register" 
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-1"
            >
              Register
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Login;