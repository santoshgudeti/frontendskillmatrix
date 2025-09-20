/**
 * Error Boundary Component
 * Catches JavaScript errors anywhere in the component tree and displays fallback UI
 */

import React from 'react';
import { motion } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationTriangle, 
  faRefresh, 
  faBug, 
  faHome,
  faChevronDown,
  faChevronUp 
} from '@fortawesome/free-solid-svg-icons';
import { AriaUtils } from '../../lib/accessibility';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      isExpanded: false,
      errorId: `error-${Date.now()}`,
    };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error details
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });

    // Report error to monitoring service
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Announce error to screen readers
    AriaUtils.announce('An error has occurred. Please try refreshing the page.', 'assertive');
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isExpanded: false,
    });
    
    if (this.props.onRetry) {
      this.props.onRetry();
    }
    
    AriaUtils.announce('Retrying...', 'polite');
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  toggleExpanded = () => {
    this.setState(prev => ({ isExpanded: !prev.isExpanded }));
  };

  render() {
    if (this.state.hasError) {
      const {
        title = 'Something went wrong',
        description = 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.',
        showDetails = process.env.NODE_ENV === 'development',
        showRetry = true,
        showHome = true,
        variant = 'default', // 'default', 'minimal', 'full'
      } = this.props;

      if (variant === 'minimal') {
        return (
          <div 
            className="p-4 bg-red-50 border border-red-200 rounded-lg"
            role="alert"
            aria-labelledby={`${this.state.errorId}-title`}
          >
            <div className="flex items-center gap-3">
              <FontAwesomeIcon 
                icon={faExclamationTriangle} 
                className="text-red-500 flex-shrink-0" 
                aria-hidden="true"
              />
              <div className="flex-1 min-w-0">
                <h3 id={`${this.state.errorId}-title`} className="font-medium text-red-800">
                  {title}
                </h3>
                <p className="text-sm text-red-700 mt-1">{description}</p>
              </div>
              {showRetry && (
                <button
                  onClick={this.handleRetry}
                  className="btn-outline btn-sm text-red-600 border-red-600 hover:bg-red-50 focus:ring-red-500"
                  aria-label="Retry the operation"
                >
                  <FontAwesomeIcon icon={faRefresh} className="mr-1" aria-hidden="true" />
                  Retry
                </button>
              )}
            </div>
          </div>
        );
      }

      return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-red-50 flex items-center justify-center p-4">
          <motion.div 
            className="card-glass max-w-2xl w-full"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            role="alert"
            aria-labelledby={`${this.state.errorId}-title`}
            aria-describedby={`${this.state.errorId}-description`}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div
                className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              >
                <FontAwesomeIcon 
                  icon={faExclamationTriangle} 
                  className="text-3xl text-red-500" 
                  aria-hidden="true"
                />
              </motion.div>
              
              <motion.h1 
                id={`${this.state.errorId}-title`}
                className="text-3xl font-bold text-gray-900 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                {title}
              </motion.h1>
              
              <motion.p 
                id={`${this.state.errorId}-description`}
                className="text-lg text-gray-600 leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                {description}
              </motion.p>
            </div>

            {/* Actions */}
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              {showRetry && (
                <button
                  onClick={this.handleRetry}
                  className="btn-primary px-6 py-3 text-lg"
                  aria-label="Retry the operation that caused the error"
                >
                  <FontAwesomeIcon icon={faRefresh} className="mr-2" aria-hidden="true" />
                  Try Again
                </button>
              )}
              
              {showHome && (
                <button
                  onClick={this.handleGoHome}
                  className="btn-outline px-6 py-3 text-lg"
                  aria-label="Go back to the home page"
                >
                  <FontAwesomeIcon icon={faHome} className="mr-2" aria-hidden="true" />
                  Go Home
                </button>
              )}
            </motion.div>

            {/* Error Details (Development/Debug) */}
            {showDetails && this.state.error && (
              <motion.div 
                className="border-t border-gray-200 pt-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <button
                  onClick={this.toggleExpanded}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded px-2 py-1"
                  aria-expanded={this.state.isExpanded}
                  aria-controls={`${this.state.errorId}-details`}
                >
                  <FontAwesomeIcon 
                    icon={faBug} 
                    className="text-xs" 
                    aria-hidden="true"
                  />
                  <span>Error Details</span>
                  <FontAwesomeIcon 
                    icon={this.state.isExpanded ? faChevronUp : faChevronDown}
                    className="text-xs"
                    aria-hidden="true"
                  />
                </button>
                
                {this.state.isExpanded && (
                  <motion.div 
                    id={`${this.state.errorId}-details`}
                    className="bg-gray-100 rounded-lg p-4 text-sm font-mono text-gray-800 overflow-auto max-h-64"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Error:</h4>
                      <pre className="whitespace-pre-wrap text-red-600">
                        {this.state.error.toString()}
                      </pre>
                    </div>
                    
                    {this.state.errorInfo && (
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-2">Stack Trace:</h4>
                        <pre className="whitespace-pre-wrap text-gray-600">
                          {this.state.errorInfo.componentStack}
                        </pre>
                      </div>
                    )}
                  </motion.div>
                )}
              </motion.div>
            )}

            {/* Support Information */}
            <motion.div 
              className="text-center text-sm text-gray-500 border-t border-gray-200 pt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <p>
                If this problem continues, please{' '}
                <a 
                  href="mailto:support@skillmatrix.com" 
                  className="text-primary-600 hover:text-primary-700 underline focus:outline-none focus:ring-2 focus:ring-primary-500 rounded"
                >
                  contact support
                </a>
                {' '}with the error details above.
              </p>
            </motion.div>
          </motion.div>
        </div>
      );
    }

    // No error, render children normally
    return this.props.children;
  }
}

// Higher-order component wrapper for functional components
export const withErrorBoundary = (Component, errorBoundaryProps = {}) => {
  const WrappedComponent = (props) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
  
  WrappedComponent.displayName = `withErrorBoundary(${Component.displayName || Component.name})`;
  
  return WrappedComponent;
};

// Hook for error handling in functional components
export const useErrorHandler = () => {
  const handleError = React.useCallback((error, errorInfo) => {
    console.error('Error caught by error handler:', error, errorInfo);
    
    // Report to error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: error.toString(),
        fatal: false,
      });
    }
    
    // Announce to screen readers
    AriaUtils.announce('An error occurred while processing your request.', 'assertive');
  }, []);

  return { handleError };
};

export default ErrorBoundary;