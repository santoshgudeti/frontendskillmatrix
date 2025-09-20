/**
 * React hooks for accessibility features
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { KeyboardNavigation, FocusManagement, AriaUtils } from '../lib/accessibility';

/**
 * Hook for keyboard navigation in lists and menus
 * @param {Array} items - Array of items to navigate
 * @param {Object} options - Configuration options
 * @returns {Object} Navigation state and handlers
 */
export const useKeyboardNavigation = (items = [], options = {}) => {
  const {
    initialIndex = -1,
    wrap = true,
    horizontal = false,
    onSelect,
    onEscape
  } = options;

  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [isNavigating, setIsNavigating] = useState(false);

  const handleKeyDown = useCallback((event) => {
    if (!items.length) return;

    const maxIndex = items.length - 1;

    // Handle list navigation
    const prevIndex = activeIndex;
    KeyboardNavigation.handleListNavigation(
      event, 
      activeIndex, 
      maxIndex, 
      setActiveIndex, 
      { wrap, horizontal }
    );

    // Handle selection
    if (event.key === KeyboardNavigation.KEYS.ENTER || event.key === KeyboardNavigation.KEYS.SPACE) {
      event.preventDefault();
      if (activeIndex >= 0 && onSelect) {
        onSelect(items[activeIndex], activeIndex);
      }
    }

    // Handle escape
    if (event.key === KeyboardNavigation.KEYS.ESCAPE) {
      event.preventDefault();
      setIsNavigating(false);
      if (onEscape) {
        onEscape();
      }
    }

    // Set navigating state if index changed
    if (prevIndex !== activeIndex) {
      setIsNavigating(true);
    }
  }, [activeIndex, items, wrap, horizontal, onSelect, onEscape]);

  const resetNavigation = useCallback(() => {
    setActiveIndex(initialIndex);
    setIsNavigating(false);
  }, [initialIndex]);

  return {
    activeIndex,
    setActiveIndex,
    isNavigating,
    setIsNavigating,
    handleKeyDown,
    resetNavigation
  };
};

/**
 * Hook for focus management in modals and overlays
 * @param {boolean} isOpen - Whether the modal/overlay is open
 * @param {Object} options - Configuration options
 * @returns {Object} Focus management utilities
 */
export const useFocusTrap = (isOpen, options = {}) => {
  const { 
    initialFocus = null,
    returnFocus = true,
    restoreOnClose = true
  } = options;

  const containerRef = useRef(null);
  const previousActiveElement = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    // Store the currently focused element
    previousActiveElement.current = document.activeElement;

    // Focus initial element or first focusable element
    const focusInitial = () => {
      if (initialFocus) {
        initialFocus.focus();
      } else if (containerRef.current) {
        FocusManagement.focusFirst(containerRef.current);
      }
    };

    // Small delay to ensure DOM is ready
    setTimeout(focusInitial, 100);

    // Add focus trap event listener
    const handleKeyDown = (event) => {
      if (event.key === KeyboardNavigation.KEYS.TAB && containerRef.current) {
        FocusManagement.trapFocus(containerRef.current, event);
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      
      // Return focus to previous element
      if (restoreOnClose && returnFocus && previousActiveElement.current) {
        FocusManagement.returnFocus(previousActiveElement.current);
      }
    };
  }, [isOpen, initialFocus, returnFocus, restoreOnClose]);

  return {
    containerRef,
    setInitialFocus: (element) => {
      if (element) element.focus();
    }
  };
};

/**
 * Hook for ARIA live regions and announcements
 * @returns {Object} Announcement utilities
 */
export const useAnnouncements = () => {
  const announce = useCallback((message, priority = 'polite') => {
    AriaUtils.announce(message, priority);
  }, []);

  const updateStatus = useCallback((status) => {
    AriaUtils.updateStatus(status);
  }, []);

  const announceSuccess = useCallback((message) => {
    announce(`Success: ${message}`, 'polite');
  }, [announce]);

  const announceError = useCallback((message) => {
    announce(`Error: ${message}`, 'assertive');
  }, [announce]);

  const announceLoading = useCallback((message = 'Loading...') => {
    updateStatus(message);
  }, [updateStatus]);

  const announceLoaded = useCallback((message = 'Content loaded') => {
    updateStatus(message);
  }, [updateStatus]);

  return {
    announce,
    updateStatus,
    announceSuccess,
    announceError,
    announceLoading,
    announceLoaded
  };
};

/**
 * Hook for managing ARIA attributes dynamically
 * @param {string} prefix - Prefix for generated IDs
 * @returns {Object} ARIA utilities
 */
