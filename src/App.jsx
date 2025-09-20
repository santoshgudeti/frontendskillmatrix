import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { useEffect } from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import AssessmentPlatform from './components/TestPlatform/AssessmentPlatform';
import InterviewPlatform from './components/TestPlatform/InterviewPlatform';
import Quiz from './components/TestPlatform/Quiz';
import LandingLayout from './components/Layouts/LandingLayout';
import { ToastContainer } from 'react-toastify';
import { AriaUtils } from './lib/accessibility';
import { ErrorBoundary, FeedbackProvider } from './components/ui';

import ForgotPassword from './components/Auth/ForgotPassword';
import ResetPassword from './components/Auth/ResetPassword';

import JobPortalLogin from './components/JobPortal/JobPortalLogin';
import JobPortalRegister from './components/JobPortal/JobPortalRegister';
import JobPostForm from './components/JobPortal/JobPostForm';
import JobPortalProtectedRoute from './components/JobPortal/JobPortalProtectedRoute';
import JobPortalEntry from './components/JobPortal/JobPortalEntry';
import JobPosterDashboard from './components/JobPortal/JobPosterDashboard';
import HRApplications from './components/JobPortal/HRApplications';
import PublicJobView from './components/JobPortal/PublicJobView';

import './App.css';
import './styles.css';

function App() {
  // Initialize accessibility features
  useEffect(() => {
    // Set up ARIA live regions
    AriaUtils.updateStatus('Application loaded');
    
    // Set document language if not already set
    if (!document.documentElement.lang) {
      document.documentElement.lang = 'en';
    }
    
    // Announce page changes to screen readers
    const handleLocationChange = () => {
      // Small delay to let the page render
      setTimeout(() => {
        const pageTitle = document.title;
        AriaUtils.announce(`Navigated to ${pageTitle}`, 'polite');
      }, 100);
    };
    
    // Listen for route changes
    window.addEventListener('popstate', handleLocationChange);
    
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
    };
  }, []);

  return (
    <ErrorBoundary 
      title="Application Error"
      description="The SkillMatrix application encountered an unexpected error. Please try refreshing the page."
      onError={(error, errorInfo) => {
        // Log to error tracking service
        console.error('Application Error:', error, errorInfo);
        
        // Report to analytics if available
        if (window.gtag) {
          window.gtag('event', 'exception', {
            description: error.toString(),
            fatal: false,
          });
        }
      }}
    >
      <FeedbackProvider>
        {/* Skip Navigation Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white"
          tabIndex={0}
        >
          Skip to main content
        </a>
        
        <Router>
          <ToastContainer 
            position="top-center" 
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
          />
        <Routes>
          {/* Landing Routes (with Navbar + Footer) */}
          <Route
            path="/"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="SkillMatrix Landing Page">
                  <LandingPage />
                </main>
              </LandingLayout>
            }
          />
          <Route
            path="/login"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Login Page">
                  <Login />
                </main>
              </LandingLayout>
            }
          />
          <Route
            path="/register"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Registration Page">
                  <Register />
                </main>
              </LandingLayout>
            }
          />
          <Route
            path="/jobportal"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Job Portal Entry">
                  <JobPortalEntry />
                </main>
              </LandingLayout>
            }
          />

          <Route
            path="/jobportal/login"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Job Portal Login">
                  <JobPortalLogin />
                </main>
              </LandingLayout>
            }
          />
          <Route
            path="/jobportal/register"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Job Portal Registration">
                  <JobPortalRegister />
                </main>
              </LandingLayout>
            }
          />

          <Route path="/jobportal/dashboard" element={
            <JobPortalProtectedRoute>
              <main id="main-content" role="main" aria-label="Job Poster Dashboard">
                <JobPosterDashboard />
              </main>
            </JobPortalProtectedRoute>
          } />



          <Route
            path="/jobportal/post"
            element={
              <JobPortalProtectedRoute>
                <main id="main-content" role="main" aria-label="Post Job Form">
                  <JobPostForm />
                </main>
              </JobPortalProtectedRoute>
            }
          />

          <Route 
            path="/jobportal/applications/:jobId" 
            element={
              <JobPortalProtectedRoute>
                <main id="main-content" role="main" aria-label="Job Applications">
                  <HRApplications />
                </main>
              </JobPortalProtectedRoute>
            } 
          />
          <Route path="/jobs/:publicId" element={
            <main id="main-content" role="main" aria-label="Public Job View">
              <PublicJobView />
            </main>
          } />

          <Route
            path="/forgot-password"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Forgot Password">
                  <ForgotPassword />
                </main>
              </LandingLayout>
            }
          />
          <Route
            path="/reset-password"
            element={
              <LandingLayout>
                <main id="main-content" role="main" aria-label="Reset Password">
                  <ResetPassword />
                </main>
              </LandingLayout>
            }
          />

          {/* Dashboard & Internal Routes (no navbar/footer) */}
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/assessment/:token" element={
            <main id="main-content" role="main" aria-label="Assessment Platform">
              <AssessmentPlatform />
            </main>
          } />
          <Route path="/interview/*" element={
            <main id="main-content" role="main" aria-label="Interview Platform">
              <InterviewPlatform />
            </main>
          } />
          <Route path="/quiz/:token" element={
            <main id="main-content" role="main" aria-label="Quiz Platform">
              <Quiz proctored={false} />
            </main>
          } />
        </Routes>
      </Router>
    </FeedbackProvider>
  </ErrorBoundary>
  );
}

export default App;
