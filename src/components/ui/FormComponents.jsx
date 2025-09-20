/**
 * Enhanced Form Components with Built-in Validation
 * Provides form components with accessibility and validation
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faExclamationCircle, 
  faCheckCircle, 
  faEye, 
  faEyeSlash,
  faUpload,
  faFile,
  faTimes,
  faCalendar,
  faChevronDown
} from '@fortawesome/free-solid-svg-icons';
import { cn } from '../../lib/styleUtils';
import { useFormAccessibility } from '../../lib/useAccessibility';

/**
 * Enhanced Text Input with Validation
 */
export const FormInput = React.forwardRef(({
  label,
  error,
  success,
  helpText,
  required = false,
  type = 'text',
  className = '',
  containerClassName = '',
  showPasswordToggle = false,
  icon = null,
  suffix = null,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [isFocused, setIsFocused] = React.useState(false);
  const fieldName = props.name || props.id || 'field';
  
  const {
    hasError,
    errorMessage,
    ids,
    getFieldProps,
    getErrorProps,
  } = useFormAccessibility(fieldName);

  const actualError = error || errorMessage;
  const actualType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={ids.field}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            actualError ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Input Container */}
      <div className="relative">
        {/* Leading Icon */}
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <FontAwesomeIcon 
              icon={icon} 
              className={cn(
                'text-sm transition-colors duration-200',
                actualError ? 'text-red-400' : success ? 'text-green-400' : isFocused ? 'text-primary-500' : 'text-gray-400'
              )}
              aria-hidden="true"
            />
          </div>
        )}

        {/* Input Field */}
        <input
          ref={ref}
          type={actualType}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 text-sm transition-all duration-200',
            'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            icon && 'pl-10',
            (showPasswordToggle || suffix) && 'pr-10',
            actualError && 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50',
            success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50',
            !actualError && !success && 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          aria-invalid={!!actualError}
          aria-describedby={cn(
            helpText && ids.help,
            actualError && ids.error
          ).trim() || undefined}
          {...getFieldProps()}
          {...props}
        />

        {/* Trailing Elements */}
        <div className="absolute inset-y-0 right-0 flex items-center">
          {/* Success Icon */}
          {success && !showPasswordToggle && !suffix && (
            <div className="pr-3">
              <FontAwesomeIcon 
                icon={faCheckCircle} 
                className="text-green-500" 
                aria-hidden="true"
              />
            </div>
          )}

          {/* Error Icon */}
          {actualError && !showPasswordToggle && !suffix && (
            <div className="pr-3">
              <FontAwesomeIcon 
                icon={faExclamationCircle} 
                className="text-red-500" 
                aria-hidden="true"
              />
            </div>
          )}

          {/* Password Toggle */}
          {showPasswordToggle && type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="pr-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={0}
            >
              <FontAwesomeIcon 
                icon={showPassword ? faEyeSlash : faEye} 
                className="text-sm"
              />
            </button>
          )}

          {/* Custom Suffix */}
          {suffix && (
            <div className="pr-3">
              {suffix}
            </div>
          )}
        </div>
      </div>

      {/* Help Text */}
      {helpText && !actualError && (
        <p 
          id={ids.help}
          className="text-xs text-gray-600"
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {actualError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            {...getErrorProps()}
          >
            <p className="text-xs text-red-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" aria-hidden="true" />
              {actualError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FormInput.displayName = 'FormInput';

/**
 * Enhanced Textarea with Validation
 */
export const FormTextarea = React.forwardRef(({
  label,
  error,
  success,
  helpText,
  required = false,
  rows = 4,
  maxLength,
  showCharCount = false,
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const [charCount, setCharCount] = React.useState(props.value?.length || 0);
  const fieldName = props.name || props.id || 'field';
  
  const {
    hasError,
    errorMessage,
    ids,
    getFieldProps,
    getErrorProps,
  } = useFormAccessibility(fieldName);

  const actualError = error || errorMessage;

  const handleChange = (e) => {
    setCharCount(e.target.value.length);
    if (props.onChange) {
      props.onChange(e);
    }
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={ids.field}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            actualError ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Textarea */}
      <textarea
        ref={ref}
        rows={rows}
        maxLength={maxLength}
        className={cn(
          'w-full rounded-lg border bg-white px-3 py-2.5 text-sm transition-all duration-200',
          'placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-1',
          'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
          'resize-y',
          actualError && 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50',
          success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50',
          !actualError && !success && 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',
          className
        )}
        onChange={handleChange}
        aria-invalid={!!actualError}
        aria-describedby={cn(
          helpText && ids.help,
          actualError && ids.error
        ).trim() || undefined}
        {...getFieldProps()}
        {...props}
      />

      {/* Character Count */}
      {(showCharCount || maxLength) && (
        <div className="flex justify-between items-center text-xs">
          <div>
            {helpText && !actualError && (
              <span id={ids.help} className="text-gray-600">
                {helpText}
              </span>
            )}
          </div>
          {(showCharCount || maxLength) && (
            <span 
              className={cn(
                'text-gray-500',
                maxLength && charCount > maxLength * 0.9 && 'text-yellow-600',
                maxLength && charCount >= maxLength && 'text-red-600'
              )}
            >
              {charCount}{maxLength && `/${maxLength}`}
            </span>
          )}
        </div>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {actualError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            {...getErrorProps()}
          >
            <p className="text-xs text-red-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" aria-hidden="true" />
              {actualError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FormTextarea.displayName = 'FormTextarea';

/**
 * Enhanced Select with Validation
 */
export const FormSelect = React.forwardRef(({
  label,
  error,
  success,
  helpText,
  required = false,
  options = [],
  placeholder = 'Select an option...',
  className = '',
  containerClassName = '',
  ...props
}, ref) => {
  const fieldName = props.name || props.id || 'field';
  
  const {
    hasError,
    errorMessage,
    ids,
    getFieldProps,
    getErrorProps,
  } = useFormAccessibility(fieldName);

  const actualError = error || errorMessage;

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label 
          htmlFor={ids.field}
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            actualError ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Select Container */}
      <div className="relative">
        <select
          ref={ref}
          className={cn(
            'w-full rounded-lg border bg-white px-3 py-2.5 pr-10 text-sm transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-offset-1',
            'disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-gray-50',
            'appearance-none cursor-pointer',
            actualError && 'border-red-300 focus:border-red-500 focus:ring-red-500/20 bg-red-50',
            success && 'border-green-300 focus:border-green-500 focus:ring-green-500/20 bg-green-50',
            !actualError && !success && 'border-gray-300 focus:border-primary-500 focus:ring-primary-500/20',
            className
          )}
          aria-invalid={!!actualError}
          aria-describedby={cn(
            helpText && ids.help,
            actualError && ids.error
          ).trim() || undefined}
          {...getFieldProps()}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option, index) => (
            <option 
              key={option.value || index} 
              value={option.value}
              disabled={option.disabled}
            >
              {option.label}
            </option>
          ))}
        </select>

        {/* Dropdown Icon */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <FontAwesomeIcon 
            icon={faChevronDown} 
            className={cn(
              'text-sm transition-colors duration-200',
              actualError ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'
            )}
            aria-hidden="true"
          />
        </div>
      </div>

      {/* Help Text */}
      {helpText && !actualError && (
        <p 
          id={ids.help}
          className="text-xs text-gray-600"
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {actualError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            {...getErrorProps()}
          >
            <p className="text-xs text-red-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" aria-hidden="true" />
              {actualError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
});

FormSelect.displayName = 'FormSelect';

/**
 * Enhanced File Upload with Validation
 */
export const FormFileUpload = ({
  label,
  error,
  success,
  helpText,
  required = false,
  accept,
  multiple = false,
  maxSize,
  onFileSelect,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [dragOver, setDragOver] = React.useState(false);
  const [selectedFiles, setSelectedFiles] = React.useState([]);
  const fileInputRef = React.useRef(null);
  const fieldName = props.name || props.id || 'file';
  
  const {
    hasError,
    errorMessage,
    ids,
    getErrorProps,
  } = useFormAccessibility(fieldName);

  const actualError = error || errorMessage;

  const handleFileSelect = (files) => {
    const fileList = Array.from(files);
    setSelectedFiles(fileList);
    if (onFileSelect) {
      onFileSelect(multiple ? fileList : fileList[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileSelect(files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(newFiles);
    if (onFileSelect) {
      onFileSelect(multiple ? newFiles : null);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={cn('space-y-2', containerClassName)}>
      {/* Label */}
      {label && (
        <label 
          className={cn(
            'block text-sm font-medium transition-colors duration-200',
            actualError ? 'text-red-700' : success ? 'text-green-700' : 'text-gray-700'
          )}
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}

      {/* Drop Zone */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer',
          'hover:bg-gray-50 focus-within:bg-gray-50',
          dragOver && 'border-primary-500 bg-primary-50',
          actualError && 'border-red-300 bg-red-50',
          success && 'border-green-300 bg-green-50',
          !dragOver && !actualError && !success && 'border-gray-300',
          className
        )}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
        aria-describedby={cn(
          helpText && ids.help,
          actualError && ids.error
        ).trim() || undefined}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            fileInputRef.current?.click();
          }
        }}
      >
        <FontAwesomeIcon 
          icon={faUpload} 
          className={cn(
            'text-2xl mb-3 transition-colors duration-200',
            dragOver ? 'text-primary-600' : actualError ? 'text-red-400' : success ? 'text-green-400' : 'text-gray-400'
          )}
          aria-hidden="true"
        />
        <p className="text-sm font-medium text-gray-900 mb-1">
          {dragOver ? 'Drop files here' : 'Click to upload or drag and drop'}
        </p>
        <p className="text-xs text-gray-600">
          {accept && `Supported formats: ${accept}`}
          {maxSize && ` • Max size: ${formatFileSize(maxSize)}`}
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={(e) => handleFileSelect(e.target.files)}
          className="hidden"
          aria-describedby={cn(
            helpText && ids.help,
            actualError && ids.error
          ).trim() || undefined}
          {...props}
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-2">
          {selectedFiles.map((file, index) => (
            <div 
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
            >
              <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={faFile} className="text-primary-600" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-600">{formatFileSize(file.size)}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
                className="text-gray-400 hover:text-red-500 focus:outline-none focus:text-red-500 transition-colors duration-200"
                aria-label={`Remove ${file.name}`}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Help Text */}
      {helpText && !actualError && (
        <p 
          id={ids.help}
          className="text-xs text-gray-600"
        >
          {helpText}
        </p>
      )}

      {/* Error Message */}
      <AnimatePresence>
        {actualError && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            {...getErrorProps()}
          >
            <p className="text-xs text-red-600 flex items-center gap-1">
              <FontAwesomeIcon icon={faExclamationCircle} className="text-xs" aria-hidden="true" />
              {actualError}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default {
  FormInput,
  FormTextarea,
  FormSelect,
  FormFileUpload,
};