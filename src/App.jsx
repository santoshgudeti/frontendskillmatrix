import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react';
import LandingPage from './components/LandingPage/LandingPage';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Dashboard from './components/Dashboard/Dashboard';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import UserProfile from './components/ProfileSection/UserProfile';
import AdminDashboard from './components/ProfileSection/AdminDashboard';
import { ToastContainer } from "react-toastify";
import AssessmentPlatform from './components/TestPlatform/AssessmentPlatform';
import InterviewPlatform from './components/TestPlatform/InterviewPlatform';
import Quiz from './components/TestPlatform/Quiz';
import "./App.css";
import "./styles.css"


function App() {

  return (
    <Router>
         <ToastContainer />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
       
          {/* Dashboard Route */}
        <Route path="/dashboard/*"element={<ProtectedRoute><Dashboard/></ProtectedRoute> } />
         <Route path="/assessment/:token" element={<ProtectedRoute><AssessmentPlatform /></ProtectedRoute>} />
         <Route path="/interview/*" element={<ProtectedRoute><InterviewPlatform /></ProtectedRoute>}/>
        <Route path="/quiz/:token" element={<ProtectedRoute><Quiz proctored={false} /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;

