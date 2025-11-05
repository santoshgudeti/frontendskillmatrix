import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { motion } from 'framer-motion';
import Header from '../Dashboard/Header';
import Sidebar from '../Sidebar/Sidebar';
import CandidateTable from '../Candidates/CandidateTable';
import UploadDocuments from '../Dashboard/UploadDocuments';
import React, { useRef, useEffect, useState } from "react";
import ResponseTable from "../Dashboard/ResponseTable";
import AdminDashboard from "../ProfileSection/AdminDashboard";
import AdminUserDetail from "../ProfileSection/AdminUserDetail";
import UserProfile from "../ProfileSection/UserProfile";
import ScheduleTestPage from '../ScheduledTest/ScheduleTestPage';
import ScheduledTestsList from '../ScheduledTest/ScheduledTestsList';
import ScheduledTestDetails from '../ScheduledTest/ScheduledTestDetails';
import DashboardHome from './DashboardHome';
import Reports from './Reports';
import History from './History';
import CandidateDetailsPage from './CandidateDetailsPage';
import DocumentCollectionDashboard from './DocumentCollection/DocumentCollectionDashboard';
import TemplateManagement from './Templates/TemplateManagement';

// Import new components for candidate assessment workflow


// Create a new component for assessment session details
const AssessmentSessionDetails = () => {
  return (
    <div>
      <h1>Assessment Session Details</h1>
      <p>This page will show details for an assessment session.</p>
    </div>
  );
};

function Dashboard({ onLogout }) {
  const [resumeData, setResumeData] = useState([]);
  const [responseData, setResponseData] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.isAdmin) {
      setIsAdmin(true);
    }
  }, []);

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024; // Match sidebar breakpoint
      setIsMobile(mobile);
      if (mobile) {
        setSidebarCollapsed(false); // Reset collapse state on mobile
        setMobileMenuOpen(false); // Close mobile menu
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Update ResponseData based on filtered results or processing
  const updateCandidatesData = (newData) => {
    setResponseData(newData);
  };

  // Handle sidebar toggle
  const handleSidebarToggle = (collapsed) => {
    if (isMobile) {
      setMobileMenuOpen(!mobileMenuOpen);
    } else {
      setSidebarCollapsed(collapsed);
    }
  };

  // Handle mobile menu toggle from header
  const handleMobileToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex relative">
      <Sidebar 
        onLogout={onLogout} 
        onSidebarToggle={handleSidebarToggle}
        collapsed={sidebarCollapsed}
        isMobile={isMobile}
        mobileMenuOpen={mobileMenuOpen}
        isAdmin={isAdmin}
      />
      
      <motion.div 
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isMobile 
            ? 'ml-0' 
            : sidebarCollapsed 
              ? 'ml-20' 
              : 'ml-64'
        }`}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Header 
          onResponseSubmit={() => {}} 
          isMobile={isMobile} 
          onToggleSidebar={handleMobileToggle}
          sidebarCollapsed={sidebarCollapsed}
        />
        
        <motion.main 
          className="flex-1 p-4 md:p-6 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="max-w-none w-full">
            <Routes>
              {/* Dashboard Home Route */}
              <Route path="" element={<DashboardHome />} />
              
              {/* Immediate Test Platform Routes */}
              <Route path="upload" element={<UploadDocuments setResponseData={setResponseData}/>} />
              <Route path="response" element={responseData && (
                <ResponseTable 
                  data={responseData.results}
                  duplicateCount={responseData.duplicateCount} 
                />
              )} />
              <Route path="candidates" element={
                <CandidateTable 
                  data={resumeData} 
                  updateCandidatesData={updateCandidatesData} 
                /> 
              } />
              
              {/* Scheduled Test Platform Routes */}
              <Route path="schedule-test" element={<ScheduleTestPage />} />
              <Route path="scheduled-tests" element={<ScheduledTestsList />} />
              <Route path="scheduled-tests/:id/details" element={<ScheduledTestDetails />} />

              {/* Candidate Assessment & Interview Workflow Routes */}
              <Route path="candidate-details/:candidateId/:assessmentSessionId" element={<CandidateDetailsPage />} />
              <Route path="assessment-session/:id" element={<AssessmentSessionDetails />} />


              {/* Reports and History Routes */}
              <Route path="reports" element={<Reports />} />
              <Route path="history" element={<History />} />

              {/* Admin Routes */}
              <Route path="admin/*" element={<AdminDashboard />} />
              <Route path="admin/users/:id" element={<AdminUserDetail />} />

              {/* User Profile Route */}
              <Route path="user" element={<UserProfile />} />

              {/* Add this new route for document collection dashboard */}
              <Route path="document-collection" element={<DocumentCollectionDashboard />} />
              
              {/* Add this new route for template management */}
              <Route path="templates" element={<TemplateManagement />} />
            </Routes>
          </div>
        </motion.main>
      </motion.div>
    </div>
  );
}

export default Dashboard;