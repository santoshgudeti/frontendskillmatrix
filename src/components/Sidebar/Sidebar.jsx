import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faHome,
  faUsers,
  faFileLines,
  faClock,
  faGear,
  faRightFromBracket,
  faCalendarPlus,
  faCalendarCheck,
  faChartBar,
  faUser,
  faBars,
  faXmark,
  faAngleLeft,
  faAngleRight
} from '@fortawesome/free-solid-svg-icons';
import { motion, AnimatePresence } from 'framer-motion';

function Sidebar({ onLogout, onSidebarToggle, collapsed: propCollapsed, isMobile: propIsMobile, mobileMenuOpen: propMobileMenuOpen, isAdmin }) {
  const location = useLocation();
  const currentPath = location.pathname;
  const [isCollapsed, setIsCollapsed] = useState(propCollapsed || false);
  const [isMobile, setIsMobile] = useState(propIsMobile || false);
  const [isActive, setIsActive] = useState(propMobileMenuOpen || false);
  const sidebarRef = useRef(null);

  // Sync with props
  useEffect(() => {
    setIsCollapsed(propCollapsed || false);
  }, [propCollapsed]);

  useEffect(() => {
    setIsMobile(propIsMobile || false);
  }, [propIsMobile]);

  useEffect(() => {
    setIsActive(propMobileMenuOpen || false);
  }, [propMobileMenuOpen]);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobile && isActive && sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        setIsActive(false);
        onSidebarToggle && onSidebarToggle(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobile, isActive, onSidebarToggle]);

  // Enhanced mobile check with proper prop synchronization
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Changed to lg breakpoint
      if (mobile !== isMobile) {
        setIsMobile(mobile);
        if (mobile) {
          setIsCollapsed(false);
          setIsActive(false);
        } else {
          setIsActive(false);
        }
      }
    };

    // Only add listener if not controlled by parent
    if (propIsMobile === undefined) {
      checkMobile();
      window.addEventListener('resize', checkMobile);
      return () => window.removeEventListener('resize', checkMobile);
    }
  }, [isMobile, propIsMobile]);

  // Function to determine if a link is active
  const isLinkActive = (path) => {
    if (path === '/dashboard' && currentPath === '/dashboard') return true;
    if (path !== '/dashboard' && currentPath.startsWith(path)) return true;
    return false;
  };

  // Toggle sidebar state
  const toggleSidebar = () => {
    if (isMobile) {
      const newActive = !isActive;
      setIsActive(newActive);
      // Call parent handler for mobile menu toggle
      onSidebarToggle && onSidebarToggle(newActive);
    } else {
      const newCollapsed = !isCollapsed;
      setIsCollapsed(newCollapsed);
      onSidebarToggle && onSidebarToggle(newCollapsed);
    }
  };

  // Get toggle icon based on state
  const getToggleIcon = () => {
    if (isMobile) {
      return isActive ? faXmark : faBars;
    } else {
      return isCollapsed ? faAngleRight : faAngleLeft;
    }
  };

  // Flattened navigation items for regular users
  const userNavItems = [
    { to: '/dashboard', icon: faHome, text: 'Dashboard', exact: true },
    { to: '/dashboard/candidates', icon: faUsers, text: 'All Candidates' },
    { to: '/dashboard/upload', icon: faFileLines, text: 'Upload Resumes' },
    { to: '/dashboard/response', icon: faChartBar, text: 'Evaluation Results' },
    { to: '/dashboard/schedule-test', icon: faCalendarPlus, text: 'Schedule Test' },
    { to: '/dashboard/scheduled-tests', icon: faCalendarCheck, text: 'Scheduled Tests' },
    { to: '/dashboard/reports', icon: faFileLines, text: 'Reports' },
    { to: '/dashboard/history', icon: faClock, text: 'History' },
    { to: '/dashboard/user', icon: faUser, text: 'Profile' }
  ];

  // Navigation items for admin users
  const adminNavItems = [
    { to: '/dashboard/admin', icon: faHome, text: 'Admin Dashboard', exact: true },
    { to: '/dashboard/admin/users', icon: faUsers, text: 'User Management' },
    { to: '/dashboard/admin/pending', icon: faClock, text: 'Pending Approvals' },
    { to: '/dashboard/upload', icon: faFileLines, text: 'Upload Resumes' },
    { to: '/dashboard/response', icon: faChartBar, text: 'Evaluation Results' },
    { to: '/dashboard/schedule-test', icon: faCalendarPlus, text: 'Schedule Test' },
    { to: '/dashboard/scheduled-tests', icon: faCalendarCheck, text: 'Scheduled Tests' },
    { to: '/dashboard/reports', icon: faFileLines, text: 'Reports' },
    { to: '/dashboard/history', icon: faClock, text: 'History' },
    { to: '/dashboard/user', icon: faUser, text: 'Profile' }
  ];

  // Select navigation items based on user role
  const navItems = isAdmin ? adminNavItems : userNavItems;

  const sidebarVariants = {
    expanded: { 
      width: isCollapsed ? '5rem' : '16rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    },
    collapsed: { 
      width: '5rem',
      transition: { duration: 0.3, ease: 'easeInOut' }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    }
  };

  const textVariants = {
    hidden: { opacity: 0, scale: 0.8, x: -10 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      x: 0,
      transition: { duration: 0.2, ease: 'easeOut' }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8, 
      x: -10,
      transition: { duration: 0.15, ease: 'easeIn' }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isMobile && isActive && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleSidebar}
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
      
      {/* Sidebar */}
      <motion.aside 
        ref={sidebarRef}
        className={`sidebar fixed left-0 top-0 h-screen z-50 backdrop-blur-lg border-r border-gray-200 overflow-hidden ${
          isMobile 
            ? `lg:relative lg:translate-x-0 ${isActive ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : isCollapsed ? 'w-20' : 'w-64'
        }`}
        style={{
          background: 'linear-gradient(165deg, #ffffff 0%, #f9fafb 100%)',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
        }}
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        role="navigation"
        aria-label="Main navigation"
        aria-expanded={!isCollapsed}
      >
        {/* Header Section */}
        <div className="relative p-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <AnimatePresence mode="wait">
              {!isCollapsed && (
                <motion.div 
                  className="flex items-center space-x-3"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-sm">
                    <span className="text-xl font-bold text-white">S</span>
                  </div>
                  <h1 className="text-xl font-bold text-gray-800 tracking-tight">
                    SkillMatrix
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>
            
            {/* Toggle Button */}
            <motion.button
              className={`relative w-9 h-9 rounded-lg bg-gray-100 text-gray-600 flex items-center justify-center hover:bg-gray-200 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none ${
                isCollapsed ? 'mx-auto' : ''
              }`}
              onClick={toggleSidebar}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-expanded={!isCollapsed}
              aria-controls="main-navigation"
            >
              <FontAwesomeIcon 
                icon={getToggleIcon()} 
                className="text-sm" 
                aria-hidden="true"
              />
            </motion.button>
          </div>
        </div>
        
        {/* Navigation Menu */}
        <nav className="flex-1 py-4 overflow-y-auto" id="main-navigation" aria-label="Main navigation menu">
          <motion.ul 
            className="space-y-1 px-3"
            variants={{ visible: { transition: { staggerChildren: 0.02 } } }}
            initial="hidden"
            animate="visible"
            role="menubar"
            aria-orientation="vertical"
          >
            {navItems.map((item, index) => {
              const isActiveLink = item.exact 
                ? (currentPath === item.to)
                : (item.to !== '/dashboard' && currentPath.startsWith(item.to));
              
              return (
                <motion.li 
                  key={item.to} 
                  variants={itemVariants} 
                  role="none"
                  className="mb-1"
                >
                  <Link
                    to={item.to}
                    className={`group relative flex items-center rounded-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:outline-none overflow-hidden ${
                      isCollapsed 
                        ? 'p-3 mx-1 justify-center' 
                        : 'px-4 py-3 mx-1'
                    } ${
                      isActiveLink 
                        ? 'bg-blue-50 text-blue-700 font-medium' 
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                    onClick={() => {
                      if (isMobile) {
                        setIsActive(false);
                        onSidebarToggle && onSidebarToggle(false);
                      }
                    }}
                    role="menuitem"
                    aria-current={isActiveLink ? 'page' : undefined}
                  >
                    {/* Active indicator */}
                    {isActiveLink && (
                      <motion.div 
                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full"
                        layoutId="activeIndicator"
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                    
                    {/* Icon Container */}
                    <div className={`relative flex items-center justify-center flex-shrink-0 ${
                      isCollapsed ? 'w-6 h-6' : 'w-6 h-6'
                    }`}>
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className={`transition-all duration-200 ${
                          isCollapsed ? 'text-lg' : 'text-base'
                        } ${
                          isActiveLink 
                            ? 'text-blue-600' 
                            : 'text-gray-500 group-hover:text-gray-700'
                        }`}
                        aria-hidden="true"
                      />
                    </div>
                    
                    {/* Text Label */}
                    <AnimatePresence mode="wait">
                      {!isCollapsed && (
                        <motion.span 
                          className="ml-3 font-medium text-sm truncate flex-1"
                          variants={textVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                        >
                          {item.text}
                        </motion.span>
                      )}
                    </AnimatePresence>
                    
                    {/* Tooltip for Collapsed State */}
                    {isCollapsed && (
                      <div className="absolute left-full ml-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg whitespace-nowrap z-50 shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        <div className="relative">
                          {item.text}
                          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-1 w-2 h-2 bg-gray-900 rotate-45" />
                        </div>
                      </div>
                    )}
                  </Link>
                </motion.li>
              );
            })}
            
            {/* Logout Button */}
            <motion.li 
              variants={itemVariants} 
              className="mt-6 pt-6 border-t border-gray-200" 
              role="none"
            >
             
            </motion.li>
          </motion.ul>
        </nav>
        
        {/* Bottom Accent */}
        <div className="h-1 bg-gradient-to-r from-blue-500 to-indigo-600" />
      </motion.aside>
    </>
  );
}

export default Sidebar;