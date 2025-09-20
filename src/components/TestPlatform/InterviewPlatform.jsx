import React, { useRef, useState, useEffect } from "react";
import RecordRTC from "recordrtc";
import axios from "axios";
import { Rnd } from "react-rnd";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlay, faStop, faExpand, faCompress, 
  faMinus, faTimes, faCheckCircle, faExclamationTriangle,
  faUser, faVideo, faMicrophone, faDesktop
} from '@fortawesome/free-solid-svg-icons';

import { axiosInstance } from "../../axiosUtils";
const InterviewPlatform = () => {
  // State management
  const [recording, setRecording] = useState(false);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [screenBlob, setScreenBlob] = useState(null);
  const [transcription, setTranscription] = useState(null);
  const [isCameraPopupOpen, setIsCameraPopupOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1); // 1: Instructions, 2: Verification, 3: Consent, 4: Recording
  const [systemCheck, setSystemCheck] = useState({
    camera: false,
    microphone: false,
    screenShare: false
  });
  const [tabActive, setTabActive] = useState(true);
  const [consentGiven, setConsentGiven] = useState(false);

  // Refs
  const mediaStreamRef = useRef(null);
  const screenStreamRef = useRef(null);
  const recorderRef = useRef(null);
  const screenRecorderRef = useRef(null);
  const fullscreenElementRef = useRef(null);

  // Check system requirements
  const checkSystemRequirements = async () => {
    try {
      // Check camera
      const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true });
      cameraStream.getTracks().forEach(track => track.stop());
      setSystemCheck(prev => ({ ...prev, camera: true }));

      // Check microphone
      const micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStream.getTracks().forEach(track => track.stop());
      setSystemCheck(prev => ({ ...prev, microphone: true }));

      // Screen share can't be checked without user interaction
      setSystemCheck(prev => ({ ...prev, screenShare: true }));

      return true;
    } catch (error) {
      console.error("System check failed:", error);
      return false;
    }
  };

  // Handle visibility change (tab switching)
  useEffect(() => {
    const handleVisibilityChange = () => {
      setTabActive(!document.hidden);
      if (document.hidden && recording) {
        // Warn user when they switch tabs during recording
        alert("Please don't switch tabs during the interview recording!");
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [recording]);

  // Prevent ESC key during fullscreen recording
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen && recording) {
        e.preventDefault();
        alert("Please use the stop button to end recording properly.");
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, recording]);

  // Toggle fullscreen mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      fullscreenElementRef.current?.requestFullscreen().catch(err => {
        console.error("Error attempting to enable fullscreen:", err);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Start the interview process
  const startInterviewProcess = async () => {
    const systemReady = await checkSystemRequirements();
    if (systemReady) {
      setCurrentStep(2); // Move to verification step
    }
  };

  // Start Recording (Camera + Screen)
  const startRecording = async () => {
    try {
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
      
      // Automatically stop recording if screen share is canceled
      screenStream.getVideoTracks()[0].onended = () => {
        if (recording) {
          stopRecording();
        }
      };

      screenStreamRef.current = screenStream;
      screenRecorderRef.current = new RecordRTC(screenStream, { type: "video" });
      screenRecorderRef.current.startRecording();

      // Enter fullscreen mode
      toggleFullscreen();

      setRecording(true);
      setIsCameraPopupOpen(true);
      setCurrentStep(4); // Move to recording step
    } catch (error) {
      console.error("Error accessing media:", error);
      stopAllMediaTracks();
    }
  };

  // Stop Recording
  const stopRecording = () => {
    if (!recorderRef.current || !screenRecorderRef.current) return;

    // Exit fullscreen first
    if (document.fullscreenElement) {
      document.exitFullscreen();
      setIsFullscreen(false);
    }

    recorderRef.current.stopRecording(() => {
      const cameraBlob = recorderRef.current.getBlob();
      setMediaBlob(cameraBlob);

      screenRecorderRef.current.stopRecording(() => {
        const screenBlob = screenRecorderRef.current.getBlob();
        setScreenBlob(screenBlob);

        uploadRecordings(cameraBlob, screenBlob);
      });
    });

    setRecording(false);
    setIsCameraPopupOpen(false);
  };

  // Clean up all media tracks
  const stopAllMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach(track => track.stop());
    screenStreamRef.current?.getTracks().forEach(track => track.stop());
  };

  // Upload Recordings
  const uploadRecordings = async (cameraBlob, screenBlob) => {
    const formData = new FormData();
    formData.append("cameraFile", cameraBlob, "camera_recording.webm");
    formData.append("screenFile", screenBlob, "screen_recording.webm");

    try {
      const response = await axiosInstance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.transcription) {
        setTranscription(response.data.transcription.transcriptionPath);
      }
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopAllMediaTracks();
      if (document.fullscreenElement) {
        document.exitFullscreen();
      }
    };
  }, []);

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  // Render onboarding steps
  const renderStepContent = () => {
    switch (currentStep) {
      case 1: // Instructions
        return (
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6 border border-gray-200">
            <div className="bg-blue-600 text-white rounded-t-lg -m-6 mb-0 p-4">
              <h3 className="text-xl font-bold">Interview Recording Instructions</h3>
            </div>
            <div className="pt-4">
              <ol className="list-decimal pl-5 space-y-2">
                <li className="border-b border-gray-100 pb-2">Ensure you're in a quiet, well-lit environment</li>
                <li className="border-b border-gray-100 pb-2">Close all unnecessary applications</li>
                <li className="border-b border-gray-100 pb-2">Have your ID ready if required</li>
                <li className="border-b border-gray-100 pb-2">Test your equipment before starting</li>
                <li>Interview will be recorded</li>
              </ol>
              <div className="mt-4">
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200"
                  onClick={startInterviewProcess}
                >
                  Begin System Check
                </button>
              </div>
            </div>
          </div>
        );
      
      case 2: // Verification
        return (
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6 border border-gray-200">
            <div className="bg-blue-600 text-white rounded-t-lg -m-6 mb-0 p-4">
              <h3 className="text-xl font-bold">System Verification</h3>
            </div>
            <div className="pt-4">
              <div className="space-y-3 mb-4">
                <div className={`p-3 rounded-lg flex items-center ${systemCheck.camera ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <FontAwesomeIcon icon={systemCheck.camera ? faCheckCircle : faExclamationTriangle} className="mr-2" />
                  <span>Camera: {systemCheck.camera ? 'Working' : 'Not detected'}</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center ${systemCheck.microphone ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <FontAwesomeIcon icon={systemCheck.microphone ? faCheckCircle : faExclamationTriangle} className="mr-2" />
                  <span>Microphone: {systemCheck.microphone ? 'Working' : 'Not detected'}</span>
                </div>
                <div className={`p-3 rounded-lg flex items-center ${systemCheck.screenShare ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                  <FontAwesomeIcon icon={systemCheck.screenShare ? faCheckCircle : faExclamationTriangle} className="mr-2" />
                  <span>Screen Sharing: {systemCheck.screenShare ? 'Available' : 'Will be tested'}</span>
                </div>
              </div>
              
              <div className="space-y-3">
                <button 
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${(!systemCheck.camera || !systemCheck.microphone) ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={() => setCurrentStep(3)}
                  disabled={!systemCheck.camera || !systemCheck.microphone}
                >
                  Continue to Consent
                </button>
                <button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
                  onClick={() => setCurrentStep(1)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      
      case 3: // Consent
        return (
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6 border border-gray-200">
            <div className="bg-blue-600 text-white rounded-t-lg -m-6 mb-0 p-4">
              <h3 className="text-xl font-bold">Recording Consent</h3>
            </div>
            <div className="pt-4">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="font-medium mb-2">By proceeding, you consent to:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Recording of your camera, microphone, and screen</li>
                  <li>Storage and processing of the recording</li>
                  <li>Analysis of your responses</li>
                </ul>
              </div>
              
              <div className="flex items-center mb-4">
                <input 
                  type="checkbox" 
                  id="consentCheck" 
                  checked={consentGiven}
                  onChange={(e) => setConsentGiven(e.target.checked)}
                  className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                />
                <label htmlFor="consentCheck" className="ml-2 block text-sm text-gray-900">
                  I understand and consent to the recording
                </label>
              </div>
              
              <div className="space-y-3">
                <button 
                  className={`w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ${!consentGiven ? 'opacity-50 cursor-not-allowed' : ''}`}
                  onClick={startRecording}
                  disabled={!consentGiven}
                >
                  Start Interview
                </button>
                <button 
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-4 rounded-lg transition duration-200"
                  onClick={() => setCurrentStep(2)}
                >
                  Back
                </button>
              </div>
            </div>
          </div>
        );
      
      case 4: // Recording in progress
        return (
          <div className="bg-white rounded-lg shadow-lg mb-6 p-6 border border-gray-200">
            <div className="bg-red-600 text-white rounded-t-lg -m-6 mb-0 p-4">
              <h3 className="text-xl font-bold">Interview in Progress</h3>
            </div>
            <div className="pt-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="flex items-center text-yellow-800">
                  <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                  Please don't switch tabs or applications during the interview
                </p>
              </div>
              
              <div className="flex justify-center mb-4">
                <div className="mr-6">
                  <div className={`px-4 py-2 rounded-full ${tabActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {tabActive ? 'Tab Active' : 'Tab Inactive'}
                  </div>
                </div>
                <div>
                  <div className="flex items-center px-4 py-2 bg-red-100 text-red-800 rounded-full">
                    <span className="w-3 h-3 bg-red-600 rounded-full mr-2 animate-pulse"></span>
                    Recording
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <button 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
                  onClick={stopRecording}
                >
                  <FontAwesomeIcon icon={faStop} className="mr-2" />
                  End Interview
                </button>
              </div>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="w-full interview-platform" ref={fullscreenElementRef}>
      <header className="bg-gray-900 text-white mb-6 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <span className="text-xl font-bold flex items-center">
            <FontAwesomeIcon icon={faVideo} className="mr-2" />
            Interview Recording Platform
          </span>
          {recording && (
            <div className="flex items-center">
              <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium mr-3 flex items-center">
                <FontAwesomeIcon icon={faStop} className="mr-1" />
                Recording
              </span>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-2 rounded-lg transition duration-200"
                onClick={toggleFullscreen}
              >
                <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} />
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="container mx-auto">
        <div className="flex justify-center">
          <div className="w-full max-w-4xl">
            {currentStep <= 3 && !recording ? (
              renderStepContent()
            ) : (
              <div className="recording-interface">
                {renderStepContent()}
                
                {/* Recording previews */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  {mediaBlob && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                      <div className="bg-blue-600 text-white p-4">
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        Camera Recording
                      </div>
                      <div className="p-0">
                        <video controls src={URL.createObjectURL(mediaBlob)} className="w-full" />
                      </div>
                    </div>
                  )}
                  
                  {screenBlob && (
                    <div className="bg-white rounded-lg shadow border border-gray-200 overflow-hidden">
                      <div className="bg-green-600 text-white p-4">
                        <FontAwesomeIcon icon={faDesktop} className="mr-2" />
                        Screen Recording
                      </div>
                      <div className="p-0">
                        <video controls src={URL.createObjectURL(screenBlob)} className="w-full" />
                      </div>
                    </div>
                  )}
                </div>
                
                {transcription && (
                  <div className="bg-white rounded-lg shadow border border-gray-200 mt-6">
                    <div className="bg-blue-500 text-white p-4">
                      <FontAwesomeIcon icon={faMicrophone} className="mr-2" />
                      Transcription
                    </div>
                    <div className="p-4">
                      <pre className="bg-gray-50 p-4 rounded border border-gray-200 whitespace-pre-wrap">{transcription}</pre>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Camera Pop-Up */}
      {isCameraPopupOpen && !isMinimized && (
        <Rnd
          default={{
            x: window.innerWidth - 320,
            y: 50,
            width: 300,
            height: 200,
          }}
          minWidth={250}
          minHeight={150}
          enableResizing
          className="camera-popup shadow-lg"
        >
          <div className="bg-gray-900 text-white p-2 flex justify-between items-center rounded-t">
            <h6 className="text-sm font-medium flex items-center">
              <FontAwesomeIcon icon={faVideo} className="mr-2" />
             Front Camera
            </h6>
            <div>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded mr-2" 
                onClick={toggleMinimize}
              >
                <FontAwesomeIcon icon={faMinus} />
              </button>
              <button 
                className="bg-gray-700 hover:bg-gray-600 text-white p-1 rounded" 
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
            className="w-full h-full"
          />
        </Rnd>
      )}

      {/* Minimized Pop-Up Button */}
      {isMinimized && (
        <button 
          className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition duration-200"
          onClick={toggleMinimize}
        >
          <FontAwesomeIcon icon={faVideo} />
        </button>
      )}
    </div>
  );
};

export default InterviewPlatform;