import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  ActivityIndicator,
} from 'react-native';
import { theme } from '../theme';

interface LoadingStateProps {
  message?: string;
  size?: 'small' | 'large';
  variant?: 'inline' | 'centered' | 'overlay';
  style?: any;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  size = 'large',
  variant = 'centered',
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'inline':
        return styles.inline;
      case 'centered':
        return styles.centered;
      case 'overlay':
        return styles.overlay;
      default:
        return styles.centered;
    }
  };

  return (
    <Animated.View
      style={[
        getVariantStyles(),
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
        style,
      ]}
    >
      <ActivityIndicator
        size={size}
        color={theme.colors.semantic.info}
        style={styles.spinner}
      />
      {message && (
        <Text style={[styles.message, { color: theme.colors.neutral.gray[600] }]}>
          {message}
        </Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  inline: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[4],
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing[8],
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.layout.zIndex.overlay,
  },
  spinner: {
    marginBottom: theme.spacing[2],
  },
  message: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
    textAlign: 'center',
  },
});
