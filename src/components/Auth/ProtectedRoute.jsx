import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { axiosInstance } from '../../axiosUtils';

const ProtectedRoute = ({ children, isAdmin }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axiosInstance.get('/user', { withCredentials: true });
        setIsAuthenticated(true);
        setUser(res.data.user);
        // Store user data in localStorage for easy access
        localStorage.setItem('user', JSON.stringify(res.data.user));
      } catch (error) {
        console.log("Auth check failed:", error.response?.data || error.message);
        setIsAuthenticated(false);
        // Clear user data on auth failure
        localStorage.removeItem('user');
      }
    };
    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/login" />;
  }

  // If this route requires admin access but user is not admin
  if (isAdmin && !user?.isAdmin) {
    return <Navigate to="/dashboard/user" />;
  }

  // If user is admin but trying to access regular user routes, redirect to admin dashboard
  if (user?.isAdmin && !isAdmin && window.location.pathname.startsWith('/dashboard/user')) {
    return <Navigate to="/dashboard/admin" />;
  }

  return children;
};

export default ProtectedRoute;