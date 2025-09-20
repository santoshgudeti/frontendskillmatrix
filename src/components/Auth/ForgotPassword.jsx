import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowLeft, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axiosInstance.post('/api/forgot-password', { email });
      setShowSuccessModal(true);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to send reset link');
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
            <p className="text-lg font-semibold text-gray-700">Sending email, please wait...</p>
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
              <FontAwesomeIcon icon={faEnvelope} className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Password</h2>
            <p className="text-gray-600">We'll send you a reset link</p>
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
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address *
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                id="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-modern pl-10 w-full focus:ring-2 focus:ring-primary-500 focus:outline-none"
                required
              />
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
                <span>Sending...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faPaperPlane} />
                <span>Send Reset Link</span>
              </div>
            )}
          </motion.button>
        </motion.form>

        {/* Footer Links */}
        <motion.div 
          className="mt-4 mb-6 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <button 
            onClick={() => navigate('/login')} 
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200 flex items-center justify-center gap-2 mx-auto"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
            <span>Back to Login</span>
          </button>
        </motion.div>
      </motion.div>

      {/* Success Modal */}
      {showSuccessModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="card-glass max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FontAwesomeIcon icon={faEnvelope} className="text-primary-600" />
                  <span>Email Sent</span>
                </h3>
                <button 
                  onClick={() => setShowSuccessModal(false)}
                  className="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-full p-1"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="mb-6">
                <p className="text-gray-600 mb-2">A reset link has been sent to <strong className="text-primary-600">{email}</strong>.</p>
                <p className="text-gray-600">Please check your inbox and follow the instructions.</p>
              </div>
              
              <div className="flex justify-end">
                <motion.button
                  className="btn-primary px-6 py-3 rounded-lg font-semibold"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowSuccessModal(false);
                    navigate('/login');
                  }}
                >
                  Okay
                </motion.button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default ForgotPassword;