
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaSave, FaArrowLeft, FaTrash } from 'react-icons/fa';
import { axiosInstance } from '../../axiosUtils';
import { confirmAlert } from 'react-confirm-alert';
import "./Admin.css"

const AdminUserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobileNumber: '',
    companyName: '',
    designation: '',
    isApproved: false,
    isUnlimited: false,
    trialEnd: ''
  });

  const [subscriptionData, setSubscriptionData] = useState({
    plan: 'trial',
    months: 1
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/admin/users/${id}`, { withCredentials: true });
        setUser(res.data.user);
        
        setFormData({
          fullName: res.data.user.fullName,
          email: res.data.user.email,
          mobileNumber: res.data.user.mobileNumber,
          companyName: res.data.user.companyName,
          designation: res.data.user.designation,
          isApproved: res.data.user.isApproved,
          isUnlimited: res.data.user.isUnlimited,
          trialEnd: res.data.user.trialEnd ? new Date(res.data.user.trialEnd).toISOString().split('T')[0] : ''
        });

        setSubscriptionData({
          plan: res.data.user.subscription?.plan || 'trial',
          months: 1
        });

        setLoading(false);
      } catch (error) {
        toast.error(error.response?.data?.message || 'Failed to fetch user');
        setLoading(false);
        navigate('/dashboard/admin');
      }
    };
    fetchUser();
  }, [id, navigate]);


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

const handleDelete = async () => {
  confirmAlert({
    title: 'Delete User',
    message: 'Are you sure you want to delete this user? This action cannot be undone.',
    buttons: [
      {
        label: 'Yes',
        onClick: async () => {
          try {
            await axiosInstance.delete(
              `/admin/delete-user/${id}`,
              { withCredentials: true }
            );
            toast.success('User deleted successfully');
            navigate('/dashboard/admin');
          } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
          }
        }
      },
      { label: 'No' }
    ]
  });
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axiosInstance.put(
        `/admin/update-user/${id}`,
        formData,
        { withCredentials: true }
      );
      toast.success('User updated successfully');
      setUser(res.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update user');
    }
  };
// Update handleSubscriptionUpdate to send months
const handleSubscriptionUpdate = async () => {
  confirmAlert({
    title: 'Update Subscription',
    message: `Are you sure you want to change the subscription to ${subscriptionData.plan} plan?`,
    buttons: [
      {
        label: 'Yes',
        onClick: async () => {
          try {
            await axiosInstance.put(
              `/admin/update-subscription/${id}`,
              {
                plan: subscriptionData.plan,
                months: subscriptionData.months
              },
              { withCredentials: true }
            );
            toast.success('Subscription updated successfully');
          } catch (error) {
            toast.error('Failed to update subscription');
          }
        }
      },
      { label: 'No' }
    ]
  });
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto mt-6 p-4">
      <Link
        to="/dashboard/admin"
        className="mb-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
      >
        <FaArrowLeft className="mr-2" /> Back to Admin Dashboard
      </Link>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="border-b border-gray-200 pb-4 mb-6">
          <h4 className="text-2xl font-bold text-gray-900">User Management: {user.fullName}</h4>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={formData.mobileNumber}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation</label>
              <input
                type="text"
                name="designation"
                value={formData.designation}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Account Status</label>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isApproved"
                  name="isApproved"
                  checked={formData.isApproved}
                  onChange={handleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isApproved" className="ml-2 block text-sm text-gray-900">
                  {formData.isApproved ? 'Approved' : 'Pending Approval'}
                </label>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
            <div className="border-b border-gray-200 pb-4 mb-4">
              <h5 className="text-lg font-medium text-gray-900">Subscription Management</h5>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                <select 
                  value={subscriptionData.plan}
                  onChange={(e) => setSubscriptionData({
                    ...subscriptionData, 
                    plan: e.target.value,
                    months: e.target.value === 'paid' ? subscriptionData.months : 1
                  })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                >
                  <option value="trial">Trial</option>
                  <option value="free">Free</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              
              {subscriptionData.plan === 'paid' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (months)</label>
                  <select 
                    value={subscriptionData.months}
                    onChange={(e) => setSubscriptionData({
                      ...subscriptionData, 
                      months: parseInt(e.target.value)
                    })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="1">1 Month</option>
                    <option value="3">3 Months</option>
                    <option value="6">6 Months</option>
                    <option value="12">12 Months</option>
                  </select>
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-900 mb-1">
                  <strong>Current Status:</strong> {user.subscription.isActive ? 'Active' : 'Inactive'}
                </p>
                {user.subscription.expiresAt && (
                  <p className="text-sm text-gray-900 mb-1">
                    <strong>Expires:</strong> {new Date(user.subscription.expiresAt).toLocaleDateString()}
                  </p>
                )}
              </div>
              
              <button
                type="button"
                onClick={handleSubscriptionUpdate}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Update Subscription
              </button>
            </div>
          </div>

          <div className="flex mt-6 space-x-3">
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <FaSave className="mr-2" /> Save Changes
            </button>
            
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <FaTrash className="mr-2" /> Delete User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminUserDetail;
