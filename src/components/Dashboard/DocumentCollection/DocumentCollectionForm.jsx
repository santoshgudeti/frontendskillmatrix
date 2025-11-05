import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faFileUpload, 
  faPaperclip, 
  faInfoCircle, 
  faCheckCircle, 
  faExclamationTriangle,
  faUpload,
  faTimes,
  faSync,
  faPlus,
  faEdit
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { axiosInstance } from '../../../axiosUtils';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentCollectionForm = ({ candidateId, assessmentSessionId, candidateData, onClose, onDocumentsUploaded }) => {
  const [documentTypes, setDocumentTypes] = useState([
    { id: 'aadhaar', name: 'Aadhaar Card', selected: false },
    { id: 'passport', name: 'Passport', selected: false },
    { id: 'voter-id', name: 'Voter ID', selected: false },
    { id: 'driving-license', name: 'Driving License', selected: false },
    { id: 'address-proof', name: 'Address Proof', selected: false },
    { id: 'educational-certificates', name: 'Educational Certificates', selected: false },
    { id: 'experience-certificates', name: 'Experience Certificates', selected: false },
    { id: 'relieving-letters', name: 'Relieving Letters', selected: false },
    { id: 'salary-slips', name: 'Salary Slips', selected: false },
    { id: 'form-16', name: 'Form 16', selected: false },
    { id: 'photographs', name: 'Passport Size Photographs', selected: false },
    { id: 'bank-details', name: 'Bank Details (Cancelled Cheque or Passbook)', selected: false },
    { id: 'pan-card', name: 'PAN Card', selected: true }, // Required by default
    { id: 'medical-certificates', name: 'Medical/Health Certificates', selected: false },
    { id: 'nda', name: 'NDA (Non-Disclosure Agreement)', selected: false },
    { id: 'background-verification', name: 'Background Verification Consent', selected: false },
    { id: 'references', name: 'Reference Details', selected: false },
    { id: 'other', name: 'Other Documents', selected: false }
  ]);
  
  const [customMessage, setCustomMessage] = useState('');
  const [template, setTemplate] = useState('standard');
  const [userTemplates, setUserTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadStatus, setUploadStatus] = useState('idle'); // idle, uploading, success, error
  const [documentCollectionId, setDocumentCollectionId] = useState(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', content: '' });

  // Fetch user templates
  useEffect(() => {
    fetchUserTemplates();
  }, []);

  const fetchUserTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await axiosInstance.get('/api/document-collection/templates');
      setUserTemplates(response.data.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to fetch email templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const toggleDocumentType = (id) => {
    setDocumentTypes(prev => prev.map(doc => 
      doc.id === id ? { ...doc, selected: !doc.selected } : doc
    ));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setUploadedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleRequestDocuments = async () => {
    const selectedTypes = documentTypes.filter(doc => doc.selected).map(doc => doc.id);
    
    if (selectedTypes.length === 0) {
      toast.error('Please select at least one document type');
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Get current user ID for the requestedBy field
      const userResponse = await axiosInstance.get('/user');
      const userId = userResponse.data.user._id;
      
      const response = await axiosInstance.post('/api/document-collection/request', {
        candidateId,
        assessmentSessionId,
        documentTypes: selectedTypes,
        customMessage,
        template, // This can be a template ID for user-defined templates
        requestedBy: userId,
        candidateName: candidateData?.name || '',
        candidateEmail: candidateData?.email || ''
      });
      
      setDocumentCollectionId(response.data.data._id);
      
      // Show success toast immediately
      toast.success('📋 Document collection request sent successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show follow-up toast with details
      setTimeout(() => {
        toast.info(`📧 Email notification sent to ${candidateData?.email || 'candidate'}`, {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 1500);
      
      onClose();
    } catch (error) {
      console.error('Error requesting documents:', error);
      
      // Enhanced error handling with specific messages
      let errorMessage = 'Failed to send document collection request';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUploadDocuments = async () => {
    if (uploadedFiles.length === 0) {
      toast.error('Please select files to upload');
      return;
    }
    
    if (!documentCollectionId) {
      toast.error('Document collection not initialized. Please request documents first.');
      return;
    }
    
    try {
      setUploadStatus('uploading');
      
      const formData = new FormData();
      formData.append('documentCollectionId', documentCollectionId);
      // Add candidate name and email to the form data
      formData.append('candidateName', candidateData?.name || '');
      formData.append('candidateEmail', candidateData?.email || '');
      uploadedFiles.forEach((file) => {
        formData.append('documents', file);
      });
      
      toast.info('Uploading documents...');
      
      const response = await axiosInstance.post('/api/document-collection/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setUploadStatus('success');
      
      // Show enhanced success notification
      toast.success('🎉 Documents uploaded successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show follow-up info toast
      setTimeout(() => {
        toast.info('📋 Our team will review the documents shortly', {
          position: "top-right",
          autoClose: 7000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }, 1500);
      
      // Call the callback to notify parent component
      if (onDocumentsUploaded) {
        onDocumentsUploaded(response.data.data.documentCollectionId);
      }
      
      // Close after a short delay
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error('Error uploading documents:', error);
      setUploadStatus('error');
      
      // Enhanced error handling
      let errorMessage = 'Failed to upload documents. Please try again.';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      toast.error(`❌ ${errorMessage}`, {
        position: "top-right",
        autoClose: 7000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
      // Show additional error details if available
      if (error.response?.data?.details) {
        setTimeout(() => {
          toast.error(`Details: ${error.response.data.details}`, {
            position: "top-right",
            autoClose: 10000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });
        }, 1000);
      }
    }
  };

  const handleCreateTemplate = async () => {
    if (!newTemplate.name || !newTemplate.subject || !newTemplate.content) {
      toast.error('Please fill in all template fields');
      return;
    }
    
    try {
      const response = await axiosInstance.post('/api/document-collection/templates', newTemplate);
      setUserTemplates(prev => [...prev, response.data.data]);
      setTemplate(response.data.data._id);
      setNewTemplate({ name: '', subject: '', content: '' });
      setShowTemplateModal(false);
      toast.success('✅ Template created successfully!', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } catch (error) {
      console.error('Error creating template:', error);
      toast.error('❌ Failed to create template', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  };

  const selectedDocumentTypes = documentTypes.filter(doc => doc.selected);

  return (
    <motion.div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div 
        className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
        initial={{ y: 50, opacity: 0, scale: 0.95 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.95 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <FontAwesomeIcon icon={faFileUpload} className="text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Document Collection</h2>
                <p className="text-gray-600 text-sm">Request or upload candidate documents</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
            >
              <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Request Documents Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faPaperclip} className="text-blue-600" />
                Request Documents from Candidate
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Document Types <span className="text-red-500">*</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 bg-white rounded-lg border border-gray-200">
                    {documentTypes.map((doc) => (
                      <div key={doc.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`doc-${doc.id}`}
                          checked={doc.selected}
                          onChange={() => toggleDocumentType(doc.id)}
                          className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                          disabled={doc.id === 'pan-card'} // PAN card is required
                        />
                        <label htmlFor={`doc-${doc.id}`} className="ml-2 text-sm text-gray-700">
                          {doc.name}
                          {doc.id === 'pan-card' && (
                            <span className="ml-1 text-xs text-red-500">(Required)</span>
                          )}
                        </label>
                      </div>
                    ))}
                  </div>
                  {selectedDocumentTypes.length > 0 && (
                    <div className="mt-2 text-sm text-gray-600">
                      Selected: {selectedDocumentTypes.length} document type(s)
                    </div>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Message (Optional)
                  </label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Add any specific instructions for the candidate..."
                  />
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Email Template
                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowTemplateModal(true)}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faPlus} className="text-xs" />
                        New
                      </button>
                      <button
                        onClick={fetchUserTemplates}
                        disabled={loadingTemplates}
                        className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faSync} className={`text-xs ${loadingTemplates ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    </div>
                  </div>
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="standard">Standard Template</option>
                    <option value="formal">Formal Template</option>
                    <option value="friendly">Friendly Template</option>
                    <optgroup label="User Templates">
                      {userTemplates.map((userTemplate) => (
                        <option key={userTemplate._id} value={userTemplate._id}>
                          {userTemplate.name}
                        </option>
                      ))}
                    </optgroup>
                  </select>
                  <p className="mt-1 text-xs text-gray-500">
                    Select a template or create your own in the{' '}
                    <a 
                      href="/dashboard/templates" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      Template Management
                    </a>{' '}
                    section.
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleRequestDocuments}
                    disabled={isSubmitting || selectedDocumentTypes.length === 0}
                    className={`flex-1 ${
                      isSubmitting || selectedDocumentTypes.length === 0
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <FontAwesomeIcon icon={faUpload} className="mr-2 animate-spin" />
                        Sending Request...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faPaperclip} className="mr-2" />
                        Send Request
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Upload Documents Section */}
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <FontAwesomeIcon icon={faUpload} className="text-green-600" />
                Upload Documents
              </h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Files to Upload
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                    <input
                      type="file"
                      multiple
                      onChange={handleFileChange}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <FontAwesomeIcon icon={faUpload} className="text-3xl text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        <span className="text-blue-600 font-medium">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        PDF, DOC, DOCX, JPG, PNG up to 10MB each
                      </p>
                    </label>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Files ({uploadedFiles.length})
                    </h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {uploadedFiles.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-white p-2 rounded border">
                          <div className="flex items-center gap-2">
                            <FontAwesomeIcon icon={faPaperclip} className="text-gray-400" />
                            <span className="text-sm text-gray-700 truncate max-w-xs">{file.name}</span>
                          </div>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-blue-800 font-medium">Upload Instructions</p>
                      <p className="text-xs text-blue-700 mt-1">
                        Upload documents after receiving them from the candidate. 
                        These will be stored securely and can be reviewed before generating the offer letter.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleUploadDocuments}
                    disabled={uploadedFiles.length === 0 || uploadStatus === 'uploading'}
                    className={`flex-1 bg-green-600 hover:bg-green-700 ${
                      uploadedFiles.length === 0 || uploadStatus === 'uploading'
                        ? 'opacity-70 cursor-not-allowed'
                        : 'hover:shadow-lg'
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      {uploadStatus === 'uploading' ? (
                        <motion.span
                          key="uploading"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <FontAwesomeIcon icon={faUpload} className="mr-2 animate-spin" />
                          Uploading...
                        </motion.span>
                      ) : uploadStatus === 'success' ? (
                        <motion.span
                          key="success"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                          Upload Complete!
                        </motion.span>
                      ) : (
                        <motion.span
                          key="idle"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                        >
                          <FontAwesomeIcon icon={faUpload} className="mr-2" />
                          Upload Documents
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* Template Creation Modal */}
      <AnimatePresence>
        {showTemplateModal && (
          <motion.div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl"
              initial={{ y: 50, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 50, opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="sticky top-0 bg-white border-b border-gray-200 p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <FontAwesomeIcon icon={faEdit} className="text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Create Email Template</h2>
                      <p className="text-gray-600 text-sm">Create a custom email template for document requests</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowTemplateModal(false)}
                    className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors duration-200"
                  >
                    <FontAwesomeIcon icon={faTimes} className="text-gray-500" />
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Template Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTemplate.name}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Onboarding Documents Request"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={newTemplate.subject}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, subject: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., Document Collection Request - {{companyName}}"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Content <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={newTemplate.content}
                    onChange={(e) => setNewTemplate(prev => ({ ...prev, content: e.target.value }))}
                    rows={10}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                    placeholder="Enter your email template content. You can use placeholders like {{candidateName}}, {{companyName}}, {{documentList}}, etc."
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Available placeholders: {'{{candidateName}}'}, {'{{companyName}}'}, {'{{documentList}}'}, {'{{customMessage}}'}, {'{{uploadLink}}'}
                  </p>
                </div>
                
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowTemplateModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateTemplate}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Create Template
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentCollectionForm;