/**
 * Design System Component Utilities
 * Provides consistent styling functions and class builders
 */

import { designSystem } from './designSystem';

/**
 * Class name utility for conditional classes (similar to clsx/classnames)
 * @param {...any} classes - Class names or conditionals
 * @returns {string} - Combined class names
 */
export const cn = (...classes) => {
  return classes
    .flat()
    .filter(Boolean)
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();
};

/**
 * Button component class builder
 * @param {Object} options - Button styling options
 * @returns {string} - Complete button class string
 */
export const buttonClass = ({
  variant = 'primary',
  size = 'DEFAULT',
  fullWidth = false,
  disabled = false,
  loading = false,
  className = '',
} = {}) => {
  const buttonVariant = designSystem.components.button.variants[variant];
  const buttonSize = designSystem.components.button.sizes[size];
  
  return cn(
    buttonVariant?.base,
    buttonVariant?.colors,
    buttonSize,
    fullWidth && 'w-full',
    disabled && 'opacity-50 cursor-not-allowed',
    loading && 'opacity-75 cursor-wait',
    designSystem.accessibility.focusRing,
    className
  );
};

/**
 * Input component class builder
 * @param {Object} options - Input styling options
 * @returns {string} - Complete input class string
 */
export const inputClass = ({
  size = 'DEFAULT',
  state = null,
  fullWidth = true,
  className = '',
} = {}) => {
  const inputSize = designSystem.components.input.sizes[size];
  const inputState = state ? designSystem.components.input.states[state] : '';
  
  return cn(
    designSystem.components.input.base,
    inputSize,
    inputState,
    fullWidth && 'w-full',
    designSystem.accessibility.focusRing,
    className
  );
};

/**
 * Card component class builder
 * @param {Object} options - Card styling options
 * @returns {string} - Complete card class string
 */
export const cardClass = ({
  variant = null,
  padding = 'DEFAULT',
  interactive = false,
  className = '',
} = {}) => {
  const cardVariant = variant ? designSystem.components.card.variants[variant] : '';
  const cardPadding = designSystem.components.card.padding[padding];
  
  return cn(
    designSystem.components.card.base,
    cardVariant,
    cardPadding,
    interactive && designSystem.components.card.variants.interactive,
    className
  );
};

/**
 * Typography class builder
 * @param {Object} options - Typography styling options
 * @returns {string} - Complete typography class string
 */
export const textClass = ({
  size = 'base',
  weight = 'normal',
  color = 'gray-900',
  align = null,
  className = '',
} = {}) => {
  return cn(
    `text-${size}`,
    `font-${weight}`,
    `text-${color}`,
    align && `text-${align}`,
    className
  );
};

/**
 * Responsive wrapper for classes
 * @param {Object} breakpoints - Object with breakpoint keys and class values
 * @returns {string} - Responsive class string
 */
export const responsive = (breakpoints) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, classes]) => {
      if (breakpoint === 'DEFAULT' || breakpoint === 'base') {
        return classes;
      }
      return classes.split(' ').map(cls => `${breakpoint}:${cls}`).join(' ');
    })
    .join(' ');
};

/**
 * Spacing utility
 * @param {string|number} space - Spacing key or value
 * @returns {string} - Spacing class
 */
export const spacing = (space) => {
  return designSystem.spacing[space] || space;
};

/**
 * Color utility with opacity
 * @param {string} color - Color key (e.g., 'primary-500')
 * @param {number} opacity - Opacity value (0-100)
 * @returns {string} - Color class with opacity
 */
export const colorWithOpacity = (color, opacity = null) => {
  if (opacity !== null) {
    return `${color}/${opacity}`;
  }
  return color;
};

/**
 * Focus styles utility
 * @param {string} ring - Ring color (default: primary-500)
 * @returns {string} - Focus classes
 */
export const focusRing = (ring = 'primary-500') => {
  return `focus:outline-none focus:ring-2 focus:ring-${ring} focus:ring-offset-2`;
};

/**
 * Hover animation utility
 * @param {string} animation - Animation type
 * @returns {string} - Hover animation classes
 */
