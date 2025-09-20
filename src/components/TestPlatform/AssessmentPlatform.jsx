import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RecordRTC from 'recordrtc';
import { Rnd } from 'react-rnd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faStop, faExpand, faCompress, 
  faMinus, faTimes, faCheckCircle, faExclamationTriangle,
  faUser, faVideo, faMicrophone, faDesktop
} from '@fortawesome/free-solid-svg-icons';
import { motion } from 'framer-motion';
import Quiz from './Quiz';
import VoiceAssessment from './VoiceAssessment';
import { axiosInstance } from '../../axiosUtils';
const AssessmentPlatform = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  

 // Recording state
 const [recording, setRecording] = useState(false);
 const [mediaBlob, setMediaBlob] = useState(null);
 const [screenBlob, setScreenBlob] = useState(null);
 const [transcription, setTranscription] = useState(null);
 const [recordingId, setRecordingId] = useState(null);
 
 // UI state
 const [isCameraPopupOpen, setIsCameraPopupOpen] = useState(false);
 const [isMinimized, setIsMinimized] = useState(false);
 const [isFullscreen, setIsFullscreen] = useState(false);
 const [currentStep, setCurrentStep] = useState(1); // 1: Instructions, 2: Verification, 3: Consent, 4: Quiz
 const [systemCheck, setSystemCheck] = useState({
   camera: false,
   microphone: false,
   screenShare: false
 });
 const [tabActive, setTabActive] = useState(true);
 const [consentGiven, setConsentGiven] = useState(false);
 const [session, setSession] = useState(null);

 // Refs
 const mediaStreamRef = useRef(null);
 const screenStreamRef = useRef(null);
 const recorderRef = useRef(null);
 const screenRecorderRef = useRef(null);
 const fullscreenElementRef = useRef(null);
  // Add this effect at the start of the component
// Replace your validation useEffect with this:
const [validationComplete, setValidationComplete] = useState(false);
const [assessmentPhase, setAssessmentPhase] = useState('mcq');

useEffect(() => {
  const validateSession = async () => {
    try {
      const response = await axiosInstance.get(
        `/api/validate-assessment/${token}`
      );
      
      if (!response.data.valid) {
        let redirectMessage = response.data.error || 'Invalid assessment link';
        
        if (response.data.status === 'completed') {
          redirectMessage = 'This assessment has already been completed successfully.';
        }
        
        alert(redirectMessage);
        navigate('/');
        return;
      }
      
      setValidationComplete(true);
    } catch (error) {
      console.error('Validation error:', error);
      navigate('/');
    }
  };

  validateSession();
}, [token, navigate]);

  // Initialize session
  useEffect(() => {
    // Then wrap your entire component JSX with:
    if (!validationComplete) return; // Early exit here instead
  
    const initializeSession = async () => {
      try {
        const response = await axiosInstance.post('/api/start-assessment-recording', { token });
        setSession(response.data);
      } catch (error) {
        console.error('Error starting assessment:', error);
        alert('Failed to initialize assessment session.');
      }
    };
    initializeSession();
  }, [token, validationComplete]);
 
  // System check
  const checkSystemRequirements = async () => {
    try {
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStream.getTracks().forEach(track => track.stop());
      
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getTracks().forEach(track => track.stop());
      
      setSystemCheck({
        camera: true,
        microphone: true,
        screenShare: true // Will be verified during recording
      });
      
      return true;
    } catch (error) {
      console.error("System check failed:", error);
      return false;
    }
  };

  // Tab switching detection
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabActive(!document.hidden);
      if (document.hidden && recording) {
        alert("Please don't switch tabs during the assessment!");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [recording]);

  // Start recording
  const startRecording = async () => {
    try {

      const validation = await axiosInstance.get(
        `/api/validate-assessment/${token}`
      );
      
      if (!validation.data.valid) {
        alert(validation.data.error || 'Assessment link is no longer valid');
        navigate('/');
        return;
      }
      // Start camera recording
      const cameraStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      mediaStreamRef.current = cameraStream;
      recorderRef.current = new RecordRTC(cameraStream, { type: "video" });
      recorderRef.current.startRecording();

      // Start screen recording
      const screenStream = await navigator.mediaDevices.getDisplayMedia({ 
        video: true, 
        audio: true 
      });
      
      screenStream.getVideoTracks()[0].onended = () => {
        if (recording) stopRecording();
      };

      screenStreamRef.current = screenStream;
      screenRecorderRef.current = new RecordRTC(screenStream, { type: "video" });
      screenRecorderRef.current.startRecording();

      // Enter fullscreen mode
      toggleFullscreen();

      setRecording(true);
      setIsCameraPopupOpen(true);
      setCurrentStep(4); // Move to quiz step
    } catch (error) {
      console.error("Error accessing media:", error);
      stopAllMediaTracks();
    }
  };

  // Stop recording and upload
  const stopRecording = async () => {
    if (!recorderRef.current || !screenRecorderRef.current) return;

    recorderRef.current.stopRecording(() => {
      const cameraBlob = recorderRef.current.getBlob();
      setMediaBlob(cameraBlob);

      screenRecorderRef.current.stopRecording(async () => {
        const screenBlob = screenRecorderRef.current.getBlob();
        setScreenBlob(screenBlob);

        const formData = new FormData();
        formData.append("cameraFile", cameraBlob, "camera_recording.webm");
        formData.append("screenFile", screenBlob, "screen_recording.webm");
        formData.append("assessmentToken", token);  // Add this line

        try {
          const response = await axiosInstance.post("/upload", formData);
          setRecordingId(response.data.file._id);
          return response.data.file._id;
        } catch (error) {
          console.error("Upload error:", error);
          return null;
        }
      });
    });

    setRecording(false);
    setIsCameraPopupOpen(false);
    stopAllMediaTracks();
  };

