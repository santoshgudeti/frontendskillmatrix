import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCloudArrowUp, faFile, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import React, { useState, useEffect,useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./UploadDocuments.css";
import { axiosInstance } from "../../axiosUtils";

function UploadDocuments({ setResponseData }) {
  const navigate = useNavigate(); // React Router navigation hook
  const [resumeFiles, setResumeFiles] = useState([]); // Updated to support multiple resumes
  const [jobDescFile, setJobDescFile] = useState(null);
  const [activeModal, setActiveModal] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
 
const [usageLimits, setUsageLimits] = useState(null);

  useEffect(() => {
    const fetchUsage = async () => {
      const res = await axiosInstance.get('/user', { withCredentials: true });
      setUsageLimits(res.data.user);
    };
    fetchUsage();
  }, []);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setDragOver(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length) {
      handleFileUpload(files);
    }
  }, []);

  const handleFileUpload = (files) => {
    if (activeModal === "resume") {
      const validFiles = files.filter(
        (file) => file.size <= 25 * 1024 * 1024 // Max size: 25MB
      );
      if (validFiles.length !== files.length) {
        alert("Some files exceed the size limit of 25MB and were not added.");
      }
      setResumeFiles((prevFiles) => [...prevFiles, ...validFiles]);
    } else {
      const file = files[0];
      if (file.size > 25 * 1024 * 1024) {
        alert("File size should be less than 25MB");
        return;
      }
      setJobDescFile(file);
    }
    setActiveModal(null);
  };

  const removeFile = (type, index) => {
    if (type === "resume") {
      setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else {
      setJobDescFile(null);
    }
  };

  const Modal = ({ title, onClose }) => (
    <div className="modal-backdrop" onClick={() => onClose()}>
      <div className="upload-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="upload-title">{title}</h2>
          <button className="close-button" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>
        <p className="upload-subtitle">
          Please upload files in PDF format and make sure the file size is under 25 MB.
        </p>

        <div
          className={`upload-area ${dragOver ? "drag-over" : ""}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <FontAwesomeIcon icon={faCloudArrowUp} className="upload-icon" />
          <p className="drop-text">Drop files or browse</p>
          <p className="format-text">Format: PDF & Max file size: 25 MB</p>
          <label className="browse-button">
            Browse Files
            <input
              type="file"
              className="hidden-input"
              accept=".pdf"
              multiple={activeModal === "resume"} // Allow multiple selection for resumes
              onChange={(e) => {
                if (e.target.files.length) {
                  handleFileUpload(Array.from(e.target.files));
                }
              }}
            />
          </label>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-done" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );

  const UploadSection = ({ title, files, file, type }) => (
    <div className="upload-section">
      <div className="upload-card">
        <h3 className="section-title">{title}</h3>
        {type === "resume" && files.length === 0 ? (
          <div className="upload-placeholder" onClick={() => setActiveModal(type)}>
            <FontAwesomeIcon icon={faCloudArrowUp} className="placeholder-icon" />
            <p>No files uploaded yet!</p>
            <button className="upload-button">Upload</button>
            <p className="format-hint">Format: PDF & Max file size: 25 MB</p>
          </div>
        ) : type === "resume" ? (
          files.map((file, index) => (
            <div key={index} className="file-preview">
              <div className="file-info">
                <FontAwesomeIcon icon={faFile} className="file-icon" />
                <div>
                  <p className="file-name">{file.name}</p>
                  <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <button className="remove-button" onClick={() => removeFile(type, index)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          ))
        ) : !file ? (
          <div className="upload-placeholder" onClick={() => setActiveModal(type)}>
            <FontAwesomeIcon icon={faCloudArrowUp} className="placeholder-icon" />
            <p>No files uploaded yet!</p>
            <button className="upload-button">Upload</button>
            <p className="format-hint">Format: PDF & Max file size: 25 MB</p>
          </div>
        ) : (
          <div className="file-preview">
            <div className="file-info">
              <FontAwesomeIcon icon={faFile} className="file-icon" />
              <div>
                <p className="file-name">{file.name}</p>
                <p className="file-size">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button className="remove-button" onClick={() => removeFile(type)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        )}
      </div>
    </div>
  );

// Update handleSubmit function
const handleSubmit = async () => {
  try {
    // Check if usage data is loaded
    if (!usageLimits || !usageLimits.subscription || !usageLimits.usage) {
      toast.error('Unable to verify your subscription limits. Please try again.');
      return;
    }

    // Validate files
    if (resumeFiles.length === 0) {
      toast.error('Please upload at least one resume');
      return;
    }

    if (!jobDescFile) {
      toast.error('Please upload a job description');
      return;
    }

    // Check limits
    const remainingResumes = usageLimits.subscription.limits.resumeUploads - usageLimits.usage.resumeUploads;
    if (resumeFiles.length > remainingResumes) {
      toast.error(`You can only upload ${remainingResumes} more resumes with your current plan`);
      return;
    }

    if (usageLimits.usage.jdUploads >= usageLimits.subscription.limits.jdUploads) {
      toast.error('You have reached your job description upload limit');
      return;
    }

    setIsSubmitting(true);
    
    const formData = new FormData();
    resumeFiles.forEach((file) => formData.append("resumes", file));
    formData.append("job_description", jobDescFile);

    const response = await axiosInstance.post(
      "/api/submit",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );

    toast.success('Files uploaded successfully!');
    setResponseData({
      results: response.data?.results || [],
      duplicateCount: response.data?.duplicateCount || 0,
    });
    navigate("/dashboard/response");
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Error submitting files';
    toast.error(errorMessage);
    console.error("Error details:", error.response?.data || error.message);
  } finally {
    setIsSubmitting(false);
  }
};

  return (
    <div className="upload-container">
    
      <UploadSection title="Upload Resumes" files={resumeFiles} type="resume" />
      <UploadSection title="Upload Job Description" file={jobDescFile} type="jobDesc" />

      <div className="submit-button-container">
        <button
          className={`submit-button ${isSubmitting ? "submitting" : ""}`}
          onClick={handleSubmit}
          disabled={isSubmitting || resumeFiles.length === 0 || !jobDescFile}
        >
          {isSubmitting ? "Submitting..." : "Submit Files"}
        </button>
      </div>

      {activeModal && (
        <Modal
          title={activeModal === "resume" ? "Upload Resumes" : "Upload Job Description"}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}

export default UploadDocuments;

