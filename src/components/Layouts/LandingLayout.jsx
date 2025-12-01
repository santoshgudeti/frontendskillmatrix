// components/Layouts/LandingLayout.jsx
import Navbar from '../LandingPage/Navbar';
import Footer from '../LandingPage/Footer';
import LeadCapturePopup from '../LandingPage/LeadCapturePopup';
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const LandingLayout = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [location.pathname]);

  return (
    <>
      <Navbar />
      {children}
      {/* Footer only appears on home page */}
      {isHomePage && <Footer />}
      {/* Lead Capture Popup - shows on all landing pages */}
      <LeadCapturePopup currentPage={location.pathname} />
    </>
  );
};

export default LandingLayout;
