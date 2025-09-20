import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosUtils';
import { toast } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiUser, 
  FiLogOut, 
  FiBriefcase, 
  FiEye, 
  FiX, 
  FiDownload,
  FiLink,
  FiCopy,
  FiUsers,
  FiCalendar,
  FiDollarSign,
  FiMapPin,
  FiFileText,
  FiShare2,
  FiCheck
} from 'react-icons/fi';
import { FaRupeeSign } from "react-icons/fa";
import './JobPosterDashboard.css';

const JobPosterDashboard = () => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState({});
  const [selectedJob, setSelectedJob] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchProfile();
    fetchMyJobs();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await axiosInstance.get('/jobportal/profile', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('jobToken')}` }
      });
      setProfile(res.data.user);
    } catch (err) {
      toast.error('Failed to load profile');
    }
  };

  const fetchMyJobs = async () => {
    try {
      const res = await axiosInstance.get('/jobportal/myjobs', {
        headers: { Authorization: `Bearer ${sessionStorage.getItem('jobToken')}` }
      });
      setJobs(res.data.jobs);
    } catch (err) {
      toast.error('Failed to load job posts');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('jobToken');
    toast.info('Logged out successfully');
    navigate('/');
  };

  const openJobDetails = (job) => {
    setSelectedJob(job);
    setCopied(false);
  };

  const handleViewJD = async (jobId) => {
    try {
      const token = sessionStorage.getItem('jobToken');
      const res = await axiosInstance.get(`/jobportal/view-jd/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.url) {
        // Open in a new tab with proper security attributes
        window.open(res.data.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.error('Could not retrieve job description file');
      }
    } catch (err) {
      toast.error('Error opening job description file');
      console.error(err);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  const closeModal = () => setSelectedJob(null);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">
            Welcome back, <span>{profile.name?.split(' ')[0] || 'Recruiter'}</span>
          </h1>
          <p className="dashboard-subtitle">Manage your job postings and applications</p>
        </div>
        <button 
          className="dashboard-logout-button" 
          onClick={handleLogout}
        >
          <FiLogOut /> Sign Out
        </button>
      </div>

      <div className="dashboard-grid">
        <motion.div 
          className="dashboard-card dashboard-new-job-card"
          whileHover={{ y: -5 }}
          onClick={() => navigate('/jobportal/post')}
        >
          <div className="dashboard-card-content-center">
            <div className="dashboard-card-icon">
              <FiPlus />
            </div>
            <h3>Post New Job</h3>
            <p>Create a new job listing to attract top talent</p>
          </div>
        </motion.div>

        <div className="dashboard-card dashboard-jobs-card">
          <div className="dashboard-card-header">
            <h3><FiBriefcase /> My Job Posts</h3>
            <span className="dashboard-badge">{jobs.length}</span>
          </div>
          <div className="dashboard-job-list">
            {jobs.length === 0 ? (
              <div className="dashboard-empty-state">
                <p>No jobs posted yet</p>
                <button 
                  className="dashboard-primary-button small"
                  onClick={() => navigate('/jobportal/post')}
                >
                  Post Your First Job
                </button>
              </div>
            ) : (
              jobs.map(job => (
                <div 
                  className="dashboard-job-item" 
                  key={job._id}
                  onClick={() => openJobDetails(job)}
                >
                  <div className="dashboard-job-info">
                    <h4>{job.title}</h4>
                    <div className="dashboard-job-meta">
                      <span><FiCalendar /> {new Date(job.createdAt).toLocaleDateString()}</span>
                      <span><FiUsers /> {job.applications?.length || 0} applicants</span>
                    </div>
                  </div>
                  <FiEye className="dashboard-view-icon" />
                </div>
              ))
            )}
          </div>
        </div>

        <div className="dashboard-card dashboard-profile-card">
          <div className="dashboard-card-header">
            <h3><FiUser /> My Profile</h3>
          </div>
          <div className="dashboard-profile-details">
            <div className="dashboard-detail-item">
              <span className="dashboard-detail-label">Name</span>
              <span className="dashboard-detail-value">{profile.name}</span>
            </div>
            <div className="dashboard-detail-item">
              <span className="dashboard-detail-label">Email</span>
              <span className="dashboard-detail-value">{profile.email}</span>
            </div>
            <div className="dashboard-detail-item">
              <span className="dashboard-detail-label">Status</span>
              <span className={`dashboard-status-badge ${profile.isVerified ? 'verified' : 'unverified'}`}>
                {profile.isVerified ? 'Verified' : 'Unverified'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
  {selectedJob && (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={(e) => {
        // Only close modal if clicking directly on the overlay, not on children
        if (e.target === e.currentTarget) {
          closeModal();
        }
      }}
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl p-8 relative"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <motion.button 
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
          onClick={closeModal}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiX className="text-gray-500" />
        </motion.button>
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedJob.title}</h2>
          <div className="flex items-center gap-2 mb-3">
            <FiBriefcase className="text-primary-600" />
            <h6 className="text-base font-medium m-0">{selectedJob.companyName || "Unknown Company"}</h6>
          </div>

          <div className="flex items-center gap-3 text-sm text-gray-500">
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-semibold">Active</span>
            <span className="flex items-center gap-1">
              <FiCalendar /> Posted: {new Date(selectedJob.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>


              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <motion.div 
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  whileHover={{ y: -2, backgroundColor: "#f0f9ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <FiMapPin className="text-gray-700 text-lg mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Location</span>
                    <span className="text-base font-medium text-gray-800">{selectedJob.location}</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  whileHover={{ y: -2, backgroundColor: "#f0f9ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <FiBriefcase className="text-gray-700 text-lg mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Job Type</span>
                    <span className="text-base font-medium text-gray-800">{selectedJob.jobType}</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  whileHover={{ y: -2, backgroundColor: "#f0f9ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <FiUser className="text-gray-700 text-lg mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Experience</span>
                    <span className="text-base font-medium text-gray-800">{selectedJob.experience}</span>
                  </div>
                </motion.div>
                
                <motion.div 
                  className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                  whileHover={{ y: -2, backgroundColor: "#f0f9ff" }}
                  transition={{ duration: 0.2 }}
                >
                  <FaRupeeSign className="text-gray-700 text-lg mt-0.5" />
                  <div>
                    <span className="text-xs text-gray-500 block mb-1">Salary Range</span>
                    <span className="text-base font-medium text-gray-800">{selectedJob.salaryRange}</span>
                  </div>
                </motion.div>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FiFileText className="text-primary-600" /> Job Description
                </h3>
                <motion.div 
                  className="bg-gray-50 p-4 rounded-lg"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <p className="text-gray-700 leading-relaxed">{selectedJob.descriptionText}</p>
                  {selectedJob.jobDescriptionFile && (
                    <motion.button 
                      className="text-primary-600 font-medium flex items-center gap-2 mt-4 hover:text-primary-700 transition-colors"
                      onClick={() => handleViewJD(selectedJob._id)}
                      whileHover={{ x: 3 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <FiFileText /> View Full Job Description
                    </motion.button>
                  )}
                </motion.div>
              </div>

              {selectedJob.skillsRequired?.length > 0 && (
                <div className="dashboard-section">
                  <h3 className="dashboard-section-title">Required Skills</h3>
                  <div className="dashboard-skills-container">
                    {selectedJob.skillsRequired.map((skill, index) => (
                      <span key={index} className="dashboard-skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              {selectedJob.publicId && (
                <div className="mb-6 bg-gray-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiShare2 className="text-primary-600" /> Share Job Posting
                  </h3>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row overflow-hidden rounded-lg border border-gray-200 bg-white">
                      <div className="flex items-center px-3 text-gray-500 bg-gray-50 border-r border-gray-200">
                        <FiLink />
                      </div>
                      <input 
                        type="text" 
                        className="flex-1 px-4 py-3 text-gray-700 bg-white border-none focus:outline-none" 
                        value={`${window.location.origin}/jobs/${selectedJob.publicId}`}
                        readOnly
                      />
                      <motion.button 
                        className={`px-4 py-2 font-medium flex items-center justify-center gap-2 ${copied ? 'bg-green-600 text-white' : 'bg-primary-600 text-white'}`}
                        onClick={() => copyToClipboard(`${window.location.origin}/jobs/${selectedJob.publicId}`)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
                        <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                      </motion.button>
                    </div>
                    <p className="text-center text-sm text-gray-500">
                      Share this link with candidates to apply directly
                    </p>
                  </div>
                </div>
              )}

              {selectedJob.applications?.length > 0 && (
                <div className="mb-6 bg-blue-50 p-6 rounded-xl">
                  <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUsers className="text-primary-600" /> Applications ({selectedJob.applications.length})
                  </h3>
                  <motion.button 
                    className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    onClick={() => {
                      navigate(`/jobportal/applications/${selectedJob._id}`);
                      closeModal();
                    }}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <FiUsers className="h-4 w-4" /> View All Applications
                  </motion.button>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <motion.button 
                  className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-6 rounded-lg transition-colors"
                  onClick={closeModal}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Close
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JobPosterDashboard;