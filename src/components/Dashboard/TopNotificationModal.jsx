import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faTimes, faHistory } from '@fortawesome/free-solid-svg-icons';

const TopNotificationModal = ({ message, onClose, onViewHistory }) => {
  return (
    <motion.div 
      className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 max-w-md w-full mx-4"
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
    >
      <div className="card-glass backdrop-blur-lg border border-white/20 shadow-xl">
        <div className="flex items-start gap-4 p-6">
          {/* Icon */}
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 text-lg" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Duplicate Profiles Detected
            </h4>
            <p className="text-gray-700 leading-relaxed mb-4">
              {message}
            </p>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button 
                className="btn-modern bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-medium transition-colors duration-200"
                onClick={onClose}
              >
                Got it
              </button>
              {onViewHistory && (
                <button 
                  className="btn-outline px-4 py-2 text-sm font-medium"
                  onClick={onViewHistory}
                >
                  <FontAwesomeIcon icon={faHistory} className="mr-2" />
                  View History
                </button>
              )}
            </div>
          </div>
          
          {/* Close Button */}
          <button 
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
            onClick={onClose}
          >
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TopNotificationModal;
