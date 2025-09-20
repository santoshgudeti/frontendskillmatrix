import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './AssessmentSessionDetails.css';
import { 
  faArrowLeft, 
  faUser, 
  faEnvelope, 
  faFileAlt, 
  faChartBar, 
  faCalendarAlt, 
  faDownload, 
  faEye,
  faSpinner,
  faCheckCircle,
  faTimesCircle,
  faMicrophone,
  faVideo,
  faGraduationCap,
  faBuilding,
  faIdBadge,
  faPhone,
  faBriefcase,
  faStar
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';

const AssessmentSessionDetails = () => {
  const { id } = useParams(); // This will be the assessmentSessionId
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    fetchSessionDetails();
  }, [id]);

  const fetchSessionDetails = async () => {
    try {
      setLoading(true);
      // Fetch assessment session details directly
      const response = await axiosInstance.get(`/api/assessment-session/${id}`);
      
      setSessionData(response.data.data);
    } catch (error) {
      console.error('Error fetching assessment session details:', error);
      toast.error('Failed to fetch assessment session details');
    } finally {
      setLoading(false);
    }
  };

  const viewDocument = async (type, documentId) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.url) {
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.error(`Failed to view ${type}`);
      }
    } catch (error) {
      console.error(`Error viewing ${type}:`, error);
      toast.error(`Failed to view ${type}`);
    }
  };

  const downloadDocument = async (type, documentId, filename) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint, {
        params: { download: true }
      });
      
      if (response.data.url) {
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = filename || `${type}.pdf`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(`Failed to download ${type}`);
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      toast.error(`Failed to download ${type}`);
    }
  };

  const handleScheduleInterview = async () => {
    try {
      // First, check if there's a scheduled test associated with this assessment session
      const response = await axiosInstance.get(`/api/scheduled-tests/by-assessment-session/${id}`);
      
      if (response.data.success && response.data.data) {
        // If scheduled test exists, navigate to the schedule interview page with the scheduled test ID
        navigate(`/dashboard/schedule-interview/${response.data.data._id}`);
      } else {
        // If no scheduled test exists, we can either:
        // 1. Show a modal to schedule directly from assessment session
        // 2. Navigate to a new page for scheduling from assessment session
        // For now, let's show a toast message indicating the limitation
        toast.info('Interview scheduling directly from assessment session is not yet implemented. Please use the scheduled test workflow.');
      }
    } catch (error) {
      console.error('Error checking scheduled test:', error);
      // If we can't find a scheduled test, we might need to create a new endpoint
      // For now, let's show an error message
      toast.error('Unable to schedule interview: ' + (error.response?.data?.error || 'Unknown error'));
    }
  };

  if (loading) {
    return (
      <div className="candidate-details-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading assessment session details...</p>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="candidate-details-container">
        <div className="no-data">
          <FontAwesomeIcon icon={faTimesCircle} size="3x" style={{ color: '#ef4444' }} />
          <p>Assessment session details not found</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Extract resume and job description data
  const resumeData = sessionData.resumeId || {};
  const jobDescriptionData = sessionData.jobDescriptionId || {};

  return (
    <div className="candidate-details-container">
      <div className="candidate-details-header">
        <button className="btn-back" onClick={() => navigate('/dashboard')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Dashboard
        </button>
        <div className="header-content">
          <h2>
            <FontAwesomeIcon icon={faUser} className="header-icon" />
            Assessment Session Details
          </h2>
          <div className="candidate-status">
            <span className={`status-badge status-${sessionData.status}`}>
              {sessionData.status?.toUpperCase() || 'PENDING'}
            </span>
          </div>
        </div>
      </div>

      <div className="candidate-details-tabs">
        <button 
          className={`tab-button ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          <FontAwesomeIcon icon={faUser} />
          Session Details
        </button>
        <button 
          className={`tab-button ${activeTab === 'results' ? 'active' : ''}`}
          onClick={() => setActiveTab('results')}
        >
          <FontAwesomeIcon icon={faChartBar} />
          Assessment Results
        </button>
        <button 
          className={`tab-button ${activeTab === 'recordings' ? 'active' : ''}`}
          onClick={() => setActiveTab('recordings')}
        >
          <FontAwesomeIcon icon={faVideo} />
          Recordings
        </button>
      </div>

      <div className="candidate-details-content">
        {activeTab === 'details' && (
          <div className="tab-content details-tab">
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                className="btn-primary"
                onClick={handleScheduleInterview}
              >
                <FontAwesomeIcon icon={faCalendarAlt} />
                Schedule Interview
              </button>
            </div>

            {/* Candidate Information */}
            <div className="candidate-info-card">
              <h3>
                <FontAwesomeIcon icon={faUser} />
                Candidate Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Name</label>
                  <p>{resumeData.name || sessionData.candidateEmail || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Email</label>
                  <p>{sessionData.candidateEmail || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Phone</label>
                  <p>{resumeData.mobile_number || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Experience</label>
                  <p>{resumeData.experience || 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Job Information */}
            <div className="candidate-info-card">
              <h3>
                <FontAwesomeIcon icon={faBriefcase} />
                Job Information
              </h3>
              <div className="info-grid">
                <div className="info-item">
                  <label>Job Title</label>
                  <p>{sessionData.jobTitle || jobDescriptionData.title || 'N/A'}</p>
                </div>
                <div className="info-item">
                  <label>Session ID</label>
                  <p>{id}</p>
                </div>
                <div className="info-item">
                  <label>Status</label>
                  <p>
                    <span className={`status-badge status-${sessionData.status}`}>
                      {sessionData.status?.toUpperCase() || 'PENDING'}
                    </span>
                  </p>
                </div>
                <div className="info-item">
                  <label>Started At</label>
                  <p>{sessionData.startedAt ? new Date(sessionData.startedAt).toLocaleString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div className="candidate-info-card">
              <h3>
                <FontAwesomeIcon icon={faFileAlt} />
                Documents
              </h3>
              <div className="documents-grid">
                <div className="document-item">
                  <div className="document-info">
                    <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                    <div>
                      <h4>Resume</h4>
                      <p>{resumeData.filename || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="document-actions">
                    {resumeData._id && (
                      <>
                        <button 
                          className="btn-icon"
                          onClick={() => viewDocument('resume', resumeData._id)}
                          title="View Resume"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => downloadDocument('resume', resumeData._id, resumeData.filename)}
                          title="Download Resume"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
                
                <div className="document-item">
                  <div className="document-info">
                    <FontAwesomeIcon icon={faFileAlt} className="document-icon" />
                    <div>
                      <h4>Job Description</h4>
                      <p>{jobDescriptionData.filename || 'N/A'}</p>
                    </div>
                  </div>
                  <div className="document-actions">
                    {jobDescriptionData._id && (
                      <>
                        <button 
                          className="btn-icon"
                          onClick={() => viewDocument('job-description', jobDescriptionData._id)}
                          title="View Job Description"
                        >
                          <FontAwesomeIcon icon={faEye} />
                        </button>
                        <button 
                          className="btn-icon"
                          onClick={() => downloadDocument('job-description', jobDescriptionData._id, jobDescriptionData.filename)}
                          title="Download Job Description"
                        >
                          <FontAwesomeIcon icon={faDownload} />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Skills and Qualifications */}
            {resumeData.skills && resumeData.skills.length > 0 && (
              <div className="candidate-info-card">
                <h3>
                  <FontAwesomeIcon icon={faStar} />
                  Skills
                </h3>
                <div className="skills-container">
                  {resumeData.skills.map((skill, index) => (
                    <span key={index} className="skill-badge">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'results' && (
          <div className="tab-content assessment-tab">
            <div className="assessment-summary">
              <h3>
                <FontAwesomeIcon icon={faChartBar} />
                Assessment Summary
              </h3>
              
              <div className="scores-grid">
                <div className="score-card">
                  <h4>MCQ Score</h4>
                  <p className="score-value">{sessionData.testResult?.score?.toFixed(2) || 'N/A'}/100</p>
                </div>
                <div className="score-card">
                  <h4>Audio Score</h4>
                  <p className="score-value">{sessionData.testResult?.audioScore?.toFixed(2) || 'N/A'}/100</p>
                </div>
                <div className="score-card combined-score">
                  <h4>Combined Score</h4>
                  <p className="score-value">{sessionData.testResult?.combinedScore?.toFixed(2) || 'N/A'}/100</p>
                </div>
              </div>
            </div>

            {sessionData.voiceAnswers && sessionData.voiceAnswers.length > 0 && (
              <div className="voice-answers-section">
                <h3>
                  <FontAwesomeIcon icon={faMicrophone} />
                  Voice Assessment Details
                </h3>
                <div className="voice-answers-list">
                  {sessionData.voiceAnswers.map((answer, index) => (
                    <div key={answer._id} className="voice-answer-card">
                      <h4>Question {index + 1}</h4>
                      <p className="question-text">{answer.question}</p>
                      
                      {answer.answer && (
                        <div className="answer-section">
                          <h5>Answer:</h5>
                          <p>{answer.answer}</p>
                        </div>
                      )}
                      
                      <div className="answer-metrics">
                        {answer.audioAnalysis?.grading && (
                          <div className="metric">
                            <label>Audio Score:</label>
                            <span>{answer.audioAnalysis.grading['Total Score']?.toFixed(2) || 'N/A'}/100</span>
                          </div>
                        )}
                        
                        {answer.textEvaluation?.metrics && (
                          <div className="metric">
                            <label>Text Evaluation:</label>
                            <span>{answer.textEvaluation.metrics.total_average?.toFixed(2) || 'N/A'}/100</span>
                          </div>
                        )}
                        
                        <div className="metric">
                          <label>Status:</label>
                          <span className={`status-badge status-${answer.processingStatus || answer.status}`}>
                            {answer.processingStatus?.toUpperCase() || answer.status?.toUpperCase() || 'N/A'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'recordings' && (
          <div className="tab-content recordings-tab">
            <h3>
              <FontAwesomeIcon icon={faVideo} />
              Session Recordings
            </h3>
            
            {sessionData.recording ? (
              <div className="recordings-grid">
                {sessionData.recording.videoPath && (
                  <div className="recording-item">
                    <div className="recording-info">
                      <FontAwesomeIcon icon={faVideo} className="recording-icon" />
                      <div>
                        <h4>Video Recording</h4>
                        <p>Face Camera Recording</p>
                      </div>
                    </div>
                    <div className="recording-actions">
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </button>
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
                
                {sessionData.recording.screenPath && (
                  <div className="recording-item">
                    <div className="recording-info">
                      <FontAwesomeIcon icon={faVideo} className="recording-icon" />
                      <div>
                        <h4>Screen Recording</h4>
                        <p>Screen Share Recording</p>
                      </div>
                    </div>
                    <div className="recording-actions">
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </button>
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
                
                {sessionData.recording.audioPath && (
                  <div className="recording-item">
                    <div className="recording-info">
                      <FontAwesomeIcon icon={faMicrophone} className="recording-icon" />
                      <div>
                        <h4>Audio Recording</h4>
                        <p>Voice Recording</p>
                      </div>
                    </div>
                    <div className="recording-actions">
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faEye} />
                        View
                      </button>
                      <button className="btn-secondary">
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-recordings">
                <FontAwesomeIcon icon={faVideo} size="3x" />
                <p>No recordings available for this session</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AssessmentSessionDetails;