/**
 * 🍞 Toast Deduplication Utility
 * Prevents duplicate toast notifications and manages timing issues
 */

import { toast } from 'react-toastify';

class ToastDeduplicator {
  constructor() {
    // Store recent toasts with timestamps
    this.recentToasts = new Map();
    this.defaultDeduplicationTime = 3000; // 3 seconds
    this.maxToasts = 5; // Maximum concurrent toasts
    
    // Enhanced tracking for specific patterns
    this.statusUpdates = new Map();
    this.documentEvents = new Map();
    
    // Cleanup old entries periodically
    setInterval(() => this.cleanup(), 10000);
  }

  /**
   * Generate a unique key for toast deduplication
   */
  generateToastKey(type, message, context = '') {
    // Normalize message for comparison
    const normalizedMessage = message.toString().toLowerCase().trim();
    return `${type}-${normalizedMessage}-${context}`;
  }

  /**
   * Check if a toast should be shown (not a duplicate)
   */
  shouldShowToast(type, message, context = '', customDeduplicationTime = null) {
    const key = this.generateToastKey(type, message, context);
    const now = Date.now();
    const deduplicationTime = customDeduplicationTime || this.defaultDeduplicationTime;
    
    // Check if this exact toast was shown recently
    if (this.recentToasts.has(key)) {
      const lastShown = this.recentToasts.get(key);
      if (now - lastShown < deduplicationTime) {
        console.log(`🚫 [TOAST DEDUPE] Blocked duplicate toast:`, {
          type,
          message: message.substring(0, 50),
          timeSinceLastShown: now - lastShown,
          deduplicationTime
        });
        return false;
      }
    }
    
    // Store this toast's timestamp
    this.recentToasts.set(key, now);
    
    console.log(`✅ [TOAST DEDUPE] Allowing toast:`, {
      type,
      message: message.substring(0, 50),
      context,
      key
    });
    
    return true;
  }

  /**
   * Enhanced document status update tracking
   */
  trackDocumentStatusUpdate(documentCollectionId, status, source = 'unknown') {
    const key = `${documentCollectionId}-${status}`;
    const now = Date.now();
    
    // Track by document ID and status
    if (this.documentEvents.has(key)) {
      const lastUpdate = this.documentEvents.get(key);
      if (now - lastUpdate.timestamp < 2000) { // 2 second deduplication for document events
        console.log(`🚫 [DOCUMENT DEDUPE] Blocked duplicate document status update:`, {
          documentCollectionId,
          status,
          source,
          timeSinceLastUpdate: now - lastUpdate.timestamp
        });
        return false;
      }
    }
    
    this.documentEvents.set(key, { timestamp: now, source, status });
    return true;
  }

  /**
   * Clean up old entries to prevent memory leaks
   */
  cleanup() {
    const now = Date.now();
    const maxAge = 60000; // 1 minute
    
    // Clean up recent toasts
    for (const [key, timestamp] of this.recentToasts.entries()) {
      if (now - timestamp > maxAge) {
        this.recentToasts.delete(key);
      }
    }
    
    // Clean up document events
    for (const [key, data] of this.documentEvents.entries()) {
      if (now - data.timestamp > maxAge) {
        this.documentEvents.delete(key);
      }
    }
    
    console.log(`🧹 [TOAST CLEANUP] Cleaned up old toast entries. Active: ${this.recentToasts.size} toasts, ${this.documentEvents.size} document events`);
  }

  /**
   * Get current active toast count
   */
  getActiveToastCount() {
    return this.recentToasts.size;
  }

  /**
   * Force clear all toast history (for testing or reset)
   */
  clearAll() {
    this.recentToasts.clear();
    this.documentEvents.clear();
    this.statusUpdates.clear();
    console.log('🗑️ [TOAST DEDUPE] All toast history cleared');
  }
}

// Create singleton instance
const toastDeduplicator = new ToastDeduplicator();

/**
 * Enhanced toast functions with built-in deduplication
 */