export const useAriaAttributes = (prefix = 'component') => {
  const [ids] = useState(() => ({
    main: AriaUtils.generateId(prefix),
    label: AriaUtils.generateId(`${prefix}-label`),
    description: AriaUtils.generateId(`${prefix}-desc`),
    error: AriaUtils.generateId(`${prefix}-error`),
    help: AriaUtils.generateId(`${prefix}-help`)
  }));

  const getAriaProps = useCallback((options = {}) => {
    const {
      hasLabel = false,
      hasDescription = false,
      hasError = false,
      hasHelp = false,
      role,
      expanded,
      selected,
      checked,
      disabled,
      required
    } = options;

    const props = {
      id: ids.main
    };

    // Build describedby
    const describedBy = [];
    if (hasDescription) describedBy.push(ids.description);
    if (hasHelp) describedBy.push(ids.help);
    if (hasError) describedBy.push(ids.error);

    if (describedBy.length > 0) {
      props['aria-describedby'] = describedBy.join(' ');
    }

    // Add labelledby if needed
    if (hasLabel) {
      props['aria-labelledby'] = ids.label;
    }

    // Add conditional ARIA attributes
    if (role) props.role = role;
    if (expanded !== undefined) props['aria-expanded'] = expanded;
    if (selected !== undefined) props['aria-selected'] = selected;
    if (checked !== undefined) props['aria-checked'] = checked;
    if (disabled !== undefined) props['aria-disabled'] = disabled;
    if (required !== undefined) props['aria-required'] = required;

    return props;
  }, [ids]);

  return {
    ids,
    getAriaProps
  };
};

/**
 * Hook for responsive accessibility features
 * @returns {Object} Responsive accessibility state
 */
export const useResponsiveAccessibility = () => {
  const [preferences, setPreferences] = useState({
    reducedMotion: false,
    highContrast: false,
    darkMode: false
  });

  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: typeof window !== 'undefined' ? window.innerWidth < 768 : false,
    isTablet: typeof window !== 'undefined' ? window.innerWidth >= 768 && window.innerWidth < 1024 : false,
    isDesktop: typeof window !== 'undefined' ? window.innerWidth >= 1024 : false
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check user preferences
    const checkPreferences = () => {
      setPreferences({
        reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
        highContrast: window.matchMedia('(prefers-contrast: high)').matches,
        darkMode: window.matchMedia('(prefers-color-scheme: dark)').matches
      });
    };

    // Check screen size
    const checkScreenSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    // Initial checks
    checkPreferences();
    checkScreenSize();

    // Set up listeners
    const mediaQueries = [
      window.matchMedia('(prefers-reduced-motion: reduce)'),
      window.matchMedia('(prefers-contrast: high)'),
      window.matchMedia('(prefers-color-scheme: dark)')
    ];

    mediaQueries.forEach(mq => mq.addListener(checkPreferences));
    window.addEventListener('resize', checkScreenSize);

    return () => {
      mediaQueries.forEach(mq => mq.removeListener(checkPreferences));
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  return {
    preferences,
    screenSize,
    shouldReduceMotion: preferences.reducedMotion,
    shouldUseHighContrast: preferences.highContrast,
    shouldUseDarkMode: preferences.darkMode
  };
};

/**
 * Hook for form accessibility
 * @param {string} fieldName - Name of the form field
 * @returns {Object} Form accessibility utilities
 */
export const useFormAccessibility = (fieldName) => {
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [hasHelp] = useState(false);

  const ids = {
    field: fieldName,
    error: `${fieldName}-error`,
    help: `${fieldName}-help`
  };

  const getFieldProps = useCallback(() => ({
    id: ids.field,
    'aria-describedby': [
      hasHelp ? ids.help : null,
      hasError ? ids.error : null
    ].filter(Boolean).join(' ') || undefined,
    'aria-invalid': hasError,
    'aria-required': true
  }), [ids, hasError, hasHelp]);

  const getErrorProps = useCallback(() => ({
    id: ids.error,
    role: 'alert',
    'aria-live': 'polite'
  }), [ids.error]);

  const setError = useCallback((message) => {
    setHasError(true);
    setErrorMessage(message);
    AriaUtils.announce(`Error: ${message}`, 'assertive');
  }, []);

  const clearError = useCallback(() => {
    setHasError(false);
    setErrorMessage('');
  }, []);

  return {
    hasError,
    errorMessage,
    ids,
    getFieldProps,
    getErrorProps,
    setError,
    clearError
  };
};

export default {
  useKeyboardNavigation,
  useFocusTrap,
  useAnnouncements,
  useAriaAttributes,
  useResponsiveAccessibility,
  useFormAccessibility
};