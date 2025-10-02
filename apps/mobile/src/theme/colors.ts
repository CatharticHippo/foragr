// Enhanced design tokens for Foragr - inspired by modern design systems
// WCAG AA compliant color palette with improved contrast and accessibility

export const statusColors = {
  // Member status - Professional Blue
  member: {
    primary: '#2563EB',
    light: '#3B82F6',
    dark: '#1D4ED8',
    background: '#EFF6FF',
    border: '#BFDBFE',
    text: '#1E40AF',
    surface: '#F8FAFC',
  },
  
  // Volunteer status - Nature Green
  volunteer: {
    primary: '#059669',
    light: '#10B981',
    dark: '#047857',
    background: '#ECFDF5',
    border: '#A7F3D0',
    text: '#064E3B',
    surface: '#F0FDF4',
  },
  
  // Donor status - Warm Amber
  donor: {
    primary: '#D97706',
    light: '#F59E0B',
    dark: '#B45309',
    background: '#FFFBEB',
    border: '#FDE68A',
    text: '#92400E',
    surface: '#FFFAF0',
  },
} as const;

export const orgColors = {
  // Rocky Mountain Elk Foundation
  rmef: {
    primary: '#059669', // Green
    secondary: '#D97706', // Orange
    background: '#ECFDF5',
  },
  
  // Ecology Project International
  epi: {
    primary: '#0EA5E9', // Sky blue
    secondary: '#10B981', // Emerald
    background: '#F0F9FF',
  },
  
  // Foster Our Youth
  foy: {
    primary: '#8B5CF6', // Purple
    secondary: '#F59E0B', // Amber
    background: '#FAF5FF',
  },
} as const;

export const neutralColors = {
  white: '#FFFFFF',
  black: '#000000',
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
} as const;

export const semanticColors = {
  success: '#059669',
  warning: '#D97706',
  error: '#DC2626',
  info: '#2563EB',
  // Additional semantic colors for better UX
  successLight: '#ECFDF5',
  warningLight: '#FFFBEB',
  errorLight: '#FEF2F2',
  infoLight: '#EFF6FF',
} as const;

// Brand colors for Foragr
export const brandColors = {
  primary: '#059669', // Nature green - main brand color
  secondary: '#2563EB', // Professional blue
  accent: '#D97706', // Warm amber
  neutral: '#6B7280', // Balanced gray
  // Gradient combinations
  gradients: {
    primary: ['#059669', '#10B981'],
    secondary: ['#2563EB', '#3B82F6'],
    sunset: ['#D97706', '#F59E0B'],
    nature: ['#059669', '#2563EB'],
  },
} as const;

// Dark mode variants
export const darkModeColors = {
  status: {
    member: {
      primary: '#60A5FA',
      light: '#93C5FD',
      dark: '#3B82F6',
      background: '#1E3A8A',
      border: '#1E40AF',
    },
    volunteer: {
      primary: '#34D399',
      light: '#6EE7B7',
      dark: '#10B981',
      background: '#064E3B',
      border: '#059669',
    },
    donor: {
      primary: '#FBBF24',
      light: '#FCD34D',
      dark: '#F59E0B',
      background: '#78350F',
      border: '#D97706',
    },
  },
  neutral: {
    white: '#000000',
    black: '#FFFFFF',
    gray: {
      50: '#111827',
      100: '#1F2937',
      200: '#374151',
      300: '#4B5563',
      400: '#6B7280',
      500: '#9CA3AF',
      600: '#D1D5DB',
      700: '#E5E7EB',
      800: '#F3F4F6',
      900: '#F9FAFB',
    },
  },
} as const;

export type StatusColorKey = keyof typeof statusColors;
export type OrgColorKey = keyof typeof orgColors;
