import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';

interface AnimatedButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  textStyle,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0.8,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const handlePressOut = () => {
    Animated.parallel([
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.colors.semantic.info,
          borderColor: theme.colors.semantic.info,
          textColor: theme.colors.neutral.white,
        };
      case 'secondary':
        return {
          backgroundColor: theme.colors.neutral.gray[100],
          borderColor: theme.colors.neutral.gray[200],
          textColor: theme.colors.neutral.gray[900],
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.colors.semantic.info,
          textColor: theme.colors.semantic.info,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
          textColor: theme.colors.semantic.info,
        };
      default:
        return {
          backgroundColor: theme.colors.semantic.info,
          borderColor: theme.colors.semantic.info,
          textColor: theme.colors.neutral.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          paddingVertical: theme.spacing[2],
          paddingHorizontal: theme.spacing[3],
          fontSize: theme.typography.fontSize.sm,
          minHeight: theme.layout.touchTarget.min,
        };
      case 'md':
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          fontSize: theme.typography.fontSize.base,
          minHeight: theme.layout.touchTarget.comfortable,
        };
      case 'lg':
        return {
          paddingVertical: theme.spacing[4],
          paddingHorizontal: theme.spacing[6],
          fontSize: theme.typography.fontSize.lg,
          minHeight: theme.layout.touchTarget.large,
        };
      default:
        return {
          paddingVertical: theme.spacing[3],
          paddingHorizontal: theme.spacing[4],
          fontSize: theme.typography.fontSize.base,
          minHeight: theme.layout.touchTarget.comfortable,
        };
    }
  };

  const variantStyles = getVariantStyles();
  const sizeStyles = getSizeStyles();

  return (
    <Animated.View
      style={[
        {
          transform: [{ scale: scaleAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <TouchableOpacity
        style={[
          styles.button,
          {
            backgroundColor: disabled ? theme.colors.neutral.gray[300] : variantStyles.backgroundColor,
            borderColor: disabled ? theme.colors.neutral.gray[300] : variantStyles.borderColor,
            borderWidth: variant === 'outline' ? 1 : 0,
            ...sizeStyles,
            ...theme.elevation[2],
          },
          style,
        ]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled || loading}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variantStyles.textColor}
          />
        ) : (
          <>
            {icon && <>{icon}</>}
            <Text
              style={[
                styles.text,
                {
                  color: disabled ? theme.colors.neutral.gray[500] : variantStyles.textColor,
                  fontSize: sizeStyles.fontSize,
                  fontWeight: theme.typography.fontWeight.semibold,
                },
                textStyle,
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.borderRadius.lg,
    gap: theme.spacing[2],
  },
  text: {
    textAlign: 'center',
  },
});
