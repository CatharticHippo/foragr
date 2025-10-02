import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface FloatingActionButtonProps {
  onPress: () => void;
  icon: keyof typeof Ionicons.glyphMap;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  position?: 'bottom-right' | 'bottom-left' | 'bottom-center';
  disabled?: boolean;
  style?: ViewStyle;
  hapticFeedback?: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  position = 'bottom-right',
  disabled = false,
  style,
  hapticFeedback = true,
}) => {
  const scale = useSharedValue(1);
  const backgroundColor = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1],
        [getVariantColors().background, getVariantColors().backgroundPressed]
      ),
    };
  });

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.brand.primary,
          backgroundPressed: theme.colors.status.volunteer.dark,
          iconColor: theme.colors.neutral.white,
        };
      case 'secondary':
        return {
          background: theme.colors.brand.secondary,
          backgroundPressed: theme.colors.status.member.dark,
          iconColor: theme.colors.neutral.white,
        };
      case 'accent':
        return {
          background: theme.colors.brand.accent,
          backgroundPressed: theme.colors.status.donor.dark,
          iconColor: theme.colors.neutral.white,
        };
      default:
        return {
          background: theme.colors.brand.primary,
          backgroundPressed: theme.colors.status.volunteer.dark,
          iconColor: theme.colors.neutral.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          width: 48,
          height: 48,
          iconSize: 20,
        };
      case 'md':
        return {
          width: 56,
          height: 56,
          iconSize: 24,
        };
      case 'lg':
        return {
          width: 64,
          height: 64,
          iconSize: 28,
        };
      default:
        return {
          width: 56,
          height: 56,
          iconSize: 24,
        };
    }
  };

  const getPositionStyles = () => {
    switch (position) {
      case 'bottom-left':
        return {
          bottom: theme.spacing[6],
          left: theme.spacing[6],
        };
      case 'bottom-center':
        return {
          bottom: theme.spacing[6],
          alignSelf: 'center',
        };
      case 'bottom-right':
      default:
        return {
          bottom: theme.spacing[6],
          right: theme.spacing[6],
        };
    }
  };

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.9, theme.animations.spring);
    backgroundColor.value = withTiming(1, { duration: 100 });
    if (hapticFeedback) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      } catch (error) {
        // Haptic feedback not available, continue silently
      }
    }
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, theme.animations.spring);
    backgroundColor.value = withTiming(0, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled) return;
    onPress();
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();
  const positionStyles = getPositionStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled}
      style={[
        styles.container,
        positionStyles,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            width: sizeStyles.width,
            height: sizeStyles.height,
            borderRadius: sizeStyles.width / 2,
          },
          animatedStyle,
        ]}
      >
        <Ionicons
          name={icon}
          size={sizeStyles.iconSize}
          color={variantColors.iconColor}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: theme.layout.zIndex.modal,
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.elevation.lg,
  },
  disabled: {
    opacity: 0.6,
  },
});
