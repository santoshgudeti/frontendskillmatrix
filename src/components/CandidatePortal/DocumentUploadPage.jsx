import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUpload, 
  faPaperclip, 
  faCheckCircle, 
  faExclamationTriangle,
  faTimes,
  faInfoCircle,
  faSpinner,
  faFileUpload,
  faCloudUploadAlt,
  faFile,
  faImage,
  faFilePdf,
  faFileWord,
  faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../axiosUtils';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

const DocumentUploadPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { documentCollectionId } = useParams();
  const [documentFiles, setDocumentFiles] = useState({}); // Object to store files for each document type
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, loading, uploading, success, error
  const [uploadProgress, setUploadProgress] = useState({}); // Track progress for each file
  const [candidateName, setCandidateName] = useState('');
  const [candidateEmail, setCandidateEmail] = useState('');
  const [documentTypes, setDocumentTypes] = useState([]);
  const [documentCollection, setDocumentCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRefs = useRef({});

  // Get document collection details
  useEffect(() => {
    const fetchDocumentCollection = async () => {
      try {
        setLoading(true);
        // Extract documentCollectionId from query params or URL
        const urlParams = new URLSearchParams(location.search);
        const collectionId = documentCollectionId || urlParams.get('id');
        
        if (collectionId) {
          const response = await axiosInstance.get(`/api/document-collection/${collectionId}`);
          const collection = response.data.data;
          setDocumentCollection(collection);
          
          // Enhanced name parsing logic - consistent with CandidateTable
          let displayName = 'Candidate';
          
          // Priority: 1. Check candidateName field if it exists and is not an email
          if (collection.candidateName && typeof collection.candidateName === 'string' && collection.candidateName.trim()) {
            const nameValue = collection.candidateName.trim();
            // If candidateName is not in email format, use it directly
            if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(nameValue)) {
              displayName = nameValue;
            } else {
              // If candidateName contains email, parse it for display
              const emailParts = nameValue.split('@')[0].replace(/[._-]/g, ' ');
              const prettyName = emailParts
                .split(' ')
                .filter(Boolean)
                .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                .join(' ')
                .trim();
              displayName = prettyName || 'Candidate';
            }
          }
          // Priority: 2. If no proper candidateName, use candidateEmail for parsing
          else if (collection.candidateEmail && typeof collection.candidateEmail === 'string' && collection.candidateEmail.includes('@')) {
            const emailParts = collection.candidateEmail.split('@')[0].replace(/[._-]/g, ' ');
            const prettyName = emailParts
              .split(' ')
              .filter(Boolean)
              .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
              .join(' ')
              .trim();
            displayName = prettyName || 'Candidate';
          }
          
          setCandidateName(displayName);
          setCandidateEmail(collection.candidateEmail || '');
          setDocumentTypes(collection.documentTypes || []);
          
          // Initialize documentFiles state with empty arrays for each document type
          const initialDocumentFiles = {};
          (collection.documentTypes || []).forEach(type => {
            initialDocumentFiles[type] = [];
          });
          setDocumentFiles(initialDocumentFiles);
        }
      } catch (error) {
        console.error('Error fetching document collection:', error);
        toast.error('Failed to load document collection details');
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentCollection();
  }, [documentCollectionId, location.search]);

  const getFileIcon = (fileType) => {
    if (fileType.includes('image')) {
      return faImage;
    } else if (fileType.includes('pdf')) {
      return faFilePdf;
    } else if (fileType.includes('word') || fileType.includes('document')) {
      return faFileWord;
    } else if (fileType.includes('excel') || fileType.includes('spreadsheet')) {
      return faFileExcel;
    } else {
      return faFile;
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileChange = (documentType, e) => {
    const files = Array.from(e.target.files);
    setDocumentFiles(prev => ({
      ...prev,
      [documentType]: [...(prev[documentType] || []), ...files]
    }));
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (documentType, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = Array.from(e.dataTransfer.files);
    setDocumentFiles(prev => ({
      ...prev,
      [documentType]: [...(prev[documentType] || []), ...files]
    }));
  };

  const removeFile = (documentType, index) => {
    setDocumentFiles(prev => {
      const updatedFiles = [...(prev[documentType] || [])];
      updatedFiles.splice(index, 1);
      return {
        ...prev,
        [documentType]: updatedFiles
      };
    });
  };

  const getDocumentTypeLabel = (type) => {
    const typeMap = {
      'aadhaar': 'Aadhaar Card',
      'passport': 'Passport',
      'voter-id': 'Voter ID',
      'driving-license': 'Driving License',
      'address-proof': 'Address Proof',
      'educational-certificates': 'Educational Certificates',
      'experience-certificates': 'Experience Certificates',
      'relieving-letters': 'Relieving Letters',
      'salary-slips': 'Salary Slips',
      'form-16': 'Form 16',
      'photographs': 'Photographs',
      'bank-details': 'Bank Details',
      'pan-card': 'PAN Card',
      'medical-certificates': 'Medical Certificates',
      'nda': 'NDA',
      'background-verification': 'Background Verification',
      'references': 'References',
      'other': 'Other Documents'
    };
    
    return typeMap[type] || type;
  };

  const getDocumentTypeDescription = (type) => {
    const descriptionMap = {
      'aadhaar': 'Upload clear image of your Aadhaar card (front and back if applicable)',
      'passport': 'Upload clear image of your passport (bio page)',
      'voter-id': 'Upload clear image of your Voter ID card',
      'driving-license': 'Upload clear image of your Driving License (front and back)',
      'address-proof': 'Upload any address proof document (electricity bill, rental agreement, etc.)',
      'educational-certificates': 'Upload all educational certificates (10th, 12th, graduation, etc.)',
      'experience-certificates': 'Upload experience certificates from previous employers',
      'relieving-letters': 'Upload relieving letters from previous employers',
      'salary-slips': 'Upload recent salary slips (last 3 months)',
      'form-16': 'Upload your Form 16 for tax purposes',
      'photographs': 'Upload recent passport size photographs',
      'bank-details': 'Upload cancelled cheque or bank passbook first page',
      'pan-card': 'Upload clear image of your PAN card',
      'medical-certificates': 'Upload medical fitness certificates if required',
      'nda': 'Upload signed NDA document',
      'background-verification': 'Upload background verification consent form',
      'references': 'Upload contact details of professional references',
      'other': 'Upload any other documents as specified'
    };
    
    return descriptionMap[type] || 'Upload the required document';
  };

  const handleUpload = async () => {
    // Check if at least one file is uploaded for each document type
    const allDocumentTypesHaveFiles = documentTypes.every(type => 
      documentFiles[type] && documentFiles[type].length > 0
    );
    
    if (!allDocumentTypesHaveFiles) {
      toast.error('Please upload files for all requested document types');
      return;
    }
    
    if (!documentCollection) {
      toast.error('Document collection not found');
      return;
    }

    try {
      setUploadStatus('uploading');
      
      // Create FormData with files for each document type
      const formData = new FormData();
      formData.append('documentCollectionId', documentCollection._id);
      formData.append('candidateName', candidateName);
      formData.append('candidateEmail', candidateEmail);
      
      // Count total files for progress tracking
      let totalFiles = 0;
      Object.keys(documentFiles).forEach(documentType => {
        totalFiles += documentFiles[documentType].length;
      });
      
      let uploadedFiles = 0;
      
      // Append all files
      Object.keys(documentFiles).forEach(documentType => {
        (documentFiles[documentType] || []).forEach(file => {
          formData.append('documents', file);
          uploadedFiles++;
          setUploadProgress(prev => ({
            ...prev,
            [file.name]: (uploadedFiles / totalFiles) * 100
          }));
        });
      });
      
      toast.info('Uploading documents...');
      
      const response = await axiosInstance.post('/api/document-collection/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(prev => ({
              ...prev,
              overall: percentCompleted
            }));
          }
        }
      });
      
      setUploadStatus('success');
      toast.success('Documents uploaded successfully! Our team will review them shortly.');
      
      // Reset form after successful upload
      setTimeout(() => {
        // Reset document files
        const resetDocumentFiles = {};
        documentTypes.forEach(type => {
          resetDocumentFiles[type] = [];
        });
        setDocumentFiles(resetDocumentFiles);
        setUploadProgress({});
        setUploadStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Error uploading documents:', error);
      setUploadStatus('error');
      toast.error('Failed to upload documents. Please try again.');
      // Show more detailed error information
      if (error.response?.data?.details) {
        toast.error(`Details: ${error.response.data.details}`);
      } else if (error.response?.data?.error) {
        toast.error(`Error: ${error.response.data.error}`);
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <FontAwesomeIcon icon={faSpinner} spin size="3x" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading document collection details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <motion.div 
        className="w-full max-w-4xl bg-white rounded-2xl shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
              <FontAwesomeIcon icon={faFileUpload} className="text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Document Upload Portal</h1>
              <p className="text-blue-100">Upload your required documents for onboarding</p>
            </div>
          </div>
        </div>
        
        <div className="p-6">
          {documentCollection && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <FontAwesomeIcon icon={faInfoCircle} className="text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm text-blue-800 font-medium">Document Request Details</p>
                  <p className="text-xs text-blue-700 mt-1">
                    You've been requested to upload the following documents by {documentCollection.requestedBy?.fullName || 'HR team'}.
                  </p>
                </div>
              </div>
              
              <div className="mt-3">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Requested Documents:</h4>
                <div className="flex flex-wrap gap-2">
                  {documentTypes.map((type, index) => (
                    <span key={index} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {getDocumentTypeLabel(type)}
                    </span>
                  ))}
                </div>
              </div>
              
              {documentCollection.customMessage && (
                <div className="mt-3 p-3 bg-white rounded-lg border border-blue-300">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Message from HR:</span> {documentCollection.customMessage}
                  </p>
                </div>
              )}
            </div>
          )}
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={candidateName}
                onChange={(e) => setCandidateName(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your full name"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={candidateEmail}
                onChange={(e) => setCandidateEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email address"
              />
            </div>
            
            {/* Individual document upload sections */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Required Documents</h3>
              
              {documentTypes.map((documentType, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-medium text-gray-800">{getDocumentTypeLabel(documentType)}</h4>
                      <p className="text-sm text-gray-600 mt-1">{getDocumentTypeDescription(documentType)}</p>
                    </div>
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                      Required
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <div 
                      className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors bg-white"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(documentType, e)}
                    >
                      <input
                        type="file"
                        multiple
                        onChange={(e) => handleFileChange(documentType, e)}
                        className="hidden"
                        id={`file-upload-${documentType}`}
                        ref={(el) => fileInputRefs.current[documentType] = el}
                      />
                      <label 
                        htmlFor={`file-upload-${documentType}`} 
                        className="cursor-pointer"
                        onClick={(e) => e.preventDefault()}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(documentType, e)}
                      >
                        <FontAwesomeIcon icon={faCloudUploadAlt} className="text-3xl text-gray-400 mb-2" />
                        <p className="text-gray-600">
                          <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          PDF, DOC, DOCX, JPG, PNG up to 10MB each
                        </p>
                      </label>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => fileInputRefs.current[documentType]?.click()}
                      >
                        <FontAwesomeIcon icon={faUpload} className="mr-2" />
                        Select Files
                      </Button>
                    </div>
                    
                    {/* Uploaded files for this document type */}
                    {documentFiles[documentType] && documentFiles[documentType].length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-xs font-medium text-gray-700 mb-2">
                          Uploaded Files ({documentFiles[documentType].length})
                        </h5>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {documentFiles[documentType].map((file, fileIndex) => (
                            <div key={fileIndex} className="flex items-center justify-between bg-white p-2 rounded border">
                              <div className="flex items-center gap-2">
                                <FontAwesomeIcon icon={getFileIcon(file.type)} className="text-gray-400 text-sm" />
                                <div>
                                  <span className="text-xs text-gray-700 truncate max-w-xs block">{file.name}</span>
                                  <span className="text-xs text-gray-500">{formatFileSize(file.size)}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => removeFile(documentType, fileIndex)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FontAwesomeIcon icon={faTimes} size="xs" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="flex-1"
              >
                Back to Home
              </Button>
              <Button
                onClick={handleUpload}
                disabled={uploadStatus === 'uploading' || !documentCollection}
                className={`flex-1 ${
                  uploadStatus === 'uploading' || !documentCollection
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:shadow-lg'
                }`}
              >
                {uploadStatus === 'uploading' ? (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="mr-2 animate-spin" />
                    Uploading... {uploadProgress.overall ? `${Math.round(uploadProgress.overall)}%` : ''}
                  </>
                ) : uploadStatus === 'success' ? (
                  <>
                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                    Upload Complete!
                  </>
                ) : (
                  <>
                    <FontAwesomeIcon icon={faUpload} className="mr-2" />
                    Upload All Documents
                  </>
                )}
              </Button>
            </div>
            
            {/* Progress bar for overall upload */}
            {uploadStatus === 'uploading' && uploadProgress.overall && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                  style={{ width: `${uploadProgress.overall}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t border-gray-200">
          <div className="text-center text-sm text-gray-600">
            <p>Having trouble uploading documents?</p>
            <p className="mt-1">Contact our HR team at <span className="text-blue-600 font-medium">hr@company.com</span></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default DocumentUploadPage;