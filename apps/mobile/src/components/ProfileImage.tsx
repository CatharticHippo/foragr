import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ViewStyle,
} from 'react-native';
import { theme } from '../theme';

interface ProfileImageProps {
  imageUrl?: string;
  firstName?: string;
  lastName?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  borderColor?: string;
  borderWidth?: number;
  style?: ViewStyle;
}

export const ProfileImage: React.FC<ProfileImageProps> = ({
  imageUrl,
  firstName,
  lastName,
  size = 'lg',
  borderColor = theme.colors.semantic.info,
  borderWidth = 3,
  style,
}) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          width: 40,
          height: 40,
          borderRadius: 20,
          fontSize: theme.typography.fontSize.sm,
        };
      case 'md':
        return {
          width: 60,
          height: 60,
          borderRadius: 30,
          fontSize: theme.typography.fontSize.lg,
        };
      case 'lg':
        return {
          width: 100,
          height: 100,
          borderRadius: 50,
          fontSize: theme.typography.fontSize['2xl'],
        };
      case 'xl':
        return {
          width: 120,
          height: 120,
          borderRadius: 60,
          fontSize: theme.typography.fontSize['3xl'],
        };
      default:
        return {
          width: 100,
          height: 100,
          borderRadius: 50,
          fontSize: theme.typography.fontSize['2xl'],
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        styles.container,
        {
          width: sizeStyles.width + (borderWidth * 2),
          height: sizeStyles.height + (borderWidth * 2),
          borderRadius: sizeStyles.borderRadius + borderWidth,
          borderWidth,
          borderColor,
          ...theme.elevation.md,
        },
        style,
      ]}
    >
      {imageUrl ? (
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            {
              width: sizeStyles.width,
              height: sizeStyles.height,
              borderRadius: sizeStyles.borderRadius,
            },
          ]}
          resizeMode="cover"
        />
      ) : (
        <View
          style={[
            styles.placeholder,
            {
              width: sizeStyles.width,
              height: sizeStyles.height,
              borderRadius: sizeStyles.borderRadius,
              backgroundColor: borderColor,
            },
          ]}
        >
          <Text
            style={[
              styles.placeholderText,
              {
                fontSize: sizeStyles.fontSize,
                color: theme.colors.neutral.white,
              },
            ]}
          >
            {(firstName || 'U').charAt(0)}{(lastName || 'U').charAt(0)}
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.neutral.white,
  },
  image: {
    // Image styles applied via props
  },
  placeholder: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontWeight: theme.typography.fontWeight.bold,
    textAlign: 'center',
  },
});
