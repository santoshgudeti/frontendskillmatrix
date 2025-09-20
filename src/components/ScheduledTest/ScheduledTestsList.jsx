import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faUser, 
  faEnvelope,
  faClock,
  faEdit,
  faTrash,
  faEye,
  faSpinner,
  faExclamationTriangle,
  faCheckCircle,
  faHourglassHalf,
  faTimes,
  faSync,
  faChartBar,
  faFileAlt,
  faListAlt,
  faInfoCircle,
  faHistory
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';
import { useMediaOperations } from '../../hooks/useMediaOperations';
import ScheduleTestForm from './ScheduleTestForm';
import { motion, AnimatePresence } from 'framer-motion';

const ScheduledTestsList = () => {
  const [scheduledTests, setScheduledTests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTest, setSelectedTest] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });
  const navigate = useNavigate();

  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  
  useEffect(() => {
    fetchScheduledTests();
  }, [pagination.page, filter]);

  const fetchScheduledTests = async () => {
    try {
      setLoading(true);
      const params = {
        page: pagination.page,
        limit: pagination.limit
      };
      
      if (filter !== 'all') {
        params.status = filter;
      }

      const response = await axiosInstance.get('/api/scheduled-tests', { params });
      
      if (response.data.success) {
        setScheduledTests(response.data.data);
        setPagination(prev => ({
          ...prev,
          total: response.data.pagination.total,
          pages: response.data.pagination.pages
        }));
      } else {
        toast.error('Failed to fetch scheduled tests');
      }
    } catch (error) {
      console.error('Error fetching scheduled tests:', error);
      toast.error('Failed to fetch scheduled tests');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTest = async (testId) => {
    if (!window.confirm('Are you sure you want to cancel this scheduled test?')) {
      return;
    }

    try {
      const response = await axiosInstance.delete(`/api/scheduled-tests/${testId}`);
      
      if (response.data.success) {
        toast.success('Scheduled test cancelled successfully');
        fetchScheduledTests();
      } else {
        toast.error('Failed to cancel scheduled test');
      }
    } catch (error) {
      console.error('Error cancelling scheduled test:', error);
      toast.error('Failed to cancel scheduled test');
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <FontAwesomeIcon icon={faClock} className="status-icon scheduled" />;
      case 'active':
        return <FontAwesomeIcon icon={faHourglassHalf} className="status-icon active" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'expired':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon expired" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimes} className="status-icon cancelled" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getTimeRemaining = (scheduledDateTime) => {
    const now = new Date();
    const scheduled = new Date(scheduledDateTime);
    const diff = scheduled - now;
    
    if (diff <= 0) return 'Started';
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  // Add function to view test with media handling
  const viewTestDetails = (testId) => {
    navigate(`/dashboard/scheduled-tests/${testId}`);
  };

  const filteredTests = scheduledTests;

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <FontAwesomeIcon icon={faSpinner} spin className="text-4xl text-primary-600 mb-4" />
          <p className="text-lg text-gray-600">Loading scheduled tests...</p>
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
        {/* Header Section */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="card-glass p-6">
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faHistory} className="text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Scheduled Tests
                  </h1>
                  <p className="text-gray-600 mt-1">Manage and monitor your scheduled assessments</p>
                </div>
              </div>
              
              <button
                className="btn-ghost px-4 py-2 flex items-center gap-2"
                onClick={fetchScheduledTests}
                disabled={loading}
              >
                <FontAwesomeIcon icon={faSync} spin={loading} />
                Refresh
              </button>
            </div>
          </div>
        </motion.div>

        {/* Controls Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-glass p-4">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <select
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setPagination(prev => ({ ...prev, page: 1 }));
                }}
                className="input-modern max-w-xs"
              >
                <option value="all">All Tests</option>
                <option value="scheduled">Scheduled</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="expired">Expired</option>
                <option value="cancelled">Cancelled</option>
              </select>
              
              <div className="text-sm text-gray-600">
                {pagination.total} test{pagination.total !== 1 ? 's' : ''} found
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tests Grid */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredTests.length === 0 ? (
            <motion.div 
              className="card-glass text-center py-16"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <FontAwesomeIcon icon={faListAlt} className="text-6xl text-gray-300 mb-6" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No scheduled tests found</h3>
              <p className="text-gray-500">Create a new scheduled test to get started</p>
            </motion.div>
          ) : (
            <div className="grid gap-6">
              <AnimatePresence>
                {filteredTests.map((test, index) => (
                  <motion.div
                    key={test._id}
                    className="card-glass group hover:shadow-xl transition-all duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <div className="p-6">
                      {/* Card Header */}
                      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faUser} className="text-gray-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">{test.candidateName}</h3>
                            <p className="text-gray-600 flex items-center gap-2">
                              <FontAwesomeIcon icon={faEnvelope} className="text-sm" />
                              {test.candidateEmail}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(test.status)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            test.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                            test.status === 'active' ? 'bg-yellow-100 text-yellow-800' :
                            test.status === 'completed' ? 'bg-green-100 text-green-800' :
                            test.status === 'expired' ? 'bg-red-100 text-red-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {getStatusText(test.status)}
                          </span>
                        </div>
                      </div>

                      {/* Card Body */}
                      <div className="grid md:grid-cols-2 gap-6 mb-6">
                        <div className="space-y-4">
                          <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faCalendarAlt} className="text-primary-600" />
                            <div>
                              <div className="text-sm text-gray-500">Scheduled</div>
                              <div className="font-medium text-gray-900">{formatDateTime(test.scheduledDateTime)}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <FontAwesomeIcon icon={faClock} className="text-primary-600" />
                            <div>
                              <div className="text-sm text-gray-500">Time Remaining</div>
                              <div className="font-medium text-gray-900">
                                {test.status === 'scheduled' 
                                  ? getTimeRemaining(test.scheduledDateTime)
                                  : test.status === 'active'
                                  ? 'In Progress'
                                  : 'N/A'
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          {test.assessmentSession && (
                            <div className="flex items-center gap-2 text-green-600">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              <span className="text-sm font-medium">Assessment Created</span>
                            </div>
                          )}
                          
                          {test.questionsGenerated && (
                            <div className="flex items-center gap-2 text-blue-600">
                              <FontAwesomeIcon icon={faCheckCircle} />
                              <span className="text-sm font-medium">Questions Generated</span>
                            </div>
                          )}
                          
                          {(test.status === 'completed' || (test.assessmentSession && test.assessmentSession.testResult)) && (
                            <div className="flex items-center gap-2 text-purple-600">
                              <FontAwesomeIcon icon={faChartBar} />
                              <span className="text-sm font-medium">Results Available</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                        {test.status === 'scheduled' && (
                          <button
                            className="btn-ghost px-3 py-2 text-sm"
                            onClick={() => {
                              setSelectedTest(test);
                              setShowEditModal(true);
                            }}
                            title="Edit"
                          >
                            <FontAwesomeIcon icon={faEdit} className="mr-2" />
                            Edit
                          </button>
                        )}
                        
                        {test.status !== 'completed' && test.status !== 'cancelled' && (
                          <button
                            className="btn-ghost text-red-600 hover:bg-red-50 px-3 py-2 text-sm"
                            onClick={() => handleDeleteTest(test._id)}
                            title="Cancel"
                          >
                            <FontAwesomeIcon icon={faTrash} className="mr-2" />
                            Cancel
                          </button>
                        )}
                        
                        {(test.status === 'completed' || test.assessmentSession) && (
                          <button
                            className="btn-primary px-3 py-2 text-sm"
                            onClick={() => navigate(`/dashboard/scheduled-tests/${test._id}/details`)}
                          >
                            <FontAwesomeIcon icon={faChartBar} className="mr-2" />
                            View Results
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <motion.div 
            className="mt-8 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="card-glass p-4">
              <div className="flex items-center gap-4">
                <button
                  className="btn-ghost px-4 py-2"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                  disabled={pagination.page === 1}
                >
                  Previous
                </button>
                
                <span className="text-sm text-gray-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                
                <button
                  className="btn-ghost px-4 py-2"
                  onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                  disabled={pagination.page === pagination.pages}
                >
                  Next
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Edit Modal */}
      <AnimatePresence>
        {showEditModal && selectedTest && (
          <ScheduleTestForm
            initialData={selectedTest}
            onClose={() => {
              setShowEditModal(false);
              setSelectedTest(null);
            }}
            onSuccess={() => {
              fetchScheduledTests();
              setShowEditModal(false);
              setSelectedTest(null);
            }}
            isEdit={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScheduledTestsList;