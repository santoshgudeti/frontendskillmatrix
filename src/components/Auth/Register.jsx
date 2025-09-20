import React, { useState } from "react";
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, faEnvelope, faLock, faPhone, faBuilding, 
  faIdBadge, faEye, faEyeSlash, faSpinner, faCheckCircle,
  faUserPlus, faArrowRight,  
} from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from "../../axiosUtils";
import smily from "../../assets/smily.gif";

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    mobileNumber: '',
    companyName: '',
    designation: '',
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await axiosInstance.post('/register', formData);
      toast.success(res.data.message);
      setShowModal(true); // Show modal after successful registration
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    navigate('/login'); // Navigate after user closes modal
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
            <p className="text-lg font-semibold text-gray-700">Registering, please wait...</p>
          </div>
        </motion.div>
      )}

      {/* Success Modal */}
      {showModal && (
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
              <img
                src={smily}
                alt="Verify Email"
                className="w-32 h-32 mx-auto mb-6 rounded-lg"
              />
              <h3 className="text-2xl font-bold text-primary-600 mb-4 text-center">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                Verify Your Email 📩
              </h3>
              <p className="text-gray-600 mb-2 text-center">We sent a verification link to your email.</p>
              <p className="text-gray-600 mb-6 text-center">
                Check your <strong>Inbox</strong>, <strong>Spam</strong>, or <strong>Junk</strong> folders to complete the setup.
              </p>
              <motion.button 
                className="btn-primary w-full py-3 rounded-lg font-semibold"
                onClick={handleCloseModal}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Got it!
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}

      <motion.div 
        className="card-glass max-w-lg w-full"
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
              <FontAwesomeIcon icon={faUserPlus} className="text-2xl text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Apply for your Free Trial</h2>
            <p className="text-gray-600">No credit card required</p>
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
          {/* Full Name */}
          <div>
            <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faUser} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="input-modern pl-10 w-full"
                placeholder="Enter your full name"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faEnvelope} className="text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="input-modern pl-10 w-full"
                placeholder="Enter company email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faLock} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="input-modern pl-10 pr-12 w-full"
                placeholder="Enter password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
          </div>

          {/* Mobile Number */}
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Mobile Number
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faPhone} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="mobileNumber"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                className="input-modern pl-10 w-full"
                placeholder="Enter mobile number"
                required
              />
            </div>
          </div>

          {/* Company Name */}
          <div>
            <label htmlFor="companyName" className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="input-modern pl-10 w-full"
                placeholder="Enter company name"
                required
              />
            </div>
          </div>

          {/* Designation */}
          <div>
            <label htmlFor="designation" className="block text-sm font-semibold text-gray-700 mb-2">
              Designation/Job Title
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faIdBadge} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="designation"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                className="input-modern pl-10 w-full"
                placeholder="Enter your designation"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
              loading 
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                : 'btn-primary hover:scale-105 hover:shadow-xl'
            }`}
            whileHover={!loading ? { scale: 1.02 } : {}}
            whileTap={!loading ? { scale: 0.98 } : {}}
          >
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faSpinner} spin />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Register</span>
              </div>
            )}
          </motion.button>
        </motion.form>

        {/* Footer Link */}
        <motion.div 
          className="mt-6 mb-6 text-center px-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <span>Already have an account?</span>
            <Link 
              to="/login" 
              className="text-primary-600 hover:text-primary-700 font-semibold transition-colors duration-200 flex items-center gap-1"
            >
              Log in
              <FontAwesomeIcon icon={faArrowRight} className="text-xs" />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Register;