// In your existing startRecording function - NO CHANGES NEEDED
// It already starts both camera and screen recording

// In your completeAssessment function - MODIFY TO NOT STOP RECORDING
const completeAssessment = async (score) => {
  console.log("MCQ completed with score:", score);
  try {
    const response = await axiosInstance.post('/api/complete-assessment', {
      token,
      score,
    });
    console.log("Backend response:", response.data);
    
    setAssessmentPhase('voice');
    console.log("Moved to Voice Assessment phase");
  } catch (error) {
    console.error("Error in completeAssessment:", error);
    setAssessmentPhase('completed');
  }
};

// Add new function to handle final completion
const completeVoiceAssessment = async () => {
  try {
    const recordingId = await stopRecording(); // Now we stop recording here
    
    await axiosInstance.post('/api/complete-voice-assessment', { 
      token,
      recordingId // Pass recording ID when voice assessment is done
    });
    
    setCurrentStep(5);
    setAssessmentPhase('completed');
  } catch (error) {
    console.error('Error completing voice assessment:', error);
    setCurrentStep(5);
    setAssessmentPhase('completed');
  }
};

// Add this new function to handle final completion
const handleFinalCompletion = () => {
  setCurrentStep(5);
  setAssessmentPhase('completed');
  // Ensure all media is stopped
  stopAllMediaTracks();
};
  // Clean up
  const stopAllMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
  };

  // Toggle fullscreen
