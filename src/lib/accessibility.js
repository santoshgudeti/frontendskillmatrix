/**
 * Accessibility utilities for SkillMatrix frontend
 * Provides keyboard navigation, focus management, and ARIA helpers
 */

/**
 * Keyboard navigation utilities
 */
export const KeyboardNavigation = {
  // Standard key codes
  KEYS: {
    ENTER: 'Enter',
    SPACE: ' ',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',
    HOME: 'Home',
    END: 'End'
  },

  /**
   * Handle standard activation keys (Enter and Space)
   * @param {KeyboardEvent} event 
   * @param {Function} callback 
   */
  handleActivation: (event, callback) => {
    if (event.key === KeyboardNavigation.KEYS.ENTER || event.key === KeyboardNavigation.KEYS.SPACE) {
      event.preventDefault();
      callback(event);
    }
  },

  /**
   * Handle escape key
   * @param {KeyboardEvent} event 
   * @param {Function} callback 
   */
  handleEscape: (event, callback) => {
    if (event.key === KeyboardNavigation.KEYS.ESCAPE) {
      event.preventDefault();
      callback(event);
    }
  },

  /**
   * Navigate through a list with arrow keys
   * @param {KeyboardEvent} event 
   * @param {number} currentIndex 
   * @param {number} maxIndex 
   * @param {Function} setIndex 
   * @param {Object} options 
   */
  handleListNavigation: (event, currentIndex, maxIndex, setIndex, options = {}) => {
    const { wrap = true, horizontal = false } = options;
    
    const upKey = horizontal ? KeyboardNavigation.KEYS.ARROW_LEFT : KeyboardNavigation.KEYS.ARROW_UP;
    const downKey = horizontal ? KeyboardNavigation.KEYS.ARROW_RIGHT : KeyboardNavigation.KEYS.ARROW_DOWN;

    if (event.key === upKey) {
      event.preventDefault();
      if (currentIndex > 0) {
        setIndex(currentIndex - 1);
      } else if (wrap) {
        setIndex(maxIndex);
      }
    } else if (event.key === downKey) {
      event.preventDefault();
      if (currentIndex < maxIndex) {
        setIndex(currentIndex + 1);
      } else if (wrap) {
        setIndex(0);
      }
    } else if (event.key === KeyboardNavigation.KEYS.HOME) {
      event.preventDefault();
      setIndex(0);
    } else if (event.key === KeyboardNavigation.KEYS.END) {
      event.preventDefault();
      setIndex(maxIndex);
    }
  }
};

/**
 * Focus management utilities
 */
export const FocusManagement = {
  /**
   * Trap focus within a container
   * @param {HTMLElement} container 
   * @param {KeyboardEvent} event 
   */
  trapFocus: (container, event) => {
    if (event.key !== KeyboardNavigation.KEYS.TAB) return;

    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey) {
      if (document.activeElement === firstElement) {
        event.preventDefault();
        lastElement.focus();
      }
    } else {
      if (document.activeElement === lastElement) {
        event.preventDefault();
        firstElement.focus();
      }
    }
  },

  /**
   * Set focus to first focusable element in container
   * @param {HTMLElement} container 
   */
  focusFirst: (container) => {
    const focusableElement = container.querySelector(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElement) {
      focusableElement.focus();
    }
  },

  /**
   * Return focus to previous element
   * @param {HTMLElement} element 
   */
  returnFocus: (element) => {
    if (element && typeof element.focus === 'function') {
      // Small delay to ensure DOM updates
      setTimeout(() => {
        element.focus();
      }, 100);
    }
  }
};

/**
 * ARIA utilities
 */
export const AriaUtils = {
  /**
   * Generate unique ID for ARIA relationships
   * @param {string} prefix 
   * @returns {string}
   */
  generateId: (prefix = 'aria') => {
    return `${prefix}-${Math.random().toString(36).substr(2, 9)}`;
  },

  /**
   * Announce message to screen readers
   * @param {string} message 
   * @param {string} priority - 'polite' or 'assertive'
   */
  announce: (message, priority = 'polite') => {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  },

  /**
   * Update screen reader status
   * @param {string} status 
   */
  updateStatus: (status) => {
    let statusElement = document.getElementById('aria-status');
    if (!statusElement) {
      statusElement = document.createElement('div');
      statusElement.id = 'aria-status';
      statusElement.setAttribute('aria-live', 'polite');
      statusElement.setAttribute('aria-atomic', 'true');
      statusElement.className = 'sr-only';
      document.body.appendChild(statusElement);
    }
    statusElement.textContent = status;
  }
};

/**
 * Color contrast utilities
 */
export const ColorContrast = {
  /**
   * Check if color combination meets WCAG contrast requirements
   * @param {string} foreground - hex color
   * @param {string} background - hex color
   * @param {string} level - 'AA' or 'AAA'
   * @returns {boolean}
   */
  meetsWCAG: (foreground, background, level = 'AA') => {
    const minRatio = level === 'AAA' ? 7 : 4.5;
    return ColorContrast.getContrastRatio(foreground, background) >= minRatio;
  },

  /**
   * Calculate contrast ratio between two colors
   * @param {string} color1 - hex color
   * @param {string} color2 - hex color
   * @returns {number}
   */
  getContrastRatio: (color1, color2) => {
    const lum1 = ColorContrast.getLuminance(color1);
    const lum2 = ColorContrast.getLuminance(color2);
    const brightest = Math.max(lum1, lum2);
    const darkest = Math.min(lum1, lum2);
    return (brightest + 0.05) / (darkest + 0.05);
  },

  /**
   * Get relative luminance of a color
   * @param {string} hex - hex color
   * @returns {number}
   */
  getLuminance: (hex) => {
    const rgb = ColorContrast.hexToRgb(hex);
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  },

  /**
   * Convert hex to RGB
   * @param {string} hex 
   * @returns {number[]}
   */
  hexToRgb: (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : [0, 0, 0];
  }
};

/**
 * Media query utilities for accessibility
 */
export const MediaQueries = {
  /**
   * Check if user prefers reduced motion
   * @returns {boolean}
   */
  prefersReducedMotion: () => {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  },

  /**
   * Check if user prefers high contrast
   * @returns {boolean}
   */
  prefersHighContrast: () => {
    return window.matchMedia('(prefers-contrast: high)').matches;
  },

  /**
   * Check if user prefers dark color scheme
   * @returns {boolean}
   */
  prefersDarkMode: () => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
};

/**
 * Form accessibility utilities
 */
export const FormAccessibility = {
  /**
   * Generate error message ID for form field
   * @param {string} fieldName 
   * @returns {string}
   */
  getErrorId: (fieldName) => {
    return `${fieldName}-error`;
  },

  /**
   * Generate help text ID for form field
   * @param {string} fieldName 
   * @returns {string}
   */
  getHelpId: (fieldName) => {
    return `${fieldName}-help`;
  },

  /**
   * Build aria-describedby attribute value
   * @param {string} fieldName 
   * @param {boolean} hasError 
   * @param {boolean} hasHelp 
   * @returns {string}
   */
  getDescribedBy: (fieldName, hasError = false, hasHelp = false) => {
    const ids = [];
    if (hasHelp) ids.push(FormAccessibility.getHelpId(fieldName));
    if (hasError) ids.push(FormAccessibility.getErrorId(fieldName));
    return ids.join(' ');
  }
};

export default {
  KeyboardNavigation,
  FocusManagement,
  AriaUtils,
  ColorContrast,
  MediaQueries,
  FormAccessibility
};