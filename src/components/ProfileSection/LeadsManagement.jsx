import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FiDownload, FiRefreshCw, FiUsers, FiMail, FiPhone, FiBriefcase,
  FiCalendar, FiExternalLink, FiAlertCircle
} from 'react-icons/fi';
import { Button } from '../ui/Button';
import { Card, CardContent } from '../ui/Card';
import { Badge } from '../ui/Badge';
import axios from 'axios';

const LeadsManagement = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadUrl, setDownloadUrl] = useState('');
  const [error, setError] = useState('');
  const [stats, setStats] = useState({
    total: 0,
    today: 0,
    thisWeek: 0,
  });

  // Fetch leads from backend
  const fetchLeads = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get('/api/leads');
      if (response.data.success) {
        setLeads(response.data.data);
        calculateStats(response.data.data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
      setError('Failed to fetch leads. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get download link for Excel file
  const getDownloadLink = async () => {
    try {
      const response = await axios.get('/api/leads/download-link');
      if (response.data.success) {
        setDownloadUrl(response.data.downloadUrl);
      }
    } catch (err) {
      console.error('Error getting download link:', err);
      setError('Failed to generate download link.');
    }
  };

  // Calculate statistics
  const calculateStats = (leadsData) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);

    const todayCount = leadsData.filter(lead => {
      const leadDate = new Date(lead['Date/Time']);
      return leadDate >= today;
    }).length;

    const weekCount = leadsData.filter(lead => {
      const leadDate = new Date(lead['Date/Time']);
      return leadDate >= weekAgo;
    }).length;

    setStats({
      total: leadsData.length,
      today: todayCount,
      thisWeek: weekCount,
    });
  };

  // Download Excel file
  const handleDownload = () => {
    if (downloadUrl) {
      window.open(downloadUrl, '_blank');
    }
  };

  useEffect(() => {
    fetchLeads();
    getDownloadLink();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-gray-900 mb-2">Leads Management</h1>
            <p className="text-gray-600">View and manage all lead submissions</p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={fetchLeads}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiRefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              onClick={handleDownload}
              disabled={!downloadUrl}
              className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white"
            >
              <FiDownload className="w-4 h-4" />
              Download Excel
            </Button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600 font-semibold mb-1">Total Leads</p>
                <p className="text-3xl font-black text-blue-900">{stats.total}</p>
              </div>
              <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center">
                <FiUsers className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600 font-semibold mb-1">Today</p>
                <p className="text-3xl font-black text-green-900">{stats.today}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <FiCalendar className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-600 font-semibold mb-1">This Week</p>
                <p className="text-3xl font-black text-purple-900">{stats.thisWeek}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <FiBriefcase className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Error Message */}
      {error && (
        <div className="max-w-7xl mx-auto mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <FiAlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Download Link Card */}
      {downloadUrl && (
        <div className="max-w-7xl mx-auto mb-6">
          <Card className="bg-gradient-to-r from-cyan-50 to-blue-50 border-cyan-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FiExternalLink className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Shareable Download Link</p>
                    <p className="text-sm text-gray-600">Valid for 7 days - Share with team members</p>
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(downloadUrl);
                    alert('Link copied to clipboard!');
                  }}
                  variant="outline"
                  size="sm"
                >
                  Copy Link
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Leads Table */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <FiRefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-4" />
                <p className="text-gray-600">Loading leads...</p>
              </div>
            ) : leads.length === 0 ? (
              <div className="p-12 text-center">
                <FiUsers className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg font-semibold mb-2">No leads yet</p>
                <p className="text-gray-500 text-sm">Lead submissions will appear here</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Date/Time
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Service Interest
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {leads.map((lead, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-900">
                            <FiCalendar className="w-4 h-4 text-gray-400" />
                            {lead['Date/Time']}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                              {lead.Name.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-semibold text-gray-900">{lead.Name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiMail className="w-4 h-4 text-gray-400" />
                            {lead.Email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiPhone className="w-4 h-4 text-gray-400" />
                            {lead.Contact}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-sm text-gray-700">
                            <FiBriefcase className="w-4 h-4 text-gray-400" />
                            <span className="max-w-xs truncate">{lead.Service}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            className={`${
                              lead.Status === 'New'
                                ? 'bg-green-100 text-green-800 border-green-200'
                                : 'bg-gray-100 text-gray-800 border-gray-200'
                            }`}
                          >
                            {lead.Status}
                          </Badge>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LeadsManagement;
