import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import SMlogo from "../../assets/SMlogo.png";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMoreDropdownOpen, setIsMoreDropdownOpen] = useState(false);
  
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setIsMoreDropdownOpen(false);
  };

  const mainNavItems = [
    { label: 'Home', to: '/' },
    { label: 'Features', to: '/features' },
    { label: 'Services', to: '/services' },
    { label: 'Pricing', to: '/pricing' },
  ];

  const moreNavItems = [
    { label: 'How It Works', to: '/how-it-works' },
    { label: 'About', to: '/about' },
    { label: 'Blog', to: '/blog' },
    { label: 'Careers', to: '/careers' },
    { label: 'Contact', to: '/contact' },
  ];

  return (
    <motion.nav 
      className="bg-gradient-to-r from-slate-900/95 via-blue-900/95 to-indigo-900/95 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl shadow-blue-900/20"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-modern">
        <div className="flex items-center justify-between py-3">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group"
            aria-label="SkillMatrix Home"
            onClick={closeMenu}
          >
            <motion.div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-violet-600 rounded-full blur-md opacity-40 group-hover:opacity-60 transition-opacity" />
              <motion.img
                src={SMlogo}
                alt="SkillMatrix Logo"
                className="relative w-12 h-12 rounded-full border-2 border-blue-400/50 shadow-xl transition-transform duration-300"
                whileHover={{ scale: 1.08, rotate: 3 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
            </motion.div>
            <div className="ml-3 hidden sm:block">
              <span className="text-lg font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-violet-400 bg-clip-text text-transparent">SkillMatrix</span>
              <p className="text-xs text-blue-200 font-semibold tracking-wide">AI-Powered ATS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {mainNavItems.map((item, index) => (
              <Link
                key={index}
                to={item.to}
                className={`px-3 py-2 text-sm font-bold transition-all duration-300 relative group rounded-lg ${
                  location.pathname === item.to 
                    ? 'text-white bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-400/30' 
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                {item.label}
                <motion.span 
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </Link>
            ))}
            
            {/* More Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setIsMoreDropdownOpen(true)}
              onMouseLeave={() => setIsMoreDropdownOpen(false)}
            >
              <button
                className={`px-3 py-2 text-sm font-bold transition-all duration-300 relative group rounded-lg flex items-center gap-2 ${
                  moreNavItems.some(item => location.pathname === item.to)
                    ? 'text-white bg-gradient-to-r from-blue-500/20 to-violet-500/20 border border-blue-400/30'
                    : 'text-blue-100 hover:text-white hover:bg-white/10'
                }`}
              >
                More
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`text-xs transition-transform duration-200 ${isMoreDropdownOpen ? 'rotate-180' : ''}`}
                />
              </button>
              
              <AnimatePresence>
                {isMoreDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-full right-0 mt-2 w-52 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl border border-blue-400/30 py-3 overflow-hidden backdrop-blur-xl"
                  >
                    {moreNavItems.map((item, index) => (
                      <Link
                        key={index}
                        to={item.to}
                        className={`block px-4 py-3 text-sm font-semibold transition-all duration-200 rounded-lg mx-2 ${
                          location.pathname === item.to
                            ? 'text-white bg-gradient-to-r from-blue-500/30 to-violet-500/30 border-l-4 border-cyan-400'
                            : 'text-blue-100 hover:text-white hover:bg-white/10 hover:translate-x-1'
                        }`}
                        onClick={() => setIsMoreDropdownOpen(false)}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Auth Buttons */}
          <div className="hidden lg:flex items-center space-x-3">
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="px-5 py-2 text-sm font-bold text-blue-100 hover:text-white transition-all duration-300 rounded-lg hover:bg-white/10 border border-transparent hover:border-blue-400/30"
              >
                Log in
              </Link>
            )}
            {location.pathname !== '/Register' && (
              <Link
                to="/Register"
                className="px-8 py-3 text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-xl shadow-lg shadow-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/60 hover:scale-105 transition-all duration-300 border border-white/20"
              >
                Start Free Trial
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="lg:hidden p-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.05 }}
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars} 
              className="text-xl text-white" 
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="lg:hidden bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 border-t border-white/10 shadow-2xl backdrop-blur-xl"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-modern py-6">
              <div className="flex flex-col space-y-2">
                {/* Mobile Main Navigation Items */}
                {mainNavItems.map((item, index) => (
                  <Link
                    key={index}
                    to={item.to}
                    className={`py-3 px-4 rounded-xl text-sm font-bold transition-all duration-300 ${
                      location.pathname === item.to
                        ? 'text-white bg-gradient-to-r from-blue-500/30 to-violet-500/30 border-l-4 border-cyan-400'
                        : 'text-blue-100 hover:text-white hover:bg-white/10 hover:translate-x-2'
                    }`}
                    onClick={closeMenu}
                  >
                    {item.label}
                  </Link>
                ))}
                
                {/* Mobile More Items */}
                <div className="pt-3 border-t border-white/10 mt-3">
                  <p className="text-xs font-bold text-blue-300 uppercase tracking-wider px-4 mb-3">More</p>
                  {moreNavItems.map((item, index) => (
                    <Link
                      key={index}
                      to={item.to}
                      className={`py-3 px-4 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        location.pathname === item.to
                          ? 'text-white bg-gradient-to-r from-blue-500/30 to-violet-500/30 border-l-4 border-cyan-400'
                          : 'text-blue-100 hover:text-white hover:bg-white/10 hover:translate-x-2'
                      }`}
                      onClick={closeMenu}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10 mt-4">
                  {location.pathname !== '/login' && (
                    <Link
                      to="/login"
                      className="py-3 px-4 text-center text-sm font-bold border-2 border-cyan-400 text-cyan-400 rounded-xl hover:bg-cyan-400/10 transition-all duration-300 hover:scale-105"
                      onClick={closeMenu}
                    >
                      Log in
                    </Link>
                  )}
                  {location.pathname !== '/Register' && (
                    <Link
                      to="/Register"
                      className="py-2.5 px-4 text-center text-sm font-bold bg-gradient-to-r from-cyan-500 via-blue-600 to-violet-600 text-white rounded-lg shadow-lg shadow-blue-500/50 hover:shadow-xl hover:scale-105 transition-all duration-300"
                      onClick={closeMenu}
                    >
                      Start Free Trial
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
