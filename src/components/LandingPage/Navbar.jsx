import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SMlogo from "../../assets/SMlogo.png";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const navItems = [
    { label: 'Home', to: '/' },
    { label: 'Features', section: 'features' },
    { label: 'Pricing', section: 'pricing' }
  ];

  return (
    <motion.nav 
      className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-sm"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="container-modern">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center group"
            aria-label="SkillMatrix Home"
          >
            <motion.img
              src={SMlogo}
              alt="SkillMatrix Logo"
              className="w-16 h-16 rounded-full border-2 border-primary-600 shadow-lg transition-transform duration-300 group-hover:scale-105"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
            <div className="ml-3 hidden sm:block">
              <span className="text-xl font-bold text-gradient">SkillMatrix</span>
              <p className="text-xs text-gray-600">AI-Powered ATS</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item, index) => (
              <motion.div key={index} className="relative">
                {item.to ? (
                  <Link
                    to={item.to}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gradient group-hover:w-full transition-all duration-300"></span>
                  </Link>
                ) : (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      scrollToSection(item.section);
                    }}
                    className="text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
                  >
                    {item.label}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary-gradient group-hover:w-full transition-all duration-300"></span>
                  </button>
                )}
              </motion.div>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {location.pathname !== '/login' && (
              <Link
                to="/login"
                className="btn-outline px-6 py-2"
              >
                Log in
              </Link>
            )}
            {location.pathname !== '/Register' && (
              <Link
                to="/Register"
                className="btn-primary px-6 py-2"
              >
                Sign up
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            onClick={toggleMenu}
            aria-label="Toggle navigation menu"
            aria-expanded={isMenuOpen}
            whileTap={{ scale: 0.95 }}
          >
            <FontAwesomeIcon 
              icon={isMenuOpen ? faTimes : faBars} 
              className="text-xl text-gray-700" 
            />
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="md:hidden bg-white border-t border-gray-200 shadow-lg"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container-modern py-4">
              <div className="flex flex-col space-y-4">
                {/* Mobile Navigation Items */}
                {navItems.map((item, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="block py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                        onClick={closeMenu}
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          scrollToSection(item.section);
                          closeMenu();
                        }}
                        className="block w-full text-left py-2 text-gray-700 hover:text-primary-600 font-medium transition-colors duration-200"
                      >
                        {item.label}
                      </button>
                    )}
                  </motion.div>
                ))}
                
                {/* Mobile Auth Buttons */}
                <div className="flex flex-col space-y-3 pt-4 border-t border-gray-200">
                  {location.pathname !== '/login' && (
                    <Link
                      to="/login"
                      className="btn-outline w-full text-center"
                      onClick={closeMenu}
                    >
                      Log in
                    </Link>
                  )}
                  {location.pathname !== '/Register' && (
                    <Link
                      to="/Register"
                      className="btn-primary w-full text-center"
                      onClick={closeMenu}
                    >
                      Sign up
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
