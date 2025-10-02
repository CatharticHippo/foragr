import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface ButtonProps {
  onPress: () => void;
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hapticFeedback?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  onPress,
  title,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  fullWidth = false,
  style,
  textStyle,
  hapticFeedback = true,
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const backgroundColor = useSharedValue(0);

  const getVariantColors = () => {
    switch (variant) {
      case 'primary':
        return {
          background: theme.colors.brand.primary,
          backgroundPressed: theme.colors.status.volunteer.dark,
          text: theme.colors.neutral.white,
          border: theme.colors.brand.primary,
        };
      case 'secondary':
        return {
          background: theme.colors.neutral.gray[100],
          backgroundPressed: theme.colors.neutral.gray[200],
          text: theme.colors.neutral.gray[900],
          border: theme.colors.neutral.gray[200],
        };
      case 'outline':
        return {
          background: 'transparent',
          backgroundPressed: theme.colors.brand.primary + '10',
          text: theme.colors.brand.primary,
          border: theme.colors.brand.primary,
        };
      case 'ghost':
        return {
          background: 'transparent',
          backgroundPressed: theme.colors.neutral.gray[100],
          text: theme.colors.neutral.gray[700],
          border: 'transparent',
        };
      case 'danger':
        return {
          background: theme.colors.semantic.error,
          backgroundPressed: '#B91C1C',
          text: theme.colors.neutral.white,
          border: theme.colors.semantic.error,
        };
      default:
        return {
          background: theme.colors.brand.primary,
          backgroundPressed: theme.colors.status.volunteer.dark,
          text: theme.colors.neutral.white,
          border: theme.colors.brand.primary,
        };
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
      backgroundColor: interpolateColor(
        backgroundColor.value,
        [0, 1],
        [getVariantColors().background, getVariantColors().backgroundPressed]
      ),
    };
  });

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          fontSize: theme.typography.fontSize.sm,
          minHeight: 36,
        };
      case 'md':
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          fontSize: theme.typography.fontSize.base,
          minHeight: 44,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[5],
          fontSize: theme.typography.fontSize.lg,
          minHeight: 52,
        };
      default:
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          fontSize: theme.typography.fontSize.base,
          minHeight: 44,
        };
    }
  };

  const handlePressIn = () => {
    if (disabled || loading) return;
    scale.value = withSpring(0.96, theme.animations.spring);
    opacity.value = withTiming(0.8, { duration: 100 });
    backgroundColor.value = withTiming(1, { duration: 100 });
    if (hapticFeedback) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch (error) {
        // Haptic feedback not available, continue silently
      }
    }
  };

  const handlePressOut = () => {
    if (disabled || loading) return;
    scale.value = withSpring(1, theme.animations.spring);
    opacity.value = withTiming(1, { duration: 100 });
    backgroundColor.value = withTiming(0, { duration: 100 });
  };

  const handlePress = () => {
    if (disabled || loading) return;
    onPress();
  };

  const variantColors = getVariantColors();
  const sizeStyles = getSizeStyles();

  return (
    <TouchableOpacity
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={1}
      disabled={disabled || loading}
      style={[
        fullWidth && styles.fullWidth,
        disabled && styles.disabled,
        style,
      ]}
    >
      <Animated.View
        style={[
          styles.button,
          {
            backgroundColor: variantColors.background,
            borderColor: variantColors.border,
            borderWidth: variant === 'outline' ? theme.borderWidth[1] : 0,
            borderRadius: theme.borderRadius.lg,
            ...sizeStyles,
          },
          animatedStyle,
        ]}
      >
        {loading ? (
          <ActivityIndicator 
            size="small" 
            color={variantColors.text} 
            style={styles.loadingIndicator}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <Animated.View style={styles.iconLeft}>
                {icon}
              </Animated.View>
            )}
            <Text
              style={[
                styles.buttonText,
                {
                  color: variantColors.text,
                  fontSize: sizeStyles.fontSize,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
            {icon && iconPosition === 'right' && (
              <Animated.View style={styles.iconRight}>
                {icon}
              </Animated.View>
            )}
          </>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    ...theme.elevation.sm,
  },
  buttonText: {
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  loadingIndicator: {
    marginRight: theme.spacing[2],
  },
  iconLeft: {
    marginRight: theme.spacing[2],
  },
  iconRight: {
    marginLeft: theme.spacing[2],
  },
});
