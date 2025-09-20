import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileLines, 
  faChartBar, 
  faDownload, 
  faEye, 
  faFilter,
  faSearch,
  faCalendar,
  faUser,
  faBuilding,
  faSpinner
} from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user-specific reports on component mount
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get('/api/reports/user');
        if (response.data && response.data.success) {
          // Ensure we have an array and filter out any null/undefined reports
          const reportsData = Array.isArray(response.data.reports) ? response.data.reports : [];
          setReports(reportsData.filter(report => report !== null && report !== undefined));
        } else {
          setError('Failed to fetch reports: ' + (response.data?.error || 'Unknown error'));
        }
      } catch (err) {
        console.error('Error fetching reports:', err);
        // More detailed error handling
        if (err.response) {
          // Server responded with error status
          setError(`Server error ${err.response.status}: ${err.response.data?.error || err.response.statusText}`);
        } else if (err.request) {
          // Request was made but no response received
          setError('Network error: Unable to reach server. Please check your connection.');
        } else {
          // Something else happened
          setError('Error: ' + err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const filteredReports = reports.filter(report => {
    if (!report) return false;
    const candidate = report.candidate || '';
    const position = report.position || '';
    const email = report.email || '';
    const status = report.status || '';
    
    const matchesSearch = candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || (status && status.toLowerCase() === statusFilter);
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (status?.toLowerCase()) {
      case 'completed':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'processing':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'failed':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getScoreColor = (score) => {
    if (score === null || score === undefined) return 'text-gray-600 bg-gray-100';
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const handleDownloadReport = async (assessmentSessionId) => {
    try {
      if (!assessmentSessionId) {
        console.error('No assessment session ID provided');
        return;
      }
      
      const response = await axiosInstance.get(`/api/reports/${assessmentSessionId}`);
      if (response.data && response.data.success && response.data.url) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.setAttribute('download', ''); // Use empty string to let the server decide filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error('Failed to get download URL:', response.data);
      }
    } catch (error) {
      console.error('Error downloading report:', error);
      // Show user-friendly error message
      alert('Failed to download report. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" className="text-primary-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Reports</h3>
        <p className="text-red-600">{error}</p>
        <button 
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
          onClick={() => window.location.reload()}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <motion.div 
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            <FontAwesomeIcon icon={faFileLines} className="mr-3 text-primary-600" />
            My Assessment Reports
          </h2>
          <p className="text-gray-600">View and manage candidate assessment reports conducted by you</p>
        </div>
        <motion.button 
          className="btn-primary flex items-center gap-2 px-6 py-3"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
        >
          <FontAwesomeIcon icon={faDownload} />
          Refresh Reports
        </motion.button>
      </motion.div>

      {/* Filters Section */}
      <motion.div 
        className="card-glass"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="input-modern pl-10 w-full"
                placeholder="Search candidates, positions, or emails..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div className="md:w-48">
            <select 
              className="input-modern w-full"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
          
          {/* Date Filter */}
          <div className="md:w-48">
            <select 
              className="input-modern w-full"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Reports Table */}
      <motion.div 
        className="card-glass overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {filteredReports.length === 0 ? (
          <div className="text-center py-12">
            <FontAwesomeIcon icon={faFileLines} size="2x" className="text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Reports Found</h3>
            <p className="text-gray-500">You haven't conducted any assessments yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Candidate
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Score
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredReports.map((report, index) => (
                    <motion.tr 
                      key={report.id || index}
                      className="hover:bg-gray-50 transition-colors duration-200"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">
                              {report.candidate ? report.candidate.split(' ').map(n => n[0]).join('') : '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-gray-900">{report.candidate || 'Unknown Candidate'}</div>
                            <div className="text-xs text-gray-500">{report.email || 'N/A'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{report.position || 'N/A'}</div>
                          <div className="text-xs text-gray-500 flex items-center mt-1">
                            <FontAwesomeIcon icon={faBuilding} className="mr-1" />
                            {report.company || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex items-center">
                          <FontAwesomeIcon icon={faCalendar} className="mr-2 text-gray-400" />
                          {report.date ? new Date(report.date).toLocaleDateString() : 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-semibold ${getScoreColor(report.score)}`}>
                          {report.score !== null && report.score !== undefined ? `${report.score}%` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={getStatusBadge(report.status)}>
                          {report.status || 'Unknown'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <motion.button 
                            className="btn-modern bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 p-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="View Report"
                            onClick={() => handleDownloadReport(report.id)}
                            disabled={!report.id}
                          >
                            <FontAwesomeIcon icon={faEye} />
                          </motion.button>
                          <motion.button 
                            className="btn-modern bg-green-100 hover:bg-green-200 text-green-800 border-green-200 p-2"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            title="Download Report"
                            onClick={() => handleDownloadReport(report.id)}
                            disabled={!report.id}
                          >
                            <FontAwesomeIcon icon={faDownload} />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Showing 1 to {filteredReports.length} of {filteredReports.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button className="btn-ghost px-3 py-2 text-sm" disabled>
                    Previous
                  </button>
                  <button className="btn-modern bg-primary-600 text-white px-3 py-2 text-sm">
                    1
                  </button>
                  <button className="btn-ghost px-3 py-2 text-sm" disabled>
                    Next
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default Reports;