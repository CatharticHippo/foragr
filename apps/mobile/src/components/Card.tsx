import React, { useRef } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'elevated' | 'outlined' | 'filled';
  padding?: keyof typeof theme.spacing;
  margin?: keyof typeof theme.spacing;
  borderRadius?: keyof typeof theme.borderRadius;
  pressable?: boolean;
  onPress?: () => void;
  style?: ViewStyle;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'elevated',
  padding = 4,
  margin = 0,
  borderRadius = 'lg',
  pressable = false,
  onPress,
  style,
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    if (pressable) {
      Animated.timing(scaleAnim, {
        toValue: 0.98,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }).start();
    }
  };

  const handlePressOut = () => {
    if (pressable) {
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: theme.animations.duration.fast,
        useNativeDriver: true,
      }).start();
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.colors.neutral.white,
          ...theme.elevation[2],
        };
      case 'outlined':
        return {
          backgroundColor: theme.colors.neutral.white,
          borderWidth: 1,
          borderColor: theme.colors.neutral.gray[200],
        };
      case 'filled':
        return {
          backgroundColor: theme.colors.neutral.gray[50],
        };
      default:
        return {
          backgroundColor: theme.colors.neutral.white,
          ...theme.elevation[2],
        };
    }
  };

  const cardContent = (
    <Animated.View
      style={[
        styles.card,
        {
          transform: [{ scale: scaleAnim }],
          padding: theme.spacing[padding],
          margin: theme.spacing[margin],
          borderRadius: theme.borderRadius[borderRadius],
          ...getVariantStyles(),
        },
        style,
      ]}
    >
      {children}
    </Animated.View>
  );

  if (pressable && onPress) {
    return (
      <TouchableOpacity
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.9}
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
