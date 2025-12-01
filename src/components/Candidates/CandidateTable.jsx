import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation, useNavigate } from 'react-router-dom';
import './CandidateTable.css';
import { useMediaOperations } from "../../hooks/useMediaOperations";
import {
  faMagnifyingGlass, faRotateRight,
  faComment, faFileAlt, faVideo, faCode,
  faChevronDown, faChevronUp, faStar,
  faDownload, faEye, faGraduationCap,
  faBriefcase, faUserTie, faBuilding,
  faIdBadge, faCalendarAlt, faUsers,
  faSpinner, faCheckCircle, faExclamationTriangle,
  faTimes, faFilter, faSort, faDesktop, faPlayCircle,
  faMicrophone,faChevronLeft,faChevronRight,faFilePdf,
  faRobot, faUserEdit, faInfoCircle, faCheck, faQuestionCircle, faList, faPaperPlane, 
  faFileExcel, faUpload, faMobile, faEnvelope, faShieldAlt,
  faChartLine, faLightbulb, faUserClock, faClipboardList, faCircle,faTools 
} from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { io } from "socket.io-client";
import { faGoogle, faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { axiosInstance } from "../../axiosUtils";

// Add this new component for the custom assessment modal
const CustomAssessmentModal = ({ show, onClose, candidateData, onSubmit }) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [assessmentType, setAssessmentType] = useState('ai'); // 'ai' or 'custom'
  const [mcqQuestions, setMcqQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' },
    { question: '', options: ['', '', '', ''], correctAnswer: '' }
  ]);
  const [voiceQuestions, setVoiceQuestions] = useState(['', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [excelFile, setExcelFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!show) return null;

  // Removed add/remove functions as we need exactly 10 MCQ questions

  const updateMcqQuestion = (index, field, value) => {
    const newQuestions = [...mcqQuestions];
    if (field === 'options') {
      newQuestions[index].options = value;
    } else {
      newQuestions[index][field] = value;
    }
    setMcqQuestions(newQuestions);
  };

  // Removed add/remove option functions as we need exactly 4 options per MCQ

  const updateOption = (questionIndex, optionIndex, value) => {
    const newQuestions = [...mcqQuestions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setMcqQuestions(newQuestions);
  };

  // Removed add/remove functions as we need exactly 5 voice questions

  const updateVoiceQuestion = (index, value) => {
    const newQuestions = [...voiceQuestions];
    newQuestions[index] = value;
    setVoiceQuestions(newQuestions);
  };

  const validateCustomQuestions = () => {
    // Validate exact number of MCQ questions (must be 10)
    if (mcqQuestions.length !== 10) {
      setError('Exactly 10 MCQ questions are required. Please add or remove questions to meet this requirement.');
      return false;
    }
    
    // Validate each MCQ question
    for (let i = 0; i < mcqQuestions.length; i++) {
      const q = mcqQuestions[i];
      if (!q.question.trim()) {
        setError(`MCQ Question ${i + 1}: Question text is required`);
        return false;
      }
      
      // Validate exactly 4 options
      if (q.options.length !== 4) {
        setError(`MCQ Question ${i + 1}: Exactly 4 options are required`);
        return false;
      }
      
      if (q.options.some(opt => !opt.trim())) {
        setError(`MCQ Question ${i + 1}: All options must be filled`);
        return false;
      }
      if (!q.correctAnswer.trim()) {
        setError(`MCQ Question ${i + 1}: Correct answer is required`);
        return false;
      }
      if (!q.options.includes(q.correctAnswer)) {
        setError(`MCQ Question ${i + 1}: Correct answer must match one of the options`);
        return false;
      }
    }

    // Validate exact number of voice questions (must be 5)
    if (voiceQuestions.length !== 5) {
      setError('Exactly 5 voice questions are required. Please add or remove questions to meet this requirement.');
      return false;
    }

    // Validate voice questions
    for (let i = 0; i < voiceQuestions.length; i++) {
      if (!voiceQuestions[i].trim()) {
        setError(`Voice Question ${i + 1}: Question text is required`);
        return false;
      }
    }

    return true;
  };

  const handleSubmit = async () => {
    if (assessmentType === 'ai') {
      // For AI assessment, just call the existing sendTestLink function
      onSubmit('ai');
      return;
    }

    // Check if there are any incomplete questions before validating
    const hasIncompleteQuestions = mcqQuestions.some(q => 
      !q.question.trim() || 
      q.options.some(opt => !opt.trim()) || 
      !q.correctAnswer.trim()
    ) || voiceQuestions.some(q => !q.trim());

    // If there are incomplete questions, show a confirmation dialog
    if (hasIncompleteQuestions) {
      const confirmed = window.confirm(
        'You have some incomplete questions.\n\n' +
        'MCQ Questions: ' + mcqQuestions.filter(q => 
          !q.question.trim() || 
          q.options.some(opt => !opt.trim()) || 
          !q.correctAnswer.trim()
        ).length + ' incomplete\n' +
        'Voice Questions: ' + voiceQuestions.filter(q => !q.trim()).length + ' incomplete\n\n' +
        'Do you want to proceed with submission anyway?'
      );
      
      if (!confirmed) {
        return; // User cancelled the submission
      }
    }

    // For custom assessment, validate and submit custom questions
    if (!validateCustomQuestions()) {
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await onSubmit('custom', {
        customMcqQuestions: mcqQuestions,
        customVoiceQuestions: voiceQuestions.map(q => ({ question: q }))
      });
    } catch (err) {
      setError(err.message || 'Failed to create custom assessment');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle Excel file upload
  const handleExcelFileUpload = async (file) => {
    // Check file type
    if (!file.name.endsWith('.xlsx')) {
      setError('Please upload a valid Excel file (.xlsx)');
      return;
    }
    
    // Check file size (limit to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('File size exceeds 5MB limit');
      return;
    }
    
    setIsProcessing(true);
    setError('');
    setExcelFile(file);
    
    try {
      // Dynamically import xlsx library
      const XLSX = await import('xlsx');
      
      // Read the Excel file
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Process MCQ Questions sheet
          const mcqSheetName = workbook.SheetNames.find(name => name.includes('MCQ'));
          if (!mcqSheetName) {
            setError('MCQ Questions sheet not found in the Excel file');
            setIsProcessing(false);
            return;
          }
          
          const mcqSheet = workbook.Sheets[mcqSheetName];
          const mcqData = XLSX.utils.sheet_to_json(mcqSheet);
          
          // Validate MCQ data
          if (mcqData.length !== 10) {
            setError(`Expected exactly 10 MCQ questions, but found ${mcqData.length}`);
            setIsProcessing(false);
            return;
          }
          
          // Format MCQ questions
          const formattedMcqQuestions = mcqData.map((row, index) => {
            // Extract options from Option A, Option B, etc.
            const options = [
              row['Option A'] || '',
              row['Option B'] || '',
              row['Option C'] || '',
              row['Option D'] || ''
            ];
            
            return {
              question: row['Question'] || '',
              options: options,
              correctAnswer: row['Correct Answer'] || ''
            };
          });
          
          // Process Voice Questions sheet
          const voiceSheetName = workbook.SheetNames.find(name => name.includes('Voice'));
          if (!voiceSheetName) {
            setError('Voice Questions sheet not found in the Excel file');
            setIsProcessing(false);
            return;
          }
          
          const voiceSheet = workbook.Sheets[voiceSheetName];
          const voiceData = XLSX.utils.sheet_to_json(voiceSheet);
          
          // Validate voice data
          if (voiceData.length !== 5) {
            setError(`Expected exactly 5 voice questions, but found ${voiceData.length}`);
            setIsProcessing(false);
            return;
          }
          
          // Format voice questions (extract just the text)
          const formattedVoiceQuestions = voiceData.map(row => row['Question Text'] || '');
          
          // Update state with the parsed questions
          setMcqQuestions(formattedMcqQuestions);
          setVoiceQuestions(formattedVoiceQuestions);
          
          // Show success message with toast instead of alert
          toast.success(`Successfully loaded ${formattedMcqQuestions.length} MCQ questions and ${formattedVoiceQuestions.length} voice questions from the Excel file.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // Automatically show preview after successful upload
          setShowPreviewModal(true);
        } catch (err) {
          setError('Error processing Excel file: ' + err.message);
          setExcelFile(null);
        } finally {
          setIsProcessing(false);
        }
      };
      
      reader.onerror = () => {
        setError('Error reading the file');
        setExcelFile(null);
        setIsProcessing(false);
      };
      
      reader.readAsArrayBuffer(file);
    } catch (err) {
      setError('Failed to load Excel processing library: ' + err.message);
      setExcelFile(null);
      setIsProcessing(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Create Assessment</h2>
                <p className="text-gray-600 mt-1">Choose assessment type and configure questions</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </button>
            </div>

            <div className="mb-8">
              <div className="flex flex-wrap border-b border-gray-200 -mx-1">
                <button
                  className={`m-1 px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    assessmentType === 'ai'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setAssessmentType('ai')}
                >
                  <FontAwesomeIcon icon={faRobot} />
                  AI Generated Assessment
                </button>
                <button
                  className={`m-1 px-6 py-3 font-medium text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
                    assessmentType === 'custom'
                      ? 'bg-blue-100 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                  onClick={() => setAssessmentType('custom')}
                >
                  <FontAwesomeIcon icon={faUserEdit} />
                  Custom Assessment
                </button>
              </div>
            </div>

            {assessmentType === 'ai' && (
              <div className="text-center py-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FontAwesomeIcon icon={faRobot} className="text-3xl text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI Generated Assessment</h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Automatically generate 10 MCQ questions and 5 voice questions based on the candidate's resume and job description.
                </p>
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 text-left max-w-2xl mx-auto shadow-sm">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center gap-2">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    What to expect:
                  </h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">10 technical and behavioral MCQ questions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">5 voice interview questions</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">Automated question generation based on job requirements</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">Proctored assessment with video recording</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {assessmentType === 'custom' && (
              <div className="space-y-8">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-5 shadow-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600" />
                    </div>
                    <h4 className="font-bold text-blue-800 text-lg">Requirements</h4>
                  </div>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">Exactly 10 MCQ questions required (currently <span className="font-semibold">{mcqQuestions.length}/10</span>)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">Each MCQ must have exactly 4 options with 1 correct answer</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <FontAwesomeIcon icon={faCheck} className="text-blue-600 text-xs" />
                      </div>
                      <span className="text-blue-800">Exactly 5 voice questions required (currently <span className="font-semibold">{voiceQuestions.length}/5</span>)</span>
                    </li>
                  </ul>
                </div>
                
                {/* Excel File Upload Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faFileExcel} className="text-green-600" />
                      Upload Questions from Excel File
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Upload your pre-prepared questions in Excel format</p>
                  </div>
                  <div className="p-6">
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-5 text-center">
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                          <FontAwesomeIcon icon={faFileExcel} className="text-2xl text-green-600" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-lg mb-2">Upload Excel Template</h4>
                          <p className="text-gray-600 mb-4 max-w-md mx-auto">
                            Upload your questions from our Excel template. The file should contain 10 MCQ questions and 5 voice questions.
                          </p>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                          <label className="flex-1 relative">
                            <input
                              type="file"
                              accept=".xlsx"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  handleExcelFileUpload(file);
                                }
                              }}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                              disabled={isProcessing}
                            />
                            <div className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center justify-center gap-2 ${isProcessing ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 shadow-md hover:shadow-lg cursor-pointer'}`}>
                              <FontAwesomeIcon icon={isProcessing ? faSpinner : faUpload} spin={isProcessing} />
                              {isProcessing ? 'Processing...' : 'Choose File'}
                            </div>
                          </label>
                          <a 
                            href="/src/assets/templates/Recruitment_Assessment_Template.xlsx" 
                            download="Recruitment_Assessment_Template.xlsx"
                            className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center justify-center gap-2"
                          >
                            <FontAwesomeIcon icon={faDownload} />
                            Download Template
                          </a>
                        </div>
                        {excelFile && (
                          <div className="mt-3 text-sm text-gray-600 flex items-center gap-2">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                            Selected: {excelFile.name}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faList} className="text-blue-600" />
                      Custom MCQ Questions
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Create 10 multiple choice questions with 4 options each</p>
                  </div>
                  <div className="p-6">
                    {error && (
                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                        <div className="flex items-center gap-2">
                          <FontAwesomeIcon icon={faExclamationTriangle} className="text-red-600" />
                          <p className="text-red-700 font-medium">Error</p>
                        </div>
                        <p className="text-red-700 text-sm mt-2">{error}</p>
                      </div>
                    )}
                    <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                      {mcqQuestions.map((question, qIndex) => (
                        <div key={qIndex} className="border border-gray-200 rounded-lg p-5 bg-gray-50 hover:bg-white transition-colors duration-200">
                          <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-200">
                            <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                <span className="text-blue-700 font-semibold text-sm">{qIndex + 1}</span>
                              </div>
                              Question {qIndex + 1}
                            </h4>
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faQuestionCircle} className="text-blue-500" />
                              Question Text
                            </label>
                            <textarea
                              value={question.question}
                              onChange={(e) => updateMcqQuestion(qIndex, 'question', e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              rows="3"
                              placeholder="Enter your question here..."
                            />
                          </div>
                          <div className="mb-4">
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faList} className="text-blue-500" />
                              Options (Exactly 4 required)
                            </label>
                            <div className="space-y-3">
                              {question.options.map((option, oIndex) => (
                                <div key={oIndex} className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                    <span className="text-gray-700 font-medium text-sm">{String.fromCharCode(65 + oIndex)}</span>
                                  </div>
                                  <input
                                    type="text"
                                    value={option}
                                    onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    placeholder={`Option ${String.fromCharCode(65 + oIndex)}...`}
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                              <FontAwesomeIcon icon={faCheckCircle} className="text-green-500" />
                              Correct Answer
                            </label>
                            <select
                              value={question.correctAnswer}
                              onChange={(e) => updateMcqQuestion(qIndex, 'correctAnswer', e.target.value)}
                              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                              <option value="">Select correct answer</option>
                              {question.options.map((option, index) => (
                                <option key={index} value={option}>
                                  {String.fromCharCode(65 + index)}. {option}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                    <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <FontAwesomeIcon icon={faMicrophone} className="text-blue-600" />
                      Custom Voice Questions
                    </h3>
                    <p className="text-gray-600 text-sm mt-1">Create 5 voice interview questions</p>
                  </div>
                  <div className="p-6">
                    <div className="space-y-5">
                      {voiceQuestions.map((question, index) => (
                        <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white transition-colors duration-200">
                          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                            <span className="text-blue-700 font-semibold text-sm">{index + 1}</span>
                          </div>
                          <div className="flex-1">
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                              Voice Question {index + 1}
                            </label>
                            <textarea
                              value={question}
                              onChange={(e) => updateVoiceQuestion(index, e.target.value)}
                              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                              rows="3"
                              placeholder="Enter your voice question here..."
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="flex justify-end gap-4 mt-8 pt-6 border-t border-gray-200">
              <motion.button
                onClick={onClose}
                className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </motion.button>
              {assessmentType === 'custom' && (
                <motion.button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                  disabled={isSubmitting}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faEye} />
                  Preview
                </motion.button>
              )}
              <motion.button
                onClick={handleSubmit}
                className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-200 flex items-center gap-2 ${
                  isSubmitting 
                    ? 'bg-blue-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-md hover:shadow-lg'
                }`}
                disabled={isSubmitting}
                whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Creating Assessment...
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faPaperPlane} />
                    {assessmentType === 'ai' ? 'Generate AI Assessment' : 'Create Custom Assessment'}
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      <PreviewModal 
        show={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        mcqQuestions={mcqQuestions}
        voiceQuestions={voiceQuestions}
      />
    </AnimatePresence>
  );
};

// Preview Modal Component
const PreviewModal = ({ show, onClose, mcqQuestions, voiceQuestions }) => {
  if (!show) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          <div className="p-6 md:p-8">
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-200">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Assessment Preview</h2>
                <p className="text-gray-600 mt-1">Review your questions before submitting</p>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
              >
                <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
              </button>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faList} className="text-blue-600" />
                    MCQ Questions ({mcqQuestions.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-6 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
                    {mcqQuestions.map((question, qIndex) => (
                      <div key={qIndex} className="border border-gray-200 rounded-lg p-5 bg-gray-50">
                        <div className="flex justify-between items-start mb-4 pb-3 border-b border-gray-200">
                          <h4 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-700 font-semibold text-sm">{qIndex + 1}</span>
                            </div>
                            Question {qIndex + 1}
                          </h4>
                        </div>
                        <div className="mb-4">
                          <p className="text-gray-800 font-medium mb-3">{question.question || <span className="text-gray-400 italic">No question text provided</span>}</p>
                        </div>
                        <div className="mb-4">
                          <h5 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                            <FontAwesomeIcon icon={faList} className="text-blue-500" />
                            Options
                          </h5>
                          <div className="space-y-2">
                            {question.options.map((option, oIndex) => (
                              <div key={oIndex} className="flex items-center gap-3 p-2 rounded bg-white border border-gray-200">
                                <div className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                                  <span className="text-gray-700 font-medium text-xs">{String.fromCharCode(65 + oIndex)}</span>
                                </div>
                                <span className={question.correctAnswer === option ? "font-semibold text-green-600" : "text-gray-700"}>
                                  {option || <span className="text-gray-400 italic">No option text provided</span>}
                                  {question.correctAnswer === option && (
                                    <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">Correct</span>
                                  )}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <FontAwesomeIcon icon={faMicrophone} className="text-blue-600" />
                    Voice Questions ({voiceQuestions.length})
                  </h3>
                </div>
                <div className="p-6">
                  <div className="space-y-5">
                    {voiceQuestions.map((question, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200 bg-gray-50">
                        <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0 mt-1">
                          <span className="text-blue-700 font-semibold text-sm">{index + 1}</span>
                        </div>
                        <div className="flex-1">
                          <p className="text-gray-800 font-medium">
                            {question || <span className="text-gray-400 italic">No question text provided</span>}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
                <motion.button
                  onClick={onClose}
                  className="px-6 py-3 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Close Preview
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Enhanced Status Badge Component
const CandidateStatusBadge = ({ session, assessmentSessionId, candidateDecisions }) => {
  // Check for candidate decision first (highest priority)
  const decision = candidateDecisions[assessmentSessionId];
  
  if (decision) {
    switch (decision.decision) {
      case 'selected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-green-500 to-green-600 text-white shadow-sm">
            <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
            Selected ✅
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-red-500 to-red-600 text-white shadow-sm">
            <FontAwesomeIcon icon={faTimes} className="mr-1" />
            Rejected ❌
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
            Decision Pending
          </span>
        );
    }
  }
  
  // Fall back to assessment session status
  if (!session) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Sent</span>;
  
  switch (session.status) {
    case 'completed': 
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Assessment Done</span>;
    case 'in-progress': 
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
    default: 
      return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Pending</span>;
  }
};

function CandidateTable() {
  const [expandedRow, setExpandedRow] = useState(null);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [expandedLists, setExpandedLists] = useState({});
  const [allSelected, setAllSelected] = useState({});
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [testScores, setTestScores] = useState([]);
  const [showGenerationModal, setShowGenerationModal] = useState(false);
  const [showCustomAssessmentModal, setShowCustomAssessmentModal] = useState(false);
  const [currentCandidate, setCurrentCandidate] = useState(null);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [generationStatus, setGenerationStatus] = useState({
    loading: false,
    error: null,
    success: false,
    message: null
  });
  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();
  // Add pagination states
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const location = useLocation();
  const navigate = useNavigate();
  const initialViewMode = location.state?.view || 'all';
  const [viewMode, setViewMode] = useState(initialViewMode);
  const [recentCandidates, setRecentCandidates] = useState([]);
  const [historicalCandidates, setHistoricalCandidates] = useState([]);
  const [candidateDecisions, setCandidateDecisions] = useState({});
  const [recommendedCandidates, setRecommendedCandidates] = useState([]);
  const [selectedFilters, setSelectedFilters] = useState({
    skills: [],
    designation: [],
    degree: [],
    company_names: [],
    jobType: [],
    job_title: [],
  });

  // Add state for dropdowns
  const [resumeDropdownOpen, setResumeDropdownOpen] = useState({});
  const [interviewDropdownOpen, setInterviewDropdownOpen] = useState({});
  const [scoreDropdownOpen, setScoreDropdownOpen] = useState({});
  const [recordingsDropdownOpen, setRecordingsDropdownOpen] = useState({});
  const [voiceAnswersDropdownOpen, setVoiceAnswersDropdownOpen] = useState({});
  const [mergedPdfDropdownOpen, setMergedPdfDropdownOpen] = useState({});
  
  // 🔥 NEW: Bulk selection state for merged documents
  const [selectedMergedDocs, setSelectedMergedDocs] = useState(new Set());
  const [isAllMergedDocsSelected, setIsAllMergedDocsSelected] = useState(false);
  const [bulkDownloadInProgress, setBulkDownloadInProgress] = useState(false);
  
  // Refs for dropdown containers
  const resumeDropdownRefs = useRef({});
  const interviewDropdownRefs = useRef({});
  const scoreDropdownRefs = useRef({});
  const recordingsDropdownRefs = useRef({});
  const voiceAnswersDropdownRefs = useRef({});
  const mergedPdfDropdownRefs = useRef({});

  const filterIcons = {
    jobType: faUserTie,
    skills: faCode,
    designation: faBriefcase,
    degree: faGraduationCap,
    company_names: faBuilding,
    job_title: faIdBadge,
  };

  const [showModal, setShowModal] = useState({});

  useEffect(() => {
    const socket = io("");
    socket.on("apiResponseUpdated", (newResponse) => {
      setCandidates((prevCandidates) => {
        const exists = prevCandidates.some(
          (candidate) =>
            candidate.resumeId === newResponse.resumeId &&
            candidate.jobDescriptionId === newResponse.jobDescriptionId
        );
        if (exists) {
          console.log("Duplicate record detected and ignored:", newResponse);
          return prevCandidates;
        }
        return [newResponse, ...prevCandidates];
      });
    });
    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [candidatesRes, scoresRes] = await Promise.all([
          axiosInstance.get('/api/candidate-filtering'),
          axiosInstance.get('/api/test-results')
        ]);
        
        // Debug log to see the raw data structure
        console.log('Raw candidates data:', candidatesRes.data);
        console.log('Raw scores data:', scoresRes.data);
        
        const uniqueCandidates = candidatesRes.data.filter((member, index, self) => {
          return (
            index ===
            self.findIndex(
              (c) =>
                c.resumeId === member.resumeId &&
                c.jobDescriptionId === member.jobDescriptionId
            )
          );
        }).map((member) => {
          // Debug log to see individual member structure
          console.log('Individual member:', member);
          if (member.testScore) {
            console.log('Member testScore:', member.testScore);
          }
          
          return {
            ...member,
            matchingResult: member.matchingResult?.[0] ? [{
              "Resume Data": member.matchingResult[0]["Resume Data"],
              Analysis: {
                "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
                "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
                "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
                "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
                "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
                Strengths: member.matchingResult[0].Analysis?.Strengths || [],
                Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
                "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
                "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
                "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
                "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
                // New fields
                "Experience Threshold Compliance": member.matchingResult[0].Analysis?.["Experience Threshold Compliance"] || "N/A",
                "Recent Experience Relevance": member.matchingResult[0].Analysis?.["Recent Experience Relevance"] || "N/A",
                "Analysis Summary": member.matchingResult[0]["Analysis Summary"] || member.matchingResult[0].Analysis?.["Analysis Summary"] || "N/A"
              }
            }] : []
          }
        });
        setCandidates(uniqueCandidates);
        setMembers(uniqueCandidates);
        setFilteredMembers(uniqueCandidates);
        setTestScores(scoresRes.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchSegmentedData = async () => {
      try {
        const response = await axiosInstance.get('/api/candidates/segmented');
        setRecentCandidates(response.data.recent);
        setHistoricalCandidates(response.data.history);
      } catch (error) {
        console.error('Error fetching segmented candidates:', error);
        setRecentCandidates([]);
        setHistoricalCandidates([]);
      }
    };
    fetchSegmentedData();
  }, []);

  // Fetch candidate decisions
  useEffect(() => {
    const fetchCandidateDecisions = async () => {
      try {
        const response = await axiosInstance.get('/api/candidate-decisions');
        const decisionsMap = {};
        response.data.forEach(decision => {
          if (decision.assessmentSessionId) {
            decisionsMap[decision.assessmentSessionId] = decision;
          }
        });
        setCandidateDecisions(decisionsMap);
      } catch (error) {
        console.error('Error fetching candidate decisions:', error);
      }
    };
    fetchCandidateDecisions();
  }, []);

  const fetchRecommendationsConsentOnly = async () => {
    try {
      const res = await axiosInstance.get("/api/recommendations/candidates");
      const data = res.data.map((member) => ({
        ...member,
        matchingResult: member.matchingResult?.[0] ? [{
          "Resume Data": member.matchingResult[0]["Resume Data"],
          Analysis: {
            "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
            "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
            "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
            "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
            "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
            Strengths: member.matchingResult[0].Analysis?.Strengths || [],
            Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
            "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
            "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
            "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
            "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
          }
        }] : []
      }));
      setRecommendedCandidates(data);
      setMembers(data);
      setFilteredMembers([]);
    } catch (error) {
      console.error('Failed to fetch recommended candidates:', error.message);
    }
  };

  useEffect(() => {
    if (viewMode === 'recommended') {
      fetchRecommendationsConsentOnly();
    } else {
      setFilteredMembers(
        viewMode === 'recent'
          ? recentCandidates
          : viewMode === 'history'
            ? historicalCandidates
            : candidates
      );
      setSelectedFilters({
        skills: [],
        designation: [],
        degree: [],
        company_names: [],
        jobType: [],
        job_title: [],
      });
      setAllSelected({});
    }
  }, [viewMode, candidates, recentCandidates, historicalCandidates]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      Object.keys(resumeDropdownRefs.current).forEach(key => {
        if (resumeDropdownRefs.current[key] && !resumeDropdownRefs.current[key].contains(event.target)) {
          setResumeDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(interviewDropdownRefs.current).forEach(key => {
        if (interviewDropdownRefs.current[key] && !interviewDropdownRefs.current[key].contains(event.target)) {
          setInterviewDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(scoreDropdownRefs.current).forEach(key => {
        if (scoreDropdownRefs.current[key] && !scoreDropdownRefs.current[key].contains(event.target)) {
          setScoreDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(recordingsDropdownRefs.current).forEach(key => {
        if (recordingsDropdownRefs.current[key] && !recordingsDropdownRefs.current[key].contains(event.target)) {
          setRecordingsDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(voiceAnswersDropdownRefs.current).forEach(key => {
        if (voiceAnswersDropdownRefs.current[key] && !voiceAnswersDropdownRefs.current[key].contains(event.target)) {
          setVoiceAnswersDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
      
      Object.keys(mergedPdfDropdownRefs.current).forEach(key => {
        if (mergedPdfDropdownRefs.current[key] && !mergedPdfDropdownRefs.current[key].contains(event.target)) {
          setMergedPdfDropdownOpen(prev => ({ ...prev, [key]: false }));
        }
      });
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const sendTestLink = async (candidateEmail, jobTitle, resumeId, jdId) => {
    setShowGenerationModal(true);
    setGenerationStatus({
      loading: true,
      error: null,
      success: false,
      message: 'Checking your assessment limits...'
    });
    try {
      const userRes = await axiosInstance.get('/user', { withCredentials: true });
      const user = userRes.data.user;
      if (!user.isAdmin && user.subscription?.limits?.assessments) {
        const remainingAssessments = user.subscription.limits.assessments - (user.usage?.assessments || 0);
        if (remainingAssessments <= 0) {
          throw new Error(`You've reached your assessment limit (${user.subscription.limits.assessments})`);
        }
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Generating MCQ questions...'
      }));
      const mcqResponse = await axiosInstance.post(
        '/api/generate-questions',
        { resumeId, jobDescriptionId: jdId }
      );
      if (!mcqResponse.data.success) {
        throw new Error(mcqResponse.data.error || 'MCQ question generation failed');
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Generating voice questions...'
      }));
      const voiceResponse = await axiosInstance.post(
        '/api/generate-voice-questions',
        { jobDescriptionId: jdId }
      );
      if (!voiceResponse.data.success) {
        throw new Error(voiceResponse.data.error || 'Voice question generation failed');
      }
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Sending assessment email...'
      }));
      const sessionResponse = await axiosInstance.post(
        '/api/send-test-link',
        {
          candidateEmail,
          jobTitle,
          resumeId,
          jobDescriptionId: jdId,
          questions: mcqResponse.data.questions,
          voiceQuestions: voiceResponse.data.questions
        }
      );
      if (!sessionResponse.data.success) {
        throw new Error(sessionResponse.data.error || 'Email sending failed');
      }
      setGenerationStatus({
        loading: false,
        error: null,
        success: true,
        message: `Assessment sent to ${candidateEmail}`,
        testLink: sessionResponse.data.testLink
      });
      
      // Show success toast immediately
      toast.success(`Assessment successfully sent to ${candidateEmail}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      setTimeout(() => {
          // Show success message with toast instead of alert
          toast.success(`Successfully loaded ${formattedMcqQuestions.length} MCQ questions and ${formattedVoiceQuestions.length} voice questions from the Excel file.`, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
          // Automatically show preview after successful upload
          setShowPreviewModal(true);
        setShowGenerationModal(false);
        const fetchCandidates = async () => {
          try {
            const response = await axiosInstance.get("/api/candidate-filtering");
            const data = response.data;
            const uniqueCandidates = data.filter((member, index, self) => {
              return (
                index ===
                self.findIndex(
                  (c) =>
                    c.resumeId === member.resumeId &&
                    c.jobDescriptionId === member.jobDescriptionId
                )
              );
            }).map((member) => ({
              ...member,
              matchingResult: member.matchingResult?.[0] ? [{
                "Resume Data": member.matchingResult[0]["Resume Data"],
                Analysis: {
                  "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
                  "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
                  "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
                  "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
                  "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
                  Strengths: member.matchingResult[0].Analysis?.Strengths || [],
                  Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
                  "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
                  "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
                  "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
                  "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
                  // New fields
                  "Experience Threshold Compliance": member.matchingResult[0].Analysis?.["Experience Threshold Compliance"] || "N/A",
                  "Recent Experience Relevance": member.matchingResult[0].Analysis?.["Recent Experience Relevance"] || "N/A",
                  "Analysis Summary": member.matchingResult[0]["Analysis Summary"] || member.matchingResult[0].Analysis?.["Analysis Summary"] || "N/A"
                }
              }] : []
            }));
            setCandidates(uniqueCandidates);
            setMembers(uniqueCandidates);
            setFilteredMembers(uniqueCandidates);
          } catch (error) {
            console.error("Error fetching candidate data:", error.message);
          }
        };
        fetchCandidates();
      }, 10000);
    } catch (error) {
      console.error('Assessment error:', error);
      let errorMessage = 'Failed to send assessment';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setGenerationStatus({
        loading: false,
        error: errorMessage,
        success: false,
        message: null,
        testLink: error.response?.data?.testLink
      });
    }
  };

  // New function to handle custom assessment creation
  const createCustomAssessment = async (candidateData, customQuestions) => {
    setShowGenerationModal(true);
    setGenerationStatus({
      loading: true,
      error: null,
      success: false,
      message: 'Creating custom assessment...'
    });
    
    try {
      const { customMcqQuestions, customVoiceQuestions } = customQuestions;
      
      setGenerationStatus(prev => ({
        ...prev,
        message: 'Sending custom assessment email...'
      }));
      
      const sessionResponse = await axiosInstance.post(
        '/api/create-custom-assessment',
        {
          candidateEmail: candidateData.email,
          jobTitle: candidateData.jobTitle,
          resumeId: candidateData.resumeId,
          jobDescriptionId: candidateData.jdId,
          customMcqQuestions,
          customVoiceQuestions
        }
      );
      
      if (!sessionResponse.data.success) {
        throw new Error(sessionResponse.data.error || 'Failed to create custom assessment');
      }
      
      setGenerationStatus({
        loading: false,
        error: null,
        success: true,
        message: `Custom assessment sent to ${candidateData.email}`,
        testLink: sessionResponse.data.testLink
      });
      
      // Show success toast
      toast.success(`Custom assessment successfully sent to ${candidateData.email}!`, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      setTimeout(() => {
        setShowGenerationModal(false);
        setShowCustomAssessmentModal(false);
        // Refresh candidate data
        const fetchCandidates = async () => {
          try {
            const response = await axiosInstance.get("/api/candidate-filtering");
            const data = response.data;
            const uniqueCandidates = data.filter((member, index, self) => {
              return (
                index ===
                self.findIndex(
                  (c) =>
                    c.resumeId === member.resumeId &&
                    c.jobDescriptionId === member.jobDescriptionId
                )
              );
            }).map((member) => ({
              ...member,
              matchingResult: member.matchingResult?.[0] ? [{
                "Resume Data": member.matchingResult[0]["Resume Data"],
                Analysis: {
                  "Matching Score": member.matchingResult[0].Analysis?.["Matching Score"] || 0,
                  "Matched Skills": member.matchingResult[0].Analysis?.["Matched Skills"] || [],
                  "Unmatched Skills": member.matchingResult[0].Analysis?.["Unmatched Skills"] || [],
                  "Matched Skills Percentage": member.matchingResult[0].Analysis?.["Matched Skills Percentage"] || 0,
                  "Unmatched Skills Percentage": member.matchingResult[0].Analysis?.["Unmatched Skills Percentage"] || 0,
                  Strengths: member.matchingResult[0].Analysis?.Strengths || [],
                  Recommendations: member.matchingResult[0].Analysis?.Recommendations || [],
                  "Required Industrial Experience": member.matchingResult[0].Analysis?.["Required Industrial Experience"] || "N/A",
                  "Candidate Industrial Experience": member.matchingResult[0].Analysis?.["Candidate Industrial Experience"] || "N/A",
                  "Required Domain Experience": member.matchingResult[0].Analysis?.["Required Domain Experience"] || "N/A",
                  "Candidate Domain Experience": member.matchingResult[0].Analysis?.["Candidate Domain Experience"] || "N/A",
                  // New fields
                  "Experience Threshold Compliance": member.matchingResult[0].Analysis?.["Experience Threshold Compliance"] || "N/A",
                  "Recent Experience Relevance": member.matchingResult[0].Analysis?.["Recent Experience Relevance"] || "N/A",
                  "Analysis Summary": member.matchingResult[0]["Analysis Summary"] || member.matchingResult[0].Analysis?.["Analysis Summary"] || "N/A"
                }
              }] : []
            }));
            setCandidates(uniqueCandidates);
            setMembers(uniqueCandidates);
            setFilteredMembers(uniqueCandidates);
          } catch (error) {
            console.error("Error fetching candidate data:", error.message);
          }
        };
        fetchCandidates();
      }, 10000);
    } catch (error) {
      console.error('Custom assessment error:', error);
      let errorMessage = 'Failed to create custom assessment';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      setGenerationStatus({
        loading: false,
        error: errorMessage,
        success: false,
        message: null,
        testLink: error.response?.data?.testLink
      });
    }
  };

  // New function to handle assessment type selection
  const handleAssessmentSelection = (candidateData) => {
    setCurrentCandidate(candidateData);
    setShowCustomAssessmentModal(true);
  };

  // New function to handle assessment submission from modal
  const handleAssessmentSubmit = async (type, customQuestions = null) => {
    if (type === 'ai') {
      // Call the existing sendTestLink function
      await sendTestLink(
        currentCandidate.email,
        currentCandidate.jobTitle,
        currentCandidate.resumeId,
        currentCandidate.jdId
      );
    } else if (type === 'custom' && customQuestions) {
      // Call the new createCustomAssessment function
      await createCustomAssessment(currentCandidate, customQuestions);
    }
  };

  const toggleModal = (filter) => {
    setShowModal((prev) => ({ ...prev, [filter]: !prev[filter] }));
  };

  const handleFilterChange = (filterCategory, value) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filterCategory]: value,
    }));
  };

  const applyFilters = () => {
    let filtered = members;
    if (selectedFilters.jobType.length) {
      filtered = filtered.filter((member) => {
        const experienceStr = member.matchingResult[0]?.["Resume Data"]?.experience || "0 years";
        const experienceYears = parseFloat(experienceStr);
        const isFresher = selectedFilters.jobType.includes("Fresher") && experienceYears === 0;
        const isExperienced = selectedFilters.jobType.includes("Experienced") && experienceYears > 0;
        return isFresher || isExperienced;
      });
    }
    if (selectedFilters.degree.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.degree.some((degree) =>
          (member.matchingResult[0]?.["Resume Data"]?.degree || [])
            .join(", ")
            .toLowerCase()
            .includes(degree.toLowerCase())
        )
      );
    }
    if (selectedFilters.company_names.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.company_names.some((company_name) =>
          (member.matchingResult[0]?.["Resume Data"]?.company_names || [])
            .join(", ")
            .toLowerCase()
            .includes(company_name.toLowerCase())
        )
      );
    }
    if (selectedFilters.skills.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.skills.some((skill) =>
          (member.matchingResult[0]?.["Resume Data"]?.skills || [])
            .join(", ")
            .toLowerCase()
            .includes(skill.toLowerCase())
        )
      );
    }
    if (selectedFilters.job_title.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.job_title.some((title) =>
          (member.matchingResult[0]?.["Resume Data"]?.["Job Title"] || "")
            .toLowerCase()
            .includes(title.toLowerCase())
        )
      );
    }
    if (selectedFilters.designation.length) {
      filtered = filtered.filter((member) =>
        selectedFilters.designation.some((designation) =>
          (member.matchingResult[0]?.["Resume Data"]?.designation || [])
            .join(", ")
            .toLowerCase()
            .includes(designation.toLowerCase())
        )
      );
    }
    setFilteredMembers(filtered);
  };

  const extractUniqueValues = (key) => {
    if (key === "jobType") {
      return ["Fresher", "Experienced"];
    }
    if (key === "job_title") {
      return [
        ...new Set(
          members.map(
            (m) => m.matchingResult[0]?.["Resume Data"]?.["Job Title"] || ""
          ).filter(Boolean)
        ),
      ];
    }
    return [
      ...new Set(
        members.flatMap((member) =>
          (member.matchingResult[0]?.["Resume Data"]?.[key] || []).flat()
        ).filter(Boolean)
      ),
    ];
  };

  const resetFilters = (filterCategory) => {
    handleFilterChange(filterCategory, []);
    setAllSelected((prev) => ({ ...prev, [filterCategory]: false }));
  };

  const resetAllFilters = () => {
    setSelectedFilters({
      skills: [],
      designation: [],
      degree: [],
      company_names: [],
      jobType: [],
      job_title: [],
    });
    setAllSelected({});
    if (viewMode === 'recommended') {
      setFilteredMembers([]);
    } else {
      setFilteredMembers(members);
    }
  };

  const handleResumeLink = async (resumeId) => {
    try {
      if (!resumeId) {
        console.error('No resume ID provided');
        return { success: false, error: 'No resume selected' };
      }
      const response = await axiosInstance.get(`/api/resumes/${resumeId}`);
      if (!response.data?.success) {
        throw new Error(response.data?.error || 'Failed to get resume URL');
      }
      return {
        success: true,
        url: response.data.url,
        filename: response.data.filename
      };
    } catch (error) {
      console.error('Error getting resume URL:', {
        error: error.response?.data || error.message,
        resumeId
      });
      return { 
        success: false,
        error: error.response?.data?.error || 'Failed to access resume',
        details: process.env.NODE_ENV === 'development' 
          ? error.response?.data?.details || error.message 
          : undefined
      };
    }
  };

  const handlejdLink = async (jobDescriptionId) => {
    try {
      if (!jobDescriptionId) return '#';
      const response = await axiosInstance.get(`/api/job-descriptions/${jobDescriptionId}`);
      return response.data?.url || '#';
    } catch (error) {
      console.error('Error getting resume URL:', error);
      return '#';
    }
  };

  // ===========================
  // MERGED PDF HANDLERS
  // ===========================
  
  const handleGenerateMergedPDF = async (assessmentSessionId) => {
    try {
      console.log('🔄 Generating merged PDF for session:', assessmentSessionId);
      toast.info('🔄 Generating merged PDF...', { autoClose: 3000 });
      
      const response = await axiosInstance.post(`/api/merged-pdf/generate/${assessmentSessionId}`);
      
      if (response.data.success) {
        const message = response.data.message;
        toast.success(`✅ ${message}`, { autoClose: 5000 });
        console.log('✅ Merged PDF generated:', response.data.data);
      } else {
        throw new Error(response.data.error || 'Failed to generate merged PDF');
      }
    } catch (error) {
      console.error('❌ Error generating merged PDF:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to generate merged PDF';
      toast.error(`❌ ${errorMessage}`, { autoClose: 5000 });
    }
  };
  
  const handleViewMergedPDF = async (assessmentSessionId) => {
    try {
      console.log('👁️ Viewing merged PDF for session:', assessmentSessionId);
      
      // First try to generate/get the merged PDF
      const generateResponse = await axiosInstance.post(`/api/merged-pdf/generate/${assessmentSessionId}`);
      
      if (generateResponse.data.success && generateResponse.data.data.downloadUrl) {
        window.open(generateResponse.data.data.downloadUrl, '_blank');
        toast.success('📄 Opening merged PDF for viewing', { autoClose: 3000 });
      } else {
        throw new Error('Failed to get merged PDF view URL');
      }
    } catch (error) {
      console.error('❌ Error viewing merged PDF:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to view merged PDF';
      toast.error(`❌ ${errorMessage}`, { autoClose: 5000 });
    }
  };
  
  const handleDownloadMergedPDF = async (assessmentSessionId) => {
    try {
      console.log('⬇️ Downloading merged PDF for session:', assessmentSessionId);
      
      // First try to generate/get the merged PDF
      const generateResponse = await axiosInstance.post(`/api/merged-pdf/generate/${assessmentSessionId}?download=true`);
      
      if (generateResponse.data.success && generateResponse.data.data.downloadUrl) {
        // Create a temporary link to trigger download
        const link = document.createElement('a');
        link.href = generateResponse.data.data.downloadUrl;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        toast.success('📥 Merged PDF download started', { autoClose: 3000 });
      } else {
        throw new Error('Failed to get merged PDF download URL');
      }
    } catch (error) {
      console.error('❌ Error downloading merged PDF:', error);
      const errorMessage = error.response?.data?.error || error.message || 'Failed to download merged PDF';
      toast.error(`❌ ${errorMessage}`, { autoClose: 5000 });
    }
  };
  
  // 🔥 NEW: Bulk download handler for merged documents
  const handleBulkMergedDocsDownload = async () => {
    if (selectedMergedDocs.size === 0) {
      toast.warning('⚠️ Please select merged documents to download', { toastId: 'bulk-merged-download-warning' });
      return;
    }
    
    setBulkDownloadInProgress(true);
    const loadingToast = toast.loading(`📦 Preparing to download ${selectedMergedDocs.size} merged documents...`);
    
    try {
      console.log('🔥 [BULK MERGED DOWNLOAD] Starting bulk merged documents download:', {
        selectedCount: selectedMergedDocs.size,
        timestamp: new Date().toISOString()
      });
      
      // Convert Set to Array and extract assessment session IDs
      // FIX: Use the actual candidate IDs instead of array indexes
      const selectedAssessmentSessionIds = Array.from(selectedMergedDocs).map(candidateId => {
        // Find the candidate in filteredMembers by ID
        const candidate = filteredMembers.find(member => member._id === candidateId);
        const session = candidate?.assessmentSession;
        
        // Get the assessment session ID
        return session?._id || null;
      }).filter(id => id !== null); // Filter out any null IDs
      
      if (selectedAssessmentSessionIds.length === 0) {
        throw new Error('No valid assessment sessions found for download');
      }
      
      console.log('📋 [BULK MERGED DOWNLOAD] Valid sessions for download:', {
        totalCount: selectedMergedDocs.size,
        validCount: selectedAssessmentSessionIds.length,
        invalidCount: selectedMergedDocs.size - selectedAssessmentSessionIds.length,
        assessmentSessionIds: selectedAssessmentSessionIds
      });
      
      // Call backend bulk download endpoint with assessment session IDs
      const response = await axiosInstance.post('/api/merged-pdf/bulk-download', {
        assessmentSessionIds: selectedAssessmentSessionIds
      });
      
      if (response.data.success && response.data.downloadUrl) {
        // Update loading toast
        toast.update(loadingToast, {
          render: `✅ Processing ${selectedAssessmentSessionIds.length} merged documents...`,
          type: 'success',
          isLoading: false,
          autoClose: 3000
        });
        
        // Start the bulk download
        const link = document.createElement('a');
        link.href = response.data.downloadUrl;
        link.download = `bulk_merged_documents_${new Date().toISOString().split('T')[0]}.zip`;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Show success message
        toast.success(
          `🎉 Successfully downloaded ${selectedAssessmentSessionIds.length} merged document${selectedAssessmentSessionIds.length !== 1 ? 's' : ''}!`, 
          { toastId: 'bulk-merged-download-success' }
        );
        
        // Clear selection
        setSelectedMergedDocs(new Set());
        setIsAllMergedDocsSelected(false);
      } else {
        throw new Error(response.data.error || 'Failed to generate bulk download');
      }
      
    } catch (error) {
      console.error('❌ [BULK MERGED DOWNLOAD] Error:', error);
      toast.update(loadingToast, {
        render: '❌ Bulk download failed',
        type: 'error',
        isLoading: false,
        autoClose: 5000
      });
      
      const errorMessage = error.response?.data?.error || error.message || 'Failed to download merged documents';
      toast.error(`❌ ${errorMessage}`, { toastId: 'bulk-merged-download-error' });
    } finally {
      setBulkDownloadInProgress(false);
    }
  };

  // 🔥 NEW: Bulk selection handlers for merged documents
  // FIX: Store candidate IDs instead of array indexes
  const toggleMergedDocSelection = (candidateId) => {
    const newSelected = new Set(selectedMergedDocs);
    if (newSelected.has(candidateId)) {
      newSelected.delete(candidateId);
    } else {
      newSelected.add(candidateId);
    }
    setSelectedMergedDocs(newSelected);
    
    // Update "select all" state based on the sorted array being displayed
    setIsAllMergedDocsSelected(newSelected.size === sortedCandidatesToDisplay.length && sortedCandidatesToDisplay.length > 0);
  };
  
  const toggleSelectAllMergedDocs = () => {
    if (isAllMergedDocsSelected) {
      setSelectedMergedDocs(new Set());
    } else {
      // FIX: Store candidate IDs from the sorted array being displayed
      const allCandidateIds = new Set();
      sortedCandidatesToDisplay.forEach((candidate) => allCandidateIds.add(candidate._id));
      setSelectedMergedDocs(allCandidateIds);
    }
    setIsAllMergedDocsSelected(!isAllMergedDocsSelected);
  };
  
  // Also fix the "select all" checkbox state to use the sorted array
  const calculateTotalExperience = (experiences) => {
    if (!experiences || !Array.isArray(experiences)) return "0 years";
    return experiences.reduce((total, exp) => {
      const match = exp.duration?.match(/(\d+\.?\d*)\s*(?:years?|yrs?)/i);
      return total + (match ? parseFloat(match[1]) : 0);
    }, 0) + " years";
  };

  const toggleExpand = (index, type) => {
    setExpandedLists((prev) => ({
      ...prev,
      [`${index}-${type}`]: !prev[`${index}-${type}`],
    }));
  };

  const renderListWithExpand = (items, index, type, maxItems = 3) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      return <span className="text-muted">None</span>;
    }
    const isExpanded = expandedLists[`${index}-${type}`];
    const visibleItems = isExpanded ? items : items.slice(0, maxItems);
    return (
      <div className="list-container" aria-describedby={`${type}-${index}`}>
        <ul className="bullet-list list-unstyled">
          {visibleItems.map((item, i) => (
            <li key={i} className="mb-1">{item}</li>
          ))}
        </ul>
        {items.length > maxItems && (
          <span
            className="toggle-link text-primary cursor-pointer"
            onClick={() => toggleExpand(index, type)}
            role="button"
            aria-label={isExpanded ? `Collapse ${type} list` : `Expand ${type} list`}
          >
            {isExpanded ? "Show Less" : "Show More"}
          </span>
        )}
      </div>
    );
  };

  const toggleExpandRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <motion.div 
        className="card-glass p-8 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-gray-700">Loading candidate data...</p>
      </motion.div>
    </div>
  );

  const renderViewToggle = () => (
    <motion.div 
      className="flex justify-center mb-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="flex gap-3 p-2 bg-white/60 backdrop-blur-sm rounded-xl shadow-sm border border-white/20">
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 ${
            viewMode === 'all' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('all')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faUsers} />
          All Applicants
        </motion.button>
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative ${
            viewMode === 'recent' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => setViewMode('recent')}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faStar} />
          Latest Profiles
          {recentCandidates.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {recentCandidates.length}
            </span>
          )}
        </motion.button>
        <motion.button 
          className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-2 relative ${
            viewMode === 'recommended' 
              ? 'bg-primary-gradient text-white shadow-lg' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={() => {
            setViewMode('recommended');
            fetchRecommendationsConsentOnly();
          }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <FontAwesomeIcon icon={faCheckCircle} />
          Recommended Profiles
          {recommendedCandidates.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center">
              {recommendedCandidates.length}
            </span>
          )}
        </motion.button>
      </div>
    </motion.div>
  );

  const candidatesToDisplay = viewMode === 'recommended'
    ? filteredMembers
    : viewMode === 'recent'
      ? recentCandidates
      : viewMode === 'history'
        ? historicalCandidates
        : filteredMembers;

  const sortedCandidatesToDisplay = [...candidatesToDisplay].sort((a, b) => {
    const aMatch = a.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    const bMatch = b.matchingResult?.[0]?.["Resume Data"]?.["Matching Percentage"] || 0;
    return bMatch - aMatch;
  });

  // Add function to extract file key from path
  // The following functions are now provided by useMediaOperations hook:
  // viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey
  
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
          transition={{ duration: 0.5 }}
        >
          <div className="w-16 h-16 bg-primary-gradient rounded-full flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faUsers} className="text-2xl text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Talent Workspace</h1>
          <p className="text-gray-600">Manage candidates and assessments efficiently</p>
        </motion.div>

        {renderViewToggle()}
        {/* Filter Section */}
        <motion.div 
          className="card-glass mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="flex flex-wrap gap-3 items-center justify-center p-6">
            {Object.keys(filterIcons).map((filter) => (
              <motion.button
                key={filter}
                className="btn-modern bg-white/80 hover:bg-white text-gray-700 border-gray-200 flex items-center gap-2 px-4 py-2"
                onClick={() => toggleModal(filter)}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
              >
                <FontAwesomeIcon icon={filterIcons[filter]} className="text-primary-600" />
                <span className="font-medium">{filter.charAt(0).toUpperCase() + filter.slice(1)}</span>
              </motion.button>
            ))}
            <motion.button
              className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center gap-2 px-4 py-2"
              onClick={resetAllFilters}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faRotateRight} /> 
              <span className="font-medium">Reset All</span>
            </motion.button>
            <motion.button
              className="btn-primary flex items-center gap-2 px-6 py-2"
              onClick={applyFilters}
              whileHover={{ scale: 1.02, y: -1 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faMagnifyingGlass} />
              <span className="font-medium">Search</span>
            </motion.button>
          </div>
        </motion.div>
        
        {/* 🔥 NEW: Bulk Actions Panel for Merged Documents */}
        <AnimatePresence>
          {selectedMergedDocs.size > 0 && (
            <motion.div 
              className="card-glass mb-6 relative overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faFilePdf} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {selectedMergedDocs.size} merged document{selectedMergedDocs.size !== 1 ? 's' : ''} selected
                    </h3>
                    <p className="text-sm text-gray-600">Ready for bulk download</p>
                  </div>
                </div>
                
                <div className="flex gap-3 w-full sm:w-auto">
                  <motion.button
                    className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 flex-1 sm:flex-none"
                    onClick={() => {
                      setSelectedMergedDocs(new Set());
                      setIsAllMergedDocsSelected(false);
                    }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={bulkDownloadInProgress}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                    <span>Clear</span>
                  </motion.button>
                  
                  <motion.button
                    className="btn-primary flex items-center gap-2 flex-1 sm:flex-none"
                    onClick={handleBulkMergedDocsDownload}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={bulkDownloadInProgress}
                  >
                    {bulkDownloadInProgress ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        <span>Processing...</span>
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} />
                        <span>Download {selectedMergedDocs.size} Merged Document{selectedMergedDocs.size !== 1 ? 's' : ''}</span>
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
          {/* Filter Modals */}
          <AnimatePresence>
            {Object.keys(filterIcons).map((filter) => (
              showModal[filter] && (
                <motion.div
                  key={filter}
                  className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => toggleModal(filter)}
                >
                  <motion.div
                    className="card-glass max-w-md w-full p-6"
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Modal Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center">
                          <FontAwesomeIcon icon={filterIcons[filter]} className="text-white" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-900">
                          {filter.charAt(0).toUpperCase() + filter.slice(1)}
                        </h3>
                      </div>
                      <button
                        className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                        onClick={() => toggleModal(filter)}
                      >
                        <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                      </button>
                    </div>

                    {/* Modal Body */}
                    <div className="max-h-64 overflow-y-auto custom-scrollbar mb-6">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input
                            type="checkbox"
                            className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                            checked={allSelected[filter] || false}
                            onChange={(e) => {
                              const isSelected = e.target.checked;
                              const allValues = extractUniqueValues(filter);
                              setAllSelected((prev) => ({ ...prev, [filter]: isSelected }));
                              handleFilterChange(filter, isSelected ? allValues : []);
                            }}
                          />
                          <span className="font-semibold text-gray-900">Select All</span>
                        </label>
                        {extractUniqueValues(filter).map((value, index) => (
                          <label key={index} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="checkbox"
                              className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                              checked={selectedFilters[filter]?.includes(value) || false}
                              onChange={(e) => {
                                const selected = e.target.checked
                                  ? [...(selectedFilters[filter] || []), value]
                                  : selectedFilters[filter].filter((v) => v !== value);
                                handleFilterChange(filter, selected);
                              }}
                            />
                            <span className="text-gray-700">{value}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Modal Footer */}
                    <div className="flex gap-3">
                      <motion.button
                        className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors flex-1 flex items-center justify-center"
                        onClick={() => {
                          handleFilterChange(filter, []);
                          if (viewMode === 'recommended') {
                            setFilteredMembers([]);
                          } else {
                            setFilteredMembers(members);
                          }
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Reset
                      </motion.button>
                      <motion.button
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex-1 flex items-center justify-center"
                        onClick={() => {
                          applyFilters();
                          toggleModal(filter);
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        Apply
                      </motion.button>
                    </div>
                  </motion.div>
                </motion.div>
              )
            ))}
          </AnimatePresence>

          {/* Assessment Generation Modal */}
          <AnimatePresence>
            {showGenerationModal && (
              <motion.div
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="card-glass max-w-md w-full p-6 text-center"
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                >
                  {generationStatus.loading && (
                    <>
                      <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">Preparing Assessment</h3>
                      <p className="text-gray-600">{generationStatus.message || 'Processing...'}</p>
                    </>
                  )}
                  {generationStatus.error && (
                    <>
                      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faExclamationTriangle} className="text-2xl text-red-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-red-600 mb-2">Error</h3>
                      <p className="text-gray-600 mb-4">{generationStatus.error}</p>
                      <button 
                        className="btn-secondary"
                        onClick={() => setShowGenerationModal(false)}
                      >
                        Close
                      </button>
                    </>
                  )}
                  {generationStatus.success && (
                    <>
                      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-2xl text-green-600" />
                      </div>
                      <h3 className="text-xl font-semibold text-green-600 mb-2">Success!</h3>
                      <p className="text-gray-600 mb-4">{generationStatus.message}</p>
                      <button 
                        className="btn-primary"
                        onClick={() => setShowGenerationModal(false)}
                      >
                        Got it!
                      </button>
                    </>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Candidates Table */}
          <motion.div 
            className="card-glass"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="overflow-x-auto rounded-lg shadow-lg">
              <table className="w-full min-w-max">
                <thead className="bg-primary-gradient sticky top-0">
                  <tr>
                    {/* Checkbox column for bulk selection */}
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm w-12">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
                        checked={isAllMergedDocsSelected}
                        onChange={toggleSelectAllMergedDocs}
                        aria-label="Select all candidates for bulk download"
                      />
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Rank</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Candidate</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Job Title</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Experience</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Match %</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">View PDF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Merged PDF</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Interview</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Details</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Score</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">Test-Link</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-white uppercase tracking-wider md:px-6 md:py-4 md:text-sm">View Recordings</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {sortedCandidatesToDisplay.map((result, index) => {
                    const resumeData = result.matchingResult?.[0]?.["Resume Data"] || {};
                    const analysis = result.matchingResult?.[0]?.Analysis || {};
                    const email = resumeData.email || "N/A";
                    const session = result.assessmentSession;
                    const testScore = result.testScore;
                    const isRecent = recentCandidates.some(rc => rc._id === result._id);
                    
                    const getStatusBadge = () => {
                      if (!session) return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Not Sent</span>;
                      switch (session.status) {
                        case 'completed': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">Completed</span>;
                        case 'in-progress': return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">In Progress</span>;
                        default: return <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">Pending</span>;
                      }
                    };
                    return (
                     <React.Fragment key={result._id || index}>
    <motion.tr 
      className={`${expandedRow === result._id ? "bg-blue-50" : "hover:bg-gray-50"} ${isRecent ? "bg-green-50" : ""} transition-all duration-200`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -1 }}
    >
      {/* Checkbox for bulk selection */}
      {/* FIX: Use candidate ID instead of array index */}
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4 w-12">
        <input
          type="checkbox"
          className="w-4 h-4 text-primary-600 rounded border-gray-300 focus:ring-primary-500"
          checked={selectedMergedDocs.has(result._id)}
          onChange={() => toggleMergedDocSelection(result._id)}
          onClick={(e) => e.stopPropagation()}
          aria-label={`Select candidate ${index + 1} for bulk download`}
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex items-center gap-2">
          {isRecent && viewMode !== 'recent' && (
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
              New
            </span>
          )}
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-800 font-semibold text-sm">
            {index + 1}
          </span>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-gradient rounded-full flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {(resumeData.name || email || "N")[0].toUpperCase()}
            </span>
          </div>
          <div>
            <div className="text-sm font-semibold text-gray-900 truncate max-w-[120px] md:max-w-none">
              {(() => {
                // Enhanced name parsing logic - consistent with DocumentUploadPage
                let displayName = "Unknown Candidate";
                
                // Priority: 1. Check if resumeData.name exists and is not an email
                if (resumeData.name && typeof resumeData.name === 'string' && resumeData.name.trim()) {
                  // If name is not an email format
                  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resumeData.name.trim())) {
                    displayName = resumeData.name.trim();
                  } else {
                    // If name field contains email, parse it for display
                    const emailParts = resumeData.name.split('@')[0].replace(/[._-]/g, ' ');
                    const prettyName = emailParts
                      .split(' ')
                      .filter(Boolean)
                      .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                      .join(' ')
                      .trim();
                    displayName = prettyName || 'Candidate';
                  }
                }
                // Priority: 2. If no proper name found, use email for parsing
                else if (email && typeof email === 'string' && email.includes('@')) {
                  const emailParts = email.split('@')[0].replace(/[._-]/g, ' ');
                  const prettyName = emailParts
                    .split(' ')
                    .filter(Boolean)
                    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                    .join(' ')
                    .trim();
                  displayName = prettyName || 'Candidate';
                }
                
                return displayName;
              })()}
            </div>
            <div className="text-xs text-gray-500 truncate max-w-[120px] md:max-w-none">{email}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
        <div className="truncate max-w-[100px] md:max-w-none">{resumeData?.["Job Title"] || "N/A"}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900 md:px-6 md:py-4">
        <div className="truncate max-w-[80px] md:max-w-none">{resumeData.experience || calculateTotalExperience(resumeData.total_experience) || "0 years"}</div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex items-center gap-2">
          <div className="flex-1 min-w-[60px]">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}%` }}
              ></div>
            </div>
          </div>
          <span className="text-sm font-semibold text-gray-900 min-w-[3rem]">
            {resumeData["Matching Percentage"] || analysis["Matching Score"] || 0}%
          </span>
        </div>
        {result.candidateConsent?.allowedToShare && (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-1">
            Shared
          </span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="candidate-table-dropdown" ref={el => resumeDropdownRefs.current[result._id] = el}>
          <button 
            className="btn-modern bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-200 p-2"
            onClick={(e) => {
              e.stopPropagation();
              setResumeDropdownOpen(prev => ({
                ...prev,
                [result._id]: !prev[result._id]
              }));
            }}
          >
            <FontAwesomeIcon icon={faFileAlt} />
          </button>
          {resumeDropdownOpen[result._id] && (
            <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}`);
                    if (response.data?.url) {
                      window.open(response.data.url, '_blank');
                    }
                  } catch (error) {
                    console.error('Error viewing resume:', error);
                    toast.error('Failed to view resume');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faEye} className="mr-2" />
                View Resume
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/resumes/${result.resumeId?._id || result.resumeId || result.Id}?download=true`);
                    if (response.data?.url) {
                      window.location.href = response.data.url;
                    }
                  } catch (error) {
                    console.error('Download failed:', error);
                    toast.error('Failed to initiate download');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faDownload} className="mr-2" />
                Download Resume
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                onClick={async (e) => {
                  e.stopPropagation();
                  try {
                    const response = await axiosInstance.get(`/api/job-descriptions/${result.jobDescriptionId?._id || result.jobDescriptionId}`);
                    if (response.data?.url) {
                      window.open(response.data.url, '_blank');
                    }
                  } catch (error) {
                    console.error('Error viewing JD:', error);
                    toast.error('Failed to view job description');
                  }
                  setResumeDropdownOpen(prev => ({
                    ...prev,
                    [result._id]: false
                  }));
                }}
              >
                <FontAwesomeIcon icon={faFileAlt} className="mr-2" />
                View Job Description
              </button>
            </div>
          )}
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {/* MERGED PDF COLUMN */}
        {session && session.status === 'completed' ? (
          <div className="candidate-table-dropdown" ref={el => mergedPdfDropdownRefs.current[result._id] = el}>
            <button 
              className="btn-modern bg-orange-100 hover:bg-orange-200 text-orange-800 border-orange-200 p-2"
              onClick={(e) => {
                e.stopPropagation();
                // Debug log to see what session looks like
                console.log('🔍 [MERGED PDF DEBUG] Session object:', session);
                console.log('🔍 [MERGED PDF DEBUG] Session._id:', session?._id);
                console.log('🔍 [MERGED PDF DEBUG] Result.assessmentSession:', result.assessmentSession);
                console.log('🔍 [MERGED PDF DEBUG] Full result:', result);
                setMergedPdfDropdownOpen(prev => ({
                  ...prev,
                  [result._id]: !prev[result._id]
                }));
              }}
            >
              <FontAwesomeIcon icon={faFilePdf} />
            </button>
            {mergedPdfDropdownOpen[result._id] && (
              <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async (e) => {
                    e.stopPropagation();
                    // Try multiple ways to get the session ID
                    const sessionId = session?._id || session?.id || 
                                    result.assessmentSession?._id || 
                                    result.assessmentSession?.id ||
                                    (typeof result.assessmentSession === 'string' ? result.assessmentSession : null);
                    
                    console.log('🔄 [Generate] Extracted Session ID:', sessionId);
                    console.log('🔄 [Generate] Session:', session);
                    console.log('🔄 [Generate] Result.assessmentSession:', result.assessmentSession);
                    
                    if (sessionId) {
                      await handleGenerateMergedPDF(sessionId);
                    } else {
                      console.error('❌ No session ID found in:', { session, assessmentSession: result.assessmentSession });
                      toast.error('No assessment session ID found');
                    }
                    setMergedPdfDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faFilePdf} className="mr-2" />
                  Generate Merged PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const sessionId = session?._id || session?.id || 
                                    result.assessmentSession?._id || 
                                    result.assessmentSession?.id ||
                                    (typeof result.assessmentSession === 'string' ? result.assessmentSession : null);
                    
                    console.log('👁️ [View] Extracted Session ID:', sessionId);
                    
                    if (sessionId) {
                      await handleViewMergedPDF(sessionId);
                    } else {
                      console.error('❌ No session ID found');
                      toast.error('No assessment session ID found');
                    }
                    setMergedPdfDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faEye} className="mr-2" />
                  View Merged PDF
                </button>
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={async (e) => {
                    e.stopPropagation();
                    const sessionId = session?._id || session?.id || 
                                    result.assessmentSession?._id || 
                                    result.assessmentSession?.id ||
                                    (typeof result.assessmentSession === 'string' ? result.assessmentSession : null);
                    
                    console.log('⬇️ [Download] Extracted Session ID:', sessionId);
                    
                    if (sessionId) {
                      await handleDownloadMergedPDF(sessionId);
                    } else {
                      console.error('❌ No session ID found');
                      toast.error('No assessment session ID found');
                    }
                    setMergedPdfDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                  Download Merged PDF
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <span className="text-xs text-gray-400">
              {!session ? 'No Assessment' : 'Assessment Pending'}
            </span>
          </div>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex flex-col gap-2">
          {/* Proceed to Second Round Button */}
          <motion.button
            className="btn-modern bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-green-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
            onClick={async (e) => {
              e.stopPropagation();
              try {
                // Navigate to Candidate Details Page for interview workflow
                console.log('Candidate data for navigation:', {
                  result: result,
                  assessmentSession: result.assessmentSession,
                  resumeData: resumeData
                });
                
                // The correct navigation should use the assessment session ID for both parameters
                // as the backend expects assessmentSessionId for both
                if (result.assessmentSession && result.assessmentSession._id) {
                  console.log('Navigating to candidate details:', {
                    assessmentSessionId: result.assessmentSession._id
                  });
                  navigate(`/dashboard/candidate-details/${result.assessmentSession._id}/${result.assessmentSession._id}`);
                } else {
                  toast.error('No assessment session found for this candidate');
                }
              } catch (error) {
                console.error('Error navigating to candidate details:', error);
                toast.error('Failed to navigate to candidate details');
              }
            }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faUserTie} className="text-xs md:text-sm" />
            <span className="text-xs font-medium md:text-sm hidden md:inline">Proceed to Interview</span>
          </motion.button>
          
          {/* Interview Scheduling Dropdown */}
          <div className="candidate-table-dropdown" ref={el => interviewDropdownRefs.current[result._id] = el}>
            <button 
              className="btn-modern bg-purple-100 hover:bg-purple-200 text-purple-800 border-purple-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
              onClick={(e) => {
                e.stopPropagation();
                setInterviewDropdownOpen(prev => ({
                  ...prev,
                  [result._id]: !prev[result._id]
                }));
              }}
            >
              <FontAwesomeIcon icon={faCalendarAlt} className="text-xs md:text-sm" />
              <span className="text-xs font-medium md:text-sm hidden md:inline">Schedule</span>
            </button>
            {interviewDropdownOpen[result._id] && (
              <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <a
                  href={`https://calendar.google.com/calendar/render?action=TEMPLATE&add=${encodeURIComponent(resumeData.email || "")}&text=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faGoogle} className="mr-2" />
                  Google Calendar
                </a>
                <a
                  href={`https://outlook.office.com/calendar/0/deeplink/compose?to=${encodeURIComponent(resumeData.email || "")}&subject=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faMicrosoft} className="mr-2" />
                  Microsoft Teams
                </a>
                <a
                  href={`https://zoom.us/schedule?email=${encodeURIComponent(resumeData.email || "")}&topic=${encodeURIComponent(`Interview - ${resumeData["Job Title"] || "Job Title"}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    setInterviewDropdownOpen(prev => ({
                      ...prev,
                      [result._id]: false
                    }));
                  }}
                >
                  <FontAwesomeIcon icon={faVideo} className="mr-2" />
                  Zoom
                </a>
              </div>
            )}
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <motion.button
          className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-1 px-2 py-2 md:gap-2 md:px-3 md:py-2"
          onClick={() => toggleExpandRow(result._id)}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-xs font-medium md:text-sm">Details</span>
          <FontAwesomeIcon 
            icon={expandedRow === result._id ? faChevronUp : faChevronDown} 
            className="text-xs transition-transform duration-200"
          />
        </motion.button>
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <CandidateStatusBadge 
          session={session} 
          assessmentSessionId={result.assessmentSession?._id} 
          candidateDecisions={candidateDecisions} 
        />
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {testScore ? (
          <div className="candidate-table-dropdown" ref={el => scoreDropdownRefs.current[result._id] = el}>
            <button 
              className="btn-modern bg-indigo-100 hover:bg-indigo-200 text-indigo-800 border-indigo-200 px-2 py-2 md:px-3 md:py-2"
              onClick={(e) => {
                e.stopPropagation();
                setScoreDropdownOpen(prev => ({
                  ...prev,
                  [result._id]: !prev[result._id]
                }));
              }}
            >
              <span className="font-semibold text-xs md:text-sm">
                {testScore.combinedScore !== undefined ? `${testScore.combinedScore}%` : 'N/A'}
              </span>
            </button>
            {scoreDropdownOpen[result._id] && (
              <div className="candidate-table-dropdown-menu bg-white rounded-md shadow-lg border border-gray-200 z-50">
                <div className="px-4 py-2 text-sm text-gray-700">
                  <div className="font-semibold">Test Scores</div>
                  {(testScore.score !== undefined && testScore.score !== null) ? (
                    <div className="flex justify-between">
                      <span>MCQ:</span>
                      <span>{parseFloat(testScore.score).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>MCQ:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.audioScore !== undefined && testScore.audioScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Audio:</span>
                      <span>{parseFloat(testScore.audioScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Audio:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.textScore !== undefined && testScore.textScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Text:</span>
                      <span>{parseFloat(testScore.textScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Text:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  {(testScore.videoScore !== undefined && testScore.videoScore !== null) ? (
                    <div className="flex justify-between">
                      <span>Video:</span>
                      <span>{parseFloat(testScore.videoScore).toFixed(2)}%</span>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <span>Video:</span>
                      <span>N/A</span>
                    </div>
                  )}
                  <div className="flex justify-between font-semibold mt-1 pt-1 border-t">
                    <span>Total:</span>
                    <span>{testScore.combinedScore !== undefined ? `${parseFloat(testScore.combinedScore).toFixed(2)}%` : 'N/A'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <span className="text-gray-500 text-xs md:text-sm">N/A</span>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        {!session || session.status === 'pending' ? (
          <motion.button
            className="btn-primary px-3 py-2 text-xs font-medium md:px-4 md:py-2 md:text-sm"
            onClick={() => handleAssessmentSelection({
              email,
              jobTitle: resumeData["Job Title"],
              resumeId: result.resumeId?._id,
              jdId: result.jobDescriptionId?._id
            })}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="hidden md:inline">Send Assessment</span>
            <span className="md:hidden">Send</span>
          </motion.button>
        ) : (
          <button className="btn-secondary px-3 py-2 text-xs font-medium md:px-4 md:py-2 md:text-sm" disabled>
            <span className="hidden md:inline">Sent</span>
            <span className="md:hidden">✓</span>
          </button>
        )}
      </td>
      <td className="px-4 py-3 whitespace-nowrap md:px-6 md:py-4">
        <div className="flex flex-wrap gap-2">
          {/* Enhanced Video Recordings Section with Modal View */}
          <div className="w-full">
            <motion.button
              className="btn-modern bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-blue-200 p-2 flex items-center gap-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 w-full justify-center"
              onClick={() => setRecordingsDropdownOpen(prev => ({
                ...prev,
                [result._id]: !prev[result._id]
              }))}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faVideo} className="text-white" />
              <span className="text-xs font-medium">Media Center</span>
              <FontAwesomeIcon 
                icon={recordingsDropdownOpen[result._id] ? faChevronUp : faChevronDown} 
                className="text-xs transition-transform duration-200"
              />
            </motion.button>
            
            <AnimatePresence>
              {recordingsDropdownOpen[result._id] && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-2 recording-section"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3">
                      <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                        <FontAwesomeIcon icon={faVideo} />
                        Media Recordings
                      </h3>
                      <p className="text-blue-100 text-xs">View or download candidate recordings</p>
                    </div>
                    
                    <div className="p-3 max-h-80 overflow-y-auto">
                      {/* Video Recording */}
                      {result.assessmentSession?.recording?.videoPath && (
                        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg mb-2 border border-blue-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <FontAwesomeIcon icon={faVideo} className="text-blue-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">Face Camera Recording</div>
                              <div className="text-xs text-gray-500">Assessment video recording</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => {
                                const videoUrl = `/api/recordings/video/${extractFileKey(result.assessmentSession.recording.videoPath)}`;
                                window.open(videoUrl, '_blank', 'width=800,height=600,scrollbars=yes,resizable=yes');
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.video?.viewing}
                            >
                              {mediaOperations.video?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                              )}
                              View
                            </motion.button>
                            <motion.button
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => downloadVideo('video', result.assessmentSession.recording.videoPath)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.video?.downloading}
                            >
                              {mediaOperations.video?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                              )}
                              Download
                            </motion.button>
                          </div>
                        </div>
                      )}
                      
                      {/* Screen Recording */}
                      {result.assessmentSession?.recording?.screenPath && (
                        <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg mb-2 border border-purple-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                              <FontAwesomeIcon icon={faDesktop} className="text-purple-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">Screen Recording</div>
                              <div className="text-xs text-gray-500">Screen share recording</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              className="px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => {
                                const screenUrl = `/api/recordings/screen/${extractFileKey(result.assessmentSession.recording.screenPath)}`;
                                window.open(screenUrl, '_blank', 'width=1200,height=800,scrollbars=yes,resizable=yes');
                              }}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.screen?.viewing}
                            >
                              {mediaOperations.screen?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faEye} className="mr-1" />
                              )}
                              View
                            </motion.button>
                            <motion.button
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => downloadVideo('screen', result.assessmentSession.recording.screenPath)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.screen?.downloading}
                            >
                              {mediaOperations.screen?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                              )}
                              Download
                            </motion.button>
                          </div>
                        </div>
                      )}
                      
                      {/* Audio Recording */}
                      {result.assessmentSession?.recording?.audioPath && (
                        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg mb-2 border border-green-200">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                              <FontAwesomeIcon icon={faMicrophone} className="text-green-600" />
                            </div>
                            <div>
                              <div className="font-medium text-sm text-gray-900">Audio Recording</div>
                              <div className="text-xs text-gray-500">Voice recording</div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <motion.button
                              className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => viewAudio(result.assessmentSession.recording.audioPath, 0)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.audio?.[0]?.viewing}
                            >
                              {mediaOperations.audio?.[0]?.viewing ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faPlayCircle} className="mr-1" />
                              )}
                              Play
                            </motion.button>
                            <motion.button
                              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                              onClick={() => downloadAudio(result.assessmentSession.recording.audioPath, 0)}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              disabled={mediaOperations.audio?.[0]?.downloading}
                            >
                              {mediaOperations.audio?.[0]?.downloading ? (
                                <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                              ) : (
                                <FontAwesomeIcon icon={faDownload} className="mr-1" />
                              )}
                              Download
                            </motion.button>
                          </div>
                        </div>
                      )}
                      
                      {/* No recordings message */}
                      {!result.assessmentSession?.recording?.videoPath && 
                       !result.assessmentSession?.recording?.screenPath && 
                       !result.assessmentSession?.recording?.audioPath && (
                        <div className="text-center py-8">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FontAwesomeIcon icon={faVideo} className="text-gray-400 text-xl" />
                          </div>
                          <p className="text-gray-500 text-sm font-medium">No recordings available</p>
                          <p className="text-gray-400 text-xs">Assessment recordings will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Enhanced Voice Answers Section */}
                  {result.assessmentSession?.voiceAnswers && result.assessmentSession.voiceAnswers.length > 0 && (
                    <div className="mt-3">
                      <div className="bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
                        <div className="bg-gradient-to-r from-green-500 to-teal-600 p-3">
                          <h3 className="text-white font-semibold text-sm flex items-center gap-2">
                            <FontAwesomeIcon icon={faMicrophone} />
                            Voice Answers
                          </h3>
                          <p className="text-green-100 text-xs">{result.assessmentSession.voiceAnswers.length} recorded responses</p>
                        </div>
                        
                        <div className="p-3 max-h-80 overflow-y-auto">
                          {result.assessmentSession.voiceAnswers.map((answer, index) => (
                            answer.audioPath && (
                              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-2 border border-gray-200">
                                <div className="flex items-center gap-3 flex-1">
                                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                    <span className="text-green-600 font-semibold text-xs">Q{index + 1}</span>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-sm text-gray-900 truncate">
                                      {answer.question?.substring(0, 50) || `Voice Answer ${index + 1}`}
                                      {answer.question && answer.question.length > 50 ? '...' : ''}
                                    </div>
                                    <div className="text-xs text-gray-500">Click to play or download</div>
                                  </div>
                                </div>
                                <div className="flex gap-2 flex-shrink-0">
                                  <motion.button
                                    className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                                    onClick={() => viewAudio(answer.audioPath, index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={mediaOperations.audio?.[index]?.viewing}
                                  >
                                    {mediaOperations.audio?.[index]?.viewing ? (
                                      <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                                    ) : (
                                      <FontAwesomeIcon icon={faPlayCircle} className="mr-1" />
                                    )}
                                    Play
                                  </motion.button>
                                  <motion.button
                                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium transition-colors duration-200"
                                    onClick={() => downloadAudio(answer.audioPath, index)}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    disabled={mediaOperations.audio?.[index]?.downloading}
                                  >
                                    {mediaOperations.audio?.[index]?.downloading ? (
                                      <FontAwesomeIcon icon={faSpinner} spin className="mr-1" />
                                    ) : (
                                      <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                    )}
                                    Download
                                  </motion.button>
                                </div>
                              </div>
                            )
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Show a placeholder if no recordings at all */}
          {(!result.assessmentSession?.recording || 
            (!result.assessmentSession?.recording?.videoPath && 
             !result.assessmentSession?.recording?.screenPath && 
             !result.assessmentSession?.recording?.audioPath)) && 
           (!result.assessmentSession?.voiceAnswers || result.assessmentSession.voiceAnswers.length === 0) && (
            <div className="flex items-center gap-2 text-gray-400 text-xs">
              <FontAwesomeIcon icon={faVideo} />
              <span>No recordings</span>
            </div>
          )}
        </div>
      </td>
    </motion.tr>
    <AnimatePresence>
      {expandedRow === result._id && (
        <motion.tr
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <td colSpan="14" className="px-0 py-0">
            <motion.div 
              className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100 shadow-sm"
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <div className="flex flex-col gap-3 max-w-4xl mx-auto">
                {/* Analysis Summary Card - Moved to TOP and fixed data access */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-gray-600 to-gray-800 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faClipboardList} />
                      Analysis Summary
                    </h3>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-gray-700">
                      {analysis["Analysis Summary"] || result.matchingResult?.[0]?.Analysis?.["Analysis Summary"] || result.matchingResult?.[0]?.["Analysis Summary"] || "No analysis summary available"}
                    </p>
                  </div>
                </div>
                
                {/* Contact Information Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faUserTie} />
                      Contact Information
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faMobile} className="text-blue-600 text-xs" />
                        </div>
                        <div className="ml-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Mobile</p>
                          <p className="text-xs font-medium text-gray-900 mt-1">{resumeData.mobile_number || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faEnvelope} className="text-blue-600 text-xs" />
                        </div>
                        <div className="ml-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email</p>
                          <p className="text-xs font-medium text-gray-900 mt-1 break-all">{resumeData.email || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                          <FontAwesomeIcon icon={faShieldAlt} className="text-blue-600 text-xs" />
                        </div>
                        <div className="ml-2">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Consent Status</p>
                          <div className="mt-1">
                            {result.candidateConsent?.allowedToShare ? (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
                                Shared
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="mr-1" />
                                Not Shared
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Professional Details Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faBriefcase} />
                      Professional Details
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Designation</p>
                        <p className="text-xs font-medium text-gray-900 mt-1">
                          {(Array.isArray(resumeData.designation) 
                            ? resumeData.designation.join(", ") 
                            : resumeData.designation) || "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Degree</p>
                        <p className="text-xs font-medium text-gray-900 mt-1">
                          {(Array.isArray(resumeData.degree) 
                            ? resumeData.degree.join(", ") 
                            : resumeData.degree) || "N/A"}
                        </p>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Certifications</p>
                        <div className="mt-1">
                          {resumeData.certifications?.length ? (
                            <div className="flex flex-wrap gap-1">
                              {resumeData.certifications.map((cert, i) => (
                                <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                  {cert}
                                </span>
                              ))}
                            </div>
                          ) : (
                            <p className="text-xs text-gray-500">No certifications listed</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Skills Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faTools} />
                      Skills
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="flex flex-wrap gap-1">
                      {resumeData.skills?.length ? (
                        resumeData.skills.map((skill, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200">
                            {skill}
                          </span>
                        ))
                      ) : (
                        <p className="text-xs text-gray-500">No skills listed</p>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Previous Companies Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-green-500 to-teal-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faBuilding} />
                      Previous Companies
                    </h3>
                  </div>
                  <div className="p-3">
                    {resumeData.company_names?.length ? (
                      <div className="flex flex-wrap gap-1">
                        {resumeData.company_names.map((company, i) => (
                          <span key={i} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-100 to-teal-100 text-green-800 border border-green-200">
                            {company}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No previous companies listed</p>
                    )}
                  </div>
                </div>
                
                {/* Experience Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faGraduationCap} />
                      Work Experience
                    </h3>
                  </div>
                  <div className="p-3">
                    {resumeData.total_experience?.length ? (
                      <div className="space-y-3">
                        {resumeData.total_experience.map((exp, i) => (
                          <div key={i} className="border border-gray-200 rounded-md p-3 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-semibold text-gray-900">{exp.role || "N/A"}</h4>
                                <p className="text-xs text-gray-600 mt-1">{exp.company || "N/A"}</p>
                              </div>
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                                {exp.duration || "N/A"}
                              </span>
                            </div>
                            
                            {exp.responsibilities?.length > 0 && (
                              <div className="mt-2">
                                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Responsibilities</p>
                                <ul className="mt-1 space-y-1">
                                  {exp.responsibilities.slice(0, 3).map((resp, j) => (
                                    <li key={j} className="flex items-start">
                                      <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs mt-1 mr-1 flex-shrink-0" />
                                      <span className="text-xs text-gray-700">{resp}</span>
                                    </li>
                                  ))}
                                  {exp.responsibilities.length > 3 && (
                                    <li 
                                      className="text-xs text-blue-600 font-medium cursor-pointer hover:text-blue-800"
                                      onClick={() => toggleExpand(`${i}-${result._id}`, 'responsibilities')}
                                    >
                                      {expandedLists[`${i}-${result._id}-responsibilities`] 
                                        ? "Show Less" 
                                        : `+ ${exp.responsibilities.length - 3} more responsibilities`}
                                    </li>
                                  )}
                                </ul>
                                {expandedLists[`${i}-${result._id}-responsibilities`] && (
                                  <ul className="mt-1 space-y-1">
                                    {exp.responsibilities.slice(3).map((resp, j) => (
                                      <li key={`${j}-expanded`} className="flex items-start">
                                        <FontAwesomeIcon icon={faCircle} className="text-gray-400 text-xs mt-1 mr-1 flex-shrink-0" />
                                        <span className="text-xs text-gray-700">{resp}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-gray-500">No work experience listed</p>
                    )}
                  </div>
                </div>
                
                {/* Analysis Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-red-500 to-rose-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faChartLine} />
                      Analysis
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-4">
                      {/* Matching Score */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Matching Score</p>
                          <span className="text-xs font-bold text-gray-900">{analysis["Matching Score"] || "N/A"}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                          <div 
                            className="bg-gradient-to-r from-red-500 to-rose-600 h-1.5 rounded-full" 
                            style={{ width: `${analysis["Matching Score"] || 0}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      {/* Skills Breakdown */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Skills Breakdown</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-green-50 rounded-md p-2 border border-green-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-green-800">Matched</span>
                              <span className="text-xs font-bold text-green-900">{analysis["Matched Skills Percentage"] || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-green-500 h-1 rounded-full" 
                                style={{ width: `${analysis["Matched Skills Percentage"] || 0}%` }}
                              ></div>
                            </div>
                          </div>
                          
                          <div className="bg-rose-50 rounded-md p-2 border border-rose-200">
                            <div className="flex justify-between items-center">
                              <span className="text-xs font-medium text-rose-800">Unmatched</span>
                              <span className="text-xs font-bold text-rose-900">{analysis["Unmatched Skills Percentage"] || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-1 mt-1">
                              <div 
                                className="bg-rose-500 h-1 rounded-full" 
                                style={{ width: `${analysis["Unmatched Skills Percentage"] || 0}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      {/* Matched Skills */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Matched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis["Matched Skills"]?.length ? (
                            analysis["Matched Skills"].map((skill, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No matched skills</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Unmatched Skills */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Unmatched Skills</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis["Unmatched Skills"]?.length ? (
                            analysis["Unmatched Skills"].map((skill, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-rose-100 text-rose-800">
                                {skill}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No unmatched skills</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Strengths */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Strengths</p>
                        <div className="flex flex-wrap gap-1">
                          {analysis.Strengths?.length ? (
                            analysis.Strengths.map((strength, i) => (
                              <span key={i} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                {strength}
                              </span>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No strengths identified</p>
                          )}
                        </div>
                      </div>
                      
                      {/* Recommendations */}
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recommendations</p>
                        <div className="space-y-1">
                          {analysis.Recommendations?.length ? (
                            analysis.Recommendations.map((rec, i) => (
                              <div key={i} className="flex items-start p-2 bg-blue-50 rounded-md border border-blue-200">
                                <FontAwesomeIcon icon={faLightbulb} className="text-blue-500 text-xs mt-0.5 mr-1 flex-shrink-0" />
                                <span className="text-xs text-gray-700">{rec}</span>
                              </div>
                            ))
                          ) : (
                            <p className="text-xs text-gray-500">No recommendations available</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Experience Metrics Card */}
                <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden transition-all duration-200 hover:shadow-md">
                  <div className="bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-2">
                    <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                      <FontAwesomeIcon icon={faUserClock} />
                      Experience Metrics
                    </h3>
                  </div>
                  <div className="p-3">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Required Industrial Experience</p>
                          <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Required Industrial Experience"] || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-500">Candidate's Experience</p>
                          <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Candidate Industrial Experience"] || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pb-2 border-b border-gray-200">
                        <div>
                          <p className="text-xs font-medium text-gray-500">Required Domain Experience</p>
                          <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Required Domain Experience"] || "N/A"}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-medium text-gray-500">Candidate's Experience</p>
                          <p className="text-xs font-medium text-gray-900 mt-1">{analysis["Candidate Domain Experience"] || "N/A"}</p>
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Compliance Status</p>
                        <div>
                          {analysis["Experience Threshold Compliance"] ? (
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              analysis["Experience Threshold Compliance"].includes("meet") 
                                ? "bg-green-100 text-green-800" 
                                : "bg-amber-100 text-amber-800"
                            }`}>
                              <FontAwesomeIcon 
                                icon={analysis["Experience Threshold Compliance"].includes("meet") ? faCheck : faExclamationTriangle} 
                                className="mr-1" 
                              />
                              {analysis["Experience Threshold Compliance"]}
                            </span>
                          ) : (
                            <p className="text-xs text-gray-500">N/A</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">Recent Experience Relevance</p>
                        <div>
                          {analysis["Recent Experience Relevance"] ? (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800">
                              {analysis["Recent Experience Relevance"]}
                            </span>
                          ) : (
                            <p className="text-xs text-gray-500">N/A</p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </td>
        </motion.tr>
      )}
    </AnimatePresence>
  </React.Fragment>
                  );
                })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination Section - Moved outside table structure */}
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-center border-t border-gray-200">
              <div className="flex items-center gap-3">
                <button
                  className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                >
                  <FontAwesomeIcon icon={faChevronLeft} />
                  <span className="text-sm font-medium">Previous</span>
                </button>
                <span className="text-gray-700 text-sm bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">
                  Page {page} of {totalPages}
                </span>
                <button
                  className="btn-modern bg-gray-100 hover:bg-gray-200 text-gray-700 border-gray-200 flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200"
                  onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={page === totalPages}
                >
                  <span className="text-sm font-medium">Next</span>
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
        
        {/* Custom Assessment Modal */}
        <CustomAssessmentModal 
          show={showCustomAssessmentModal}
          onClose={() => setShowCustomAssessmentModal(false)}
          candidateData={currentCandidate}
          onSubmit={handleAssessmentSubmit}
        />
        
        {/* Assessment Generation Modal */}
        <AnimatePresence>
          {showGenerationModal && (
            <motion.div
              className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 text-center"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
              >
                {generationStatus.loading && (
                  <>
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Preparing Assessment</h3>
                    <p className="text-gray-600 mb-6">{generationStatus.message || 'Processing your request...'}</p>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full animate-pulse" style={{width: '75%'}}></div>
                    </div>
                  </>
                )}
                {generationStatus.error && (
                  <>
                    <div className="w-20 h-20 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FontAwesomeIcon icon={faExclamationTriangle} className="text-3xl text-red-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-red-600 mb-3">Error Occurred</h3>
                    <p className="text-gray-600 mb-6">{generationStatus.error}</p>
                    <motion.button 
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2 mx-auto"
                      onClick={() => setShowGenerationModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faTimes} />
                      Close
                    </motion.button>
                  </>
                )}
                {generationStatus.success && (
                  <>
                    <div className="w-20 h-20 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                      <FontAwesomeIcon icon={faCheckCircle} className="text-3xl text-green-600" />
                    </div>
                    <h3 className="text-2xl font-bold text-green-600 mb-3">Success!</h3>
                    <p className="text-gray-600 mb-6">{generationStatus.message}</p>
                    <motion.button 
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-teal-600 hover:from-green-600 hover:to-teal-700 text-white rounded-lg font-medium transition-all duration-200 flex items-center gap-2 mx-auto shadow-md hover:shadow-lg"
                      onClick={() => setShowGenerationModal(false)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <FontAwesomeIcon icon={faCheck} />
                      Got it!
                    </motion.button>
                  </>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* 🔥 NEW: Floating Action Button for Bulk Merged Document Download */}
        <AnimatePresence>
          {selectedMergedDocs.size > 0 && (
            <motion.div
              className="fixed bottom-6 right-6 z-50"
              initial={{ opacity: 0, scale: 0.8, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px]">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 bg-orange-gradient rounded-full flex items-center justify-center">
                      <FontAwesomeIcon icon={faFilePdf} className="text-white text-sm" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-sm">
                        Bulk Download Ready
                      </h4>
                      <p className="text-xs text-gray-500">
                        {selectedMergedDocs.size} merged document{selectedMergedDocs.size !== 1 ? 's' : ''} selected
                      </p>
                    </div>
                  </div>
                  <motion.button
                    onClick={() => {
                      setSelectedMergedDocs(new Set());
                      setIsAllMergedDocsSelected(false);
                    }}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
                  </motion.button>
                </div>
                
                <div className="space-y-2">
                  <motion.button
                    onClick={handleBulkMergedDocsDownload}
                    disabled={bulkDownloadInProgress}
                    className="w-full bg-orange-gradient text-white py-2.5 px-4 rounded-lg font-medium text-sm hover:shadow-lg transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {bulkDownloadInProgress ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4" />
                        Creating ZIP...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} className="w-4 h-4" />
                        Download ZIP File
                      </>
                    )}
                  </motion.button>
                  
                  <div className="text-xs text-gray-500 text-center">
                    Download will include candidate merged documents
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}

export default CandidateTable;