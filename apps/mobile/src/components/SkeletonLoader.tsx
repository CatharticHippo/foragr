import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, ViewStyle } from 'react-native';
import { theme } from '../theme';

interface SkeletonLoaderProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
  variant?: 'text' | 'rectangular' | 'circular';
}

export const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  width = '100%',
  height = 20,
  borderRadius = theme.borderRadius.md,
  style,
  variant = 'rectangular',
}) => {
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(animatedValue, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [animatedValue]);

  const getVariantStyles = () => {
    switch (variant) {
      case 'circular':
        return {
          width: height,
          height: height,
          borderRadius: height / 2,
        };
      case 'text':
        return {
          width,
          height,
          borderRadius: theme.borderRadius.sm,
        };
      case 'rectangular':
      default:
        return {
          width,
          height,
          borderRadius,
        };
    }
  };

  const animatedStyle = {
    opacity: animatedValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 0.7],
    }),
  };

  return (
    <Animated.View
      style={[
        styles.skeleton,
        getVariantStyles(),
        animatedStyle,
        style,
      ]}
    />
  );
};

interface SkeletonCardProps {
  style?: ViewStyle;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ style }) => (
  <View style={[styles.skeletonCard, style]}>
    <View style={styles.skeletonCardHeader}>
      <SkeletonLoader variant="circular" height={40} />
      <View style={styles.skeletonCardText}>
        <SkeletonLoader width="60%" height={16} />
        <SkeletonLoader width="40%" height={12} style={{ marginTop: 8 }} />
      </View>
    </View>
    <SkeletonLoader width="100%" height={14} style={{ marginTop: 16 }} />
    <SkeletonLoader width="80%" height={14} style={{ marginTop: 8 }} />
  </View>
);

interface SkeletonListProps {
  count?: number;
  style?: ViewStyle;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 3, style }) => (
  <View style={[styles.skeletonList, style]}>
    {Array.from({ length: count }).map((_, index) => (
      <SkeletonCard key={index} style={{ marginBottom: 16 }} />
    ))}
  </View>
);

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: theme.colors.neutral.gray[200],
  },
  skeletonCard: {
    backgroundColor: theme.colors.neutral.white,
    padding: theme.spacing[4],
    borderRadius: theme.borderRadius.lg,
    ...theme.elevation.sm,
  },
  skeletonCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing[3],
  },
  skeletonCardText: {
    flex: 1,
  },
  skeletonList: {
    padding: theme.spacing[4],
  },
});
