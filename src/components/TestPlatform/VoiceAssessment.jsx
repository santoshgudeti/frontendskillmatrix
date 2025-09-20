import React, { useState, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMicrophone, faStop, faCheck, faTimes, faSpinner, faClock, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import RecordRTC from 'recordrtc';
import { axiosInstance } from '../../axiosUtils';
const VoiceAssessment = ({ onComplete }) => {
  const { token } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedAnswers, setRecordedAnswers] = useState([]);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  // Add this state
const [isSubmitting, setIsSubmitting] = useState(false);
  const audioChunks = useRef([]);

    
  const recorderRef = useRef(null);
  const streamRef = useRef(null);
  // Timer state (15 minutes = 900 seconds)
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes in seconds
  const [timerActive, setTimerActive] = useState(true);

  // Timer countdown effect
 // Add to VoiceAssessment component
// Update timer effect
useEffect(() => {
  if (!timerActive || recordedAnswers.length === questions.length) return;

  const timer = setInterval(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(timer);
        handleTimeout();
        return 0;
      }
      return prev - 1;
    });
  }, 1000);

  return () => clearInterval(timer);
}, [timerActive, recordedAnswers, questions]);

// Enhanced timeout handler
const handleTimeout = async () => {
  if (isSubmitting) return; // Prevent multiple submissions
  setIsSubmitting(true);
  
  try {
    // Stop any active recording
    if (isRecording && recorderRef.current) {
      await stopRecording();
    }

    // Submit all unanswered questions
    const unanswered = questions.filter(q => 
      !recordedAnswers.some(a => a.questionId === q.id)
    );

    const submissionPromises = unanswered.map(q => 
      axiosInstance.post('/api/submit-voice-answer', {
        token,
        questionId: q.id,
        question: q.question,
        skipped: true,
        durationSec: 0
      })
    );

    await Promise.all(submissionPromises);

    // Update local state to reflect skipped questions
    setRecordedAnswers(prev => [
      ...prev,
      ...unanswered.map(q => ({
        questionId: q.id,
        status: 'skipped',
        valid: false
      }))
    ]);

    // Complete assessment
    if (onComplete) {
      await onComplete();
    }
  } catch (error) {
    console.error('Auto-submission error:', error);
    // Even if submission fails, ensure we complete
    if (onComplete) {
      await onComplete();
    }
  } finally {
    setIsSubmitting(false);
  }
};
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recorderRef.current) {
        recorderRef.current.destroy();
      }
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);
  // Auto-complete when time expires
  const handleAutoComplete = async () => {
    setTimerActive(false);
    if (onComplete) {
      await onComplete();
    }
  };

  // Format time (MM:SS)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  // Safely get current question with proper fallbacks
  const currentQuestion = questions[currentQuestionIndex] || {};
  const currentQuestionText = currentQuestion.question || 'Question not available';

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoadingQuestions(true);
        setError(null);
        
        const response = await axiosInstance.get(
          `/api/assessment-questions/${token}`,
        
        );
        
        // Validate and format questions
        const voiceQuestions = Array.isArray(response.data?.voiceQuestions) 
          ? response.data.voiceQuestions 
          : [];
        
        setQuestions(voiceQuestions.map((q, index) => ({
          id: q.id || `vq-${index}-${Date.now()}`, // Ensure unique ID
          question: q.question || `Voice question ${index + 1}`
        })));
        
      } catch (err) {
        console.error('Question fetch error:', err);
        setError(err.response?.data?.error || 
                err.message || 
                'Failed to load questions. Please refresh the page.');
      } finally {
        setLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [token]);

  // Cleanup media resources
  useEffect(() => {
    return () => {
      if (mediaRecorder) {
        mediaRecorder.stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [mediaRecorder]);

   const startRecording = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      
      recorderRef.current = new RecordRTC(stream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        numberOfAudioChannels: 1, // Mono recording
        desiredSampRate: 16000, // 16kHz sample rate
        bufferSize: 4096,
        timeSlice: 1000, // Optional: Get chunks every second
        ondataavailable: (blob) => {
          // Optional: Handle chunks if needed
        }
      });
      
      recorderRef.current.startRecording();
      setIsRecording(true);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Microphone access denied. Please check permissions and try again.');
    }
  };

  const stopRecording = async () => {
    if (!isRecording || !recorderRef.current) return;
    
    try {
      await new Promise((resolve) => {
        recorderRef.current.stopRecording(resolve);
      });
      
      const blob = recorderRef.current.getBlob();
      setIsRecording(false);
      await submitAnswer(blob);
    } catch (err) {
      console.error('Error stopping recording:', err);
      setError('Failed to process recording. Please try again.');
      setIsRecording(false);
    } finally {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
    }
  };


  const submitAnswer = async (audioBlob) => {
    if (!currentQuestion.id) {
      setError('Invalid question data. Please refresh the page.');
      return;
    }
  
    try {
      setIsProcessing(true);
      setUploadProgress(0);
      
      const formData = new FormData();
      const filename = `answer-${currentQuestionIndex}-${Date.now()}.wav`;
      
      // Ensure we have a valid blob
      if (!audioBlob || audioBlob.size === 0) {
        throw new Error('Invalid audio recording');
      }
  
      formData.append('audio', audioBlob, filename);
      formData.append('token', token);
      formData.append('questionId', currentQuestion.id);
      formData.append('question', currentQuestionText);
      
      const response = await axiosInstance.post('/api/submit-voice-answer', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
        timeout: 30000 // 30 second timeout
      });
      
      setRecordedAnswers(prev => [
        ...prev, 
        { 
          questionId: currentQuestion.id, 
          status: response.data.valid ? 'uploaded' : 'invalid',
          valid: response.data.valid
        }
      ]);
      
      if (currentQuestionIndex < questions.length - 1) {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
      } else {
        await completeAssessment();
      }
    } catch (err) {
      console.error('Submission error:', err);
      setError(err.response?.data?.error || 
              err.message || 
              'Failed to submit answer. Please check your connection and try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const completeAssessment = async () => {
    try {
      setUploadProgress(100);
      await axiosInstance.post('/api/complete-voice-assessment', { token });
      
      if (onComplete) {
        onComplete();
      }
    } catch (err) {
      console.error('Completion error:', err);
      setError('Failed to complete assessment. Your answers were saved but please contact support.');
    }
  };

  const getAnswerStatus = (questionId) => {
    return recordedAnswers.find(a => a.questionId === questionId)?.status || 'pending';
  };

  if (loadingQuestions) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="card-glass p-8 text-center">
          <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-700">Loading assessment questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="card-glass max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            className="btn-primary px-6 py-3" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
        <div className="card-glass max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-yellow-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Questions Available</h3>
          <p className="text-gray-600">No voice questions available for this assessment</p>
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
        {/* Timer */}
        <motion.div 
          className="flex justify-center mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-full border border-red-200">
            <FontAwesomeIcon icon={faClock} className="text-sm" />
            <span className="font-semibold text-sm">Time Left: {formatTime(timeLeft)}</span>
          </div>
        </motion.div>
        
        {/* Main Card */}
        <motion.div 
          className="card-glass max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Header */}
          <div className="bg-primary-gradient text-white p-6 rounded-t-2xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold mb-0">Voice Assessment</h3>
              <div className="text-right">
                <div className="text-sm opacity-90">Question {currentQuestionIndex + 1} of {questions.length}</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-white/20 rounded-full h-2">
              <motion.div 
                className="bg-white h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className="text-sm mt-2 opacity-90">
              {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}% Complete
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {/* Question */}
            <motion.div 
              className="mb-8"
              key={currentQuestionIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h4 className="text-xl font-semibold text-gray-900 leading-relaxed">{currentQuestionText}</h4>
            </motion.div>
            
            {/* Recording Controls */}
            <div className="text-center mb-8">
              {isRecording ? (
                <motion.button 
                  className="btn-modern bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold"
                  onClick={stopRecording}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <FontAwesomeIcon icon={faStop} />
                    <span>Stop Recording</span>
                  </div>
                </motion.button>
              ) : (
                <motion.button 
                  className={`px-8 py-4 text-lg font-semibold rounded-xl transition-all duration-300 ${
                    isProcessing || getAnswerStatus(currentQuestion.id) === 'uploaded'
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'btn-primary hover:scale-105'
                  }`}
                  onClick={startRecording}
                  disabled={isProcessing || getAnswerStatus(currentQuestion.id) === 'uploaded'}
                  initial={{ scale: 0.9 }}
                  animate={{ scale: 1 }}
                  whileHover={!isProcessing && getAnswerStatus(currentQuestion.id) !== 'uploaded' ? { scale: 1.05 } : {}}
                  whileTap={!isProcessing && getAnswerStatus(currentQuestion.id) !== 'uploaded' ? { scale: 0.95 } : {}}
                >
                  <div className="flex items-center justify-center gap-3">
                    {isProcessing ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faMicrophone} />
                        <span>{getAnswerStatus(currentQuestion.id) === 'uploaded' ? 'Answered' : 'Start Recording'}</span>
                      </>
                    )}
                  </div>
                </motion.button>
              )}
              
              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <motion.div 
                  className="mt-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <motion.div 
                      className="bg-primary-gradient h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                      initial={{ width: 0 }}
                      animate={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-sm text-gray-600">Uploading your answer... {uploadProgress}%</p>
                </motion.div>
              )}
            </div>

            {/* Questions Progress */}
            <div className="border-t border-gray-200 pt-6">
              <h5 className="text-lg font-semibold text-gray-900 mb-4">Question Progress</h5>
              <div className="flex flex-wrap gap-2">
                {questions.map((q, index) => {
                  const answer = recordedAnswers.find(a => a.questionId === q.id);
                  const status = answer 
                    ? answer.valid ? 'completed' : 'invalid'
                    : 'pending';
                  return (
                    <motion.div 
                      key={q.id}
                      className={`w-10 h-10 rounded-lg flex items-center justify-center font-semibold text-sm transition-all duration-200 ${
                        status === 'completed' 
                          ? 'bg-green-100 text-green-700 border-2 border-green-300'
                          : status === 'invalid'
                          ? 'bg-red-100 text-red-700 border-2 border-red-300'
                          : 'bg-gray-100 text-gray-600 border-2 border-gray-300'
                      }`}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <span>{index + 1}</span>
                      {status === 'completed' && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faCheck} className="text-white text-xs" />
                          </div>
                        </div>
                      )}
                      {status === 'invalid' && (
                        <div className="absolute -top-1 -right-1">
                          <div className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                            <FontAwesomeIcon icon={faTimes} className="text-white text-xs" />
                          </div>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default VoiceAssessment;