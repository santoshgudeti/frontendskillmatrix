import React from "react";
import { motion } from "framer-motion";

const Question = ({ question, options, selectedAnswer, onAnswer }) => {
  return (
    <div className="space-y-5">
      <motion.h3 
        className="text-lg font-semibold text-gray-900 leading-relaxed"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {question}
      </motion.h3>
      <div className="space-y-2.5">
        {options.map((option, index) => (
          <motion.button
            key={index}
            className={`w-full text-left p-3 rounded-md border-2 transition-all duration-200 font-medium ${
              selectedAnswer === option
                ? 'border-primary-500 bg-primary-50 text-primary-700'
                : 'border-gray-200 bg-white text-gray-700 hover:border-primary-300 hover:bg-primary-25'
            }`}
            onClick={() => onAnswer(option)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <div className="flex items-center gap-2.5">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                selectedAnswer === option
                  ? 'border-primary-500 bg-primary-500'
                  : 'border-gray-300'
              }`}>
                {selectedAnswer === option && (
                  <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                )}
              </div>
              <span className="text-sm">{option}</span>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default Question;