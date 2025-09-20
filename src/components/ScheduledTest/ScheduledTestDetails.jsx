import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUser, 
  faEnvelope,
  faCalendarAlt,
  faClock,
  faFile,
  faChartBar,
  faArrowLeft,
  faSpinner,
  faCheckCircle,
  faHourglassHalf,
  faExclamationTriangle,
  faTimes,
  faDownload,
  faEye,
  faGraduationCap,
  faBriefcase,
  faStar,
  faClipboardList,
  faMicrophone,
  faVideo,
  faDesktop,
  faPlayCircle
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';
import { useMediaOperations } from '../../hooks/useMediaOperations';
import './ScheduledTestDetails.css';

const ScheduledTestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [testDetails, setTestDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState({
    resume: false,
    jobDescription: false
  });
  
  // Use the shared media operations hook
  const { mediaOperations, viewAudio, downloadAudio, viewVideo, downloadVideo, extractFileKey } = useMediaOperations();

  useEffect(() => {
    fetchTestDetails();
  }, [id]);

  const fetchTestDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/api/scheduled-tests/${id}/details`);
      
      if (response.data.success) {
        setTestDetails(response.data.data);
      } else {
        toast.error('Failed to fetch test details');
      }
    } catch (error) {
      console.error('Error fetching test details:', error);
      toast.error('Failed to fetch test details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'scheduled':
        return <FontAwesomeIcon icon={faClock} className="status-icon scheduled" />;
      case 'active':
        return <FontAwesomeIcon icon={faHourglassHalf} className="status-icon active" />;
      case 'completed':
        return <FontAwesomeIcon icon={faCheckCircle} className="status-icon completed" />;
      case 'expired':
        return <FontAwesomeIcon icon={faExclamationTriangle} className="status-icon expired" />;
      case 'cancelled':
        return <FontAwesomeIcon icon={faTimes} className="status-icon cancelled" />;
      default:
        return <FontAwesomeIcon icon={faClock} className="status-icon" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'scheduled':
        return 'Scheduled';
      case 'active':
        return 'Active';
      case 'completed':
        return 'Completed';
      case 'expired':
        return 'Expired';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const downloadDocument = async (type, documentId, filename) => {
    try {
      setDownloading(prev => ({ ...prev, [type]: true }));
      
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint, {
        params: { download: true }
      });
      
      if (response.data.url) {
        // Create a temporary link and trigger download
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
    } finally {
      setDownloading(prev => ({ ...prev, [type]: false }));
    }
  };

  const viewDocument = async (type, documentId) => {
    try {
      const endpoint = type === 'resume' 
        ? `/api/resumes/${documentId}` 
        : `/api/job-descriptions/${documentId}`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.url) {
        // Open in a new tab instead of a new window for better UX
        window.open(response.data.url, '_blank', 'noopener,noreferrer');
      } else {
        toast.error(`Failed to view ${type}`);
      }
    } catch (error) {
      console.error(`Error viewing ${type}:`, error);
      toast.error(`Failed to view ${type}`);
    }
  };

  // Remove the duplicated functions since we're using the shared hook
  // The following functions are now provided by useMediaOperations hook:
  // - extractFileKey
  // - viewVideo
  // - downloadVideo
  // - viewAudio
  // - downloadAudio

  if (loading) {
    return (
      <div className="scheduled-tests-loading">
        <FontAwesomeIcon icon={faSpinner} spin size="2x" />
        <p>Loading test details...</p>
      </div>
    );
  }

  if (!testDetails) {
    return (
      <div className="scheduled-tests-container">
        <div className="no-data">
          <FontAwesomeIcon icon={faExclamationTriangle} size="3x" style={{ color: '#f59e0b' }} />
          <p>Test details not found</p>
          <button className="btn-primary" onClick={() => navigate('/dashboard/scheduled-tests')}>
            <FontAwesomeIcon icon={faArrowLeft} />
            Back to Tests
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="scheduled-tests-container">
      <div className="scheduled-test-details-header">
        <button className="btn-back" onClick={() => navigate('/dashboard/scheduled-tests')}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to Tests
        </button>
        <div className="header-content">
          <h2>
            <FontAwesomeIcon icon={faClipboardList} className="header-icon" />
            Scheduled Test Details
          </h2>
          <div className="candidate-summary">
            <div className="candidate-avatar-large">
              <FontAwesomeIcon icon={faUser} />
            </div>
            <div className="candidate-info">
              <h3>{testDetails.candidateName || 'N/A'}</h3>
              <p>
                <FontAwesomeIcon icon={faEnvelope} />
                {testDetails.candidateEmail || 'N/A'}
              </p>
              <div className="test-status-badge">
                {getStatusIcon(testDetails.testStatus)}
                <span>{getStatusText(testDetails.testStatus)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="scheduled-test-details-card">
        <div className="test-details-section">
          <h3>
            <FontAwesomeIcon icon={faCalendarAlt} className="section-icon" />
            Test Timing Information
          </h3>
          <div className="details-grid">
            <div className="detail-item">
              <FontAwesomeIcon icon={faClock} className="detail-icon" />
              <div>
                <label>Scheduled Date & Time</label>
                <p>{formatDateTime(testDetails.scheduledDateTime)}</p>
              </div>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faHourglassHalf} className="detail-icon" />
              <div>
                <label>Activated At</label>
                <p>{formatDateTime(testDetails.activatedAt)}</p>
              </div>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faCheckCircle} className="detail-icon" />
              <div>
                <label>Completed At</label>
                <p>{formatDateTime(testDetails.completedAt)}</p>
              </div>
            </div>
            <div className="detail-item">
              <FontAwesomeIcon icon={faExclamationTriangle} className="detail-icon" />
              <div>
                <label>Expires At</label>
                <p>{formatDateTime(testDetails.expiresAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {testDetails.testResults && (
          <div className="test-details-section">
            <h3>
              <FontAwesomeIcon icon={faChartBar} className="section-icon" />
              Assessment Results
            </h3>
            <div className="score-grid">
              <div className="score-card">
                <div className="score-header">
                  <FontAwesomeIcon icon={faGraduationCap} />
                  <h4>MCQ Score</h4>
                </div>
                <div className="score-value">
                  {testDetails.testResults?.mcqScore !== undefined && testDetails.testResults?.mcqScore !== null ? testDetails.testResults.mcqScore.toFixed(2) : 'N/A'}
                  <span className="score-max">/100</span>
                </div>
                <div className="score-description">Knowledge Assessment</div>
              </div>
              <div className="score-card">
                <div className="score-header">
                  <FontAwesomeIcon icon={faMicrophone} />
                  <h4>Audio Score</h4>
                </div>
                <div className="score-value">
                  {testDetails.testResults?.audioScore !== undefined && testDetails.testResults?.audioScore !== null ? testDetails.testResults.audioScore.toFixed(2) : 'N/A'}
                  <span className="score-max">/100</span>
                </div>
                <div className="score-description">Voice Clarity & Delivery</div>
              </div>
              <div className="score-card">
                <div className="score-header">
                  <FontAwesomeIcon icon={faFile} />
                  <h4>Text Score</h4>
                </div>
                <div className="score-value">
                  {testDetails.testResults?.textScore !== undefined && testDetails.testResults?.textScore !== null ? testDetails.testResults.textScore.toFixed(2) : 'N/A'}
                  <span className="score-max">/100</span>
                </div>
                <div className="score-description">Content Quality</div>
              </div>
              <div className="score-card">
                <div className="score-header">
                  <FontAwesomeIcon icon={faVideo} />
                  <h4>Video Score</h4>
                </div>
                <div className="score-value">
                  {testDetails.testResults?.videoScore !== undefined && testDetails.testResults?.videoScore !== null ? testDetails.testResults.videoScore.toFixed(2) : 'N/A'}
                  <span className="score-max">/100</span>
                </div>
                <div className="score-description">Visual Presentation</div>
              </div>
              <div className="score-card combined-score">
                <div className="score-header">
                  <FontAwesomeIcon icon={faStar} />
                  <h4>Combined Score</h4>
                </div>
                <div className="score-value">
                  {testDetails.testResults?.combinedScore !== undefined && testDetails.testResults?.combinedScore !== null ? testDetails.testResults.combinedScore.toFixed(2) : 'N/A'}
                  <span className="score-max">/100</span>
                </div>
                <div className="score-description">Overall Performance</div>
              </div>
            </div>
            <div className="test-status-summary">
              <FontAwesomeIcon icon={faChartBar} className="detail-icon" />
              <div>
                <label>Assessment Status</label>
                <p>{testDetails.testResults.status || 'N/A'}</p>
              </div>
              <div className="submitted-info">
                <label>Submitted At</label>
                <p>{formatDateTime(testDetails.testResults.submittedAt)}</p>
              </div>
            </div>
          </div>
        )}

        <div className="test-details-section">
          <h3>
            <FontAwesomeIcon icon={faFile} className="section-icon" />
            Test Documents
          </h3>
          <div className="documents-grid">
            {testDetails.resume && (
              <div className="document-card">
                <div className="document-icon-container">
                  <FontAwesomeIcon icon={faGraduationCap} className="document-icon" />
                </div>
                <div className="document-info">
                  <h4>
                    <FontAwesomeIcon icon={faFile} />
                    Candidate Resume
                  </h4>
                  <p className="document-filename">{testDetails.resume.filename || 'N/A'}</p>
                  <div className="document-meta">
                    <span className="document-type">PDF Document</span>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => viewDocument('resume', testDetails.resume.id)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => downloadDocument('resume', testDetails.resume.id, testDetails.resume.filename)}
                    disabled={downloading.resume}
                  >
                    {downloading.resume ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
            
            {testDetails.jobDescription && (
              <div className="document-card">
                <div className="document-icon-container">
                  <FontAwesomeIcon icon={faBriefcase} className="document-icon" />
                </div>
                <div className="document-info">
                  <h4>
                    <FontAwesomeIcon icon={faFile} />
                    Job Description
                  </h4>
                  <p className="document-filename">{testDetails.jobDescription.filename || 'N/A'}</p>
                  <div className="document-meta">
                    <span className="document-type">PDF Document</span>
                  </div>
                </div>
                <div className="document-actions">
                  <button 
                    className="btn-secondary"
                    onClick={() => viewDocument('jobDescription', testDetails.jobDescription.id)}
                  >
                    <FontAwesomeIcon icon={faEye} />
                    View
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => downloadDocument('jobDescription', testDetails.jobDescription.id, testDetails.jobDescription.filename)}
                    disabled={downloading.jobDescription}
                  >
                    {downloading.jobDescription ? (
                      <>
                        <FontAwesomeIcon icon={faSpinner} spin />
                        Downloading...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faDownload} />
                        Download
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Add Media Recordings Section */}
        {testDetails.recordings && (
          <div className="test-details-section">
            <h3>
              <FontAwesomeIcon icon={faVideo} className="section-icon" />
              Media Recordings
            </h3>
            
            <div className="media-grid">
              {/* Video Recording */}
              {testDetails.recordings.videoPath && (
                <div className="media-card">
                  <div className="media-icon-container">
                    <FontAwesomeIcon icon={faVideo} className="media-icon" />
                  </div>
                  <div className="media-info">
                    <h4>
                      <FontAwesomeIcon icon={faVideo} />
                      Video Recording
                    </h4>
                    <p className="media-description">Candidate's face camera recording</p>
                  </div>
                  <div className="media-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => viewVideo('video')}
                      disabled={mediaOperations.video.viewing}
                    >
                      {mediaOperations.video.viewing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEye} />
                          View
                        </>
                      )}
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => downloadVideo('video')}
                      disabled={mediaOperations.video.downloading}
                    >
                      {mediaOperations.video.downloading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faDownload} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
              
              {/* Screen Recording */}
              {testDetails.recordings.screenPath && (
                <div className="media-card">
                  <div className="media-icon-container">
                    <FontAwesomeIcon icon={faDesktop} className="media-icon" />
                  </div>
                  <div className="media-info">
                    <h4>
                      <FontAwesomeIcon icon={faDesktop} />
                      Screen Recording
                    </h4>
                    <p className="media-description">Candidate's screen sharing recording</p>
                  </div>
                  <div className="media-actions">
                    <button 
                      className="btn-secondary"
                      onClick={() => viewVideo('screen')}
                      disabled={mediaOperations.screen.viewing}
                    >
                      {mediaOperations.screen.viewing ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Loading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faEye} />
                          View
                        </>
                      )}
                    </button>
                    <button 
                      className="btn-primary"
                      onClick={() => downloadVideo('screen')}
                      disabled={mediaOperations.screen.downloading}
                    >
                      {mediaOperations.screen.downloading ? (
                        <>
                          <FontAwesomeIcon icon={faSpinner} spin />
                          Downloading...
                        </>
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faDownload} />
                          Download
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Add Voice Answers Section */}
        {testDetails.voiceAnswers && testDetails.voiceAnswers.length > 0 && (
          <div className="test-details-section">
            <h3>
              <FontAwesomeIcon icon={faMicrophone} className="section-icon" />
              Voice Answers
            </h3>
            
            <div className="voice-answers-list">
              {testDetails.voiceAnswers.map((answer, index) => {
                // Extract audio key from the path
                const audioKey = answer.audioPath ? extractFileKey(answer.audioPath) : null;
                
                return (
                  <div key={answer._id || index} className="voice-answer-card">
                    <div className="voice-answer-header">
                      <div className="voice-answer-icon">
                        <FontAwesomeIcon icon={faMicrophone} />
                      </div>
                      <div className="voice-answer-info">
                        <h4>Question {index + 1}</h4>
                        <p className="voice-answer-question">{answer.question || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="voice-answer-content">
                      <div className="voice-answer-transcript">
                        <h5>Transcript:</h5>
                        <p>{answer.answer || 'No transcript available'}</p>
                      </div>
                      
                      {audioKey && (
                        <div className="voice-answer-actions">
                          <button 
                            className="btn-secondary"
                            onClick={() => viewAudio(audioKey, index)}
                            disabled={mediaOperations.audio[index]?.viewing}
                          >
                            {mediaOperations.audio[index]?.viewing ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Loading...
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faPlayCircle} />
                                Play Audio
                              </>
                            )}
                          </button>
                          <button 
                            className="btn-primary"
                            onClick={() => downloadAudio(audioKey, index)}
                            disabled={mediaOperations.audio[index]?.downloading}
                          >
                            {mediaOperations.audio[index]?.downloading ? (
                              <>
                                <FontAwesomeIcon icon={faSpinner} spin />
                                Downloading...
                              </>
                            ) : (
                              <>
                                <FontAwesomeIcon icon={faDownload} />
                                Download
                              </>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default ScheduledTestDetails;