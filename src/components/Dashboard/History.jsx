import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faChartBar, 
  faUser, 
  faBuilding, 
  faSearch,
  faFilter,
  faCalendar,
  faHistory,
  faEye,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import { axiosInstance } from '../../axiosUtils';
import { useMediaOperations } from '../../hooks/useMediaOperations';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();

  // Enhanced placeholder data
  const historyItems = [
    {
      id: 1,
      candidate: 'John Doe',
      email: 'john.doe@email.com',
      position: 'Frontend Developer',
      date: '2023-05-15',
      time: '14:30',
      score: 85,
      type: 'Assessment',
      duration: '45 min',
      company: 'Tech Corp',
      status: 'Completed'
    },
    {
      id: 2,
      candidate: 'Jane Smith',
      email: 'jane.smith@email.com',
      position: 'Backend Developer',
      date: '2023-05-14',
      time: '10:15',
      score: 92,
      type: 'Scheduled Test',
      duration: '60 min',
      company: 'Digital Solutions',
      status: 'Completed'
    },
    {
      id: 3,
      candidate: 'Robert Johnson',
      email: 'robert.johnson@email.com',
      position: 'Full Stack Developer',
      date: '2023-05-12',
      time: '16:45',
      score: 78,
      type: 'Assessment',
      duration: '50 min',
      company: 'StartupXYZ',
      status: 'Completed'
    },
    {
      id: 4,
      candidate: 'Emily Davis',
      email: 'emily.davis@email.com',
      position: 'UI/UX Designer',
      date: '2023-05-10',
      time: '11:20',
      score: 88,
      type: 'Scheduled Test',
      duration: '40 min',
      company: 'Creative Agency',
      status: 'Completed'
    },
    {
      id: 5,
      candidate: 'Michael Brown',
      email: 'michael.brown@email.com',
      position: 'Data Scientist',
      date: '2023-05-08',
      time: '09:30',
      score: 94,
      type: 'Assessment',
      duration: '70 min',
      company: 'Data Corp',
      status: 'Completed'
    }
  ];

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.candidate.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || item.type.toLowerCase().includes(typeFilter.toLowerCase());
    return matchesSearch && matchesType;
  });

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'assessment':
        return faChartBar;
      case 'scheduled test':
        return faClock;
      default:
        return faHistory;
    }
  };

  const getTypeBadge = (type) => {
    const baseClasses = "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
    switch (type.toLowerCase()) {
      case 'assessment':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'scheduled test':
        return `${baseClasses} bg-purple-100 text-purple-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600 bg-green-100';
    if (score >= 80) return 'text-blue-600 bg-blue-100';
    if (score >= 70) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
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
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary-gradient rounded-xl flex items-center justify-center text-white">
                  <FontAwesomeIcon icon={faHistory} className="text-xl" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                    Assessment History
                  </h1>
                  <p className="text-gray-600 mt-1">Track and review all assessment activities</p>
                </div>
              </div>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-3">
                <select 
                  className="input-modern min-w-[140px]"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                >
                  <option value="all">All Time</option>
                  <option value="30">Last 30 Days</option>
                  <option value="7">Last 7 Days</option>
                </select>
                <select 
                  className="input-modern min-w-[140px]"
                  value={typeFilter}
                  onChange={(e) => setTypeFilter(e.target.value)}
                >
                  <option value="all">All Types</option>
                  <option value="assessment">Assessment</option>
                  <option value="scheduled">Scheduled Test</option>
                </select>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Section */}
        <motion.div 
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="card-glass p-4">
            <div className="relative max-w-md">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="input-modern pl-10"
                placeholder="Search by candidate, position, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* History Cards */}
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                className="card-glass group hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                    {/* Candidate Info */}
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-xl flex items-center justify-center">
                        <FontAwesomeIcon icon={faUser} className="text-primary-600 text-lg" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          {item.candidate}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faBuilding} className="text-gray-400" />
                            {item.company}
                          </span>
                          <span className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faUser} className="text-gray-400" />
                            {item.position}
                          </span>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">{item.email}</p>
                      </div>
                    </div>

                    {/* Assessment Details */}
                    <div className="flex flex-wrap items-center gap-4">
                      {/* Type Badge */}
                      <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={getTypeIcon(item.type)} className="text-gray-400" />
                        <span className={getTypeBadge(item.type)}>
                          {item.type}
                        </span>
                      </div>

                      {/* Score */}
                      <div className="text-center">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${getScoreColor(item.score)}`}>
                          <FontAwesomeIcon icon={faTrophy} className="mr-2" />
                          {item.score}%
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Score</p>
                      </div>

                      {/* Date & Time */}
                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-900">{item.date}</div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <FontAwesomeIcon icon={faClock} />
                          {item.time} • {item.duration}
                        </div>
                      </div>

                      {/* Action Button */}
                      <button className="btn-modern bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 text-sm font-medium group-hover:scale-105 transition-transform duration-200">
                        <FontAwesomeIcon icon={faEye} className="mr-2" />
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div 
              className="card-glass text-center py-12"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <FontAwesomeIcon icon={faHistory} className="text-gray-400 text-2xl" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No History Found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || typeFilter !== 'all' || dateFilter !== 'all' 
                  ? 'No assessments match your current filters.' 
                  : 'No assessment history available yet.'}
              </p>
              {(searchTerm || typeFilter !== 'all' || dateFilter !== 'all') && (
                <button 
                  className="btn-outline"
                  onClick={() => {
                    setSearchTerm('');
                    setTypeFilter('all');
                    setDateFilter('all');
                  }}
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </motion.div>

        {/* Pagination */}
        {filteredItems.length > 0 && (
          <motion.div 
            className="mt-8 flex justify-between items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="text-sm text-gray-600">
              Showing {filteredItems.length} of {historyItems.length} entries
            </div>
            <div className="flex gap-2">
              <button className="btn-ghost px-4 py-2 text-sm" disabled>
                Previous
              </button>
              <button className="btn-modern bg-primary-600 text-white px-3 py-2 text-sm">
                1
              </button>
              <button className="btn-ghost px-4 py-2 text-sm" disabled>
                Next
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default History;