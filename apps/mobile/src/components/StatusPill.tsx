import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { theme, StatusColorKey } from '../theme';

export type UserStatus = 'MEMBER' | 'VOLUNTEER' | 'DONOR';

interface StatusPillProps {
  status: UserStatus | string | undefined;
  verified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const StatusPill: React.FC<StatusPillProps> = ({
  status,
  verified = false,
  size = 'md',
  showIcon = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const getStatusConfig = () => {
    // Default to 'MEMBER' if status is undefined or invalid
    const validStatus = (status && typeof status === 'string') ? status.toUpperCase() as UserStatus : 'MEMBER';
    const statusKey = validStatus.toLowerCase() as StatusColorKey;
    const colors = isDark ? theme.colors.dark.status[statusKey] : theme.colors.status[statusKey];
    
    return {
      colors,
      label: validStatus.charAt(0) + validStatus.slice(1).toLowerCase(),
      icon: getStatusIcon(validStatus),
    };
  };

  const getStatusIcon = (status: UserStatus): string => {
    switch (status) {
      case 'DONOR':
        return '💰';
      case 'VOLUNTEER':
        return '🤝';
      case 'MEMBER':
      default:
        return '👤';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          text: styles.textSm,
          icon: styles.iconSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          text: styles.textLg,
          icon: styles.iconLg,
        };
      case 'md':
      default:
        return {
          container: styles.containerMd,
          text: styles.textMd,
          icon: styles.iconMd,
        };
    }
  };

  const config = getStatusConfig();
  const sizeStyles = getSizeStyles();

  return (
    <View
      style={[
        sizeStyles.container,
        {
          backgroundColor: config.colors.background,
          borderColor: config.colors.border,
        },
      ]}
    >
      {showIcon && (
        <Text style={[sizeStyles.icon, { color: config.colors.primary }]}>
          {config.icon}
        </Text>
      )}
      <Text
        style={[
          sizeStyles.text,
          { color: config.colors.primary },
        ]}
      >
        {config.label}
      </Text>
      {verified && (
        <Text style={[sizeStyles.icon, { color: config.colors.primary }]}>
          ✓
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSm: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[2],
    paddingVertical: theme.spacing[1],
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth[1],
  },
  containerMd: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[3],
    paddingVertical: theme.spacing[2],
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth[1],
  },
  containerLg: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing[4],
    paddingVertical: theme.spacing[3],
    borderRadius: theme.borderRadius.full,
    borderWidth: theme.borderWidth[2],
  },
  textSm: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
    marginLeft: theme.spacing[1],
  },
  textMd: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing[1],
  },
  textLg: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.semibold,
    marginLeft: theme.spacing[2],
  },
  iconSm: {
    fontSize: theme.typography.fontSize.xs,
  },
  iconMd: {
    fontSize: theme.typography.fontSize.sm,
  },
  iconLg: {
    fontSize: theme.typography.fontSize.base,
  },
});
