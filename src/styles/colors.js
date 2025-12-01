/**
 * Professional Color System for SkillMatrix
 * Modern, cohesive palette with proper contrast ratios
 */

export const colors = {
  // Primary Brand Colors - Deep Blue (Trust, Professional)
  primary: {
    50: '#EFF6FF',
    100: '#DBEAFE',
    200: '#BFDBFE',
    300: '#93C5FD',
    400: '#60A5FA',
    500: '#3B82F6',  // Main brand color
    600: '#2563EB',  // Primary CTA
    700: '#1D4ED8',
    800: '#1E40AF',
    900: '#1E3A8A',
  },

  // Secondary - Emerald (Growth, Success)
  secondary: {
    50: '#ECFDF5',
    100: '#D1FAE5',
    200: '#A7F3D0',
    300: '#6EE7B7',
    400: '#34D399',
    500: '#10B981',  // Accent color
    600: '#059669',
    700: '#047857',
    800: '#065F46',
    900: '#064E3B',
  },

  // Accent - Violet (Innovation, AI)
  accent: {
    50: '#F5F3FF',
    100: '#EDE9FE',
    200: '#DDD6FE',
    300: '#C4B5FD',
    400: '#A78BFA',
    500: '#8B5CF6',  // AI/Tech features
    600: '#7C3AED',
    700: '#6D28D9',
    800: '#5B21B6',
    900: '#4C1D95',
  },

  // Neutral - Clean grays
  gray: {
    50: '#F9FAFB',
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    400: '#9CA3AF',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827',
  },

  // Semantic Colors
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
};

// Gradient Combinations
export const gradients = {
  // Hero gradients
  heroPrimary: 'from-[#2563EB] via-[#3B82F6] to-[#60A5FA]',
  heroSecondary: 'from-[#7C3AED] via-[#8B5CF6] to-[#A78BFA]',
  
  // Section backgrounds
  sectionLight: 'from-gray-50 via-white to-blue-50/30',
  sectionDark: 'from-gray-900 via-gray-800 to-gray-900',
  
  // Card accents
  cardBlue: 'from-blue-500/10 to-blue-600/5',
  cardGreen: 'from-emerald-500/10 to-emerald-600/5',
  cardPurple: 'from-violet-500/10 to-violet-600/5',
  
  // Feature-specific
  aiGradient: 'from-violet-600 to-purple-600',
  successGradient: 'from-emerald-600 to-teal-600',
  premiumGradient: 'from-blue-600 via-indigo-600 to-violet-600',
};

// Typography Scale
export const typography = {
  // Display (Hero headlines)
  display: {
    lg: 'text-6xl md:text-7xl lg:text-8xl',
    md: 'text-5xl md:text-6xl lg:text-7xl',
    sm: 'text-4xl md:text-5xl lg:text-6xl',
  },
  
  // Headings
  h1: 'text-4xl md:text-5xl lg:text-6xl',
  h2: 'text-3xl md:text-4xl lg:text-5xl',
  h3: 'text-2xl md:text-3xl lg:text-4xl',
  h4: 'text-xl md:text-2xl',
  h5: 'text-lg md:text-xl',
  h6: 'text-base md:text-lg',
  
  // Body
  bodyLarge: 'text-lg md:text-xl',
  body: 'text-base',
  bodySmall: 'text-sm',
  caption: 'text-xs',
};

export default { colors, gradients, typography };
