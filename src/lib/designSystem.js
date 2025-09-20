/**
 * Design System Tokens for SkillMatrix
 * Centralized design tokens for consistent UI/UX
 */

// Color System
export const colors = {
  // Primary Blue System
  primary: {
    50: '#eff6ff',
    100: '#dbeafe', 
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  // Innovation Violet System
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065',
  },
  // Success Emerald System
  success: {
    50: '#ecfdf5',
    100: '#d1fae5',
    200: '#a7f3d0',
    300: '#6ee7b7',
    400: '#34d399',
    500: '#10b981',
    600: '#059669',
    700: '#047857',
    800: '#065f46',
    900: '#064e3b',
    950: '#022c22',
  },
  // Neutral Grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    200: '#e5e7eb',
    300: '#d1d5db',
    400: '#9ca3af',
    500: '#6b7280',
    600: '#4b5563',
    700: '#374151',
    800: '#1f2937',
    900: '#111827',
    950: '#030712',
  },
  // Semantic Colors
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  }
};

// Typography System
export const typography = {
  fontFamilies: {
    sans: ['Inter Variable', 'Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
  },
  fontSizes: {
    xs: { size: '0.75rem', lineHeight: '1rem', letterSpacing: '0.025em' },
    sm: { size: '0.875rem', lineHeight: '1.25rem', letterSpacing: '0.025em' },
    base: { size: '1rem', lineHeight: '1.5rem', letterSpacing: '0' },
    lg: { size: '1.125rem', lineHeight: '1.75rem', letterSpacing: '-0.025em' },
    xl: { size: '1.25rem', lineHeight: '1.75rem', letterSpacing: '-0.025em' },
    '2xl': { size: '1.5rem', lineHeight: '2rem', letterSpacing: '-0.025em' },
    '3xl': { size: '1.875rem', lineHeight: '2.25rem', letterSpacing: '-0.025em' },
    '4xl': { size: '2.25rem', lineHeight: '2.5rem', letterSpacing: '-0.025em' },
    '5xl': { size: '3rem', lineHeight: '1.1', letterSpacing: '-0.025em' },
    '6xl': { size: '3.75rem', lineHeight: '1.1', letterSpacing: '-0.025em' },
  },
  fontWeights: {
    thin: '100',
    extralight: '200',
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
    black: '900',
  }
};

// Spacing System (8px base unit)
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',  // 2px
  1: '0.25rem',     // 4px
  1.5: '0.375rem',  // 6px
  2: '0.5rem',      // 8px
  2.5: '0.625rem',  // 10px
  3: '0.75rem',     // 12px
  3.5: '0.875rem',  // 14px
  4: '1rem',        // 16px
  5: '1.25rem',     // 20px
  6: '1.5rem',      // 24px
  7: '1.75rem',     // 28px
  8: '2rem',        // 32px
  9: '2.25rem',     // 36px
  10: '2.5rem',     // 40px
  11: '2.75rem',    // 44px
  12: '3rem',       // 48px
  14: '3.5rem',     // 56px
  16: '4rem',       // 64px
  20: '5rem',       // 80px
  24: '6rem',       // 96px
  28: '7rem',       // 112px
  32: '8rem',       // 128px
  36: '9rem',       // 144px
  40: '10rem',      // 160px
  44: '11rem',      // 176px
  48: '12rem',      // 192px
  52: '13rem',      // 208px
  56: '14rem',      // 224px
  60: '15rem',      // 240px
  64: '16rem',      // 256px
  72: '18rem',      // 288px
  80: '20rem',      // 320px
  96: '24rem',      // 384px
  // Design System Semantic Spacing
  xs: '0.5rem',     // 8px
  sm: '0.75rem',    // 12px  
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
  '4xl': '6rem',    // 96px
  '5xl': '8rem',    // 128px
};