export const debouncedToast = {
  /**
   * Show success toast with deduplication
   */
  success: (message, context = '', options = {}) => {
    if (toastDeduplicator.shouldShowToast('success', message, context, options.deduplicationTime)) {
      return toast.success(message, {
        toastId: toastDeduplicator.generateToastKey('success', message, context),
        ...options
      });
    }
    return null;
  },

  /**
   * Show error toast with deduplication
   */
  error: (message, context = '', options = {}) => {
    if (toastDeduplicator.shouldShowToast('error', message, context, options.deduplicationTime)) {
      return toast.error(message, {
        toastId: toastDeduplicator.generateToastKey('error', message, context),
        ...options
      });
    }
    return null;
  },

  /**
   * Show warning toast with deduplication
   */
  warning: (message, context = '', options = {}) => {
    if (toastDeduplicator.shouldShowToast('warning', message, context, options.deduplicationTime)) {
      return toast.warning(message, {
        toastId: toastDeduplicator.generateToastKey('warning', message, context),
        ...options
      });
    }
    return null;
  },

  /**
   * Show info toast with deduplication
   */
  info: (message, context = '', options = {}) => {
    if (toastDeduplicator.shouldShowToast('info', message, context, options.deduplicationTime)) {
      return toast.info(message, {
        toastId: toastDeduplicator.generateToastKey('info', message, context),
        ...options
      });
    }
    return null;
  },

  /**
   * Show loading toast (these are usually unique)
   */
  loading: (message, options = {}) => {
    return toast.loading(message, {
      toastId: `loading-${Date.now()}`,
      ...options
    });
  },

  /**
   * Dismiss specific toast
   */
  dismiss: (toastId) => {
    return toast.dismiss(toastId);
  },

  /**
   * Dismiss all toasts
   */
  dismissAll: () => {
    return toast.dismiss();
  }
};

/**
 * Specialized toast functions for document operations
 */
export const documentToast = {
  /**
   * Document verification success with deduplication
   */
  verified: (documentCollectionId, candidateName = '', options = {}) => {
    const context = `doc-verify-${documentCollectionId}`;
    if (toastDeduplicator.trackDocumentStatusUpdate(documentCollectionId, 'verified', 'toast')) {
      const message = candidateName 
        ? `✅ Documents verified for ${candidateName}! Select Candidate button is now enabled.`
        : '✅ Documents verified successfully! Select Candidate button is now enabled.';
      
      return debouncedToast.success(message, context, {
        autoClose: 5000,
        ...options
      });
    }
    return null;
  },

  /**
   * Document rejection with deduplication
   */
  rejected: (documentCollectionId, reason = '', options = {}) => {
    const context = `doc-reject-${documentCollectionId}`;
    if (toastDeduplicator.trackDocumentStatusUpdate(documentCollectionId, 'rejected', 'toast')) {
      const message = reason 
        ? `❌ Documents rejected: ${reason}. Please request new documents.`
        : '❌ Documents rejected. Please request new documents.';
      
      return debouncedToast.error(message, context, {
        autoClose: 8000,
        ...options
      });
    }
    return null;
  },

  /**
   * Document upload notification
   */
  uploaded: (documentCollectionId, candidateName = '', options = {}) => {
    const context = `doc-upload-${documentCollectionId}`;
    const message = candidateName
      ? `📝 Documents uploaded by ${candidateName}. Please review and verify.`
      : '📝 Documents uploaded successfully. Please review and verify.';
    
    return debouncedToast.info(message, context, {
      autoClose: 5000,
      ...options
    });
  }
};

/**
 * Utility to prevent useEffect toast spam
 */
export const useEffectToast = {
  /**
   * Create a controlled toast function for useEffect hooks
   */
  createControlled: (componentName, effectName) => {
    const context = `${componentName}-${effectName}`;
    let lastExecution = 0;
    const minInterval = 1000; // Minimum 1 second between executions
    
    return {
      success: (message, options = {}) => {
        const now = Date.now();
        if (now - lastExecution > minInterval) {
          lastExecution = now;
          return debouncedToast.success(message, context, options);
        }
        return null;
      },
      error: (message, options = {}) => {
        const now = Date.now();
        if (now - lastExecution > minInterval) {
          lastExecution = now;
          return debouncedToast.error(message, context, options);
        }
        return null;
      },
      warning: (message, options = {}) => {
        const now = Date.now();
        if (now - lastExecution > minInterval) {
          lastExecution = now;
          return debouncedToast.warning(message, context, options);
        }
        return null;
      },
      info: (message, options = {}) => {
        const now = Date.now();
        if (now - lastExecution > minInterval) {
          lastExecution = now;
          return debouncedToast.info(message, context, options);
        }
        return null;
      }
    };
  }
};

/**
 * Debug utilities
 */
export const toastDebug = {
  getStats: () => ({
    activeToasts: toastDeduplicator.getActiveToastCount(),
    recentToasts: toastDeduplicator.recentToasts.size,
    documentEvents: toastDeduplicator.documentEvents.size
  }),
  
  clearAll: () => toastDeduplicator.clearAll(),
  
  logRecentToasts: () => {
    console.table(Array.from(toastDeduplicator.recentToasts.entries()).map(([key, timestamp]) => ({
      key,
      timestamp: new Date(timestamp).toLocaleTimeString(),
      ageMs: Date.now() - timestamp
    })));
  }
};

// Export the deduplicator instance for advanced usage
export { toastDeduplicator };

// Default export for easy importing
export default debouncedToast;