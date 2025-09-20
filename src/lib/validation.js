/**
 * Form Validation and Error Handling Utilities
 * Comprehensive validation rules and error management for forms
 */

import React from 'react';
import { AriaUtils } from './accessibility';

/**
 * Validation Rules
 */
export const validationRules = {
  // Email validation
  email: {
    required: true,
    pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    message: 'Please enter a valid email address',
  },

  // Password validation
  password: {
    required: true,
    minLength: 8,
    pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
    message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
  },

  // Name validation
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z\s'-]+$/,
    message: 'Name must be 2-50 characters and contain only letters, spaces, hyphens, and apostrophes',
  },

  // Phone validation
  phone: {
    required: false,
    pattern: /^[\+]?[1-9][\d]{0,15}$/,
    message: 'Please enter a valid phone number',
  },

  // URL validation
  url: {
    required: false,
    pattern: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
    message: 'Please enter a valid URL starting with http:// or https://',
  },

  // File validation
  file: {
    required: false,
    maxSize: 25 * 1024 * 1024, // 25MB
    allowedTypes: ['application/pdf'],
    message: 'File must be a PDF and less than 25MB',
  },

  // Custom validators
  confirmPassword: (value, formData) => {
    if (value !== formData.password) {
      return 'Passwords do not match';
    }
    return null;
  },

  dateOfBirth: (value) => {
    const date = new Date(value);
    const now = new Date();
    const age = now.getFullYear() - date.getFullYear();
    
    if (age < 13) {
      return 'You must be at least 13 years old';
    }
    if (age > 120) {
      return 'Please enter a valid date of birth';
    }
    return null;
  },
};

/**
 * Field Validator Class
 */
export class FieldValidator {
  constructor(rules = {}) {
    this.rules = rules;
    this.errors = {};
  }

  /**
   * Validate a single field
   * @param {string} fieldName - Name of the field
   * @param {any} value - Value to validate
   * @param {Object} formData - Complete form data for cross-field validation
   * @returns {string|null} - Error message or null if valid
   */
  validateField(fieldName, value, formData = {}) {
    const rule = this.rules[fieldName];
    if (!rule) return null;

    // Check if field is required
    if (rule.required && (!value || value.toString().trim() === '')) {
      return `${this.formatFieldName(fieldName)} is required`;
    }

    // Skip other validations if field is empty and not required
    if (!value && !rule.required) return null;

    const stringValue = value?.toString() || '';

    // Check minimum length
    if (rule.minLength && stringValue.length < rule.minLength) {
      return `${this.formatFieldName(fieldName)} must be at least ${rule.minLength} characters`;
    }

    // Check maximum length
    if (rule.maxLength && stringValue.length > rule.maxLength) {
      return `${this.formatFieldName(fieldName)} must be no more than ${rule.maxLength} characters`;
    }

    // Check pattern
    if (rule.pattern && !rule.pattern.test(stringValue)) {
      return rule.message || `${this.formatFieldName(fieldName)} format is invalid`;
    }

    // Check file-specific rules
    if (rule.allowedTypes && value instanceof File) {
      if (!rule.allowedTypes.includes(value.type)) {
        return `${this.formatFieldName(fieldName)} must be one of: ${rule.allowedTypes.join(', ')}`;
      }
    }

    if (rule.maxSize && value instanceof File) {
      if (value.size > rule.maxSize) {
        const sizeMB = (rule.maxSize / (1024 * 1024)).toFixed(1);
        return `${this.formatFieldName(fieldName)} must be smaller than ${sizeMB}MB`;
      }
    }

    // Check custom validator
    if (typeof rule === 'function') {
      return rule(value, formData);
    }

    // Check custom validator function
    if (rule.validator && typeof rule.validator === 'function') {
      return rule.validator(value, formData);
    }

    return null;
  }

  /**
   * Validate entire form
   * @param {Object} formData - Form data to validate
   * @returns {Object} - Object with errors for each invalid field
   */
  validateForm(formData) {
    const errors = {};

    Object.keys(this.rules).forEach(fieldName => {
      const error = this.validateField(fieldName, formData[fieldName], formData);
      if (error) {
        errors[fieldName] = error;
      }
    });

    this.errors = errors;
    return errors;
  }

  /**
   * Check if form is valid
   * @returns {boolean}
   */
  isValid() {
    return Object.keys(this.errors).length === 0;
  }

  /**
   * Get first error message
   * @returns {string|null}
   */
  getFirstError() {
    const firstErrorKey = Object.keys(this.errors)[0];
    return firstErrorKey ? this.errors[firstErrorKey] : null;
  }

  /**
   * Format field name for error messages
   * @param {string} fieldName
   * @returns {string}
   */
  formatFieldName(fieldName) {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
  }

  /**
   * Clear errors for a field
   * @param {string} fieldName
   */
  clearFieldError(fieldName) {
    delete this.errors[fieldName];
  }

  /**
   * Clear all errors
   */
  clearAllErrors() {
    this.errors = {};
  }
}

/**
 * Form Hook for React Components
 */
