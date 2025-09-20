import { useState } from 'react';
import { toast } from 'react-toastify';
import { axiosInstance } from '../axiosUtils';

/**
 * Custom hook for handling media operations (view/download audio, video, screen recordings)
 * Provides reusable functions for media handling across components
 */
export const useMediaOperations = () => {
  const [mediaOperations, setMediaOperations] = useState({
    video: {},
    screen: {},
    audio: {}
  });

  /**
   * Extract file key from file path
   * @param {string} filePath - Full file path
   * @returns {string|null} File key or null if not found
   */
  const extractFileKey = (filePath) => {
    if (!filePath) return null;
    // Extract the filename from the path (after the last slash)
    return filePath.split('/').pop().split('?')[0]; // Remove any query parameters
  };

  /**
   * View audio recording
   * @param {string} audioPath - Path to audio file
   * @param {number} index - Index for tracking state
   */
  const viewAudio = async (audioPath, index) => {
    try {
      setMediaOperations(prev => ({
        ...prev,
        audio: { ...prev.audio, [index]: { viewing: true, downloading: prev.audio[index]?.downloading || false } }
      }));

      const audioKey = extractFileKey(audioPath);
      if (!audioKey) {
        toast.error('No audio recording available');
        return;
      }

      const response = await axiosInstance.get(`/api/audio/${audioKey}`);
      
      if (response.data.url) {
        // Create a custom audio player modal for better user experience
        const audioWindow = window.open('', '_blank', 'width=400,height=200,scrollbars=no,resizable=yes');
        audioWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Audio Player</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              }
              .player-container {
                background: white;
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                text-align: center;
                max-width: 95%;
                width: 400px;
              }
              h2 {
                color: #333;
                margin-top: 0;
                margin-bottom: 20px;
              }
              audio {
                width: 100%;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
              }
              button {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
              }
              button:hover {
                background: #4338ca;
                transform: translateY(-2px);
              }
              button:active {
                transform: translateY(0);
              }
              @media (max-width: 768px) {
                .player-container {
                  padding: 20px;
                  width: 95%;
                }
                audio {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="player-container">
              <h2>Audio Recording</h2>
              <audio controls autoplay>
                <source src="${response.data.url}" type="audio/webm">
                Your browser does not support the audio element.
              </audio>
              <div class="controls">
                <button onclick="window.close()">Close</button>
              </div>
            </div>
          </body>
          </html>
        `);
        audioWindow.document.close();
      } else {
        toast.error('Failed to play audio recording');
      }
    } catch (error) {
      console.error('Error playing audio:', error);
      toast.error('Failed to play audio recording. Please try again later.');
    } finally {
      setMediaOperations(prev => ({
        ...prev,
        audio: { ...prev.audio, [index]: { viewing: false, downloading: prev.audio[index]?.downloading || false } }
      }));
    }
  };

  /**
   * Download audio recording
   * @param {string} audioPath - Path to audio file
   * @param {number} index - Index for tracking state
   */
  const downloadAudio = async (audioPath, index) => {
    try {
      setMediaOperations(prev => ({
        ...prev,
        audio: { ...prev.audio, [index]: { viewing: prev.audio[index]?.viewing || false, downloading: true } }
      }));

      const audioKey = extractFileKey(audioPath);
      if (!audioKey) {
        toast.error('No audio recording available');
        return;
      }

      const response = await axiosInstance.get(`/api/audio/${audioKey}/download`);
      
      if (response.data.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `audio_recording_${index + 1}_${audioKey}.wav`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error('Failed to download audio recording');
      }
    } catch (error) {
      console.error('Error downloading audio:', error);
      toast.error(`Failed to download audio recording: ${error.response?.data?.error || error.message}`);
    } finally {
      setMediaOperations(prev => ({
        ...prev,
        audio: { ...prev.audio, [index]: { viewing: prev.audio[index]?.viewing || false, downloading: false } }
      }));
    }
  };

  /**
   * View video recording (camera or screen)
   * @param {string} type - Type of video ('video' or 'screen')
   * @param {string} filePath - Path to video file
   */
  const viewVideo = async (type, filePath) => {
    try {
      setMediaOperations(prev => ({
        ...prev,
        [type]: { ...prev[type], viewing: true }
      }));

      const fileKey = extractFileKey(filePath);
      if (!fileKey) {
        toast.error(`No ${type} recording available`);
        return;
      }

      const endpoint = type === 'video' 
        ? `/api/video/${fileKey}` 
        : `/api/screen/${fileKey}`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.url) {
        // Create a custom video player modal for better user experience
        const videoWindow = window.open('', '_blank', 'width=800,height=600,scrollbars=no,resizable=yes');
        videoWindow.document.write(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>Video Player</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
                display: flex;
                justify-content: center;
                align-items: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              }
              .player-container {
                background: white;
                border-radius: 16px;
                padding: 30px;
                box-shadow: 0 10px 30px rgba(0,0,0,0.15);
                text-align: center;
                max-width: 95%;
                width: 700px;
              }
              h2 {
                color: #333;
                margin-top: 0;
                margin-bottom: 20px;
              }
              video {
                width: 100%;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.1);
              }
              .controls {
                display: flex;
                justify-content: center;
                gap: 15px;
                margin-top: 20px;
              }
              button {
                background: #4f46e5;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 8px;
                cursor: pointer;
                font-weight: 500;
                transition: all 0.2s;
              }
              button:hover {
                background: #4338ca;
                transform: translateY(-2px);
              }
              button:active {
                transform: translateY(0);
              }
              @media (max-width: 768px) {
                .player-container {
                  padding: 20px;
                  width: 95%;
                }
                video {
                  height: auto;
                }
              }
            </style>
          </head>
          <body>
            <div class="player-container">
              <h2>${type.charAt(0).toUpperCase() + type.slice(1)} Recording</h2>
              <video controls autoplay>
                <source src="${response.data.url}" type="video/webm">
                Your browser does not support the video element.
              </video>
              <div class="controls">
                <button onclick="window.close()">Close</button>
              </div>
            </div>
          </body>
          </html>
        `);
        videoWindow.document.close();
      } else {
        toast.error(`Failed to view ${type} recording`);
      }
    } catch (error) {
      console.error(`Error viewing ${type}:`, error);
      toast.error(`Failed to view ${type} recording: ${error.response?.data?.error || error.message}`);
    } finally {
      setMediaOperations(prev => ({
        ...prev,
        [type]: { ...prev[type], viewing: false }
      }));
    }
  };

  /**
   * Download video recording (camera or screen)
   * @param {string} type - Type of video ('video' or 'screen')
   * @param {string} filePath - Path to video file
   */
  const downloadVideo = async (type, filePath) => {
    try {
      setMediaOperations(prev => ({
        ...prev,
        [type]: { ...prev[type], downloading: true }
      }));

      const fileKey = extractFileKey(filePath);
      if (!fileKey) {
        toast.error(`No ${type} recording available`);
        return;
      }

      const endpoint = type === 'video' 
        ? `/api/video/${fileKey}/download` 
        : `/api/screen/${fileKey}/download`;
      
      const response = await axiosInstance.get(endpoint);
      
      if (response.data.url) {
        // Create a temporary link and trigger download
        const link = document.createElement('a');
        link.href = response.data.url;
        link.download = `${type}_recording_${fileKey}.webm`;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        toast.error(`Failed to download ${type} recording`);
      }
    } catch (error) {
      console.error(`Error downloading ${type}:`, error);
      toast.error(`Failed to download ${type} recording: ${error.response?.data?.error || error.message}`);
    } finally {
      setMediaOperations(prev => ({
        ...prev,
        [type]: { ...prev[type], downloading: false }
      }));
    }
  };

  return {
    mediaOperations,
    viewAudio,
    downloadAudio,
    viewVideo,
    downloadVideo,
    extractFileKey,
    setMediaOperations
  };
};