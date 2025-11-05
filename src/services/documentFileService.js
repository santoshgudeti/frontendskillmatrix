import { axiosInstance } from '../axiosUtils';
import { toast } from 'react-toastify';

/**
 * 🚀 Professional Document File Service
 * Unified frontend service for all document operations
 */
class DocumentFileService {
  constructor() {
    this.baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  }

  /**
   * Get document collection with enhanced metadata
   */
  async getDocumentCollection(documentCollectionId) {
    try {
      console.log('📋 [FRONTEND FILE SERVICE] Fetching document collection:', documentCollectionId);
      
      const response = await axiosInstance.get(`/api/document-collection/${documentCollectionId}`);
      
      console.log('✅ [FRONTEND FILE SERVICE] Collection fetched:', {
        id: response.data.data._id,
        status: response.data.data.status,
        documentsCount: response.data.data.documents?.length || 0,
        candidateName: response.data.data.candidateName
      });
      
      return {
        success: true,
        collection: response.data.data
      };
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error fetching collection:', error);
      throw new Error(`Failed to fetch document collection: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * View a single document with enhanced fallback strategies
   */
  async viewDocument(documentCollectionId, documentIndex, documentName) {
    try {
      console.log('👁️ [FRONTEND FILE SERVICE] Viewing document:', {
        documentCollectionId,
        documentIndex,
        documentName
      });
      
      const response = await axiosInstance.get(
        `/api/document-collection/${documentCollectionId}/documents/${documentIndex}?view=true`
      );
      
      if (response.data.success && response.data.url) {
        console.log('✅ [FRONTEND FILE SERVICE] View URL generated successfully');
        
        const viewUrl = response.data.url;
        const fallbackUrl = response.data.fallbackUrl;
        const preferredStrategy = response.data.preferredStrategy || 'signed-url';
        
        console.log('🔗 [FRONTEND FILE SERVICE] Viewing strategies:', {
          primary: viewUrl.substring(0, 100) + '...',
          hasFallback: !!fallbackUrl,
          strategy: preferredStrategy
        });
        
        // Enhanced viewing strategy with multiple fallbacks
        return await this.executeViewingStrategy(viewUrl, fallbackUrl, documentName, preferredStrategy);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error viewing document:', error);
      
      // Enhanced error messages
      let errorMessage = 'Failed to view document';
      if (error.response?.status === 404) {
        errorMessage = 'Document not found. It may have been deleted.';
      } else if (error.response?.status === 403) {
        errorMessage = 'Access denied. Please check your permissions.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Server error while generating document link. Please try again.';
      }
      
      toast.error(`❌ ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Execute the appropriate viewing strategy with fallbacks
   */
  async executeViewingStrategy(primaryUrl, fallbackUrl, documentName, strategy) {
    try {
      console.log('🎯 [FRONTEND FILE SERVICE] Executing viewing strategy:', strategy);
      
      // Strategy 1: Try primary URL with enhanced popup handling
      const primaryResult = await this.attemptDocumentViewing(primaryUrl, documentName, 'primary');
      if (primaryResult.success) {
        return primaryResult;
      }
      
      // Strategy 2: Try fallback URL if available
      if (fallbackUrl) {
        console.log('🔄 [FRONTEND FILE SERVICE] Trying fallback URL...');
        const fallbackResult = await this.attemptDocumentViewing(fallbackUrl, documentName, 'fallback');
        if (fallbackResult.success) {
          return fallbackResult;
        }
      }
      
      // Strategy 3: Last resort - direct navigation
      console.log('🚑 [FRONTEND FILE SERVICE] Using last resort - direct navigation');
      window.location.href = primaryUrl;
      toast.info(`📄 Opening ${documentName} - If nothing happens, please check your browser settings`);
      
      return {
        success: true,
        method: 'direct-navigation',
        windowOpened: false
      };
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] All viewing strategies failed:', error);
      throw error;
    }
  }

  /**
   * Attempt to view document with enhanced popup handling
   */
  async attemptDocumentViewing(url, documentName, attemptType) {
    try {
      console.log(`🔗 [FRONTEND FILE SERVICE] Attempting ${attemptType} viewing:`, {
        url: url.substring(0, 100) + '...',
        documentName
      });
      
      // Method 1: Enhanced popup with immediate navigation
      const newWindow = window.open(
        '',
        '_blank',
        'width=1200,height=900,scrollbars=yes,resizable=yes,toolbar=yes,menubar=no,location=yes,status=yes'
      );
      
      if (newWindow) {
        // Immediately navigate to the URL
        newWindow.location.href = url;
        newWindow.document.title = `Viewing: ${documentName}`;
        
        // Add error handling for the popup
        newWindow.onerror = () => {
          console.warn('🚨 [FRONTEND FILE SERVICE] Popup window error detected');
        };
        
        toast.success(`📄 Opening ${documentName} for viewing (${attemptType})`);
        return {
          success: true,
          method: 'enhanced-popup',
          windowOpened: true,
          attemptType
        };
      }
      
      // Method 2: Direct window.open as fallback
      const directWindow = window.open(url, '_blank');
      if (directWindow) {
        toast.success(`📄 Opening ${documentName} for viewing (${attemptType})`);
        return {
          success: true,
          method: 'direct-popup',
          windowOpened: true,
          attemptType
        };
      }
      
      // Method 3: Create invisible link as last resort
      const tempLink = document.createElement('a');
      tempLink.href = url;
      tempLink.target = '_blank';
      tempLink.rel = 'noopener noreferrer';
      tempLink.style.display = 'none';
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      
      toast.info(`📄 Opening ${documentName} - Please allow popups for better viewing experience`);
      return {
        success: true,
        method: 'link-click',
        windowOpened: true,
        attemptType
      };
    } catch (error) {
      console.error(`❌ [FRONTEND FILE SERVICE] ${attemptType} viewing attempt failed:`, error);
      return {
        success: false,
        error: error.message,
        attemptType
      };
    }
  }

  /**
   * Download a single document
   */
  async downloadDocument(documentCollectionId, documentIndex, documentName) {
    try {
      console.log('📥 [FRONTEND FILE SERVICE] Downloading document:', {
        documentCollectionId,
        documentIndex,
        documentName
      });
      
      const response = await axiosInstance.get(
        `/api/document-collection/${documentCollectionId}/documents/${documentIndex}`
      );
      
      if (response.data.success && response.data.url) {
        console.log('✅ [FRONTEND FILE SERVICE] Download URL generated successfully');
        
        // Create temporary download link
        const tempLink = document.createElement('a');
        tempLink.href = response.data.url;
        tempLink.download = documentName;
        tempLink.style.display = 'none';
        document.body.appendChild(tempLink);
        tempLink.click();
        document.body.removeChild(tempLink);
        
        toast.success(`📥 Download started: ${documentName}`);
        return {
          success: true,
          filename: documentName,
          downloaded: true
        };
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error downloading document:', error);
      
      const errorMessage = error.response?.data?.error || 'Failed to download document';
      toast.error(`❌ ${errorMessage}`);
      throw new Error(errorMessage);
    }
  }

  /**
   * Generate bulk URLs for all documents in a collection
   */
  async getBulkUrls(documentCollectionId, mode = 'view') {
    try {
      console.log('📦 [FRONTEND FILE SERVICE] Generating bulk URLs:', { documentCollectionId, mode });
      
      const response = await axiosInstance.get(
        `/api/document-collection/${documentCollectionId}/bulk-urls?mode=${mode}`
      );
      
      if (response.data.success) {
        console.log('✅ [FRONTEND FILE SERVICE] Bulk URLs generated:', response.data.summary);
        return {
          success: true,
          mode,
          urls: response.data.results,
          summary: response.data.summary
        };
      } else {
        throw new Error('Failed to generate bulk URLs');
      }
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error generating bulk URLs:', error);
      throw new Error(`Failed to generate bulk URLs: ${error.response?.data?.error || error.message}`);
    }
  }

  /**
   * Download all documents in a collection (one by one)
   */
  async downloadAllDocuments(documentCollectionId) {
    try {
      console.log('📦 [FRONTEND FILE SERVICE] Starting bulk download:', documentCollectionId);
      
      // Get collection details first
      const collectionResult = await this.getDocumentCollection(documentCollectionId);
      const documents = collectionResult.collection.documents;
      
      if (!documents || documents.length === 0) {
        toast.info('📄 No documents available for download');
        return {
          success: true,
          downloaded: 0,
          total: 0
        };
      }
      
      // Generate bulk download URLs
      const bulkResult = await this.getBulkUrls(documentCollectionId, 'download');
      
      let successCount = 0;
      let failCount = 0;
      
      // Download each document with a small delay
      for (let i = 0; i < bulkResult.urls.length; i++) {
        const urlResult = bulkResult.urls[i];
        
        try {
          if (urlResult.success && urlResult.url) {
            // Create download link with delay
            setTimeout(() => {
              const tempLink = document.createElement('a');
              tempLink.href = urlResult.url;
              tempLink.download = urlResult.filename || `document_${i + 1}`;
              tempLink.style.display = 'none';
              document.body.appendChild(tempLink);
              tempLink.click();
              document.body.removeChild(tempLink);
            }, i * 1000); // 1 second delay between downloads
            
            successCount++;
          } else {
            console.warn('❌ [FRONTEND FILE SERVICE] Failed to generate URL for document:', urlResult);
            failCount++;
          }
        } catch (downloadError) {
          console.error('❌ [FRONTEND FILE SERVICE] Download error for document:', downloadError);
          failCount++;
        }
      }
      
      const message = failCount > 0 
        ? `📥 Downloading ${successCount} documents... ${failCount} failed`
        : `📥 Downloading ${successCount} documents... Check your downloads folder`;
        
      toast.success(message);
      
      console.log('📊 [FRONTEND FILE SERVICE] Bulk download initiated:', {
        total: documents.length,
        successful: successCount,
        failed: failCount
      });
      
      return {
        success: true,
        total: documents.length,
        successful: successCount,
        failed: failCount
      };
      
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error in bulk download:', error);
      toast.error('❌ Failed to download documents');
      throw error;
    }
  }

  /**
   * Verify file integrity for a document collection
   */
  async verifyDocumentFiles(documentCollectionId) {
    try {
      console.log('🔍 [FRONTEND FILE SERVICE] Verifying document files:', documentCollectionId);
      
      const response = await axiosInstance.get(`/api/document-collection/${documentCollectionId}/verify-files`);
      
      if (response.data.success) {
        const verification = response.data.verification;
        console.log('✅ [FRONTEND FILE SERVICE] File verification complete:', verification.summary);
        
        // Show appropriate toast based on results
        if (verification.allExist) {
          toast.success('✅ All documents verified successfully');
        } else {
          const missing = verification.summary.missing;
          toast.warning(`⚠️ ${missing} document(s) missing from storage`);
        }
        
        return {
          success: true,
          verification
        };
      } else {
        throw new Error('Verification failed');
      }
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error verifying files:', error);
      toast.error('❌ Failed to verify document files');
      throw error;
    }
  }

  /**
   * Enhanced document modal data preparation
   */
  async prepareDocumentModal(documentCollectionId) {
    try {
      console.log('🎭 [FRONTEND FILE SERVICE] Preparing document modal data:', documentCollectionId);
      
      // Get collection details and verify files
      const [collectionResult, verificationResult] = await Promise.allSettled([
        this.getDocumentCollection(documentCollectionId),
        this.verifyDocumentFiles(documentCollectionId)
      ]);
      
      const collection = collectionResult.status === 'fulfilled' 
        ? collectionResult.value.collection 
        : null;
        
      const verification = verificationResult.status === 'fulfilled' 
        ? verificationResult.value.verification 
        : null;
      
      if (!collection) {
        throw new Error('Failed to load document collection');
      }
      
      console.log('✅ [FRONTEND FILE SERVICE] Modal data prepared:', {
        documentsCount: collection.documents.length,
        allFilesExist: verification?.allExist || false
      });
      
      return {
        success: true,
        collection,
        verification,
        modalData: {
          title: `Document Collection - ${collection.candidateName || 'Unknown Candidate'}`,
          subtitle: `${collection.documents.length} files uploaded`,
          documents: collection.documents,
          status: collection.status,
          allFilesExist: verification?.allExist || false,
          missingFiles: verification?.summary?.missing || 0
        }
      };
    } catch (error) {
      console.error('❌ [FRONTEND FILE SERVICE] Error preparing modal data:', error);
      throw error;
    }
  }
}

// Export singleton instance
export default new DocumentFileService();