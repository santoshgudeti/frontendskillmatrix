import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React from 'react';
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
import './App.css';
import './styles.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>

        {/* Landing Routes (with Navbar + Footer) */}
        <Route
          path="/"
          element={
            <LandingLayout>
              <LandingPage />
            </LandingLayout>
          }
        />
        <Route
          path="/login"
          element={
            <LandingLayout>
              <Login />
            </LandingLayout>
          }
        />
        <Route
          path="/register"
          element={
            <LandingLayout>
              <Register />
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
        <Route
          path="/assessment/:token"
          element={
            <ProtectedRoute>
              <AssessmentPlatform />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview/*"
          element={
            <ProtectedRoute>
              <InterviewPlatform />
            </ProtectedRoute>
          }
        />
        <Route
          path="/quiz/:token"
          element={
            <ProtectedRoute>
              <Quiz proctored={false} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