export const hoverAnimation = (animation = 'lift') => {
  const animations = {
    lift: 'hover:-translate-y-1 hover:shadow-lg transition-all duration-200',
    scale: 'hover:scale-105 transition-transform duration-200',
    glow: 'hover:shadow-glow transition-shadow duration-200',
    subtle: 'hover:bg-gray-50 transition-colors duration-200',
  };
  
  return animations[animation] || animations.lift;
};

/**
 * Loading state utility
 * @param {boolean} loading - Loading state
 * @param {string} type - Loading animation type
 * @returns {string} - Loading classes
 */
export const loadingState = (loading, type = 'opacity') => {
  if (!loading) return '';
  
  const loadingTypes = {
    opacity: 'opacity-50 cursor-wait',
    pulse: 'animate-pulse cursor-wait',
    spin: 'opacity-75 cursor-wait',
  };
  
  return loadingTypes[type] || loadingTypes.opacity;
};

/**
 * Error state utility
 * @param {boolean} error - Error state
 * @returns {string} - Error classes
 */
export const errorState = (error) => {
  if (!error) return '';
  return 'border-red-500 text-red-900 bg-red-50';
};

/**
 * Success state utility
 * @param {boolean} success - Success state
 * @returns {string} - Success classes
 */
export const successState = (success) => {
  if (!success) return '';
  return 'border-green-500 text-green-900 bg-green-50';
};

/**
 * Accessibility utility
 * @param {Object} options - Accessibility options
 * @returns {Object} - Accessibility props
 */
export const a11yProps = ({
  label = null,
  describedBy = null,
  role = null,
  expanded = null,
  selected = null,
  disabled = null,
  required = null,
} = {}) => {
  const props = {};
  
  if (label) props['aria-label'] = label;
  if (describedBy) props['aria-describedby'] = describedBy;
  if (role) props.role = role;
  if (expanded !== null) props['aria-expanded'] = expanded;
  if (selected !== null) props['aria-selected'] = selected;
  if (disabled !== null) props['aria-disabled'] = disabled;
  if (required !== null) props['aria-required'] = required;
  
  return props;
};

/**
 * Breakpoint utility for responsive design
 * @param {Object} values - Values for each breakpoint
 * @returns {string} - Responsive classes
 */
export const breakpoint = (values) => {
  return Object.entries(values)
    .map(([bp, value]) => {
      if (bp === 'DEFAULT') return value;
      return `${bp}:${value}`;
    })
    .join(' ');
};

/**
 * Theme-aware classes
 * @param {Object} themes - Theme-specific classes
 * @param {string} currentTheme - Current theme
 * @returns {string} - Theme classes
 */
export const themeClass = (themes, currentTheme = 'light') => {
  return themes[currentTheme] || themes.light || '';
};

/**
 * Status indicator utility
 * @param {string} status - Status type
 * @returns {string} - Status classes
 */
export const statusClass = (status) => {
  const statusClasses = {
    success: 'bg-green-100 text-green-800 border-green-200',
    warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    error: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-gray-100 text-gray-800 border-gray-200',
  };
  
  return statusClasses[status] || statusClasses.neutral;
};

/**
 * Animation utility
 * @param {string} animation - Animation name
 * @param {Object} options - Animation options
 * @returns {string} - Animation classes
 */
export const animation = (animation, options = {}) => {
  const { duration = 'normal', delay = null, repeat = null } = options;
  
  const classes = [`animate-${animation}`];
  
  if (duration !== 'normal') classes.push(`duration-${duration}`);
  if (delay) classes.push(`delay-${delay}`);
  if (repeat) classes.push(`repeat-${repeat}`);
  
  return classes.join(' ');
};

/**
 * Gradient utility
 * @param {string} direction - Gradient direction
 * @param {Array} colors - Color stops
 * @returns {string} - Gradient classes
 */
export const gradient = (direction = 'to-r', colors = ['primary-500', 'secondary-500']) => {
  return `bg-gradient-${direction} from-${colors[0]} to-${colors[1]}`;
};

export default {
  cn,
  buttonClass,
  inputClass,
  cardClass,
  textClass,
  responsive,
  spacing,
  colorWithOpacity,
  focusRing,
  hoverAnimation,
  loadingState,
  errorState,
  successState,
  a11yProps,
  breakpoint,
  themeClass,
  statusClass,
  animation,
  gradient,
};