import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiBriefcase, FiLogIn, FiUserPlus } from 'react-icons/fi';

const JobPortalEntry = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.div
            className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 260, 
              damping: 20,
              delay: 0.2
            }}
          >
            <FiBriefcase className="w-10 h-10 text-white" />
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            Welcome to <span className="text-gradient">SkillMatrix Jobs</span>
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Connect with top talent and find the perfect candidates for your open positions
          </motion.p>
        </div>

        {/* Main Card */}
        <motion.div 
          className="bg-white/80 backdrop-blur-xl border border-white/30 rounded-3xl shadow-2xl overflow-hidden"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="p-8 md:p-12">
            <div className="text-center mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3">
                For Companies & Recruiters
              </h2>
              <p className="text-lg text-gray-600">
                Post jobs and discover qualified candidates with our AI-powered matching technology
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-10">
              <motion.div 
                className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center">
                    <FiLogIn className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">Existing Account</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Sign in to your company account to manage job postings and applications
                </p>
                <Link 
                  to="/jobportal/login" 
                  className="btn-modern btn-outline w-full justify-center"
                >
                  Login to Dashboard
                </Link>
              </motion.div>

              <motion.div 
                className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100"
                whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)" }}
                transition={{ duration: 0.2 }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500 flex items-center justify-center">
                    <FiUserPlus className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900">New Company</h3>
                </div>
                <p className="text-gray-600 mb-6">
                  Create a new company account to start posting jobs and finding talent
                </p>
                <Link 
                  to="/jobportal/register" 
                  className="btn-modern btn-primary w-full justify-center"
                >
                  Register Company
                </Link>
              </motion.div>
            </div>

            <div className="text-center">
              <p className="text-gray-500 text-sm">
                Only verified companies can post jobs. All postings are reviewed for quality and compliance.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div 
          className="grid sm:grid-cols-3 gap-6 mt-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          {[
            { title: "AI Matching", desc: "Smart candidate-job matching" },
            { title: "Easy Posting", desc: "Create jobs in minutes" },
            { title: "Verified Talent", desc: "Access to pre-screened candidates" }
          ].map((feature, index) => (
            <div key={index} className="bg-white/60 backdrop-blur-sm rounded-xl p-4 text-center border border-white/20">
              <h4 className="font-semibold text-gray-900">{feature.title}</h4>
              <p className="text-sm text-gray-600 mt-1">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default JobPortalEntry;