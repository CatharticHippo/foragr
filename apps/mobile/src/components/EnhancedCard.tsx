import React from 'react';
import { View, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme, SpacingKey, BorderRadiusKey, ElevationKey } from '../theme';

interface EnhancedCardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled' | 'glass';
  padding?: SpacingKey;
  margin?: SpacingKey;
  borderRadius?: BorderRadiusKey;
  elevation?: ElevationKey;
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
  hapticFeedback?: boolean;
  // Enhanced props for better UX
  gradient?: boolean;
  borderColor?: string;
  backgroundColor?: string;
}

export const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  variant = 'elevated',
  padding = 4,
  margin = 0,
  borderRadius = 'lg',
  elevation = 'sm',
  pressable = false,
  onPress,
  style,
  hapticFeedback = true,
  gradient = false,
  borderColor,
  backgroundColor,
}) => {
  const scale = useSharedValue(1);
  const animatedElevation = useSharedValue(theme.elevation[elevation]?.elevation || theme.elevation.sm.elevation);
  const backgroundOpacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      elevation: animatedElevation.value,
      shadowOffset: {
        width: theme.elevation[elevation]?.shadowOffset.width || theme.elevation.sm.shadowOffset.width,
        height: animatedElevation.value / 2,
      },
      shadowOpacity: (theme.elevation[elevation]?.shadowOpacity || theme.elevation.sm.shadowOpacity) * (animatedElevation.value / (theme.elevation[elevation]?.elevation || theme.elevation.sm.elevation)),
      shadowRadius: (theme.elevation[elevation]?.shadowRadius || theme.elevation.sm.shadowRadius) * (animatedElevation.value / (theme.elevation[elevation]?.elevation || theme.elevation.sm.elevation)),
      opacity: backgroundOpacity.value,
    };
  });

  const handlePressIn = () => {
    if (!pressable) return;
    scale.value = withSpring(0.98, theme.animations.spring);
    if (variant === 'elevated') {
      animatedElevation.value = withTiming(theme.elevation.xs.elevation, { 
        duration: theme.animations.durations.shortest,
        easing: theme.animations.easing.standard 
      });
    }
    backgroundOpacity.value = withTiming(0.95, { 
      duration: theme.animations.durations.shortest 
    });
    if (hapticFeedback) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptic feedback not available, continue silently
      }
    }
  };

  const handlePressOut = () => {
    if (!pressable) return;
    scale.value = withSpring(1, theme.animations.spring);
    if (variant === 'elevated') {
      animatedElevation.value = withTiming(theme.elevation[elevation]?.elevation || theme.elevation.sm.elevation, { 
        duration: theme.animations.durations.shortest,
        easing: theme.animations.easing.standard 
      });
    }
    backgroundOpacity.value = withTiming(1, { 
      duration: theme.animations.durations.shortest 
    });
  };

  const getVariantStyles = () => {
    const baseStyles: ViewStyle = {
      padding: theme.spacing[padding],
      margin: theme.spacing[margin],
      borderRadius: theme.borderRadius[borderRadius],
    };

    switch (variant) {
      case 'elevated':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || theme.colors.neutral.white,
          ...(theme.elevation[elevation] || theme.elevation.sm),
        };
      case 'outlined':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || theme.colors.neutral.white,
          borderWidth: theme.borderWidth[1],
          borderColor: borderColor || theme.colors.neutral.gray[200],
        };
      case 'filled':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || theme.colors.neutral.gray[50],
        };
      case 'glass':
        return {
          ...baseStyles,
          backgroundColor: backgroundColor || 'rgba(255, 255, 255, 0.9)',
          borderWidth: theme.borderWidth[1],
          borderColor: borderColor || 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
        };
      default:
        return baseStyles;
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        getVariantStyles(),
        animatedStyle,
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (pressable) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={1}
      >
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

const styles = StyleSheet.create({
  card: {
    // Base card styles are applied via props
  },
});
