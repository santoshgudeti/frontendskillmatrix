import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCheckCircle, faTrophy, faRefresh, faStar,
  faExclamationTriangle, faChartLine
} from '@fortawesome/free-solid-svg-icons';

const Result = ({ score, totalQuestions, onRestart, violations = 0 }) => {
  const percentage = Math.round((score / totalQuestions) * 100);
  const isExcellent = percentage >= 80;
  const isGood = percentage >= 60;
  const isPoor = percentage < 40;

  const getResultIcon = () => {
    if (isExcellent) return faTrophy;
    if (isGood) return faCheckCircle;
    return faExclamationTriangle;
  };

  const getResultColor = () => {
    if (isExcellent) return 'text-yellow-500';
    if (isGood) return 'text-green-500';
    return 'text-red-500';
  };

  const getResultMessage = () => {
    if (isExcellent) return 'Excellent Performance!';
    if (isGood) return 'Good Job!';
    return 'Needs Improvement';
  };

  const getGradient = () => {
    if (isExcellent) return 'from-yellow-400 to-orange-500';
    if (isGood) return 'from-green-400 to-emerald-500';
    return 'from-red-400 to-red-600';
  };

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="card-glass max-w-2xl w-full rounded-2xl shadow-xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="p-6 md:p-8">
          {/* Icon and Title */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className={`w-16 h-16 mx-auto mb-3 bg-gradient-to-r ${getGradient()} rounded-full flex items-center justify-center`}>
              <FontAwesomeIcon icon={getResultIcon()} className="text-2xl text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">{getResultMessage()}</h2>
          </motion.div>

          {/* Score Display */}
          <motion.div 
            className="mb-5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
              <div className="text-4xl md:text-5xl font-bold mb-2 text-center">
                <span className={getResultColor()}>{percentage}</span>
                <span className="text-gray-400 text-2xl md:text-3xl">%</span>
              </div>
              <p className="text-gray-600 text-center text-sm">
                You scored {score} out of {totalQuestions} questions correctly
              </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
              <motion.div 
                className={`h-2 rounded-full bg-gradient-to-r ${getGradient()}`}
                style={{ width: `${percentage}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </div>

            {/* Score Breakdown */}
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-white rounded-md p-3 border border-gray-200 text-center">
                <div className="text-lg md:text-xl font-bold text-green-600">{score}</div>
                <div className="text-xs text-gray-600">Correct</div>
              </div>
              <div className="bg-white rounded-md p-3 border border-gray-200 text-center">
                <div className="text-lg md:text-xl font-bold text-red-600">{totalQuestions - score}</div>
                <div className="text-xs text-gray-600">Incorrect</div>
              </div>
            </div>

            {/* Violations Warning */}
            {violations > 0 && (
              <motion.div 
                className="bg-yellow-50 border border-yellow-200 rounded-md p-3 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
              >
                <div className="flex items-center gap-2 text-yellow-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="text-sm" />
                  <span className="font-semibold text-sm">Proctoring Alert</span>
                </div>
                <p className="text-yellow-700 text-xs mt-1">
                  {violations} tab switching violation{violations !== 1 ? 's' : ''} detected during the assessment
                </p>
              </motion.div>
            )}
          </motion.div>

          {/* Action Button */}
          <motion.button
            className="btn-primary w-full py-2.5 text-base font-semibold rounded-lg"
            onClick={onRestart}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faRefresh} className="mr-2" />
            Take Another Test
          </motion.button>

          {/* Performance Tips */}
          <motion.div 
            className="mt-5 text-left bg-blue-50 rounded-lg p-4 border border-blue-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.9 }}
          >
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2 text-sm">
              <FontAwesomeIcon icon={faChartLine} className="text-xs" />
              Performance Summary
            </h4>
            <div className="space-y-1.5 text-blue-800 text-xs">
              {isExcellent && (
                <p>🌟 Outstanding performance! You demonstrated excellent knowledge of the subject matter.</p>
              )}
              {isGood && !isExcellent && (
                <p>✅ Good work! You have a solid understanding with room for minor improvements.</p>
              )}
              {isPoor && (
                <p>📚 Consider reviewing the material and practicing more before your next attempt.</p>
              )}
              <p>💡 Your assessment results help us understand your skill level for better job matching.</p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Result;