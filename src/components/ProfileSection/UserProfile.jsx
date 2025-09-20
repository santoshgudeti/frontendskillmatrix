import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope, 
  faPhone, 
  faEdit, 
  faPaperPlane, 
  faSignOutAlt, 
  faCrown,
  faExclamationTriangle,
  faTimes,
  faCheck
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';
import TopNotificationModal from '../Dashboard/TopNotificationModal';
import { axiosInstance } from '../../axiosUtils';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '123456789'
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user', { withCredentials: true });
        setUser(res.data.user);
        setFormData({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          phone: '123456789'
        });
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user details');
      }
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
      setNotificationMessage("Logout successful. See you again!");
      setShowNotification(true);
      setTimeout(() => {
        navigate('/login');
      }, 1500);
    } catch (error) {
      console.error('Logout failed:', error);
      toast.error('Logout failed. Please try again.');
    }
  };

  const getSubscriptionStatus = () => {
    if (!user.subscription) return 'No active subscription';
    
    const planName = user.subscription.plan.charAt(0).toUpperCase() + 
                    user.subscription.plan.slice(1);
    
    if (user.subscription.plan === 'paid') {
      return `Paid Plan (Expires: ${new Date(user.subscription.expiresAt).toLocaleDateString()})`;
    }
    
    if (user.subscription.plan === 'free') {
      return 'Free Plan (Unlimited)';
    }
    
    if (user.subscription.plan === 'trial') {
      return `Trial (Expires: ${new Date(user.subscription.expiresAt).toLocaleDateString()})`;
    }
    
    return `${planName} Plan`;
  };

  const handleSave = () => {
    setNotificationMessage("Profile updated successfully!");
    setShowNotification(true);
    setShowModal(false);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-primary-gradient rounded-full mx-auto mb-4 animate-pulse"></div>
          <p className="text-lg text-gray-600">Loading profile...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <motion.div 
        className="container-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {showNotification && (
          <TopNotificationModal
            message={notificationMessage}
            onClose={() => setShowNotification(false)}
          />
        )}

        <div className="max-w-2xl mx-auto">
          {/* Profile Card */}
          <motion.div 
            className="card-glass overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {/* Header with Gradient Background */}
            <div className="relative h-32 bg-primary-gradient">
              {/* Logout Button */}
              <button 
                onClick={handleLogout}
                className="absolute top-4 right-4 btn-ghost bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 backdrop-blur-sm"
              >
                <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
                Logout
              </button>
              
              {/* Profile Picture */}
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <div className="w-24 h-24 bg-white rounded-full border-4 border-white shadow-lg flex items-center justify-center">
                  <span className="text-3xl font-bold text-primary-600">
                    {user.fullName.charAt(0)}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-16 pb-8 px-8">
              <div className="text-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">{user.fullName}</h1>
                <p className="text-gray-600 mb-1">
                  <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
                  {user.email}
                </p>
                <p className="text-primary-600 font-medium">Hyderabad-Telangana, India</p>
                
                {/* Action Buttons */}
                <div className="flex justify-center gap-4 mt-6">
                  <button 
                    onClick={() => setShowModal(true)}
                    className="btn-outline px-6 py-2"
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit Profile
                  </button>
                  <button className="btn-primary px-6 py-2">
                    <FontAwesomeIcon icon={faPaperPlane} className="mr-2" />
                    Message
                  </button>
                </div>
              </div>
              
              {/* Subscription Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="text-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center justify-center gap-2">
                    <FontAwesomeIcon icon={faCrown} className="text-yellow-500" />
                    Subscription Plan
                  </h3>
                  
                  <div className="mb-4">
                    <span className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                      user.subscription?.plan === 'paid' ? 'bg-green-100 text-green-800' : 
                      user.subscription?.plan === 'free' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {getSubscriptionStatus()}
                    </span>
                  </div>

                  {user.subscription?.plan === 'trial' && (
                    <motion.div 
                      className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex items-center justify-center gap-2 text-yellow-800">
                        <FontAwesomeIcon icon={faExclamationTriangle} />
                        <span className="font-medium">Trial period active. Upgrade for full access.</span>
                      </div>
                    </motion.div>
                  )}

                  {user.subscription?.limits && (
                    <div className="space-y-4">
                      {/* JD Uploads */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">JD Uploads</span>
                          <span className="text-gray-900 font-medium">
                            {user.usage?.jdUploads || 0}/{user.subscription.limits.jdUploads}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-primary-gradient h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((user.usage?.jdUploads || 0) / user.subscription.limits.jdUploads) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Resume Uploads */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Resume Uploads</span>
                          <span className="text-gray-900 font-medium">
                            {user.usage?.resumeUploads || 0}/{user.subscription.limits.resumeUploads}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-secondary-gradient h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((user.usage?.resumeUploads || 0) / user.subscription.limits.resumeUploads) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>

                      {/* Assessments */}
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Assessments</span>
                          <span className="text-gray-900 font-medium">
                            {user.usage?.assessments || 0}/{user.subscription.limits.assessments}
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-success-gradient h-2 rounded-full transition-all duration-300"
                            style={{ 
                              width: `${Math.min(100, ((user.usage?.assessments || 0) / user.subscription.limits.assessments) * 100)}%` 
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div 
              className="card-glass max-w-md w-full"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-6">
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <button 
                    onClick={() => setShowModal(false)}
                    className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
                
                {/* Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    <input 
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input 
                      type="email" 
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input 
                      type="text" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="input-modern w-full"
                    />
                  </div>
                </div>
                
                {/* Modal Footer */}
                <div className="flex justify-end gap-3 mt-6">
                  <button 
                    onClick={() => setShowModal(false)}
                    className="btn-ghost px-4 py-2"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleSave}
                    className="btn-primary px-4 py-2"
                  >
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserProfile;