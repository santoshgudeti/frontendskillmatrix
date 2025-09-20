import React from 'react'
import { cn } from '../../lib/utils'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from './Button'

// Dialog Context
const DialogContext = React.createContext({})

// Main Dialog Component
const Dialog = ({ children, open, onOpenChange, modal = true }) => {
  const [isOpen, setIsOpen] = React.useState(open || false)
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open)
    }
  }, [open])
  
  const handleOpenChange = (open) => {
    setIsOpen(open)
    onOpenChange?.(open)
  }
  
  // Lock body scroll when modal is open
  React.useEffect(() => {
    if (modal && isOpen) {
      document.body.style.overflow = 'hidden'
      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen, modal])
  
  // Handle escape key
  React.useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleOpenChange(false)
      }
    }
    
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      return () => document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen])
  
  return (
    <DialogContext.Provider value={{ isOpen, setOpen: handleOpenChange }}>
      {children}
    </DialogContext.Provider>
  )
}

// Dialog Trigger
const DialogTrigger = React.forwardRef(({ children, asChild, ...props }, ref) => {
  const { setOpen } = React.useContext(DialogContext)
  
  const handleClick = () => {
    setOpen(true)
  }
  
  if (asChild) {
    return React.cloneElement(children, {
      ...props,
      ref,
      onClick: handleClick
    })
  }
  
  return (
    <button ref={ref} onClick={handleClick} {...props}>
      {children}
    </button>
  )
})
DialogTrigger.displayName = `DialogTrigger`

// Dialog Content/Portal
const DialogContent = React.forwardRef(({ 
  children, 
  className, 
  size = `default`,
  showClose = true,
  closeOnOverlayClick = true,
  ...props 
}, ref) => {
  const { isOpen, setOpen } = React.useContext(DialogContext)
  
  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      setOpen(false)
    }
  }
  
  const sizeClasses = {
    sm: `max-w-md`,
    default: `max-w-lg`,
    lg: `max-w-2xl`,
    xl: `max-w-4xl`,
    "2xl": `max-w-6xl`,
    full: `max-w-[95vw] max-h-[95vh]`
  }
  
  if (!isOpen) return null
  
  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 bg-black/50 backdrop-blur-sm`}
            onClick={handleOverlayClick}
          />
          
          {/* Content */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: `spring`, duration: 0.3 }}
            className={cn(
              `relative w-full bg-white rounded-2xl shadow-2xl border border-gray-200`,
              sizeClasses[size],
              className
            )}
            {...props}
          >
            {/* Close Button */}
            {showClose && (
              <button
                className={`absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all duration-200`}
                onClick={() => setOpen(false)}
              >
                <X className={`w-4 h-4`} />
              </button>
            )}
            
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
})
DialogContent.displayName = `DialogContent`

// Dialog Header
const DialogHeader = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex flex-col space-y-1.5 px-6 py-4 border-b border-gray-100`, className)}
    {...props}
  >
    {children}
  </div>
))
DialogHeader.displayName = `DialogHeader`

// Dialog Title
const DialogTitle = React.forwardRef(({ children, className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn(`text-lg font-semibold text-gray-900 leading-none tracking-tight`, className)}
    {...props}
  >
    {children}
  </h2>
))
DialogTitle.displayName = `DialogTitle`

// Dialog Description
const DialogDescription = React.forwardRef(({ children, className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn(`text-sm text-gray-500`, className)}
    {...props}
  >
    {children}
  </p>
))
DialogDescription.displayName = `DialogDescription`

// Dialog Body
const DialogBody = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`px-6 py-4`, className)}
    {...props}
  >
    {children}
  </div>
))
DialogBody.displayName = `DialogBody`

// Dialog Footer
const DialogFooter = React.forwardRef(({ children, className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(`flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-100`, className)}
    {...props}
  >
    {children}
  </div>
))
DialogFooter.displayName = `DialogFooter`

// Confirmation Dialog Hook
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [config, setConfig] = React.useState({})
  const resolveRef = React.useRef()
  
  const confirm = React.useCallback((options = {}) => {
    setConfig({
      title: 'Confirm Action',
      description: 'Are you sure you want to continue?',
      confirmText: 'Confirm',
      cancelText: 'Cancel',
      variant: 'default',
      ...options
    })
    setIsOpen(true)
    
    return new Promise((resolve) => {
      resolveRef.current = resolve
    })
  }, [])
  
  const handleConfirm = () => {
    resolveRef.current?.(true)
    setIsOpen(false)
  }
  
  const handleCancel = () => {
    resolveRef.current?.(false)
    setIsOpen(false)
  }
  
  const ConfirmDialog = () => (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent size={`sm`}>
        <DialogHeader>
          <DialogTitle>{config.title}</DialogTitle>
          {config.description && (
            <DialogDescription>{config.description}</DialogDescription>
          )}
        </DialogHeader>
        
        <DialogFooter>
          <Button variant={`ghost`} onClick={handleCancel}>
            {config.cancelText}
          </Button>
          <Button 
            variant={config.variant === 'destructive' ? 'destructive' : 'default'} 
            onClick={handleConfirm}
          >
            {config.confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
  
  return { confirm, ConfirmDialog }
}

export {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogBody,
  DialogFooter
}