// Modify the fullscreen toggle function
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      document.documentElement.classList.add('fullscreen-enabled');
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      document.documentElement.classList.remove('fullscreen-enabled');
      setIsFullscreen(false);
    }
  } catch (err) {
    console.error('Fullscreen error:', err);
  }
};
// Add this effect to handle pointer events
useEffect(() => {
  const handleFullscreenChange = () => {
    if (document.fullscreenElement) {
      document.body.style.overflow = 'auto';
      document.body.style.touchAction = 'auto';
    }
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
  };
}, []);
if (!validationComplete) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <div className="card-glass p-8 text-center">
        <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">Validating assessment link...</p>
      </div>
    </div>
  );
}
  // Render steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Instructions
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center p-6 rounded-t-xl">
                <h3 className="text-xl font-semibold">Assessment Instructions</h3>
              </div>
              <div className="p-6">
                <ol className="list-decimal pl-5 space-y-2 mb-6">
                  <li className="text-gray-700">Ensure you're in a quiet, well-lit environment</li>
                  <li className="text-gray-700">Close all unnecessary applications</li>
                  <li className="text-gray-700">Have your ID ready if required</li>
                  <li className="text-gray-700">Test your equipment before starting</li>
                  <li className="text-gray-700">The session will be recorded</li>
                  <li className="text-gray-700">You'll complete an MCQ test after verification</li>
                </ol>

                <div className="space-y-3">
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200"
                    onClick={async () => {
                      const ready = await checkSystemRequirements();
                      if (ready) setCurrentStep(2);
                    }}
                  >
                    Begin System Check
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 2: // Verification
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center p-6 rounded-t-xl">
                <h3 className="text-xl font-semibold">System Verification</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  <div className={`p-4 rounded-lg flex items-center ${systemCheck.camera ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <FontAwesomeIcon
                      icon={systemCheck.camera ? faCheckCircle : faExclamationTriangle}
                      className={`text-xl mr-3 ${systemCheck.camera ? 'text-green-600' : 'text-yellow-600'}`}
                    />
                    <span className="font-medium">Camera: {systemCheck.camera ? 'Working' : 'Not detected'}</span>
                  </div>
                  <div className={`p-4 rounded-lg flex items-center ${systemCheck.microphone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                    <FontAwesomeIcon
                      icon={systemCheck.microphone ? faCheckCircle : faExclamationTriangle}
                      className={`text-xl mr-3 ${systemCheck.microphone ? 'text-green-600' : 'text-yellow-600'}`}
                    />
                    <span className="font-medium">Microphone: {systemCheck.microphone ? 'Working' : 'Not detected'}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ${(!systemCheck.camera || !systemCheck.microphone) ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={() => setCurrentStep(3)}
                    disabled={!systemCheck.camera || !systemCheck.microphone}
                  >
                    Continue to Consent
                  </button>
                  <button
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
                    onClick={() => setCurrentStep(1)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 3: // Consent
        return (
          <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl">
              <div className="bg-blue-600 text-white text-center p-6 rounded-t-xl">
                <h3 className="text-xl font-semibold">Recording Consent</h3>
              </div>
              <div className="p-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <h5 className="font-semibold text-blue-800 mb-2">By proceeding, you consent to:</h5>
                  <ul className="list-disc pl-5 space-y-1 text-blue-700">
                    <li>Recording of your camera, microphone, and screen</li>
                    <li>Storage and processing of the recording</li>
                    <li>Completion of an MCQ test under supervision</li>
                  </ul>
                </div>

                <div className="flex items-center mb-6">
                  <input
                    type="checkbox"
                    id="consentCheck"
                    checked={consentGiven}
                    onChange={(e) => setConsentGiven(e.target.checked)}
                    className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="consentCheck" className="ml-3 block text-gray-700 font-medium">
                    I understand and consent to the recording and assessment
                  </label>
                </div>

                <div className="space-y-3">
                  <button
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ${!consentGiven ? 'opacity-50 cursor-not-allowed' : ''}`}
                    onClick={startRecording}
                    disabled={!consentGiven}
                  >
                    Begin Assessment
                  </button>
                  <button
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-4 rounded-lg transition duration-200"
                    onClick={() => setCurrentStep(2)}
                  >
                    Back
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 4: // Quiz
        return (
          <div className="quiz-container">
            <Quiz 
              proctored={true} 
              onComplete={completeAssessment}
            />
          </div>
        );
      
      case 5: // Completion
        return (
          <div className="flex justify-center items-center min-h-screen">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="bg-green-600 text-white p-6 rounded-t-xl">
                <h3 className="text-xl font-semibold mb-0">Assessment Complete</h3>
              </div>
              <div className="p-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-green-800">Your assessment has been successfully submitted!</p>
                  <p className="text-green-800 font-semibold"><strong>This link is now expired.</strong> You cannot retake this assessment.</p>
                </div>
                <div>
                  <button 
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition duration-200"
                    onClick={() => {
                      stopAllMediaTracks();
                      navigate('/');
                    }}
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50" ref={fullscreenElementRef}>
      {/* Recording Header */}
      {recording && (
        <motion.header 
          className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-200 shadow-sm"
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="container-modern py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <FontAwesomeIcon icon={faStop} className="text-sm" />
                <span className="font-semibold text-sm">Recording</span>
              </div>
              <button 
                className="btn-outline px-4 py-2 text-sm font-medium flex items-center gap-2"
                onClick={toggleFullscreen}
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
                {isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              </button>
            </div>
          </div>
        </motion.header>
      )}
  
      {/* Main Content */}
      <main className={`${recording ? 'pt-20' : ''} min-h-screen`}>
        {assessmentPhase === 'mcq' ? (
          renderStepContent()
        ) : assessmentPhase === 'voice' ? (
          <VoiceAssessment 
            onComplete={completeVoiceAssessment}
            onError={() => {
              setCurrentStep(5);
              setAssessmentPhase('completed');
            }}
          />
        ) : (
          renderStepContent()
        )}
      </main>
  {/* Camera Pop-Up */}
      {isCameraPopupOpen && !isMinimized && (
        <Rnd
          default={{
            x: window.innerWidth - 320,
            y: 50,
            width: 250,
            height: 200,
          }}
          minWidth={250}
          minHeight={150}
          enableResizing
          className="camera-popup shadow-lg"
        >
          <div className="popup-header bg-gray-900 text-white p-2 flex justify-between items-center">
            <h6 className="m-0">
              <FontAwesomeIcon icon={faVideo} className="mr-5" />
            
            </h6>
            <div>
              <button 
                className="inline-flex items-center px-2 py-1 text-sm font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 mr-2"
                onClick={() => setIsMinimized(true)}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button 
                className="inline-flex items-center px-2 py-1 text-sm font-medium rounded border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                onClick={() => setIsCameraPopupOpen(false)}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          </div>
          <video
            autoPlay
            muted
            ref={(video) => {
              if (video && mediaStreamRef.current) {
                video.srcObject = mediaStreamRef.current;
              }
            }}
            className="popup-video w-full h-full"
          />
        </Rnd>
      )}

      {/* Minimized Pop-Up Button */}
      {isMinimized && (
        <button 
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-200"
          onClick={() => {
            setIsMinimized(false);
            setIsCameraPopupOpen(true);
          }}
        >
          <FontAwesomeIcon icon={faVideo} />
        </button>
      )}
     
    </div>
  );
};

export default AssessmentPlatform;