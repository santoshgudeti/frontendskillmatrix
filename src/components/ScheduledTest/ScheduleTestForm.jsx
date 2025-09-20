import React, { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faCalendarAlt, 
  faClock, 
  faUser, 
  faEnvelope, 
  faFileUpload,
  faSpinner,
  faTimes,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';
import './ScheduleTestForm.css';

const ScheduleTestForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    candidateName: '',
    candidateEmail: '',
    scheduledDateTime: ''
  });
  
  const [files, setFiles] = useState({
    resume: null,
    jobDescription: null
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState({ resume: false, jobDescription: false });
  
  const resumeInputRef = useRef(null);
  const jdInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (type, uploadedFiles) => {
    const file = uploadedFiles[0];
    if (file && file.type === 'application/pdf') {
      if (file.size <= 25 * 1024 * 1024) { // 25MB limit
        setFiles(prev => ({
          ...prev,
          [type]: file
        }));
      } else {
        toast.error('File size must be less than 25MB');
      }
    } else {
      toast.error('Please upload PDF files only');
    }
  };

  const handleDragOver = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: true }));
  };

  const handleDragLeave = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
  };

  const handleDrop = (e, type) => {
    e.preventDefault();
    setDragOver(prev => ({ ...prev, [type]: false }));
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFileUpload(type, droppedFiles);
  };

  const validateForm = () => {
    if (!formData.candidateName.trim()) {
      toast.error('Candidate name is required');
      return false;
    }
    
    if (!formData.candidateEmail.trim()) {
      toast.error('Candidate email is required');
      return false;
    }
    
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.candidateEmail)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    
    if (!formData.scheduledDateTime) {
      toast.error('Scheduled date and time is required');
      return false;
    }
    
    const scheduledTime = new Date(formData.scheduledDateTime);
    const now = new Date();
    
    if (scheduledTime <= now) {
      toast.error('Scheduled time must be in the future');
      return false;
    }
    
    if (!files.resume) {
      toast.error('Please upload candidate resume');
      return false;
    }
    
    if (!files.jobDescription) {
      toast.error('Please upload job description');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('🚀 Form submission started');
    console.log('📋 Form data:', formData);
    console.log('📎 Files:', files);
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submitFormData = new FormData();
      submitFormData.append('candidateName', formData.candidateName);
      submitFormData.append('candidateEmail', formData.candidateEmail);
      submitFormData.append('scheduledDateTime', formData.scheduledDateTime);
      submitFormData.append('resume', files.resume);
      submitFormData.append('job_description', files.jobDescription);
      
      console.log('📤 Sending request to /api/schedule-test');
      console.log('📦 FormData contents:');
      for (let [key, value] of submitFormData.entries()) {
        console.log(`  ${key}:`, value);
      }
      
      // Show progress toast
      const progressToast = toast.info('⏳ Creating scheduled test...', {
        autoClose: false,
        hideProgressBar: false
      });
      
      const response = await axiosInstance.post('/api/schedule-test', submitFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // Dismiss progress toast
      toast.dismiss(progressToast);
      
      console.log('✅ Response received:', response.data);
      
      if (response.data.success) {
        const { data } = response.data;
        
        // 🔥 SHOW REAL-TIME PROCESSING RESULTS
        if (data.processing) {
          const { questionsGenerated, emailSent, processingTime } = data.processing;
          
          console.log('🔄 Real-time processing results:', data.processing);
          
          // Show detailed success message with processing info
          const successMessage = `✅ Test scheduled successfully!\n` +
            `📧 Email confirmation: ${emailSent ? '✅ Sent' : '❌ Failed'}\n` +
            `🧠 Questions generated: ${questionsGenerated ? '✅ Ready' : '❌ Failed'}\n` +
            `⏱️ Processing time: ${processingTime}`;
          
          toast.success(successMessage, {
            duration: 8000,
            style: { whiteSpace: 'pre-line' }
          });
          
          // Show any errors that occurred
          if (data.errors) {
            if (data.errors.questionsError) {
              toast.error(`⚠️ Question generation issue: ${data.errors.questionsError}`, {
                duration: 10000
              });
            }
            if (data.errors.emailError) {
              toast.error(`⚠️ Email sending issue: ${data.errors.emailError}`, {
                duration: 10000
              });
            }
          }
        } else {
          // Fallback for old response format
          toast.success('✅ Test scheduled successfully!');
        }
        
        // Call success callback with enhanced data
        onSuccess && onSuccess({
          ...data,
          // Add processing feedback for UI display
          processingFeedback: data.processing || {
            questionsGenerated: false,
            emailSent: false,
            processingTime: 'Unknown'
          }
        });
        onClose && onClose();
      } else {
        console.error('❌ Server returned error:', response.data.error);
        toast.error(response.data.error || 'Failed to schedule test');
      }
      
    } catch (error) {
      console.error('💥 Error scheduling test:', error);
      console.error('📄 Error response:', error.response?.data);
      console.error('🔢 Error status:', error.response?.status);
      
      // Enhanced error handling with more details
      let errorMessage = 'Failed to schedule test';
      
      if (error.response?.data) {
        const errorData = error.response.data;
        if (errorData.error) {
          errorMessage = errorData.error;
        }
        if (errorData.details) {
          errorMessage += `\nDetails: ${errorData.details}`;
        }
        if (errorData.processingTime) {
          errorMessage += `\nProcessing time: ${errorData.processingTime}`;
        }
      }
      
      toast.error(errorMessage, {
        duration: 10000,
        style: { whiteSpace: 'pre-line' }
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const FileUploadArea = ({ type, label, file }) => (
    <div className="file-upload-section">
      <label className="file-upload-label">{label}</label>
      <div
        className={`file-upload-area ${dragOver[type] ? 'drag-over' : ''} ${file ? 'has-file' : ''}`}
        onDragOver={(e) => handleDragOver(e, type)}
        onDragLeave={(e) => handleDragLeave(e, type)}
        onDrop={(e) => handleDrop(e, type)}
        onClick={() => type === 'resume' ? resumeInputRef.current?.click() : jdInputRef.current?.click()}
      >
        {file ? (
          <div className="file-preview">
            <FontAwesomeIcon icon={faCheckCircle} className="file-success-icon" />
            <span className="file-name">{file.name}</span>
            <span className="file-size">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
            <button
              type="button"
              className="remove-file-btn"
              onClick={(e) => {
                e.stopPropagation();
                setFiles(prev => ({ ...prev, [type]: null }));
              }}
            >
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </div>
        ) : (
          <div className="upload-placeholder">
            <FontAwesomeIcon icon={faFileUpload} className="upload-icon" />
            <p>Drop {label.toLowerCase()} here or click to browse</p>
            <small>PDF format, max 25MB</small>
          </div>
        )}
      </div>
      <input
        type="file"
        ref={type === 'resume' ? resumeInputRef : jdInputRef}
        accept=".pdf"
        style={{ display: 'none' }}
        onChange={(e) => handleFileUpload(type, Array.from(e.target.files))}
      />
    </div>
  );

  return (
    <div className="schedule-test-modal-overlay">
      <div className="schedule-test-modal">
        <div className="modal-header">
          <h2>Schedule New Assessment</h2>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="schedule-test-form">
          <div className="form-section">
            <h3>Candidate Information</h3>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="candidateName">
                  <FontAwesomeIcon icon={faUser} /> Candidate Name
                </label>
                <input
                  type="text"
                  id="candidateName"
                  name="candidateName"
                  value={formData.candidateName}
                  onChange={handleInputChange}
                  placeholder="Enter candidate's full name"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="candidateEmail">
                  <FontAwesomeIcon icon={faEnvelope} /> Email Address
                </label>
                <input
                  type="email"
                  id="candidateEmail"
                  name="candidateEmail"
                  value={formData.candidateEmail}
                  onChange={handleInputChange}
                  placeholder="candidate@example.com"
                  required
                />
              </div>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Schedule Details</h3>
            <div className="form-group">
              <label htmlFor="scheduledDateTime">
                <FontAwesomeIcon icon={faCalendarAlt} /> Scheduled Date & Time
              </label>
              <input
                type="datetime-local"
                id="scheduledDateTime"
                name="scheduledDateTime"
                value={formData.scheduledDateTime}
                onChange={handleInputChange}
                min={new Date().toISOString().slice(0, 16)}
                required
              />
              <small className="help-text">
                Assessment will be available for 2 days from scheduled time
              </small>
            </div>
          </div>
          
          <div className="form-section">
            <h3>Documents</h3>
            <div className="form-row">
              <FileUploadArea
                type="resume"
                label="Candidate Resume"
                file={files.resume}
              />
              
              <FileUploadArea
                type="jobDescription"
                label="Job Description"
                file={files.jobDescription}
              />
            </div>
          </div>
          
          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-schedule"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin />
                  Scheduling...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCalendarAlt} />
                  Schedule Test
                </>
              )}
            </button>
          </div>
        </form>
      </div>
      
      {/* Enhanced Processing Modal */}
      {isSubmitting && (
        <div className="processing-overlay">
          <div className="processing-modal">
            <div className="processing-header">
              <FontAwesomeIcon icon={faSpinner} spin className="processing-icon" />
              <h3>🚀 Creating Your Scheduled Test</h3>
            </div>
            <div className="processing-steps">
              <div className="step-item">
                <span className="step-icon">📋</span>
                <span>Validating form data...</span>
              </div>
              <div className="step-item">
                <span className="step-icon">📤</span>
                <span>Uploading documents...</span>
              </div>
              <div className="step-item">
                <span className="step-icon">🧠</span>
                <span>Generating questions...</span>
              </div>
              <div className="step-item">
                <span className="step-icon">📧</span>
                <span>Sending confirmation email...</span>
              </div>
            </div>
            <p className="processing-note">
              ⏳ This may take a moment. We're setting up everything for real-time assessment!
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleTestForm;