import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBell, faSearch } from "@fortawesome/free-solid-svg-icons";
import { axiosInstance } from "../../axiosUtils";

function Header({ onResponseSubmit, isMobile, onToggleSidebar, sidebarCollapsed }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get('/user', { withCredentials: true });
        setUser(res.data.user);
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const getPageTitle = () => {
    if (currentPath === "/dashboard") return "Dashboard";
    if (currentPath === "/dashboard/upload") return "AI Matching";
    if (currentPath === "/dashboard/candidates") return "Talent Workspace";
    if (currentPath === "/dashboard/schedule-test") return "Schedule Test";
    if (currentPath === "/dashboard/scheduled-tests") return "Scheduled Tests";
    if (currentPath === "/dashboard/response") return "Evaluation Results";
    if (currentPath === "/dashboard/reports") return "Reports";
    if (currentPath === "/dashboard/history") return "History";
    if (currentPath === "/dashboard/settings") return "Settings";
    if (currentPath.startsWith("/dashboard/user")) return "User Profile";
    return "Dashboard";
  };

  if (loading) {
    return (
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
          <div className="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <motion.header 
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-30"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="banner"
    >
      <div className="px-4 md:px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Mobile Menu Button & Page Title Container */}
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Mobile Menu Button */}
            {isMobile && (
              <motion.button
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none lg:hidden flex-shrink-0"
                onClick={onToggleSidebar}
                aria-label="Toggle navigation menu"
                aria-expanded={false}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <svg 
                  className="w-6 h-6 text-gray-700" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              </motion.button>
            )}
            
            {/* Page Title */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex-1 min-w-0"
            >
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 truncate">
                {getPageTitle()}
              </h1>
            </motion.div>
          </div>

          {/* Right Section */}
          <motion.div 
            className="flex items-center gap-2 md:gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Search - Hidden on mobile */}
            {!isMobile && (
              <div className="relative hidden lg:block">
                <label htmlFor="global-search" className="sr-only">
                  Search across the application
                </label>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" aria-hidden="true" />
                </div>
                <input
                  id="global-search"
                  type="text"
                  className="input-modern pl-10 w-64 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Search..."
                  aria-label="Search across the application"
                  role="searchbox"
                />
              </div>
            )}

            {/* Mobile Search Button */}
            {isMobile && (
              <button 
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                aria-label="Open search"
                onClick={() => {
                  // TODO: Implement mobile search modal
                  console.log('Mobile search clicked');
                }}
              >
                <FontAwesomeIcon icon={faSearch} className="text-gray-600 text-lg" aria-hidden="true" />
              </button>
            )}

            {/* Notifications */}
            <button 
              className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none"
              aria-label="View notifications (1 unread)"
              onClick={() => {
                // TODO: Implement notifications panel
                console.log('Notifications clicked');
              }}
            >
              <FontAwesomeIcon icon={faBell} className="text-gray-600 text-lg" aria-hidden="true" />
              <span 
                className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" 
                aria-hidden="true"
              ></span>
              <span className="sr-only">You have 1 unread notification</span>
            </button>

            {/* User Profile */}
            <Link 
              to="/dashboard/user" 
              className="flex items-center gap-2 md:gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="View user profile"
            >
              <div className="w-8 h-8 bg-primary-gradient rounded-full flex items-center justify-center flex-shrink-0">
                <FontAwesomeIcon icon={faUser} className="text-white text-sm" />
              </div>
              {!isMobile && (
                <div className="hidden md:block text-left min-w-0">
                  <span className="text-sm font-semibold text-gray-900 block truncate">
                    {user?.fullName || 'User'}
                  </span>
                  <div className="text-xs text-gray-500 truncate max-w-[120px]">
                    {user?.email}
                  </div>
                </div>
              )}
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.header>
  );
}

export default Header;