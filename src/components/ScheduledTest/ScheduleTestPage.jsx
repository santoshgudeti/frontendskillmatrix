import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ScheduleTestForm from './ScheduleTestForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarPlus, 
  faArrowLeft,
  faCheckCircle,
  faEye,
  faCogs
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';

const ScheduleTestPage = () => {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [lastScheduledTest, setLastScheduledTest] = useState(null);

  const handleScheduleSuccess = (scheduledTestData) => {
    setLastScheduledTest(scheduledTestData);
    setShowForm(false);
  };

  const handleGoBack = () => {
    navigate('/dashboard');
  };

  const handleViewScheduledTests = () => {
    navigate('/dashboard/scheduled-tests');
  };

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
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleGoBack}
                  className="btn-ghost px-4 py-2 flex items-center gap-2"
                >
                  <FontAwesomeIcon icon={faArrowLeft} />
                  Back to Dashboard
                </button>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white">
                      <FontAwesomeIcon icon={faCalendarPlus} className="text-xl" />
                    </div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                      Schedule Assessment
                    </h1>
                  </div>
                  <p className="text-gray-600">Create time-bound assessment links for candidates</p>
                </div>
              </div>
              <button 
                onClick={handleViewScheduledTests}
                className="btn-primary px-6 py-3"
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View All Scheduled Tests
              </button>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        {lastScheduledTest && !showForm && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="card-glass border-l-4 border-green-500">
              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">🎉 Test Scheduled Successfully!</h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-gray-700 mb-2">
                          Assessment for <span className="font-semibold text-gray-900">{lastScheduledTest.candidateName}</span> has been scheduled for{' '}
                          <span className="font-semibold text-primary-600">{new Date(lastScheduledTest.scheduledDateTime).toLocaleString()}</span>
                        </p>
                        <p className="text-sm text-gray-500 mb-4">
                          Test ID: {lastScheduledTest.scheduledTestId}
                        </p>
                        
                        {/* Processing Feedback */}
                        {lastScheduledTest.processingFeedback && (
                          <div className="bg-blue-50 rounded-lg p-4">
                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                              <FontAwesomeIcon icon={faCogs} />
                              Real-time Processing Results
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-center">
                              <div className="bg-white rounded-lg p-3">
                                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                                  lastScheduledTest.processingFeedback.questionsGenerated ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {lastScheduledTest.processingFeedback.questionsGenerated ? '✅' : '⚠️'}
                                </div>
                                <div className="text-xs text-gray-600">Questions</div>
                              </div>
                              <div className="bg-white rounded-lg p-3">
                                <div className={`w-8 h-8 mx-auto mb-2 rounded-full flex items-center justify-center ${
                                  lastScheduledTest.processingFeedback.emailSent ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                                }`}>
                                  {lastScheduledTest.processingFeedback.emailSent ? '✅' : '⚠️'}
                                </div>
                                <div className="text-xs text-gray-600">Email</div>
                              </div>
                              <div className="bg-white rounded-lg p-3 md:col-span-2">
                                <div className="w-8 h-8 mx-auto mb-2 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                  ⏱️
                                </div>
                                <div className="text-xs text-gray-600">{lastScheduledTest.processingFeedback.processingTime}</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col gap-3">
                        <button 
                          onClick={handleViewScheduledTests}
                          className="btn-success px-4 py-2"
                        >
                          <FontAwesomeIcon icon={faEye} className="mr-2" />
                          View Details
                        </button>
                        <button 
                          onClick={() => setShowForm(true)}
                          className="btn-outline px-4 py-2"
                        >
                          <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                          Schedule Another
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {!showForm && !lastScheduledTest ? (
            <div className="card-glass text-center">
              <div className="p-12">
                <div className="w-20 h-20 bg-primary-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faCalendarPlus} className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Schedule New Assessment</h2>
                <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
                  Create time-bound assessment links that candidates can access<br />
                  for 2 days after the scheduled time
                </p>
                
                {/* Features Grid */}
                <div className="max-w-3xl mx-auto mb-8">
                  <div className="bg-blue-50 rounded-2xl p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-6">Key Features</h3>
                    <div className="grid md:grid-cols-2 gap-4 text-left">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <span className="text-blue-800">Time-bound assessment links (valid for 48 hours)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <span className="text-blue-800">Automated email notifications to candidates</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <span className="text-blue-800">Direct question generation (no resume-JD matching)</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-green-600 font-bold">✓</span>
                        </div>
                        <span className="text-blue-800">Real-time status tracking and management</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <button 
                  onClick={() => setShowForm(true)}
                  className="btn-primary px-8 py-4 text-lg font-semibold"
                >
                  <FontAwesomeIcon icon={faCalendarPlus} className="mr-3" />
                  Create Scheduled Test
                </button>
              </div>
            </div>
          ) : !showForm && lastScheduledTest ? (
            <div className="card-glass text-center">
              <div className="p-12">
                <div className="w-20 h-20 bg-success-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-white" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Schedule More?</h2>
                <p className="text-lg text-gray-600 mb-8">
                  Your test has been scheduled successfully. You can create another one or manage existing tests.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => setShowForm(true)}
                    className="btn-primary px-6 py-3 text-lg"
                  >
                    <FontAwesomeIcon icon={faCalendarPlus} className="mr-2" />
                    Schedule Another Test
                  </button>
                  <button 
                    onClick={handleViewScheduledTests}
                    className="btn-outline px-6 py-3 text-lg"
                  >
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Manage Scheduled Tests
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </motion.div>
      </motion.div>

      {/* Schedule Test Form Modal */}
      {showForm && (
        <ScheduleTestForm
          onClose={() => setShowForm(false)}
          onSuccess={handleScheduleSuccess}
        />
      )}
    </div>
  );
};

export default ScheduleTestPage;