import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileUpload,
  faUsers,
  faCalendarPlus,
  faCalendarCheck,
  faChartBar,
  faRobot,
  faBrain,
  faCogs
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";

function DashboardHome() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="">
      <motion.div 
        className="max-w-7xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Welcome Section */}
        <motion.div 
          className="mb-8"
          variants={itemVariants}
        >
          <div className="card-glass p-8 text-center">
            <h1 className="text-4xl lg:text-5xl font-bold text-gradient-hero mb-4">
              Welcome to SkillMatrix AI
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Your intelligent recruitment platform powered by advanced AI technologies
            </p>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Link 
              to="/dashboard/upload" 
              className="card-interactive group block"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-primary-gradient rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faFileUpload} />
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Upload Documents
                </h5>
                <p className="text-sm text-gray-600">
                  Upload resumes and job descriptions for AI matching
                </p>
              </div>
            </Link>

            <Link 
              to="/dashboard/candidates" 
              className="card-interactive group block"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-secondary-gradient rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faUsers} />
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Candidates
                </h5>
                <p className="text-sm text-gray-600">
                  Manage and evaluate candidate profiles
                </p>
              </div>
            </Link>

            <Link 
              to="/dashboard/schedule-test" 
              className="card-interactive group block"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-success-gradient rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faCalendarPlus} />
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Schedule Test
                </h5>
                <p className="text-sm text-gray-600">
                  Schedule assessments for candidates
                </p>
              </div>
            </Link>

            <Link 
              to="/dashboard/scheduled-tests" 
              className="card-interactive group block"
            >
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white text-2xl group-hover:scale-110 transition-transform duration-300">
                  <FontAwesomeIcon icon={faCalendarCheck} />
                </div>
                <h5 className="text-lg font-semibold text-gray-800 mb-2">
                  Scheduled Tests
                </h5>
                <p className="text-sm text-gray-600">
                  View and manage scheduled assessments
                </p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Platform Features */}
        <motion.div 
          className="mb-12"
          variants={itemVariants}
        >
          <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
            Platform Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="card-glass group text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-primary-gradient rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h5 className="text-xl font-semibold text-gray-800 mb-4">
                AI-Powered Matching
              </h5>
              <p className="text-gray-600 leading-relaxed">
                Advanced algorithms match candidates with job descriptions for optimal fit
              </p>
            </div>

            <div className="card-glass group text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-success-gradient rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faBrain} />
              </div>
              <h5 className="text-xl font-semibold text-gray-800 mb-4">
                Intelligent Assessment
              </h5>
              <p className="text-gray-600 leading-relaxed">
                Comprehensive evaluation through MCQs, voice, and video interviews
              </p>
            </div>

            <div className="card-glass group text-center hover:shadow-2xl transition-all duration-300">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center text-white text-3xl group-hover:scale-110 transition-transform duration-300">
                <FontAwesomeIcon icon={faCogs} />
              </div>
              <h5 className="text-xl font-semibold text-gray-800 mb-4">
                Automated Workflow
              </h5>
              <p className="text-gray-600 leading-relaxed">
                Streamlined recruitment process with real-time analytics and reporting
              </p>
            </div>
          </div>
        </motion.div>

        {/* Quick Stats Section */}
        <motion.div 
          className=""
          variants={itemVariants}
        >
          <div className="card-glass">
            <h3 className="text-2xl font-semibold text-gray-800 text-center mb-8">
              Quick Overview
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-primary-600 mb-2">--</div>
                <div className="text-sm font-medium text-gray-600">
                  Active Scheduled Tests
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-secondary-600 mb-2">--</div>
                <div className="text-sm font-medium text-gray-600">
                  Completed Assessments
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-success-600 mb-2">--</div>
                <div className="text-sm font-medium text-gray-600">
                  Total Candidates
                </div>
              </div>
              <div className="text-center p-6 rounded-xl bg-white/50 backdrop-blur-sm border border-white/20">
                <div className="text-4xl font-bold text-purple-600 mb-2">--</div>
                <div className="text-sm font-medium text-gray-600">
                  This Month
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default DashboardHome;