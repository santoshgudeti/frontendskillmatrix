import React from 'react'
import { cn } from '../../lib/utils'
import { X, CheckCircle, AlertCircle, XCircle, Info } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

// Toast Context
const ToastContext = React.createContext({})

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = React.useState([])
  
  const addToast = React.useCallback((toast) => {
    const id = Math.random().toString(36).substring(2, 15)
    const newToast = {
      id,
      ...toast,
      createdAt: Date.now()
    }
    
    setToasts(prev => [...prev, newToast])
    
    // Auto remove after duration
    if (toast.duration !== 0) {
      setTimeout(() => {
        removeToast(id)
      }, toast.duration || 5000)
    }
    
    return id
  }, [])
  
  const removeToast = React.useCallback((id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
  }, [])
  
  const removeAllToasts = React.useCallback(() => {
    setToasts([])
  }, [])
  
  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, removeAllToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  )
}

// Toast Hook
export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider')
  }
  
  const { addToast, removeToast, removeAllToasts } = context
  
  return {
    toast: {
      success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
      error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
      warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
      info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
      custom: (options) => addToast(options)
    },
    dismiss: removeToast,
    dismissAll: removeAllToasts
  }
}

// Toast Container
const ToastContainer = () => {
  const { toasts } = React.useContext(ToastContext)
  
  return (
    <div className={`fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none`}>
      <AnimatePresence mode={`popLayout`}>
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </AnimatePresence>
    </div>
  )
}

// Individual Toast Component
const Toast = ({ id, type = 'info', title, message, duration, action, onClose }) => {
  const { removeToast } = React.useContext(ToastContext)
  
  const handleClose = () => {
    if (onClose) onClose()
    removeToast(id)
  }
  
  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className={`w-5 h-5 text-green-500`} />
      case 'error':
        return <XCircle className={`w-5 h-5 text-red-500`} />
      case 'warning':
        return <AlertCircle className={`w-5 h-5 text-amber-500`} />
      case 'info':
      default:
        return <Info className={`w-5 h-5 text-blue-500`} />
    }
  }
  
  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-white border-l-4 border-green-500 shadow-lg'
      case 'error':
        return 'bg-white border-l-4 border-red-500 shadow-lg'
      case 'warning':
        return 'bg-white border-l-4 border-amber-500 shadow-lg'
      case 'info':
      default:
        return 'bg-white border-l-4 border-blue-500 shadow-lg'
    }
  }
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className={cn(
        `pointer-events-auto relative overflow-hidden rounded-lg p-4 pr-8`,
        getStyles()
      )}
    >
      {/* Progress Bar */}
      {duration && duration > 0 && (
        <motion.div
          className={`absolute bottom-0 left-0 h-1 bg-gray-200`}
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
        />
      )}
      
      <div className={`flex items-start gap-3`}>
        {/* Icon */}
        <div className={`flex-shrink-0`}>
          {getIcon()}
        </div>
        
        {/* Content */}
        <div className={`flex-1 min-w-0`}>
          {title && (
            <p className={`text-sm font-medium text-gray-900`}>
              {title}
            </p>
          )}
          {message && (
            <p className={cn(
              `text-sm text-gray-500`,
              title && `mt-1`
            )}>
              {message}
            </p>
          )}
          
          {/* Action */}
          {action && (
            <div className={`mt-3`}>
              {action}
            </div>
          )}
        </div>
        
        {/* Close Button */}
        <button
          onClick={handleClose}
          className={`absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors`}
        >
          <X className={`w-4 h-4`} />
        </button>
      </div>
    </motion.div>
  )
}

export { Toast, ToastContainer }