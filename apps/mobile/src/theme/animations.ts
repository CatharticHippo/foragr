// Animation design tokens
// Following Material Design 3 motion principles

export const animations = {
  // Duration tokens (in milliseconds)
  duration: {
    instant: 0,
    fast: 150,
    normal: 300,
    slow: 500,
    slower: 700,
  },
  
  // Easing curves
  easing: {
    linear: 'linear',
    ease: 'ease',
    easeIn: 'ease-in',
    easeOut: 'ease-out',
    easeInOut: 'ease-in-out',
    // Material Design 3 easing curves
    standard: 'cubic-bezier(0.2, 0, 0, 1)',
    standardAccelerate: 'cubic-bezier(0.3, 0, 1, 1)',
    standardDecelerate: 'cubic-bezier(0, 0, 0, 1)',
    emphasized: 'cubic-bezier(0.2, 0, 0, 1)',
    emphasizedAccelerate: 'cubic-bezier(0.3, 0, 0.8, 0.15)',
    emphasizedDecelerate: 'cubic-bezier(0.05, 0.7, 0.1, 1)',
  },
  
  // Common animation configurations
  presets: {
    fadeIn: {
      duration: 300,
      easing: 'ease-out',
    },
    fadeOut: {
      duration: 200,
      easing: 'ease-in',
    },
    slideUp: {
      duration: 300,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    slideDown: {
      duration: 300,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    scaleIn: {
      duration: 200,
      easing: 'cubic-bezier(0.2, 0, 0, 1)',
    },
    scaleOut: {
      duration: 150,
      easing: 'cubic-bezier(0.4, 0, 1, 1)',
    },
    bounce: {
      duration: 400,
      easing: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    },
  },
} as const;

export type DurationKey = keyof typeof animations.duration;
export type EasingKey = keyof typeof animations.easing;
export type PresetKey = keyof typeof animations.presets;
