import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { theme, OrgColorKey } from '../theme';

export type PinKind = 'EVENT' | 'NEWS' | 'PROJECT';

interface MapPinProps {
  kind: PinKind;
  title: string;
  orgName?: string;
  orgPrimaryColor?: string;
  size?: 'sm' | 'md' | 'lg';
  selected?: boolean;
  isCluster?: boolean;
}

export const MapPin: React.FC<MapPinProps> = ({
  kind,
  title,
  orgName,
  orgPrimaryColor,
  size = 'md',
  selected = false,
  isCluster = false,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getKindConfig = () => {
    switch (kind) {
      case 'EVENT':
        return {
          icon: '📅',
          color: theme.colors.semantic.info,
          backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white,
        };
      case 'NEWS':
        return {
          icon: '📰',
          color: theme.colors.semantic.warning,
          backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white,
        };
      case 'PROJECT':
        return {
          icon: '🚀',
          color: theme.colors.semantic.success,
          backgroundColor: isDark ? theme.colors.dark.neutral.gray[800] : theme.colors.neutral.white,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          icon: styles.iconSm,
          text: styles.textSm,
          orgText: styles.orgTextSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          icon: styles.iconLg,
          text: styles.textLg,
          orgText: styles.orgTextLg,
        };
      case 'md':
      default:
        return {
          container: styles.containerMd,
          icon: styles.iconMd,
          text: styles.textMd,
          orgText: styles.orgTextMd,
        };
    }
  };

  const config = getKindConfig();
  const sizeStyles = getSizeStyles();
  const pinColor = orgPrimaryColor || config.color;

  return (
    <View
      style={[
        sizeStyles.container,
        {
          backgroundColor: selected 
            ? pinColor 
            : (isCluster ? theme.colors.semantic.warning : config.backgroundColor),
          borderColor: selected 
            ? pinColor 
            : (isCluster ? theme.colors.semantic.warning : (isDark ? theme.colors.dark.neutral.gray[600] : theme.colors.neutral.gray[300])),
          borderWidth: selected ? 3 : (isCluster ? 3 : 2),
        },
      ]}
    >
      <Text style={[sizeStyles.icon, { color: selected || isCluster ? theme.colors.neutral.white : pinColor }]}>
        {isCluster ? '📍' : config.icon}
      </Text>
      <Text
        style={[
          sizeStyles.text,
          {
            color: selected || isCluster
              ? theme.colors.neutral.white 
              : (isDark ? theme.colors.dark.neutral.gray[200] : theme.colors.neutral.gray[700]),
          },
        ]}
        numberOfLines={2}
      >
        {title}
      </Text>
      {orgName && !isCluster && (
        <Text
          style={[
            sizeStyles.orgText,
            {
              color: selected 
                ? theme.colors.neutral.white 
                : (isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500]),
            },
          ]}
          numberOfLines={1}
        >
          {orgName}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSm: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[1],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.md,
    minWidth: 60,
    maxWidth: 100,
    shadowColor: theme.colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  containerMd: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.xl,
    minWidth: 100,
    maxWidth: 140,
    shadowColor: theme.colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  containerLg: {
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius['2xl'],
    minWidth: 120,
    maxWidth: 160,
    shadowColor: theme.colors.neutral.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  iconSm: {
    fontSize: theme.typography.fontSize.sm,
    marginBottom: theme.spacing[1],
  },
  iconMd: {
    fontSize: theme.typography.fontSize.base,
    marginBottom: theme.spacing[1],
  },
  iconLg: {
    fontSize: theme.typography.fontSize.lg,
    marginBottom: theme.spacing[2],
  },
  textSm: {
    fontSize: 10,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: 2,
  },
  textMd: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
  textLg: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    textAlign: 'center',
    marginBottom: theme.spacing[1],
  },
  orgTextSm: {
    fontSize: 8,
    fontWeight: theme.typography.fontWeight.normal,
    textAlign: 'center',
  },
  orgTextMd: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.normal,
    textAlign: 'center',
  },
  orgTextLg: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.normal,
    textAlign: 'center',
  },
});
