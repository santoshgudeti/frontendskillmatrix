import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faCheck } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');

    if (!tokenParam || !emailParam) {
      navigate('/forgot-password');
      return;
    }

    setToken(tokenParam);
    setEmail(decodeURIComponent(emailParam));
  }, [searchParams, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await axiosInstance.post('/api/reset-password', {
        token,
        email,
        password,
        confirmPassword
      });

      toast.success('Password updated successfully!');
      navigate('/login');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to reset password');
    } finally {
      setLoading(false);
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
            <p className="text-lg font-semibold text-gray-700">Updating password, please wait...</p>
          </div>
        </motion.div>
      )}
      
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
              <FontAwesomeIcon icon={faLock} className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Reset Password</h2>
            <p className="text-gray-600">for <span className="font-semibold text-primary-600">{email}</span></p>
          </motion.div>
        </div>

        {/* Form */}
        <motion.form 
          onSubmit={handleSubmit}
          className="space-y-6 px-6 pb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          {/* New Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              New Password *
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
                placeholder="Enter new password"
                minLength="6"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} aria-hidden="true" />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Confirm Password */}
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Confirm Password *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="input-modern pl-10 pr-12 w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
                placeholder="Confirm your password"
                minLength="6"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} aria-hidden="true" />
              </button>
            </div>
          </div>

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
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Updating...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCheck} />
                <span>Reset Password</span>
              </div>
            )}
          </motion.button>
        </motion.form>
      </motion.div>
    </div>
  );
};

export default ResetPassword;