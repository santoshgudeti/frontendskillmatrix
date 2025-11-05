import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faArrowLeft,
  faFileUpload,
  faSearch,
  faFilter,
  faSort,
  faEye,
  faDownload,
  faCheckCircle,
  faClock,
  faTimesCircle,
  faExclamationTriangle,
  faTrash,
  faCheck,
  faBan,
  faSync,
  faFile,
  faFilePdf,
  faFileImage,
  faFileWord,
  faFileExcel,
  faEllipsisV,
  faShieldAlt
} from '@fortawesome/free-solid-svg-icons';
import { debouncedToast, documentToast } from '../../../utils/toastUtils';
import { axiosInstance } from '../../../axiosUtils';
import { Button } from '../../ui/Button';
import { motion, AnimatePresence } from 'framer-motion';
import documentFileService from '../../../services/documentFileService';

// Enhanced UI with better styling and enterprise look
const DocumentCollectionDashboard = () => {
  const navigate = useNavigate();
  const [documentCollections, setDocumentCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortField, setSortField] = useState('requestedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [verifyingDocument, setVerifyingDocument] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedDocumentForRejection, setSelectedDocumentForRejection] = useState(null);
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [showDocumentModal, setShowDocumentModal] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState(null);

  useEffect(() => {
    fetchDocumentCollections();
  }, []);

  const fetchDocumentCollections = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/api/document-collection');
      setDocumentCollections(response.data.data);
    } catch (error) {
      console.error('Error fetching document collections:', error);
      debouncedToast.error('Failed to fetch document collections', 'dashboard-fetch');
      // Fallback to mock data if API fails
      const mockData = [
        {
          _id: '1',
          candidateName: 'John Doe',
          candidateEmail: 'john.doe@example.com',
          documentTypes: ['aadhaar', 'pan-card', 'educational-certificates'],
          status: 'requested',
          requestedAt: new Date('2025-10-01'),
          uploadedAt: null,
          documents: []
        },
        {
          _id: '2',
          candidateName: 'Jane Smith',
          candidateEmail: 'jane.smith@example.com',
          documentTypes: ['passport', 'bank-details', 'experience-certificates'],
          status: 'uploaded',
          requestedAt: new Date('2025-09-28'),
          uploadedAt: new Date('2025-09-30'),
          documents: [
            { name: 'passport.pdf', type: 'application/pdf' },
            { name: 'bank_details.pdf', type: 'application/pdf' }
          ]
        },
        {
          _id: '3',
          candidateName: 'Robert Johnson',
          candidateEmail: 'robert.j@example.com',
          documentTypes: ['driving-license', 'pan-card', 'photographs'],
          status: 'verified',
          requestedAt: new Date('2025-09-25'),
          uploadedAt: new Date('2025-09-27'),
          verifiedAt: new Date('2025-09-29'),
          documents: [
            { name: 'dl_front.jpg', type: 'image/jpeg' },
            { name: 'dl_back.jpg', type: 'image/jpeg' },
            { name: 'photo.jpg', type: 'image/jpeg' }
          ]
        }
      ];
      
      setDocumentCollections(mockData);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'requested':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
          <FontAwesomeIcon icon={faClock} className="mr-1" />
          Requested
        </span>;
      case 'uploaded':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          <FontAwesomeIcon icon={faFileUpload} className="mr-1" />
          Uploaded
        </span>;
      case 'verified':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <FontAwesomeIcon icon={faCheckCircle} className="mr-1" />
          Verified
        </span>;
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <FontAwesomeIcon icon={faTimesCircle} className="mr-1" />
          Rejected
        </span>;
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
          {status}
        </span>;
    }
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

  const getFileIcon = (fileType) => {
    if (fileType?.includes('image')) {
      return faFileImage;
    } else if (fileType?.includes('pdf')) {
      return faFilePdf;
    } else if (fileType?.includes('word') || fileType?.includes('document')) {
      return faFileWord;
    } else if (fileType?.includes('excel') || fileType?.includes('spreadsheet')) {
      return faFileExcel;
    } else {
      return faFile;
    }
  };

  const handleVerifyDocument = async (documentCollectionId, verificationNotes = '') => {
    try {
      console.log('🔍 [DASHBOARD DEBUG] Starting document verification:', {
        documentCollectionId,
        verificationNotes,
        timestamp: new Date().toISOString(),
        currentCollections: documentCollections.length,
        targetCollection: documentCollections.find(c => c._id === documentCollectionId)?.status
      });
      
      const userResponse = await axiosInstance.get('/user');
      const userId = userResponse.data.user._id;
      
      console.log('👤 [DASHBOARD DEBUG] User ID obtained:', userId);
      
      const response = await axiosInstance.put(`/api/document-collection/${documentCollectionId}/verify`, {
        verifiedBy: userId,
        verificationNotes
      });
      
      console.log('✅ [DASHBOARD DEBUG] Document verification API response:', {
        success: response.data.success,
        status: response.data.data?.status,
        verifiedAt: response.data.data?.verifiedAt,
        verifiedBy: response.data.data?.verifiedBy,
        fullResponse: response.data
      });
      
      // Use deduplicated document toast
      documentToast.verified(documentCollectionId, 
        documentCollections.find(c => c._id === documentCollectionId)?.candidateName || '');
      
      // 🔥 ENHANCED DEBUG: Multiple event broadcasting strategies
      console.log('📡 [DASHBOARD DEBUG] Preparing to broadcast verification events...');
      
      // Strategy 1: Original documentVerified event
      const verificationEvent = new CustomEvent('documentVerified', {
        detail: {
          documentCollectionId,
          status: 'verified',
          data: response.data.data,
          timestamp: new Date().toISOString(),
          source: 'DocumentCollectionDashboard',
          action: 'verify'
        }
      });
      
      console.log('📡 [DASHBOARD DEBUG] Broadcasting documentVerified event:', verificationEvent.detail);
      window.dispatchEvent(verificationEvent);
      
      // Strategy 2: Additional documentStatusChanged event
      const statusChangeEvent = new CustomEvent('documentStatusChanged', {
        detail: {
          documentCollectionId,
          newStatus: 'verified',
          previousStatus: documentCollections.find(c => c._id === documentCollectionId)?.status || 'unknown',
          data: response.data.data,
          timestamp: new Date().toISOString(),
          source: 'DocumentCollectionDashboard'
        }
      });
      
      console.log('📡 [DASHBOARD DEBUG] Broadcasting documentStatusChanged event:', statusChangeEvent.detail);
      window.dispatchEvent(statusChangeEvent);
      
      // Strategy 3: Storage-based communication as fallback
      const storageData = {
        documentCollectionId,
        status: 'verified',
        timestamp: Date.now(),
        source: 'DocumentCollectionDashboard'
      };
      localStorage.setItem('lastDocumentVerification', JSON.stringify(storageData));
      console.log('💾 [DASHBOARD DEBUG] Stored verification data in localStorage:', storageData);
      
      // Strategy 4: Focus-based refresh trigger
      setTimeout(() => {
        console.log('🔄 [DASHBOARD DEBUG] Triggering window focus event for refresh');
        window.dispatchEvent(new Event('focus'));
      }, 500);
      
      console.log('✅ [DASHBOARD DEBUG] All verification events broadcasted successfully');
      
      // Refresh local state
      console.log('🔄 [DASHBOARD DEBUG] Refreshing document collections list...');
      await fetchDocumentCollections();
      
      console.log('🎯 [DASHBOARD DEBUG] Document verification process completed successfully');
      
    } catch (error) {
      console.error('❌ [DASHBOARD DEBUG] Error verifying document:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        documentCollectionId
      });
      debouncedToast.error('❌ Failed to verify document', `verify-${documentCollectionId}`);
    }
  };

  const handleRejectDocument = async () => {
    if (!selectedDocumentForRejection || !rejectionReason.trim()) {
      debouncedToast.error('Please provide a rejection reason', 'rejection-reason-required');
      return;
    }
    
    try {
      console.log('🚫 [DASHBOARD DEBUG] Starting document rejection:', {
        documentCollectionId: selectedDocumentForRejection,
        rejectionReason,
        timestamp: new Date().toISOString(),
        currentStatus: documentCollections.find(c => c._id === selectedDocumentForRejection)?.status
      });
      
      const userResponse = await axiosInstance.get('/user');
      const userId = userResponse.data.user._id;
      
      console.log('👤 [DASHBOARD DEBUG] User ID obtained for rejection:', userId);
      
      const response = await axiosInstance.put(`/api/document-collection/${selectedDocumentForRejection}/reject`, {
        rejectedBy: userId,
        rejectionReason: rejectionReason
      });
      
      console.log('✅ [DASHBOARD DEBUG] Document rejection API response:', {
        success: response.data.success,
        status: response.data.data?.status,
        rejectedAt: response.data.data?.rejectedAt,
        rejectedBy: response.data.data?.rejectedBy,
        rejectionReason: response.data.data?.rejectionReason
      });
      
      // Use deduplicated document toast
      documentToast.rejected(selectedDocumentForRejection, rejectionReason);
      
      // 🔥 ENHANCED DEBUG: Multiple event broadcasting for rejection
      console.log('📡 [DASHBOARD DEBUG] Preparing to broadcast rejection events...');
      
      // Strategy 1: Original documentVerified event (keeping for compatibility)
      const rejectionEvent = new CustomEvent('documentVerified', {
        detail: {
          documentCollectionId: selectedDocumentForRejection,
          status: 'rejected',
          data: response.data.data,
          timestamp: new Date().toISOString(),
          source: 'DocumentCollectionDashboard',
          action: 'reject',
          rejectionReason
        }
      });
      
      console.log('📡 [DASHBOARD DEBUG] Broadcasting rejection event:', rejectionEvent.detail);
      window.dispatchEvent(rejectionEvent);
      
      // Strategy 2: Status change event
      const statusChangeEvent = new CustomEvent('documentStatusChanged', {
        detail: {
          documentCollectionId: selectedDocumentForRejection,
          newStatus: 'rejected',
          previousStatus: documentCollections.find(c => c._id === selectedDocumentForRejection)?.status || 'unknown',
          data: response.data.data,
          timestamp: new Date().toISOString(),
          source: 'DocumentCollectionDashboard',
          rejectionReason
        }
      });
      
      console.log('📡 [DASHBOARD DEBUG] Broadcasting status change event:', statusChangeEvent.detail);
      window.dispatchEvent(statusChangeEvent);
      
      // Strategy 3: Storage-based communication
      const storageData = {
        documentCollectionId: selectedDocumentForRejection,
        status: 'rejected',
        timestamp: Date.now(),
        source: 'DocumentCollectionDashboard',
        rejectionReason
      };
      localStorage.setItem('lastDocumentVerification', JSON.stringify(storageData));
      console.log('💾 [DASHBOARD DEBUG] Stored rejection data in localStorage:', storageData);
      
      console.log('✅ [DASHBOARD DEBUG] All rejection events broadcasted successfully');
      
      setShowRejectionModal(false);
      setRejectionReason('');
      setSelectedDocumentForRejection(null);
      
      console.log('🔄 [DASHBOARD DEBUG] Refreshing document collections after rejection...');
      await fetchDocumentCollections(); // Refresh the list
      
      console.log('🎯 [DASHBOARD DEBUG] Document rejection process completed successfully');
      
    } catch (error) {
      console.error('❌ [DASHBOARD DEBUG] Error rejecting document:', {
        error: error.message,
        stack: error.stack,
        response: error.response?.data,
        documentCollectionId: selectedDocumentForRejection
      });
      debouncedToast.error('Failed to reject document', `reject-${selectedDocumentForRejection}`);
    }
  };

  // 🔥 ENHANCED: Professional document viewing with unified service and comprehensive error handling
  const handleViewDocument = async (documentCollectionId) => {
    try {
      console.log('👁️ [DASHBOARD] Starting document view process:', {
        documentCollectionId,
        timestamp: new Date().toISOString()
      });
      
      // Show loading state
      const loadingToast = debouncedToast.loading('🔄 Loading documents...');
      
      try {
        const modalData = await documentFileService.prepareDocumentModal(documentCollectionId);
        
        // Dismiss loading toast
        debouncedToast.dismiss(loadingToast);
        
        console.log('📊 [DASHBOARD] Modal data prepared:', {
          documentsCount: modalData.collection.documents?.length || 0,
          allFilesExist: modalData.verification?.allExist,
          candidateName: modalData.collection.candidateName
        });
        
        if (modalData.collection.documents && modalData.collection.documents.length > 0) {
          // Show file verification warning if needed
          if (modalData.verification && !modalData.verification.allExist) {
            const missingCount = modalData.verification.summary.missing;
            debouncedToast.warning(`⚠️ ${missingCount} document(s) missing from storage`, 
              `missing-docs-${documentCollectionId}`);
          }
          
          if (modalData.collection.documents.length === 1) {
            // Single document - open directly with better error handling
            await documentFileService.viewDocument(
              documentCollectionId, 
              0, 
              modalData.collection.documents[0].name
            );
          } else {
            // Multiple documents - show enhanced modal
            setSelectedCollection({
              ...modalData.collection,
              _modalData: modalData.modalData,
              _verification: modalData.verification
            });
            setShowDocumentModal(true);
            
            console.log('🎭 [DASHBOARD] Document modal opened for collection:', documentCollectionId);
          }
        } else {
          debouncedToast.info('📄 No documents have been uploaded for this collection yet.', 
            `no-docs-${documentCollectionId}`);
          console.log('ℹ️ [DASHBOARD] No documents found in collection:', documentCollectionId);
        }
      } catch (modalError) {
        debouncedToast.dismiss(loadingToast);
        throw modalError;
      }
    } catch (error) {
      console.error('❌ [DASHBOARD] Error in document view process:', {
        error: error.message,
        stack: error.stack,
        documentCollectionId
      });
      
      // Enhanced error messaging
      let errorMessage = 'Failed to load documents';
      if (error.message.includes('not found')) {
        errorMessage = 'Document collection not found';
      } else if (error.message.includes('permission') || error.message.includes('access')) {
        errorMessage = 'Access denied to documents';
      } else if (error.message.includes('network') || error.message.includes('timeout')) {
        errorMessage = 'Network error loading documents';
      }
      
      debouncedToast.error(`❌ ${errorMessage}`, `view-error-${documentCollectionId}`);
    }
  };

  // 🔥 ENHANCED: Simplified single document viewing
  const handleViewSingleDocument = async (documentCollectionId, documentIndex, documentName) => {
    try {
      await documentFileService.viewDocument(documentCollectionId, documentIndex, documentName);
    } catch (error) {
      console.error('❌ [DASHBOARD] Error viewing single document:', error);
      // Error is already handled by the service with toast notifications
    }
  };

  // 🔥 ENHANCED: Professional single document download with progress indication
  const handleDownloadSingleDocument = async (documentCollectionId, documentIndex, filename) => {
    try {
      console.log('📥 [DASHBOARD] Starting single document download:', {
        documentCollectionId,
        documentIndex,
        filename
      });
      
      const loadingToast = debouncedToast.loading(`📥 Downloading ${filename}...`);
      
      try {
        await documentFileService.downloadDocument(documentCollectionId, documentIndex, filename);
        debouncedToast.dismiss(loadingToast);
        debouncedToast.success(`✅ Downloaded: ${filename}`, 
          `download-${documentCollectionId}-${documentIndex}`);
        
        console.log('✅ [DASHBOARD] Single document download completed:', filename);
      } catch (downloadError) {
        debouncedToast.dismiss(loadingToast);
        throw downloadError;
      }
    } catch (error) {
      console.error('❌ [DASHBOARD] Error downloading single document:', {
        error: error.message,
        documentCollectionId,
        documentIndex,
        filename
      });
      
      // Enhanced error messaging for downloads
      let errorMessage = `Failed to download ${filename}`;
      if (error.message.includes('not found')) {
        errorMessage = `File ${filename} not found in storage`;
      } else if (error.message.includes('access') || error.message.includes('permission')) {
        errorMessage = `Access denied to ${filename}`;
      }
      
      debouncedToast.error(`❌ ${errorMessage}`, 
        `download-error-${documentCollectionId}-${documentIndex}`);
    }
  };

  // 🔥 ENHANCED: Intelligent download handler with bulk and single document support
  const handleDownloadDocument = async (documentCollectionId, documentIndex = null) => {
    try {
      console.log('📦 [DASHBOARD] Starting download process:', {
        documentCollectionId,
        documentIndex,
        type: documentIndex !== null ? 'single' : 'bulk'
      });
      
      if (documentIndex !== null) {
        // Download specific document with enhanced error handling
        try {
          const collection = await documentFileService.getDocumentCollection(documentCollectionId);
          const document = collection.collection.documents[documentIndex];
          
          if (!document) {
            throw new Error(`Document at index ${documentIndex} not found`);
          }
          
          await handleDownloadSingleDocument(documentCollectionId, documentIndex, document.name);
        } catch (singleError) {
          console.error('❌ [DASHBOARD] Single document download failed:', singleError);
          debouncedToast.error(`❌ Failed to download document: ${singleError.message}`, 'single-download-error');
        }
      } else {
        // Download all documents with progress tracking
        const loadingToast = debouncedToast.loading('📦 Preparing bulk download...');
        
        try {
          const result = await documentFileService.downloadAllDocuments(documentCollectionId);
          debouncedToast.dismiss(loadingToast);
          
          if (result.successful > 0) {
            const message = result.failed > 0 
              ? `📥 Downloaded ${result.successful}/${result.total} documents (${result.failed} failed)`
              : `📥 Downloaded ${result.successful} documents successfully`;
            debouncedToast.success(message, `bulk-download-${documentCollectionId}`);
            
            console.log('✅ [DASHBOARD] Bulk download completed:', result);
          } else {
            debouncedToast.error('❌ No documents could be downloaded', `bulk-download-error-${documentCollectionId}`);
          }
        } catch (bulkError) {
          debouncedToast.dismiss(loadingToast);
          throw bulkError;
        }
      }
    } catch (error) {
      console.error('❌ [DASHBOARD] Error in download process:', {
        error: error.message,
        stack: error.stack,
        documentCollectionId,
        documentIndex
      });
      
      // Enhanced error messaging
      let errorMessage = 'Download failed';
      if (error.message.includes('network')) {
        errorMessage = 'Network error during download';
      } else if (error.message.includes('not found')) {
        errorMessage = 'Documents not found';
      } else if (error.message.includes('permission')) {
        errorMessage = 'Access denied to download';
      }
      
      debouncedToast.error(`❌ ${errorMessage}: ${error.message}`, 
        `download-error-${documentCollectionId}-${documentIndex || 'all'}`);
    }
  };

  const toggleRowExpansion = (collectionId) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(collectionId)) {
      newExpandedRows.delete(collectionId);
    } else {
      newExpandedRows.add(collectionId);
    }
    setExpandedRows(newExpandedRows);
  };

  const filteredCollections = documentCollections
    .filter(collection => {
      // Safely extract candidate name and email
      let candidateName = '';
      let candidateEmail = '';
      
      // Check if candidateId is populated with name/email
      if (collection.candidateId && typeof collection.candidateId === 'object') {
        candidateName = collection.candidateId.name || '';
        candidateEmail = collection.candidateId.email || '';
      }
      
      // If not populated, use direct properties if they exist
      if (!candidateName) {
        candidateName = collection.candidateName || '';
      }
      if (!candidateEmail) {
        candidateEmail = collection.candidateEmail || '';
      }
      
      // If still no name, use a fallback
      if (!candidateName && collection.candidateId) {
        candidateName = typeof collection.candidateId === 'string' ? 
          `Candidate ${collection.candidateId.substring(0, 8)}` : 
          'Unknown Candidate';
      }
      
      // Safely check if search term matches (with null/undefined checks)
      const matchesSearch = !searchTerm || 
                           (searchTerm && 
                           ((candidateName && candidateName.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (candidateEmail && candidateEmail.toLowerCase().includes(searchTerm.toLowerCase()))));
      const matchesFilter = filterStatus === 'all' || collection.status === filterStatus;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      if (sortOrder === 'asc') {
        return new Date(a[sortField]) - new Date(b[sortField]);
      } else {
        return new Date(b[sortField]) - new Date(a[sortField]);
      }
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <FontAwesomeIcon icon={faFileUpload} spin size="3x" className="text-blue-600 mb-4" />
          <p className="text-gray-600">Loading document collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4">
      <motion.div 
        className="max-w-7xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header with enhanced styling */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/dashboard/candidates')}
                className="flex items-center gap-2"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Back
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Document Collection Dashboard
                </h1>
                <p className="text-gray-600">Manage candidate document collections</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FontAwesomeIcon icon={faSearch} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search candidates..."
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Statuses</option>
                <option value="requested">Requested</option>
                <option value="uploaded">Uploaded</option>
                <option value="verified">Verified</option>
                <option value="rejected">Rejected</option>
              </select>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                onClick={fetchDocumentCollections}
              >
                <FontAwesomeIcon icon={faSync} />
                Refresh
              </Button>
            </div>
          </div>
        </div>

        {/* Enhanced Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                <FontAwesomeIcon icon={faFileUpload} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-semibold text-gray-900">{documentCollections.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-yellow-100 text-yellow-600">
                <FontAwesomeIcon icon={faClock} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documentCollections.filter(d => d.status === 'requested').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100 text-green-600">
                <FontAwesomeIcon icon={faCheckCircle} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documentCollections.filter(d => d.status === 'verified').length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100 text-purple-600">
                <FontAwesomeIcon icon={faFileUpload} className="text-xl" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Uploaded</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {documentCollections.filter(d => d.status === 'uploaded').length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Document Collections Table */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Candidate
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documents Requested
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Uploaded Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCollections.map((collection) => {
                  // Enhanced candidate name parsing
                  let candidateName = '';
                  let candidateEmail = '';
                  
                  // Check if candidateId is populated with name/email
                  if (collection.candidateId && typeof collection.candidateId === 'object') {
                    candidateName = collection.candidateId.name || '';
                    candidateEmail = collection.candidateId.email || '';
                  }
                  
                  // If not populated, use direct properties if they exist
                  if (!candidateName) {
                    candidateName = collection.candidateName || 'Unknown Candidate';
                  }
                  if (!candidateEmail) {
                    candidateEmail = collection.candidateEmail || 'No email provided';
                  }
                  
                  // Enhanced name parsing for better display
                  if (candidateName && typeof candidateName === 'string') {
                    // If name looks like an email, parse it
                    if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(candidateName)) {
                      const emailName = candidateName.split('@')[0].replace(/[._-]/g, ' ');
                      const prettyName = emailName
                        .split(' ')
                        .filter(Boolean)
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                        .trim();
                      candidateName = prettyName || 'Candidate';
                    }
                    // If name is just a single word with dots or underscores, parse it
                    else if (/^[a-zA-Z0-9._-]+$/.test(candidateName) && !candidateName.includes(' ')) {
                      const parsedName = candidateName.replace(/[._-]/g, ' ');
                      const prettyName = parsedName
                        .split(' ')
                        .filter(Boolean)
                        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
                        .join(' ')
                        .trim();
                      candidateName = prettyName || candidateName;
                    }
                  }
                  
                  const isExpanded = expandedRows.has(collection._id);
                  
                  return (
                    <React.Fragment key={collection._id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold">
                                {candidateName && candidateName.charAt(0).toUpperCase()}
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{candidateName || 'Unknown Candidate'}</div>
                              <div className="text-sm text-gray-500">{candidateEmail || 'No email provided'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">
                            {collection.documentTypes.slice(0, 2).map(type => (
                              <span key={type} className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-800 mr-1 mb-1">
                                {getDocumentTypeLabel(type)}
                              </span>
                            ))}
                            {collection.documentTypes.length > 2 && (
                              <span className="inline-block bg-gray-100 rounded-full px-3 py-1 text-xs font-medium text-gray-800">
                                +{collection.documentTypes.length - 2} more
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(collection.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.requestedAt ? new Date(collection.requestedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {collection.uploadedAt ? new Date(collection.uploadedAt).toLocaleDateString() : '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex flex-wrap gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => handleViewDocument(collection._id)}
                            >
                              <FontAwesomeIcon icon={faEye} />
                              <span className="hidden md:inline">View</span>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              disabled={!collection.documents || collection.documents.length === 0}
                              onClick={() => handleDownloadDocument(collection._id)}
                            >
                              <FontAwesomeIcon icon={faDownload} />
                              <span className="hidden md:inline">Download</span>
                              {collection.documents && collection.documents.length > 0 && (
                                <span className="bg-gray-200 text-gray-800 text-xs rounded-full px-1.5 py-0.5">
                                  {collection.documents.length}
                                </span>
                              )}
                            </Button>
                            {collection.status === 'uploaded' && (
                              <>
                                <Button
                                  size="sm"
                                  className="flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white"
                                  onClick={() => handleVerifyDocument(collection._id)}
                                >
                                  <FontAwesomeIcon icon={faCheck} />
                                  <span className="hidden md:inline">Verify</span>
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex items-center gap-1 text-red-600 border-red-300 hover:bg-red-50"
                                  onClick={() => {
                                    setSelectedDocumentForRejection(collection._id);
                                    setShowRejectionModal(true);
                                  }}
                                >
                                  <FontAwesomeIcon icon={faBan} />
                                  <span className="hidden md:inline">Reject</span>
                                </Button>
                              </>
                            )}
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex items-center gap-1"
                              onClick={() => toggleRowExpansion(collection._id)}
                            >
                              <FontAwesomeIcon icon={isExpanded ? faTimesCircle : faEllipsisV} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                      {isExpanded && (
                        <tr>
                          <td colSpan="6" className="px-6 py-4 bg-gray-50">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                              <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-medium text-gray-900 mb-2">Document Details</h4>
                                <div className="space-y-2">
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Total Documents:</span>
                                    <span className="font-medium">{collection.documents?.length || 0}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="font-medium">{collection.status}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-medium text-gray-900 mb-2">Timeline</h4>
                                <div className="space-y-2 text-sm">
                                  <div>
                                    <span className="text-gray-600">Requested:</span>
                                    <span className="ml-2">
                                      {collection.requestedAt ? new Date(collection.requestedAt).toLocaleString() : 'N/A'}
                                    </span>
                                  </div>
                                  {collection.uploadedAt && (
                                    <div>
                                      <span className="text-gray-600">Uploaded:</span>
                                      <span className="ml-2">{new Date(collection.uploadedAt).toLocaleString()}</span>
                                    </div>
                                  )}
                                  {collection.verifiedAt && (
                                    <div>
                                      <span className="text-gray-600">Verified:</span>
                                      <span className="ml-2">{new Date(collection.verifiedAt).toLocaleString()}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                              <div className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-medium text-gray-900 mb-2">Actions</h4>
                                <div className="flex flex-wrap gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => handleViewDocument(collection._id)}
                                  >
                                    <FontAwesomeIcon icon={faEye} className="mr-1" />
                                    View All
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    disabled={!collection.documents || collection.documents.length === 0}
                                    onClick={() => handleDownloadDocument(collection._id)}
                                  >
                                    <FontAwesomeIcon icon={faDownload} className="mr-1" />
                                    Download All
                                  </Button>
                                  {collection.status === 'uploaded' && (
                                    <>
                                      <Button
                                        size="sm"
                                        className="bg-green-600 hover:bg-green-700 text-white"
                                        onClick={() => handleVerifyDocument(collection._id)}
                                      >
                                        <FontAwesomeIcon icon={faCheck} className="mr-1" />
                                        Verify
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-red-600 border-red-300 hover:bg-red-50"
                                        onClick={() => {
                                          setSelectedDocumentForRejection(collection._id);
                                          setShowRejectionModal(true);
                                        }}
                                      >
                                        <FontAwesomeIcon icon={faBan} className="mr-1" />
                                        Reject
                                      </Button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {filteredCollections.length === 0 && (
            <div className="text-center py-12">
              <FontAwesomeIcon icon={faFileUpload} className="text-4xl text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No document collections found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      </motion.div>
      
      {/* Professional Document Modal */}
      {showDocumentModal && selectedCollection && (
        <motion.div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowDocumentModal(false);
              setSelectedCollection(null);
            }
          }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Enhanced Modal Header with File Verification Status */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <h3 className="text-xl font-bold">Document Collection</h3>
                  <div className="flex items-center gap-3 mt-1">
                    <p className="text-blue-100">{selectedCollection.documents.length} files uploaded</p>
                    {selectedCollection._verification && (
                      <div className="flex items-center gap-2">
                        {selectedCollection._verification.allExist ? (
                          <div className="flex items-center gap-1 text-green-200">
                            <FontAwesomeIcon icon={faCheckCircle} className="text-sm" />
                            <span className="text-xs">All files verified</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-1 text-yellow-200">
                            <FontAwesomeIcon icon={faExclamationTriangle} className="text-sm" />
                            <span className="text-xs">
                              {selectedCollection._verification.summary.missing} missing
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  {selectedCollection._modalData?.candidateName && (
                    <p className="text-blue-200 text-sm mt-1">
                      Candidate: {selectedCollection._modalData.candidateName}
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => {
                    setShowDocumentModal(false);
                    setSelectedCollection(null);
                  }}
                  className="text-white hover:text-gray-200 text-2xl w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 transition-colors duration-200 flex items-center justify-center ml-4"
                >
                  ×
                </button>
              </div>
            </div>
            
            {/* Enhanced Modal Body with File Verification Indicators */}
            <div className="p-6 max-h-96 overflow-y-auto">
              {/* File Verification Summary */}
              {selectedCollection._verification && !selectedCollection._verification.allExist && (
                <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 text-yellow-800">
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                    <span className="font-medium">File Verification Warning</span>
                  </div>
                  <p className="text-sm text-yellow-700 mt-1">
                    {selectedCollection._verification.summary.missing} out of {selectedCollection._verification.summary.total} files are missing from storage.
                    Some documents may not be accessible for viewing or download.
                  </p>
                </div>
              )}
              
              <div className="grid grid-cols-1 gap-3">
                {selectedCollection.documents.map((doc, index) => {
                  // Check if this specific file exists (from verification)
                  const fileVerification = selectedCollection._verification?.results?.find(r => r.name === doc.name);
                  const fileExists = fileVerification?.exists !== false;
                  
                  return (
                    <motion.div 
                      key={index}
                      className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                        fileExists 
                          ? 'bg-gray-50 border-gray-200 hover:bg-gray-100' 
                          : 'bg-red-50 border-red-200 hover:bg-red-100'
                      }`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          fileExists ? 'bg-blue-100' : 'bg-red-100'
                        }`}>
                          <FontAwesomeIcon 
                            icon={getFileIcon(doc.type)} 
                            className={`${
                              !fileExists ? 'text-red-500' :
                              doc.type?.includes('image') ? 'text-green-600' : 
                              doc.type?.includes('pdf') ? 'text-red-600' : 
                              'text-gray-600'
                            }`} 
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <div className="font-semibold text-gray-900 truncate">{doc.name}</div>
                            {!fileExists && (
                              <div className="flex items-center gap-1 text-red-600">
                                <FontAwesomeIcon icon={faExclamationTriangle} className="text-xs" />
                                <span className="text-xs">Missing</span>
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            Uploaded: {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'N/A'}
                          </div>
                          <div className="text-xs text-gray-400 flex items-center gap-3">
                            <span>Size: {doc.size ? (doc.size / 1024).toFixed(1) + ' KB' : 'Unknown'}</span>
                            {fileVerification?.actualSize && fileVerification.actualSize !== doc.size && (
                              <span className="text-yellow-600">
                                (Actual: {(fileVerification.actualSize / 1024).toFixed(1)} KB)
                              </span>
                            )}
                          </div>
                          {doc.s3Key && (
                            <div className="text-xs text-gray-400 mt-1 font-mono truncate">
                              Path: {doc.s3Key}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button 
                          onClick={() => handleViewSingleDocument(
                            selectedCollection._id, 
                            index, 
                            doc.name
                          )}
                          disabled={!fileExists}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                            fileExists 
                              ? 'bg-blue-600 hover:bg-blue-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          whileHover={fileExists ? { scale: 1.02 } : {}}
                          whileTap={fileExists ? { scale: 0.98 } : {}}
                        >
                          <FontAwesomeIcon icon={faEye} />
                          View
                        </motion.button>
                        <motion.button 
                          onClick={() => handleDownloadSingleDocument(selectedCollection._id, index, doc.name)}
                          disabled={!fileExists}
                          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center gap-2 ${
                            fileExists 
                              ? 'bg-green-600 hover:bg-green-700 text-white'
                              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          }`}
                          whileHover={fileExists ? { scale: 1.02 } : {}}
                          whileTap={fileExists ? { scale: 0.98 } : {}}
                        >
                          <FontAwesomeIcon icon={faDownload} />
                          Download
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            
            {/* Enhanced Modal Footer with Bulk Actions */}
            <div className="bg-gray-50 p-4 rounded-b-2xl border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div className="flex items-center gap-4">
                  <p className="text-sm text-gray-600 flex items-center gap-2">
                    <FontAwesomeIcon icon={faFileUpload} className="text-blue-500" />
                    Click "View" to open documents in a new window
                  </p>
                  {selectedCollection._verification && (
                    <div className="text-xs text-gray-500">
                      File verification: {selectedCollection._verification.allExist ? 'All OK' : 
                        `${selectedCollection._verification.summary.missing}/${selectedCollection._verification.summary.total} missing`}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {selectedCollection.documents.length > 1 && (
                    <Button
                      onClick={() => handleDownloadDocument(selectedCollection._id)}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
                      variant="outline"
                    >
                      <FontAwesomeIcon icon={faDownload} />
                      Download All
                    </Button>
                  )}
                  <Button
                    onClick={() => {
                      setShowDocumentModal(false);
                      setSelectedCollection(null);
                    }}
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    Close
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Enhanced Rejection Modal */}
      {showRejectionModal && (
        <motion.div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-md"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 50, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Reject Document Collection</h3>
              <p className="text-sm text-gray-500 mb-4">
                Please provide a reason for rejecting these documents:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter rejection reason..."
              />
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowRejectionModal(false);
                    setRejectionReason('');
                    setSelectedDocumentForRejection(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white"
                  onClick={handleRejectDocument}
                >
                  Reject Documents
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default DocumentCollectionDashboard;