// Border Radius System
export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  '4xl': '2rem',    // 32px
  '5xl': '2.5rem',  // 40px
  full: '9999px',
  // Design System Semantic Radius
  xs: '0.25rem',    // 4px
  sm: '0.375rem',   // 6px 
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
};

// Shadow System
export const shadows = {
  none: 'none',
  xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
  DEFAULT: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
  // Design System Semantic Shadows
  card: '0 4px 12px rgba(0, 0, 0, 0.08)',
  'card-hover': '0 8px 25px rgba(0, 0, 0, 0.12)',
  button: '0 2px 4px rgba(0, 0, 0, 0.1)',
  'button-hover': '0 4px 8px rgba(0, 0, 0, 0.15)',
  focus: '0 0 0 3px rgba(59, 130, 246, 0.5)',
  glow: '0 0 20px rgba(59, 130, 246, 0.15)',
  'glow-lg': '0 0 40px rgba(59, 130, 246, 0.15)',
  glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
};

// Z-Index Scale
export const zIndex = {
  auto: 'auto',
  0: '0',
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  // Semantic Z-Index
  dropdown: '1000',
  sticky: '1010',
  fixed: '1020',
  'modal-backdrop': '1030',
  modal: '1040',
  popover: '1050',
  tooltip: '1060',
  toast: '1070',
  'skip-link': '9999',
};

// Breakpoints
export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
  '3xl': '1920px',
};

// Animation Durations
export const durations = {
  'instant': '0ms',
  'fast': '100ms',
  'quick': '150ms',
  'normal': '200ms',
  'slow': '300ms',
  'slower': '500ms',
  'slowest': '1000ms',
};

// Animation Easings
export const easings = {
  'linear': 'linear',
  'ease': 'ease',
  'ease-in': 'ease-in',
  'ease-out': 'ease-out',
  'ease-in-out': 'ease-in-out',
  'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  'ease-in-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  'ease-out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1)',
  'ease-in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
  'ease-in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
};

// Component Variants
export const components = {
  button: {
    variants: {
      primary: {
        base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        colors: 'bg-primary-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
      },
      secondary: {
        base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-secondary-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        colors: 'bg-secondary-gradient text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]',
      },
      outline: {
        base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        colors: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 hover:scale-[1.02] active:scale-[0.98]',
      },
      ghost: {
        base: 'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
        colors: 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
      },
    },
    sizes: {
      sm: 'px-3 py-1.5 text-xs',
      DEFAULT: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      xl: 'px-8 py-4 text-lg',
    },
  },
  input: {
    base: 'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm transition-all duration-200 file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-500 focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20 disabled:cursor-not-allowed disabled:opacity-50',
    sizes: {
      sm: 'px-2.5 py-1.5 text-xs',
      DEFAULT: 'px-3 py-2 text-sm',
      lg: 'px-4 py-3 text-base',
    },
    states: {
      error: 'border-red-500 focus:border-red-500 focus:ring-red-500/20',
      success: 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
    },
  },
  card: {
    base: 'bg-white rounded-2xl shadow-lg border border-gray-200/50 transition-all duration-300',
    variants: {
      elevated: 'hover:shadow-xl hover:-translate-y-1',
      interactive: 'cursor-pointer hover:shadow-2xl hover:-translate-y-2 hover:border-primary-200',
      glass: 'bg-white/95 backdrop-blur-xl border-gray-200/30 shadow-2xl',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      DEFAULT: 'p-6',
      lg: 'p-8',
      xl: 'p-10',
    },
  },
};

// Accessibility
export const accessibility = {
  focusRing: 'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2',
  focusVisible: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  skipLink: 'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-primary-600 focus:text-white focus:rounded-md focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-white',
  screenReaderOnly: 'sr-only',
  reducedMotion: 'motion-reduce:transition-none motion-reduce:transform-none',
};

// Export complete design system
export const designSystem = {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  zIndex,
  breakpoints,
  durations,
  easings,
  components,
  accessibility,
};

export default designSystem;