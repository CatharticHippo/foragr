import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { AnimatedButton } from './AnimatedButton';

interface EmptyStateProps {
  icon?: keyof typeof Ionicons.glyphMap;
  title: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  variant?: 'default' | 'compact' | 'minimal';
  style?: any;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = 'heart-outline',
  title,
  description,
  actionText,
  onAction,
  variant = 'default',
  style,
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: theme.animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: theme.animations.duration.normal,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getVariantStyles = () => {
    switch (variant) {
      case 'compact':
        return {
          padding: theme.spacing[4],
          iconSize: 32,
          titleSize: theme.typography.fontSize.lg,
          descriptionSize: theme.typography.fontSize.sm,
        };
      case 'minimal':
        return {
          padding: theme.spacing[2],
          iconSize: 24,
          titleSize: theme.typography.fontSize.base,
          descriptionSize: theme.typography.fontSize.xs,
        };
      default:
        return {
          padding: theme.spacing[8],
          iconSize: 48,
          titleSize: theme.typography.fontSize['2xl'],
          descriptionSize: theme.typography.fontSize.base,
        };
    }
  };

  const variantStyles = getVariantStyles();

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
          padding: variantStyles.padding,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        <Ionicons
          name={icon}
          size={variantStyles.iconSize}
          color={theme.colors.neutral.gray[400]}
          style={styles.icon}
        />
        
        <Text
          style={[
            styles.title,
            {
              fontSize: variantStyles.titleSize,
              color: theme.colors.neutral.gray[600],
            },
          ]}
        >
          {title}
        </Text>
        
        {description && (
          <Text
            style={[
              styles.description,
              {
                fontSize: variantStyles.descriptionSize,
                color: theme.colors.neutral.gray[500],
              },
            ]}
          >
            {description}
          </Text>
        )}
        
        {actionText && onAction && (
          <View style={styles.actionContainer}>
            <AnimatedButton
              title={actionText}
              onPress={onAction}
              variant="outline"
              size="md"
            />
          </View>
        )}
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    maxWidth: 280,
  },
  icon: {
    marginBottom: theme.spacing[4],
  },
  title: {
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing[2],
  },
  description: {
    textAlign: 'center',
    lineHeight: theme.typography.lineHeight.relaxed * theme.typography.fontSize.base,
    marginBottom: theme.spacing[6],
  },
  actionContainer: {
    marginTop: theme.spacing[2],
  },
});