export const useFormValidation = (initialValues = {}, rules = {}) => {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitCount, setSubmitCount] = React.useState(0);

  const validator = React.useMemo(() => new FieldValidator(rules), [rules]);

  /**
   * Handle field value change
   */
  const handleChange = React.useCallback((fieldName, value) => {
    setValues(prev => ({ ...prev, [fieldName]: value }));

    // Clear error when user starts typing
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }

    // Validate on change if field was previously touched and has errors
    if (touched[fieldName] && submitCount > 0) {
      const error = validator.validateField(fieldName, value, { ...values, [fieldName]: value });
      if (error) {
        setErrors(prev => ({ ...prev, [fieldName]: error }));
      }
    }
  }, [errors, touched, submitCount, validator, values]);

  /**
   * Handle field blur (for validation)
   */
  const handleBlur = React.useCallback((fieldName) => {
    setTouched(prev => ({ ...prev, [fieldName]: true }));

    // Validate field on blur
    const error = validator.validateField(fieldName, values[fieldName], values);
    if (error) {
      setErrors(prev => ({ ...prev, [fieldName]: error }));
      AriaUtils.announce(`Error in ${validator.formatFieldName(fieldName)}: ${error}`, 'assertive');
    }
  }, [validator, values]);

  /**
   * Validate entire form
   */
  const validate = React.useCallback(() => {
    const formErrors = validator.validateForm(values);
    setErrors(formErrors);
    return formErrors;
  }, [validator, values]);

  /**
   * Handle form submission
   */
  const handleSubmit = React.useCallback(async (onSubmit) => {
    setSubmitCount(prev => prev + 1);
    setIsSubmitting(true);

    try {
      const formErrors = validate();
      
      if (Object.keys(formErrors).length > 0) {
        // Mark all fields as touched to show errors
        const allTouched = Object.keys(rules).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        setTouched(allTouched);

        // Announce first error to screen readers
        const firstError = Object.values(formErrors)[0];
        AriaUtils.announce(`Form validation failed: ${firstError}`, 'assertive');
        
        setIsSubmitting(false);
        return false;
      }

      // Form is valid, submit
      if (onSubmit) {
        await onSubmit(values);
      }
      
      return true;
    } catch (error) {
      console.error('Form submission error:', error);
      AriaUtils.announce('Form submission failed. Please try again.', 'assertive');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [validate, values, rules]);

  /**
   * Reset form to initial values
   */
  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
    setSubmitCount(0);
  }, [initialValues]);

  /**
   * Set form values programmatically
   */
  const setFormValues = React.useCallback((newValues) => {
    setValues(prev => ({ ...prev, ...newValues }));
  }, []);

  /**
   * Get field props for form inputs
   */
  const getFieldProps = React.useCallback((fieldName) => ({
    value: values[fieldName] || '',
    onChange: (e) => handleChange(fieldName, e.target.value),
    onBlur: () => handleBlur(fieldName),
    'aria-invalid': !!errors[fieldName],
    'aria-describedby': errors[fieldName] ? `${fieldName}-error` : undefined,
  }), [values, handleChange, handleBlur, errors]);

  /**
   * Get error props for error display
   */
  const getErrorProps = React.useCallback((fieldName) => ({
    id: `${fieldName}-error`,
    role: 'alert',
    'aria-live': 'polite',
  }), []);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    submitCount,
    handleChange,
    handleBlur,
    handleSubmit,
    validate,
    reset,
    setFormValues,
    getFieldProps,
    getErrorProps,
    isValid: Object.keys(errors).length === 0,
    hasErrors: Object.keys(errors).length > 0,
  };
};

/**
 * Error Handler Hook
 */
export const useErrorHandler = () => {
  const [errors, setErrors] = React.useState([]);

  const addError = React.useCallback((error, context = '') => {
    const errorObj = {
      id: Date.now(),
      message: error.message || error.toString(),
      context,
      timestamp: new Date().toISOString(),
      stack: error.stack,
    };

    setErrors(prev => [...prev, errorObj]);

    // Log error
    console.error('Error caught:', errorObj);

    // Announce to screen readers
    AriaUtils.announce(`Error: ${errorObj.message}`, 'assertive');

    // Report to error tracking service
    if (window.gtag) {
      window.gtag('event', 'exception', {
        description: errorObj.message,
        fatal: false,
      });
    }

    return errorObj.id;
  }, []);

  const removeError = React.useCallback((errorId) => {
    setErrors(prev => prev.filter(error => error.id !== errorId));
  }, []);

  const clearErrors = React.useCallback(() => {
    setErrors([]);
  }, []);

  const hasErrors = errors.length > 0;
  const latestError = errors[errors.length - 1];

  return {
    errors,
    hasErrors,
    latestError,
    addError,
    removeError,
    clearErrors,
  };
};

/**
 * API Error Handler
 */
export const handleApiError = (error, context = '') => {
  let message = 'An unexpected error occurred';

  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 400:
        message = data.message || 'Invalid request. Please check your input.';
        break;
      case 401:
        message = 'Please log in to continue.';
        break;
      case 403:
        message = 'You do not have permission to perform this action.';
        break;
      case 404:
        message = 'The requested resource was not found.';
        break;
      case 409:
        message = data.message || 'Conflict with existing data.';
        break;
      case 422:
        message = data.message || 'Validation failed. Please check your input.';
        break;
      case 429:
        message = 'Too many requests. Please try again later.';
        break;
      case 500:
        message = 'Server error. Please try again later.';
        break;
      case 503:
        message = 'Service temporarily unavailable. Please try again later.';
        break;
      default:
        message = data.message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // Network error
    message = 'Network error. Please check your internet connection.';
  } else {
    // Other error
    message = error.message || message;
  }

  return {
    message,
    status: error.response?.status,
    context,
    timestamp: new Date().toISOString(),
  };
};

export default {
  validationRules,
  FieldValidator,
  useFormValidation,
  useErrorHandler,
  handleApiError,
};