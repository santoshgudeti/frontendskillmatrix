import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCloudArrowUp, 
  faFile, 
  faTrash, 
  faTimes,
  faEdit,
  faChevronDown,
  faPlus,
  faSpinner,
  faCheckCircle,
  faExclamationTriangle,
  faUpload,
  faInfoCircle,
  faUsers 
} from "@fortawesome/free-solid-svg-icons";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion";
import { axiosInstance } from "../../axiosUtils";

function UploadDocuments({ setResponseData }) {
  const navigate = useNavigate();
  const [resumeFiles, setResumeFiles] = useState([]);
  const [jobDescFile, setJobDescFile] = useState(null);
  const [jobDescTitle, setJobDescTitle] = useState("");
  const [savedJDs, setSavedJDs] = useState([]);
  const [selectedJD, setSelectedJD] = useState(null);
  const [isJDDropdownOpen, setIsJDDropdownOpen] = useState(false);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usageLimits, setUsageLimits] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [jdToDelete, setJdToDelete] = useState(null);
  const [isLoading, setIsLoading] = useState({
    jds: false,
    content: false,
    delete: false,
    update: false
  });

  // Enhanced loading state management
  const setLoading = (key, value) => {
    setIsLoading(prev => ({ ...prev, [key]: value }));
  };

  // Fetch user's saved JDs with loading state
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading('jds', true);
        const [usageRes, jdsRes] = await Promise.all([
          axiosInstance.get('/user', { withCredentials: true }),
          axiosInstance.get('/api/job-descriptions', { withCredentials: true })
        ]);
        
        setUsageLimits(usageRes.data.user);
        setSavedJDs(jdsRes.data);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error('Failed to load saved JDs');
      } finally {
        setLoading('jds', false);
      }
    };
    
    fetchData();
  }, []);


  // Load JD content when selected with loading state
  useEffect(() => {
    if (!selectedJD) return;

    const loadJDContent = async () => {
      try {
        setLoading('content', true);
        const response = await axiosInstance.get(
          `/api/job-descriptions/${selectedJD._id}/content`,
          { 
            withCredentials: true,
            responseType: 'blob'
          }
        );
        
        const file = new File([response.data], selectedJD.filename, {
          type: 'application/pdf'
        });
        
        setJobDescFile(file);
        setJobDescTitle(selectedJD.title || selectedJD.filename);
      } catch (error) {
        toast.error('Failed to load JD content');
        console.error("Error loading JD:", error);
      } finally {
        setLoading('content', false);
      }
    };

    loadJDContent();
  }, [selectedJD]);

  
  // Confirmation Dialog Component
  const ConfirmationDialog = ({ 
    isOpen, 
    onConfirm, 
    onCancel, 
    title, 
    message,
    confirmText = "Delete",
    cancelText = "Cancel",
    type = "delete"
  }) => {
    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.3 }}
        >
          <div className="text-center">
            <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
              type === 'delete' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'
            }`}>
              <FontAwesomeIcon 
                icon={type === "delete" ? faExclamationTriangle : faCheckCircle} 
                size="lg" 
              />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6 leading-relaxed">{message}</p>
            <div className="flex justify-center gap-3">
              <motion.button 
                className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={onCancel}
                disabled={isLoading.delete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cancelText}
              </motion.button>
              <motion.button 
                className={`px-6 py-2.5 font-medium rounded-lg ${
                  type === 'delete' 
                    ? 'bg-red-600 hover:bg-red-700 text-white' 
                    : 'bg-green-600 hover:bg-green-700 text-white'
                } transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed`}
                onClick={onConfirm}
                disabled={isLoading.delete}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading.delete ? (
                  <>
                    <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                    <span>Processing...</span>
                  </>
                ) : confirmText}
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  const handleDeleteConfirmation = (jd) => {
    setJdToDelete(jd);
    setShowDeleteConfirm(true);
  };
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
        (file) => file.size <= 25 * 1024 * 1024
      );
      if (validFiles.length !== files.length) {
        toast.error("Some files exceed the size limit of 25MB and were not added.");
      }
      setResumeFiles((prevFiles) => [...prevFiles, ...validFiles]);
    } else {
      const file = files[0];
      if (file.size > 25 * 1024 * 1024) {
        toast.error("File size should be less than 25MB");
        return;
      }
      setJobDescFile(file);
      setJobDescTitle(file.name.replace('.pdf', ''));
      setSelectedJD(null); // Clear selected JD when uploading new file
    }
    setActiveModal(null);
  };

  const removeFile = (type, index) => {
    if (type === "resume") {
      setResumeFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    } else {
      setJobDescFile(null);
      setJobDescTitle("");
      setSelectedJD(null);
    }
  };

   const handleUpdateTitle = async () => {
    if (!selectedJD || !jobDescTitle.trim()) return;
    
    try {
      setLoading('update', true);
      await axiosInstance.put(
        `/api/job-descriptions/${selectedJD._id}/title`,
        { title: jobDescTitle },
        { withCredentials: true }
      );
      
      setSavedJDs(prev => prev.map(jd => 
        jd._id === selectedJD._id ? { ...jd, title: jobDescTitle } : jd
      ));
      setIsEditingTitle(false);
      toast.success('Title updated successfully');
    } catch (error) {
      toast.error('Failed to update title');
      console.error("Error updating title:", error);
    } finally {
      setLoading('update', false);
    }
  };


const handleDeleteJD = async () => {
    try {
      setLoading('delete', true);
      await axiosInstance.delete(
        `/api/job-descriptions/${jdToDelete._id}`,
        { withCredentials: true }
      );
      
      setSavedJDs(prev => prev.filter(jd => jd._id !== jdToDelete._id));
      if (selectedJD && selectedJD._id === jdToDelete._id) {
        setJobDescFile(null);
        setJobDescTitle("");
        setSelectedJD(null);
      }
      toast.success('JD deleted successfully');
    } catch (error) {
      toast.error('Failed to delete JD');
      console.error("Error deleting JD:", error);
    } finally {
      setLoading('delete', false);
      setShowDeleteConfirm(false);
      setJdToDelete(null);
    }
  };

  const Modal = ({ title, onClose }) => (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" 
      onClick={() => onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <motion.div 
        className="bg-white rounded-2xl shadow-2xl p-6 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        role="document"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-2xl font-semibold text-gray-900">{title}</h2>
          <button 
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none" 
            onClick={onClose}
            aria-label="Close dialog"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" aria-hidden="true" />
          </button>
        </div>
        <p id="modal-description" className="text-gray-600 mb-6">
          Please upload files in PDF format and make sure the file size is under 25 MB.
        </p>

        <div
          className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
            dragOver 
              ? "border-primary-500 bg-primary-50" 
              : "border-gray-300 bg-gray-50 hover:border-primary-400 hover:bg-primary-25"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          aria-label="File upload area. Drag and drop files or click to browse"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              document.getElementById('file-input-modal').click();
            }
          }}
        >
          <FontAwesomeIcon 
            icon={faCloudArrowUp} 
            className={`text-5xl mb-4 transition-colors duration-300 ${
              dragOver ? "text-primary-600" : "text-primary-500"
            }`}
            aria-hidden="true"
          /> 
          <p className="text-lg font-semibold text-gray-900 mb-2">Drop files or browse</p>
          <p className="text-sm text-gray-600 mb-6">Format: PDF & Max file size: 25 MB</p>
          <motion.label 
            className="bg-primary-gradient text-white font-medium px-6 py-3 rounded-lg transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <FontAwesomeIcon icon={faUpload} aria-hidden="true" />
            Browse Files
            <input
              id="file-input-modal"
              type="file"
              className="hidden"
              accept=".pdf"
              multiple={activeModal === "resume"}
              onChange={(e) => {
                if (e.target.files.length) {
                  handleFileUpload(Array.from(e.target.files));
                }
              }}
              aria-describedby="file-help"
            />
          </motion.label>
          <div id="file-help" className="sr-only">
            Upload PDF files up to 25MB each. You can select multiple files at once for resumes.
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <motion.button 
            className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium px-6 py-2.5 rounded-lg transition-colors focus:ring-2 focus:ring-gray-300 focus:outline-none" 
            onClick={onClose}
            aria-label="Cancel and close dialog"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Cancel
          </motion.button>
          <motion.button 
            className="bg-primary-gradient text-white font-medium px-6 py-2.5 rounded-lg transition-all focus:ring-2 focus:ring-primary-300 focus:outline-none shadow-md hover:shadow-lg" 
            onClick={onClose}
            aria-label="Complete file upload"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Done
          </motion.button>
        </div>
      </motion.div>
    </div>
  );

  const JDSelector = () => (
    <div className="relative mb-6">
      <label htmlFor="jd-selector" className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <FontAwesomeIcon icon={faFile} className="text-primary-500" />
        Saved Job Descriptions
        <FontAwesomeIcon icon={faInfoCircle} className="text-gray-400 text-xs" title="Select from your saved job descriptions or upload a new one" />
      </label>
      <div 
        id="jd-selector"
        className={`w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm cursor-pointer flex justify-between items-center transition-all duration-200 focus:ring-2 focus:ring-primary-500 focus:outline-none ${
          isJDDropdownOpen ? 'ring-2 ring-primary-500/20 border-primary-500 bg-white' : 'bg-gray-50 hover:bg-gray-100'
        }`}
        onClick={() => setIsJDDropdownOpen(!isJDDropdownOpen)}
        role="combobox"
        aria-expanded={isJDDropdownOpen}
        aria-haspopup="listbox"
        aria-labelledby="jd-selector-label"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsJDDropdownOpen(!isJDDropdownOpen);
          } else if (e.key === 'Escape') {
            setIsJDDropdownOpen(false);
          }
        }}
      >
        <span className={`truncate ${
          selectedJD ? 'text-gray-900 font-medium' : 'text-gray-500'
        }`}>
          {selectedJD ? jobDescTitle : "Select a saved Job Description"}
        </span>
        {isLoading.content ? (
          <FontAwesomeIcon icon={faSpinner} spin className="text-gray-400 ml-2" aria-hidden="true" />
        ) : (
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={`text-gray-400 ml-2 transition-transform duration-200 ${
              isJDDropdownOpen ? 'rotate-180' : ''
            }`}
            aria-hidden="true"
          /> 
        )}
      </div>
      
      <AnimatePresence>
        {isJDDropdownOpen && (
          <motion.div 
            className="absolute top-full left-0 right-0 mt-2 max-h-72 overflow-y-auto bg-white border border-gray-200 rounded-xl shadow-lg z-20"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            role="listbox"
            aria-labelledby="jd-selector-label"
          >
            {isLoading.jds ? (
              <div className="p-4 text-center text-gray-500">
                <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                <span>Loading JDs...</span>
              </div>
            ) : savedJDs.length > 0 ? (
              savedJDs.map((jd, index) => (
                <motion.div 
                  key={jd._id} 
                  className={`p-4 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                    selectedJD?._id === jd._id ? 'bg-primary-50 border-primary-200' : ''
                  } flex justify-between items-center`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  onClick={() => {
                    setSelectedJD(jd);
                    setIsJDDropdownOpen(false);
                  }}
                  role="option"
                  aria-selected={selectedJD?._id === jd._id}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setSelectedJD(jd);
                      setIsJDDropdownOpen(false);
                    }
                  }}
                >
                  <div className="flex-1 min-w-0">
                    <span className="block font-medium text-gray-900 truncate">{jd.title || jd.filename}</span>
                    <span className="block text-xs text-gray-500 mt-1">
                      {new Date(jd.uploadedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <button 
                    className="ml-2 p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 rounded-md hover:bg-red-50 focus:ring-2 focus:ring-red-300 focus:outline-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteConfirmation(jd);
                    }}
                    disabled={isLoading.delete}
                    aria-label={`Delete job description: ${jd.title || jd.filename}`}
                  >
                    {isLoading.delete && jdToDelete?._id === jd._id ? (
                      <FontAwesomeIcon icon={faSpinner} spin size="sm" aria-hidden="true" />
                    ) : (
                      <FontAwesomeIcon icon={faTrash} size="sm" aria-hidden="true" />
                    )}
                  </button>
                </motion.div>
              ))
            ) : (
              <div className="p-6 text-center text-gray-500 italic">
                <FontAwesomeIcon icon={faFile} className="text-2xl mb-2 text-gray-300" />
                <p>No saved Job Descriptions found</p>
                <p className="text-sm mt-1">Upload a new JD to get started</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

const UploadSection = ({ title, files, file, type, icon }) => {
  const titleInputRef = useRef(null);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
    }
  }, [isEditingTitle]);

  return (
    <motion.div 
      className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-gradient rounded-lg flex items-center justify-center text-white">
          <FontAwesomeIcon icon={icon} />
        </div>
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
      </div>
      
      {type === "jobDesc" && <JDSelector />}
      
      {type === "resume" && files.length === 0 ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary-400 hover:bg-primary-25 group"
          onClick={() => setActiveModal(type)}
        >
          <FontAwesomeIcon 
            icon={faCloudArrowUp} 
            className="text-4xl text-gray-400 group-hover:text-primary-500 mb-4 transition-colors duration-300" 
          />
          <p className="text-lg font-medium text-gray-700 mb-2">No files uploaded yet!</p>
          <div className="flex justify-center">
            <motion.button 
              className="bg-primary-gradient text-white font-medium px-6 py-2.5 rounded-lg transition-all mb-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Upload Resumes
            </motion.button>
          </div>
          <p className="text-sm text-gray-500">Format: PDF & Max file size: 25 MB</p>
        </div>
      ) : type === "resume" ? (
        <div className="space-y-3">
          <div className="max-h-64 overflow-y-auto pr-2 scrollbar-thin">
            {files.map((file, index) => (
              <motion.div 
                key={index} 
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors duration-200"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <FontAwesomeIcon icon={faFile} className="text-primary-600" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-gray-900 truncate">{file.name}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                </div>
                <button 
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
                  onClick={() => removeFile(type, index)}
                  aria-label={`Remove ${file.name}`}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-center">
            <motion.button 
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 font-medium py-2.5 px-4 rounded-lg transition-colors w-full mt-4 flex items-center justify-center gap-2 shadow-sm hover:shadow-md max-w-xs mx-auto"
              onClick={() => setActiveModal(type)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Add More Files
            </motion.button>
          </div>
        </div>
      ) : !file ? (
        <div 
          className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center cursor-pointer transition-all duration-300 hover:border-primary-400 hover:bg-primary-25 group"
          onClick={() => setActiveModal(type)}
        >
          <FontAwesomeIcon 
            icon={faCloudArrowUp} 
            className="text-4xl text-gray-400 group-hover:text-primary-500 mb-4 transition-colors duration-300" 
          />
          <p className="text-lg font-medium text-gray-700 mb-2">No files uploaded yet!</p>
          <div className="flex justify-center">
            <motion.button 
              className="bg-primary-gradient text-white font-medium px-6 py-2.5 rounded-lg transition-all mb-3 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FontAwesomeIcon icon={faPlus} />
              Upload Job Description
            </motion.button>
          </div>
          <p className="text-sm text-gray-500">Format: PDF & Max file size: 25 MB</p>
        </div>
      ) : (
        <motion.div 
          className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <FontAwesomeIcon icon={faFile} className="text-primary-600" />
            </div>
            <div className="flex-1 min-w-0">
              {isEditingTitle ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    ref={titleInputRef}
                    value={jobDescTitle}
                    onChange={(e) => setJobDescTitle(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 flex-1 text-sm"
                    placeholder="Enter JD title"
                  />
                  <motion.button 
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 text-sm rounded-md shadow-sm"
                    onClick={handleUpdateTitle}
                    disabled={isLoading.update}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Save title"
                  >
                    {isLoading.update ? (
                      <FontAwesomeIcon icon={faSpinner} spin />
                    ) : (
                      <FontAwesomeIcon icon={faCheckCircle} />
                    )}
                  </motion.button>
                  <motion.button 
                    className="border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 px-3 py-2 text-sm rounded-md shadow-sm"
                    onClick={() => setIsEditingTitle(false)}
                    disabled={isLoading.update}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Cancel editing"
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </motion.button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{jobDescTitle}</p>
                    <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                  </div>
                  {selectedJD && (
                    <button 
                      className="p-2 text-gray-400 hover:text-primary-500 transition-colors duration-200 rounded-md hover:bg-primary-50"
                      onClick={() => setIsEditingTitle(true)}
                      disabled={isLoading.update}
                      aria-label="Edit title"
                    >
                      {isLoading.update ? (
                        <FontAwesomeIcon icon={faSpinner} spin size="sm" />
                      ) : (
                        <FontAwesomeIcon icon={faEdit} size="sm" />
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
          <button 
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
            onClick={() => removeFile(type)}
            aria-label="Remove file"
          >
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

  const handleSubmit = async () => {
    try {
      if (!usageLimits) {
        toast.error('Unable to verify your subscription status. Please try again.');
        return;
      }

      if (resumeFiles.length === 0) {
        toast.error('Please upload at least one resume');
        return;
      }

      if (!jobDescFile) {
        toast.error('Please upload a job description');
        return;
      }

      if (!usageLimits.isAdmin && usageLimits.subscription?.limits) {
        const remainingResumes = usageLimits.subscription.limits.resumeUploads - (usageLimits.usage?.resumeUploads || 0);
        if (resumeFiles.length > remainingResumes) {
          toast.error(`You can only upload ${remainingResumes} more resumes with your current plan`);
          return;
        }

        if ((usageLimits.usage?.jdUploads || 0) >= usageLimits.subscription.limits.jdUploads) {
          toast.error('You have reached your job description upload limit');
          return;
        }
      }

      setIsSubmitting(true);
      
      const formData = new FormData();
      resumeFiles.forEach((file) => formData.append("resumes", file));
      formData.append("job_description", jobDescFile);
      
      if (jobDescTitle && !selectedJD) {
        formData.append("job_description_title", jobDescTitle);
      }

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
  navigate("/dashboard/response", { state: { fromUpload: true } });

    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Error submitting files';
      toast.error(errorMessage);
      console.error("Error details:", error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 sm:p-6">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header Section */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-gradient rounded-2xl mb-4 shadow-lg">
            <FontAwesomeIcon icon={faUpload} className="text-white text-2xl" />
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gradient-hero mb-3">
            Upload Documents
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload resumes and job descriptions for AI-powered matching and analysis
          </p>
        </motion.div>

        {/* Upload Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <UploadSection 
            title="Upload Resumes" 
            files={resumeFiles} 
            type="resume" 
            icon={faUsers}
          />
          <UploadSection 
            title="Upload Job Description" 
            file={jobDescFile} 
            type="jobDesc" 
            icon={faFile}
          />
        </div>

        {/* Submit Button */}
        <motion.div 
          className="flex justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <button
            className={`relative overflow-hidden px-8 py-4 text-lg font-semibold rounded-xl text-white shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${
              isSubmitting 
                ? 'bg-gradient-to-r from-primary-600 to-primary-700 animate-pulse' 
                : 'bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700'
            }`}
            onClick={handleSubmit}
            disabled={isSubmitting || resumeFiles.length === 0 || !jobDescFile}
          >
            <div className="flex items-center justify-center gap-3">
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="text-xl" />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faCloudArrowUp} className="text-xl" />
                  <span>Submit Files for Analysis</span>
                </>
              )}
            </div>
          </button>
        </motion.div>

        {/* Usage Info */}
        {usageLimits && !usageLimits.isAdmin && (
          <motion.div 
            className="mt-8 bg-white/90 backdrop-blur-xl border border-gray-200/30 rounded-2xl shadow-xl p-6 max-w-md mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faInfoCircle} className="text-primary-500" />
              Usage Limits
            </h4>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex justify-between items-center">
                <span>Resumes:</span>
                <span className="font-medium">
                  {usageLimits.usage?.resumeUploads || 0} / {usageLimits.subscription?.limits?.resumeUploads || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-primary-gradient h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((usageLimits.usage?.resumeUploads || 0) / (usageLimits.subscription?.limits?.resumeUploads || 1)) * 100)}%` 
                  }}
                ></div>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span>Job Descriptions:</span>
                <span className="font-medium">
                  {usageLimits.usage?.jdUploads || 0} / {usageLimits.subscription?.limits?.jdUploads || 0}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-secondary-gradient h-2 rounded-full" 
                  style={{ 
                    width: `${Math.min(100, ((usageLimits.usage?.jdUploads || 0) / (usageLimits.subscription?.limits?.jdUploads || 1)) * 100)}%` 
                  }}
                ></div>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Modals and Dialogs */}
      <AnimatePresence>
        {activeModal && (
          <Modal
            title={activeModal === "resume" ? "Upload Resumes" : "Upload Job Description"}
            onClose={() => setActiveModal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteConfirm && (
          <ConfirmationDialog
            isOpen={showDeleteConfirm}
            onConfirm={handleDeleteJD}
            onCancel={() => {
              setShowDeleteConfirm(false);
              setJdToDelete(null);
            }}
            title="Confirm Deletion"
            message="Are you sure you want to delete this Job Description? This action cannot be undone."
            confirmText="Delete"
            cancelText="Cancel"
            type="delete"
          />
        )}
      </AnimatePresence>

      <ToastContainer 
        position="bottom-right" 
        className="!bottom-6 !right-6"
        toastClassName="!bg-white !text-gray-900 !rounded-lg !shadow-lg"
      />
    </div>
  );
}

export default UploadDocuments;