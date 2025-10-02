// Main theme export
export * from './colors';
export * from './typography';
export * from './spacing';
export * from './elevation';
export * from './animations';
export * from './layout';

import { statusColors, orgColors, neutralColors, semanticColors, darkModeColors, brandColors } from './colors';
import { fontSizes, fontWeights, lineHeights, letterSpacings, textStyles } from './typography';
import { spacing, borderRadius, borderWidth } from './spacing';
import { elevation } from './elevation';
import { animations } from './animations';
import { layout } from './layout';

export const theme = {
  colors: {
    status: statusColors,
    org: orgColors,
    neutral: neutralColors,
    semantic: semanticColors,
    brand: brandColors,
    dark: darkModeColors,
  },
  typography: {
    fontSize: fontSizes,
    fontWeight: fontWeights,
    lineHeight: lineHeights,
    letterSpacing: letterSpacings,
    textStyles,
  },
  spacing,
  borderRadius,
  borderWidth,
  elevation,
  animations,
  layout,
} as const;

export type Theme = typeof theme;
