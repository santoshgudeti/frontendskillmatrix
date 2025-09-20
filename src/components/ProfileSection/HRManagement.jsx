import React, { useState, useEffect } from 'react';
import { axiosInstance } from '../../axiosUtils';
import { toast } from 'react-toastify';
import { 
  FiDownload, FiMail, FiPhone, FiUser, FiBriefcase, 
  FiCalendar, FiMapPin, FiDollarSign, FiUsers, FiLink2,
  FiChevronRight, FiSearch, FiFilter, FiX, FiChevronDown, FiChevronUp
} from 'react-icons/fi';
import { FaRupeeSign,FaBuilding  } from "react-icons/fa";
import { motion, AnimatePresence } from 'framer-motion';
import './HRManagement.css';

const HRManagement = () => {
  const [hrUsers, setHrUsers] = useState([]);
  const [selectedHr, setSelectedHr] = useState(null);
  const [jobPosts, setJobPosts] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('hrUsers');
  const [expandedJobId, setExpandedJobId] = useState(null);

  useEffect(() => {
    fetchHrUsers();
  }, []);

  const fetchHrUsers = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get('/admin/jobposters', { withCredentials: true });
      setHrUsers(res.data);
    } catch (err) {
      toast.error('Failed to fetch HR users');
    } finally {
      setLoading(false);
    }
  };

  const fetchHrData = async (hrId) => {
    try {
      setLoading(true);
      const jobsRes = await axiosInstance.get(`/jobportal/admin/jobs/${hrId}`, { withCredentials: true });
      setJobPosts(jobsRes.data);
      
      const apps = [];
      for (const job of jobsRes.data) {
        const appsRes = await axiosInstance.get(`/jobportal/admin/applications/${job._id}`, { withCredentials: true });
        apps.push(...appsRes.data.map(app => ({ ...app, jobTitle: job.title, jobId: job._id })));
      }
      setApplications(apps);
      setSelectedHr(hrId);
      setActiveTab('jobs');
    } catch (err) {
      toast.error('Failed to fetch HR data');
    } finally {
      setLoading(false);
    }
  };

  const handleViewJD = async (jobId) => {
    try {
      const res = await axiosInstance.get(`/jobportal/view-jd/${jobId}`, { withCredentials: true });
      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      } else {
        toast.error('Could not retrieve job description file');
      }
    } catch (err) {
      toast.error('Error opening job description file');
    }
  };

  const handleViewResume = async (applicationId, candidateName) => {
    try {
      const res = await axiosInstance.get(`/jobportal/view-resume/${applicationId}`, {
        withCredentials: true,
      });

      if (res.data?.url) {
        window.open(res.data.url, '_blank');
      } else {
        toast.error('Could not retrieve resume file');
      }
    } catch (err) {
      toast.error('Failed to open resume');
    }
  };

  const toggleJobExpansion = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const openApplicationDetails = (app) => {
    setSelectedApplication(app);
  };

  const closeModal = () => {
    setSelectedApplication(null);
  };

  const filteredHrUsers = hrUsers.filter(hr => {
    const name = hr?.name || '';
    const email = hr?.email || '';
    const searchLower = searchTerm.toLowerCase();
    return name.toLowerCase().includes(searchLower) || 
           email.toLowerCase().includes(searchLower);
  });

  const filteredJobs = jobPosts.filter(job => {
    const title = job?.title || '';
    const location = job?.location || '';
    const searchLower = searchTerm.toLowerCase();
    return title.toLowerCase().includes(searchLower) || 
           location.toLowerCase().includes(searchLower);
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center h-80">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 py-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-2">HR Management Dashboard</h1>
          <nav className="flex text-gray-500 text-sm" aria-label="breadcrumb">
            <span>Admin</span>
            <span className="mx-2">/</span>
            <span className="text-gray-900">HR Management</span>
          </nav>
        </div>
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setSearchTerm('')}>
              <FiX />
            </button>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total HR Users</h6>
              <h3 className="text-2xl font-bold">{hrUsers.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUser className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Jobs Posted</h6>
              <h3 className="text-2xl font-bold">{jobPosts.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <FiBriefcase className="text-green-600 text-xl" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Total Applications</h6>
              <h3 className="text-2xl font-bold">{applications.length}</h3>
            </div>
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
              <FiUsers className="text-blue-600 text-xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button 
              className={`px-4 py-3 font-medium text-sm ${activeTab === 'hrUsers' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('hrUsers')}
            >
              <FiUser className="inline mr-2" /> HR Users
            </button>
            {selectedHr && (
              <button 
                className={`px-4 py-3 font-medium text-sm ${activeTab === 'jobs' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                onClick={() => setActiveTab('jobs')}
              >
                <FiBriefcase className="inline mr-2" /> Jobs & Applications
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6">
          {/* HR Users Tab */}
          {activeTab === 'hrUsers' && (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">HR Manager</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jobs Posted</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHrUsers.map(hr => (
                    <tr key={hr._id} className="hover:bg-gray-50 cursor-pointer">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
                            {(hr.name || '').charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{hr.name}</div>
                            <div className="text-sm text-gray-500">ID: {hr._id.substring(0, 8)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hr.email}</div>
                        {hr.phone && <div className="text-sm text-gray-500">{hr.phone}</div>}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {hr.jobCount || 0} Jobs
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {hr.lastActive ? new Date(hr.lastActive).toLocaleDateString() : 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => fetchHrData(hr._id)}
                          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-full text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                        >
                          View Details <FiChevronRight className="ml-1" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Jobs & Applications Tab */}
          {activeTab === 'jobs' && (
            <>
              <div className="flex justify-between items-center mb-4">
                <h5 className="text-lg font-medium text-gray-900">
                  Jobs Posted by {hrUsers.find(u => u._id === selectedHr)?.name}
                </h5>
                <div className="flex">
                  <div className="relative mr-2">
                    <button className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                      <FiFilter className="mr-1" /> Filter
                    </button>
                    {/* Dropdown menu would go here */}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {filteredJobs.length > 0 ? (
                  filteredJobs.map(job => (
                    <div key={job._id} className="border border-gray-200 rounded-lg">
                      <div 
                        className="p-4 cursor-pointer hover:bg-gray-50"
                        onClick={() => toggleJobExpansion(job._id)}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="text-lg font-medium text-gray-900">{job.title}</h5>
                          {job.companyName && (
                            <div className="inline-flex items-center px-2 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded">
                              <FaBuilding className="mr-1" />
                              <span>{job.companyName}</span>
                            </div>
                          )}
                          <div className="flex items-center">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded mr-2">
                              Active
                            </span>
                            <span className="text-gray-400">
                              {expandedJobId === job._id ? (
                                <FiChevronUp />
                              ) : (
                                <FiChevronDown />
                              )}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mb-2">
                          <FiMapPin className="mr-2 flex-shrink-0" />
                          <span className="truncate">{job.location}</span>
                        </div>
                        <div className="flex items-center text-gray-500 text-sm mb-3">
                          <FaRupeeSign className="mr-2 flex-shrink-0" />
                          <span>{job.salaryRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <div>
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                              <FiUsers className="mr-1" /> {applications.filter(app => app.jobId === job._id).length} applications
                            </span>
                          </div>
                          <div className="text-gray-500 text-sm">
                            <FiCalendar className="mr-1 inline" /> Posted: {new Date(job.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {/* Expanded Content - Both Job Details and Applications */}
                      {expandedJobId === job._id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="border-t border-gray-200"
                        >
                          <div className="p-4 border-b border-gray-200">
                            <div className="flex justify-between items-center mb-4">
                              <h6 className="text-md font-medium text-gray-900">Job Details</h6>
                              <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded">
                                Active
                              </span>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                              {/* Job Details */}
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FiMapPin />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Location</h6>
                                  <p className="text-sm text-gray-900">{job.location || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FaBuilding />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Company</h6>
                                  <p className="text-sm text-gray-900">{job.companyName || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FiBriefcase />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Job Type</h6>
                                  <p className="text-sm text-gray-900">{job.jobType || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FiUser />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Experience</h6>
                                  <p className="text-sm text-gray-900">{job.experience || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FaRupeeSign />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Salary Range</h6>
                                  <p className="text-sm text-gray-900">{job.salaryRange || 'Not specified'}</p>
                                </div>
                              </div>
                              <div className="flex">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 text-gray-800 flex items-center justify-center mr-3">
                                  <FiCalendar />
                                </div>
                                <div>
                                  <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Posted</h6>
                                  <p className="text-sm text-gray-900">
                                    {job.createdAt ? new Date(job.createdAt).toLocaleDateString() : 'Not specified'}
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Job Description */}
                            <div className="mb-6">
                              <h6 className="text-md font-medium text-gray-900 mb-2">Job Description</h6>
                              <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-gray-700">{job.descriptionText || 'No description provided'}</p>
                              </div>
                              {job.jobDescriptionFile && (
                                <button
                                  onClick={() => handleViewJD(job._id)}
                                  className="mt-2 inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                >
                                  <FiDownload className="mr-2" /> View Job Description File
                                </button>
                              )}
                            </div>

                            {/* Required Skills */}
                            {job.skillsRequired?.length > 0 && (
                              <div className="mb-6">
                                <h6 className="text-md font-medium text-gray-900 mb-2">Required Skills</h6>
                                <div className="flex flex-wrap gap-2">
                                  {job.skillsRequired.map((skill, index) => (
                                    <span key={index} className="inline-flex items-center px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded">
                                      {skill}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Share Job */}
                            {job.publicId && (
                              <div>
                                <h6 className="text-md font-medium text-gray-900 mb-2">Share This Job</h6>
                                <div className="flex">
                                  <input
                                    type="text"
                                    className="flex-1 min-w-0 block w-full px-3 py-2 border border-gray-300 rounded-l-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    value={`${window.location.origin}/jobs/${job.publicId}`}
                                    readOnly
                                  />
                                  <button
                                    onClick={() => {
                                      navigator.clipboard.writeText(`${window.location.origin}/jobs/${job.publicId}`);
                                      toast.success('Link copied to clipboard!');
                                    }}
                                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                  >
                                    <FiLink2 className="mr-1" /> Copy
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>

                          <div className="p-4">
                            <h6 className="text-md font-medium text-gray-900 mb-4">Applications for this job</h6>
                            {applications.filter(app => app.jobId === job._id).length > 0 ? (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {applications
                                  .filter(app => app.jobId === job._id)
                                  .map(app => (
                                    <div key={app._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center">
                                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mr-3">
                                            {app.candidateName.charAt(0).toUpperCase()}
                                          </div>
                                          <div>
                                            <h6 className="text-sm font-medium text-gray-900">{app.candidateName}</h6>
                                            <p className="text-xs text-gray-500">{app.candidateEmail}</p>
                                          </div>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded">
                                          New
                                        </span>
                                      </div>
                                      
                                      <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-sm text-gray-500">
                                          <FiCalendar className="mr-2 text-xs" />
                                          <span>Applied: {new Date(app.appliedAt).toLocaleDateString()}</span>
                                        </div>
                                        {app.candidatePhone && (
                                          <div className="flex items-center text-sm text-gray-500">
                                            <FiPhone className="mr-2 text-xs" />
                                            <span>{app.candidatePhone}</span>
                                          </div>
                                        )}
                                      </div>
                                      
                                      <div className="flex space-x-2">
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            openApplicationDetails(app);
                                          }}
                                          className="inline-flex items-center px-3 py-1 border border-blue-300 rounded-md text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100"
                                        >
                                          View Details
                                        </button>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            handleViewResume(app._id, app.candidateName);
                                          }}
                                          className="inline-flex items-center px-3 py-1 border border-green-300 rounded-md text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100"
                                        >
                                          <FiDownload className="mr-1" /> Resume
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            ) : (
                              <div className="text-center py-8">
                                <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-3">
                                  <FiUsers className="h-6 w-6" />
                                </div>
                                <h6 className="text-sm font-medium text-gray-900 mb-1">No applications yet</h6>
                                <p className="text-sm text-gray-500">This job hasn't received any applications yet.</p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 mb-4">
                      <FiBriefcase className="h-6 w-6" />
                    </div>
                    <h5 className="text-lg font-medium text-gray-900 mb-1">No jobs found</h5>
                    <p className="text-gray-500">This HR manager hasn't posted any jobs yet.</p>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Application Details Modal - Improved Design */}
      <AnimatePresence>
        {selectedApplication && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-2xl shadow-2xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modern Header with Gradient */}
              <div className="bg-gradient-to-r from-blue-700 to-indigo-900 p-6 relative">
                <div className="flex items-center w-full relative">
                  <div className="flex items-center justify-center w-14 h-14 mr-3 rounded-xl bg-white bg-opacity-20 text-white text-2xl font-semibold">
                    {selectedApplication.candidateName.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <h5 className="text-xl font-bold text-white mb-0">
                      {selectedApplication.candidateName}
                    </h5>
                    <span className="text-white text-opacity-90 text-sm">
                      Applied for: <span className="font-medium">{selectedApplication.jobTitle}</span>
                    </span>
                  </div>
                  <button 
                    type="button" 
                    className="rounded-full p-2 text-white text-opacity-80 hover:text-white hover:bg-white hover:bg-opacity-10 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-20"
                    onClick={closeModal}
                    aria-label="Close"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Refined Body Section */}
              <div className="bg-gray-50 p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Email Card - Modern Design */}
                  <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                    <div className="p-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-3">
                          <FiMail className="text-blue-600 text-lg" />
                        </div>
                        <div>
                          <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Email</h6>
                          <p className="text-gray-800 font-medium">{selectedApplication.candidateEmail}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Phone Card - Matching Style */}
                  {selectedApplication.candidatePhone && (
                    <div className="h-full bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300">
                      <div className="p-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-3">
                            <FiPhone className="text-green-600 text-lg" />
                          </div>
                          <div>
                            <h6 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1">Phone</h6>
                            <p className="text-gray-800 font-medium">{selectedApplication.candidatePhone}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Enhanced Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewResume(selectedApplication._id, selectedApplication.candidateName)}
                    className="w-full py-3 px-4 flex items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    <FiDownload className="mr-2 h-5 w-5" /> View Resume
                  </motion.button>
                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-3 px-4 flex items-center justify-center rounded-xl bg-white text-blue-500 font-medium border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <FiMail className="mr-2 h-5 w-5" /> Send Message
                  </motion.button>
                </div>
              </div>

              {/* Minimal Footer */}
              <div className="p-4 bg-gray-50 rounded-b-2xl">
                <motion.button 
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-4 py-2 rounded-lg text-gray-500 font-medium bg-white border border-gray-200 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  onClick={closeModal}
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

export default HRManagement;