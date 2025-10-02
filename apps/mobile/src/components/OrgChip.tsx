import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, useColorScheme } from 'react-native';
import { theme, OrgColorKey } from '../theme';

interface OrgChipProps {
  id: string;
  name: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  selected?: boolean;
  onPress?: (orgId: string) => void;
  size?: 'sm' | 'md' | 'lg';
}

export const OrgChip: React.FC<OrgChipProps> = ({
  id,
  name,
  logoUrl,
  primaryColor,
  secondaryColor,
  selected = false,
  onPress,
  size = 'md',
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          text: styles.textSm,
          image: styles.imageSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          text: styles.textLg,
          image: styles.imageLg,
        };
      case 'md':
      default:
        return {
          container: styles.containerMd,
          text: styles.textMd,
          image: styles.imageMd,
        };
    }
  };

  const getOrgColors = () => {
    // Try to match organization to predefined colors
    const orgKey = name.toLowerCase().replace(/\s+/g, '');
    if (orgKey.includes('elk') || orgKey.includes('rmef')) {
      return theme.colors.org.rmef;
    } else if (orgKey.includes('ecology') || orgKey.includes('epi')) {
      return theme.colors.org.epi;
    } else if (orgKey.includes('foster') || orgKey.includes('foy')) {
      return theme.colors.org.foy;
    }
    
    // Fallback to provided colors or default
    return {
      primary: primaryColor || theme.colors.semantic.info,
      secondary: secondaryColor || theme.colors.semantic.info,
      background: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.gray[100],
    };
  };

  const sizeStyles = getSizeStyles();
  const orgColors = getOrgColors();

  const handlePress = () => {
    if (onPress) {
      onPress(id);
    }
  };

  return (
    <TouchableOpacity
      style={[
        sizeStyles.container,
        {
          backgroundColor: selected 
            ? orgColors.primary 
            : (isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.white),
          borderColor: selected 
            ? orgColors.primary 
            : (isDark ? theme.colors.dark.neutral.gray[600] : theme.colors.neutral.gray[300]),
          borderWidth: selected ? 2 : 1,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      {logoUrl && (
        <Image
          source={{ uri: logoUrl }}
          style={[
            sizeStyles.image,
            {
              tintColor: selected 
                ? theme.colors.neutral.white 
                : orgColors.primary,
            },
          ]}
          resizeMode="contain"
        />
      )}
      <Text
        style={[
          sizeStyles.text,
          {
            color: selected 
              ? theme.colors.neutral.white 
              : (isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700]),
          },
        ]}
        numberOfLines={1}
      >
        {name}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  containerSm: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing[1],
    marginBottom: 0,
  },
  containerMd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing[1],
    marginBottom: 0,
  },
  containerLg: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    marginRight: theme.spacing[2],
    marginBottom: 0,
  },
  textSm: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing[1],
  },
  textMd: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing[1],
  },
  textLg: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing[1],
  },
  imageSm: {
    width: 14,
    height: 14,
  },
  imageMd: {
    width: 16,
    height: 16,
  },
  imageLg: {
    width: 20,
    height: 20,
  },
});
