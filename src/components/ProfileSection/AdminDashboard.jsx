import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import { 
  FaEdit, FaSave, FaTrash, FaCheck, FaTimes, 
  FaUsers, FaUserClock, FaUserCheck, FaUserShield,
  FaChartPie, FaList, FaUserCog, FaSignOutAlt, FaUserTie
} from 'react-icons/fa';
import { axiosInstance } from '../../axiosUtils';
import HRManagement from './HRManagement';

import "./Admin.css"

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();

  // Add this effect to sync activeTab with current route
  const location = useLocation();
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    setActiveTab(path || 'dashboard');
  }, [location]);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get('/admin/dashboard', { withCredentials: true });
        setUsers(res.data.users);
        setPendingUsers(res.data.pendingUsers);
        setStats(res.data.stats);
        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch dashboard data');
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const handleLogout = async () => {
    try {
      await axiosInstance.post('/logout', {}, { withCredentials: true });
      navigate('/login');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  // Add this helper function
  const getAccessDisplay = (user) => {
    if (user.isAdmin) return 'Admin (Unlimited)';
    
    if (user.subscription.plan === 'paid') {
      return `Paid until ${new Date(user.subscription.expiresAt).toLocaleDateString()}`;
    }
    
    if (user.subscription.plan === 'free') {
      return 'Free (Unlimited)';
    }
    
    // For trial users
    return `Trial until ${new Date(user.subscription.expiresAt).toLocaleDateString()}`;
  };
  
  const handleApproveUser = async (userId) => {
    confirmAlert({
      title: 'Approve User',
      message: 'Are you sure you want to approve this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await axiosInstance.post(
                `/admin/approve-user/${userId}`,
                {},
                { withCredentials: true }
              );
              toast.success(res.data.message);
              // Update the user list
              const updatedPending = pendingUsers.filter(u => u._id !== userId);
              const approvedUser = pendingUsers.find(u => u._id === userId);
              setPendingUsers(updatedPending);
              setUsers([...users, { ...approvedUser, isApproved: true }]);
              // Update stats
              setStats({
                ...stats,
                pendingApproval: updatedPending.length,
                activeUsers: stats.activeUsers + 1
              });
            } catch (error) {
              toast.error(error.response?.data?.message || 'Failed to approve user');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const handleRejectUser = (userId) => {
    confirmAlert({
      title: 'Reject User',
      message: 'Are you sure you want to reject this user?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              const res = await axiosInstance.delete(
                `/admin/delete-user/${userId}`,
                { withCredentials: true }
              );
              toast.success(res.data.message);
              const updatedPending = pendingUsers.filter(u => u._id !== userId);
              setPendingUsers(updatedPending);
              setStats({
                ...stats,
                pendingApproval: updatedPending.length
              });
            } catch (error) {
              toast.error(error.response?.data?.message || 'Failed to reject user');
            }
          }
        },
        { label: 'No' }
      ]
    });
  };

  const DashboardHome = () => (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-blue-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUsers className="text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-medium">Total Users</h3>
              <p className="text-3xl font-bold">
                {stats?.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUserClock className="text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-medium">Pending Approval</h3>
              <p className="text-3xl font-bold">
                {stats?.pendingApproval || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-green-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUserCheck className="text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-medium">Active Users</h3>
              <p className="text-3xl font-bold">
                {stats?.activeUsers || 0}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-red-500 text-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <FaUserShield className="text-2xl mr-4" />
            <div>
              <h3 className="text-lg font-medium">Admin Users</h3>
              <p className="text-3xl font-bold">
                {stats?.adminUsers || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {pendingUsers.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="bg-yellow-500 text-white px-6 py-4 rounded-t-lg">
            <div className="flex items-center">
              <FaUserClock className="text-xl mr-2" />
              <h2 className="text-xl font-semibold">Users Pending Approval</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {pendingUsers.map(user => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.companyName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleApproveUser(user._id)}
                          className="mr-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FaCheck className="mr-1" /> Approve
                        </button>
                        <button
                          onClick={() => handleRejectUser(user._id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
                        >
                          <FaTimes className="mr-1" /> Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="bg-blue-500 text-white px-6 py-4 rounded-t-lg">
          <div className="flex items-center">
            <FaUsers className="text-xl mr-2" />
            <h2 className="text-xl font-semibold">All Users</h2>
          </div>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Access Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map(user => (
                  <tr key={user._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.companyName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {user.isApproved ? (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Approved
                        </span>
                      ) : (
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getAccessDisplay(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <Link
                        to={`/dashboard/admin/users/${user._id}`}
                        className="bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded text-sm flex items-center w-fit"
                      >
                        <FaUserCog className="mr-1" /> Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-6">
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
            >
              <FaSignOutAlt className="mr-2" /> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const UserManagement = () => (
    <div>
      <h2 className="text-2xl font-bold mb-4">User Management</h2>
      {/* Your existing user management table */}
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex">
      {/* Main Content */}
      <div className="flex-1 p-5">
        <nav className="bg-gray-100 rounded-lg mb-6">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="text-xl font-bold text-gray-800">Admin Dashboard</div>
              <Link
                to="hr-management"
                className={`px-4 py-2 rounded-lg flex items-center ${
                  activeTab === 'hr-management' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
                onClick={() => setActiveTab('hr-management')}
              >
                <FaUserTie className="mr-2" /> HR Management
              </Link>
            </div>
          </div>
        </nav>

        <div className="container mx-auto">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="dashboard" element={<DashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="hr-management" element={<HRManagement />} />
            <Route path="/pending" element={
              <div className="bg-white rounded-lg shadow">
                <div className="bg-yellow-500 text-white px-6 py-4 rounded-t-lg">
                  <div className="flex items-center">
                    <FaUserClock className="text-xl mr-2" />
                    <h2 className="text-xl font-semibold">Pending Approvals</h2>
                  </div>
                </div>
                <div className="p-6">
                  {pendingUsers.length === 0 ? (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-blue-800">No users pending approval</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {pendingUsers.map(user => (
                            <tr key={user._id}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.fullName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.companyName}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm">
                                <button
                                  onClick={() => handleApproveUser(user._id)}
                                  className="mr-2 bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                >
                                  <FaCheck className="mr-1" /> Approve
                                </button>
                                <button
                                  onClick={() => handleRejectUser(user._id)}
                                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm flex items-center"
                                >
                                  <FaTimes className="mr-1" /> Reject
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;