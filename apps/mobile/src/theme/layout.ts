// Layout design tokens
// Following Material Design 3 layout principles

export const layout = {
  // Breakpoints for responsive design
  breakpoints: {
    xs: 0,
    sm: 576,
    md: 768,
    lg: 992,
    xl: 1200,
  },
  
  // Container max widths
  container: {
    xs: '100%',
    sm: '540px',
    md: '720px',
    lg: '960px',
    xl: '1140px',
  },
  
  // Grid system
  grid: {
    columns: 12,
    gutter: 16,
  },
  
  // Z-index scale
  zIndex: {
    hide: -1,
    auto: 'auto',
    base: 0,
    docked: 10,
    dropdown: 1000,
    sticky: 1100,
    banner: 1200,
    overlay: 1300,
    modal: 1400,
    popover: 1500,
    skipLink: 1600,
    toast: 1700,
    tooltip: 1800,
  },
  
  // Common layout dimensions
  dimensions: {
    headerHeight: 56,
    tabBarHeight: 60,
    bottomSheetHeight: 300,
    modalMaxHeight: '90%',
    sidebarWidth: 280,
    drawerWidth: 320,
  },
  
  // Touch targets (minimum 44pt for accessibility)
  touchTarget: {
    min: 44,
    comfortable: 48,
    large: 56,
  },
  
  // Profile image sizes
  profileImage: {
    sm: 32,
    md: 48,
    lg: 64,
    xl: 96,
  },
  
  // Profile image text sizes
  profileImageText: {
    sm: 12,
    md: 16,
    lg: 20,
    xl: 28,
  },
} as const;

export type BreakpointKey = keyof typeof layout.breakpoints;
export type ZIndexKey = keyof typeof layout.zIndex;
