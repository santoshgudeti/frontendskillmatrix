import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner, faExclamationTriangle, faClock, faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import Question from './Question';
import Result from './Result';
import { axiosInstance } from '../../axiosUtils';
const Quiz = ({ proctored = true, onComplete }) => {
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [userAnswers, setUserAnswers] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [errorLoadingQuestions, setErrorLoadingQuestions] = useState(null);
  
  // Proctoring state
  const [tabActive, setTabActive] = useState(true);
  const [violations, setViolations] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

// Timer state (15 minutes = 900 seconds)
const [timeLeft, setTimeLeft] = useState(900); // Restore to 15 mins
const [timerActive, setTimerActive] = useState(true);

 // Initialize userAnswers when questions load
 useEffect(() => {
  if (questions.length > 0 && userAnswers.length === 0) {
    setUserAnswers(Array(questions.length).fill(null));
  }
}, [questions]);
// Timer countdown effect
useEffect(() => {
  if (!timerActive || quizCompleted) return;

  const timer = setInterval(() => {
    setTimeLeft((prevTime) => {
      if (prevTime <= 1) {
        clearInterval(timer);
        handleAutoSubmit();
        return 0;
      }
      return prevTime - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timerActive, quizCompleted, userAnswers]); // Add userAnswers to dependencies


const handleAutoSubmit = async () => {
  console.log("Auto-submitting MCQ...");
  setTimerActive(false);
  setQuizCompleted(true);
  
  // Calculate final score based on all answered questions
  const finalScore = Math.round((score / questions.length) * 100);
  console.log("Final MCQ Score:", finalScore);

  if (onComplete) {
    console.log("Calling onComplete...");
    await onComplete(finalScore);
  } else {
    console.error("onComplete not provided!");
  }
};

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Fetch questions from API when component mounts
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        // First try to get questions from assessment session
        const response = await axiosInstance.get(
          `/api/assessment-questions/${token}`
        );
        
        if (response.data.questions && response.data.questions.length > 0) {
          setQuestions(response.data.questions);
        } else {
          throw new Error('No questions found for this assessment');
        }
      } catch (error) {
        console.error('Failed to load questions:', error);
        setErrorLoadingQuestions('Failed to load questions. Please try again later.');
        
        // Fallback to default questions if in development
        if (process.env.NODE_ENV === 'development') {
          setQuestions([
            {
              question: "What is the capital of France?",
              options: ["Berlin", "Madrid", "Paris", "Rome"],
              correctAnswer: "Paris",
            },
            {
              question: "Which hook is used to manage state in functional components?",
              options: ["useEffect", "useState", "useContext", "useReducer"],
              correctAnswer: "useState",
            }
          ]);
          setErrorLoadingQuestions(null);
        }
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [token]);

  // Proctoring effects
  useEffect(() => {
    if (!proctored) return;

    // Tab switching detection
    const handleVisibilityChange = () => {
      const isActive = !document.hidden;
      setTabActive(isActive);
      
      if (!isActive) {
        const newViolations = violations + 1;
        setViolations(newViolations);
        setShowWarning(true);
        
        if (newViolations > 2) {
          alert('Warning: Multiple tab switching violations detected. This may invalidate your assessment.');
        }
      }
    };

    // Fullscreen detection
    const handleFullscreenChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    // Enforce fullscreen if proctored
    if (proctored && !document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error('Error attempting to enable fullscreen:', err);
      });
    }

    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [proctored, violations]);
// Update handleAnswer to store user answer
const handleAnswer = async (selectedAnswer) => {
  if (questions.length === 0) return;
  
  // Update local state immediately for UI responsiveness
  const newAnswers = [...userAnswers];
  newAnswers[currentQuestion] = selectedAnswer;
  setUserAnswers(newAnswers);

  const updatedQuestions = [...questions];
  updatedQuestions[currentQuestion].userAnswer = selectedAnswer;
  setQuestions(updatedQuestions);

  // Persist to backend
  try {
    await axiosInstance.patch(`/api/update-answer/${token}`, {
      questionId: questions[currentQuestion].id,
      userAnswer: selectedAnswer
    });
  } catch (error) {
    console.error('Failed to save answer:', error);
    // Consider adding retry logic here
  }

  // Recalculate score
  const newScore = questions.reduce((total, question, index) => {
    return total + (newAnswers[index] === question.correctAnswer ? 1 : 0);
  }, 0);
  setScore(newScore);
};

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowWarning(false);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setShowWarning(false);
    }
  };

const handleSubmit = async () => {
  if (questions.length === 0) return;
  
  // Calculate final score (percentage)
  const finalScore = Math.round((score / questions.length) * 100);
  
  if (proctored) {
    // If part of proctored assessment, use the onComplete callback
    if (onComplete) {
      await onComplete(finalScore, questions); // Pass questions with answers
    }
  } else {
    // Standalone quiz mode - submit directly to backend
    try {
      await axiosInstance.post('/api/submit-score', {
        token,
        score: finalScore,
        answers: questions.map(q => ({
          id: q.id,
          question: q.question,
          userAnswer: q.userAnswer
        }))
      });
    } catch (error) {
      console.error('Error submitting score:', error);
    }
  }
  
  setQuizCompleted(true);
};

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setUserAnswers([]);
    setQuizCompleted(false);
    setViolations(0);
    navigate(proctored ? '/' : `/quiz/${token}`);
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="card-glass p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Preparing your assessment questions...</p>
        </div>
      </div>
    );
  }

  if (errorLoadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="card-glass max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Questions</h3>
          <p className="text-gray-600 mb-6">{errorLoadingQuestions}</p>
          <button 
            className="btn-primary px-6 py-3" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="container-modern"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient-hero mb-4">MCQ Assessment</h1>
          <p className="text-lg text-gray-600">Test your knowledge and skills for the job position</p>
        </motion.div>
        
        {/* Proctoring Alerts */}
        {proctored && (
          <motion.div 
            className="mb-6 space-y-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Timer Display */}
            <div className="flex justify-center">
              <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full border border-red-200">
                <FontAwesomeIcon icon={faClock} className="text-sm" />
                <span className="font-semibold text-sm">Time Left: {formatTime(timeLeft)}</span>
              </div>
            </div>

            {!fullscreen && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 text-red-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} />
                  <span className="font-medium">Please enable fullscreen mode for your assessment</span>
                </div>
              </div>
            )}
            
            {showWarning && (
              <motion.div 
                className="bg-yellow-50 border border-yellow-200 rounded-lg p-4"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span className="font-medium">Tab switching detected ({violations} violation{violations !== 1 ? 's' : ''})</span>
                  </div>
                  <button 
                    onClick={() => setShowWarning(false)}
                    className="text-yellow-600 hover:text-yellow-800 transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
        
        {/* Quiz Content */}
        <motion.div 
          className="card-glass max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {!quizCompleted && questions.length > 0 ? (
            <>
              {/* Question */}
              <Question
                question={questions[currentQuestion].question}
                options={questions[currentQuestion].options}
                selectedAnswer={userAnswers[currentQuestion]}
                onAnswer={handleAnswer}
              />
              
              {/* Navigation */}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  className="btn-outline px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                >
                  Previous
                </button>
                
                {currentQuestion < questions.length - 1 ? (
                  <button
                    className="btn-primary px-6 py-3"
                    onClick={handleNext}
                  >
                    Next
                  </button>
                ) : (
                  <button
                    className="btn-modern bg-green-600 hover:bg-green-700 text-white px-8 py-3 font-semibold"
                    onClick={handleSubmit}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Submit Test
                  </button>
                )}
              </div>
              
              {/* Progress Bar */}
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    Question {currentQuestion + 1} of {questions.length}
                  </span>
                  <span className="text-sm text-gray-500">
                    {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    className="bg-primary-gradient h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  />
                </div>
              </div>
            </>
          ) : quizCompleted ? (
            <Result 
              score={score} 
              totalQuestions={questions.length} 
              onRestart={restartQuiz}
              violations={proctored ? violations : 0}
            />
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
              </div>
              <p className="text-lg text-gray-700">No questions available for this assessment.</p>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Quiz;