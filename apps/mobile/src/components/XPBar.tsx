import React from 'react';
import { View, Text, StyleSheet, useColorScheme } from 'react-native';
import { theme } from '../theme';

interface XPBarProps {
  currentXP: number;
  nextLevelXP: number;
  level: number;
  size?: 'sm' | 'md' | 'lg';
  showLabels?: boolean;
}

export const XPBar: React.FC<XPBarProps> = ({
  currentXP,
  nextLevelXP,
  level,
  size = 'md',
  showLabels = true,
}) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const currentLevelXP = (level - 1) * 1000;
  const progressXP = currentXP - currentLevelXP;
  const progressPercentage = Math.min((progressXP / 1000) * 100, 100);

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return {
          container: styles.containerSm,
          bar: styles.barSm,
          text: styles.textSm,
          label: styles.labelSm,
        };
      case 'lg':
        return {
          container: styles.containerLg,
          bar: styles.barLg,
          text: styles.textLg,
          label: styles.labelLg,
        };
      case 'md':
      default:
        return {
          container: styles.containerMd,
          bar: styles.barMd,
          text: styles.textMd,
          label: styles.labelMd,
        };
    }
  };

  const sizeStyles = getSizeStyles();

  return (
    <View style={sizeStyles.container}>
      {showLabels && (
        <View style={styles.labelContainer}>
          <Text style={[sizeStyles.label, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600] }]}>
            Level {level}
          </Text>
          <Text style={[sizeStyles.label, { color: isDark ? theme.colors.dark.neutral.gray[300] : theme.colors.neutral.gray[600] }]}>
            {progressXP.toLocaleString()} / 1,000 XP
          </Text>
        </View>
      )}
      
      <View
        style={[
          sizeStyles.bar,
          {
            backgroundColor: isDark ? theme.colors.dark.neutral.gray[700] : theme.colors.neutral.gray[200],
          },
        ]}
      >
        <View
          style={[
            styles.progressBar,
            {
              width: `${progressPercentage}%`,
              backgroundColor: theme.colors.semantic.info,
            },
          ]}
        />
      </View>
      
      {showLabels && (
        <Text style={[sizeStyles.text, { color: isDark ? theme.colors.dark.neutral.gray[400] : theme.colors.neutral.gray[500] }]}>
          {Math.round(progressPercentage)}% to Level {level + 1}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSm: {
    width: '100%',
  },
  containerMd: {
    width: '100%',
  },
  containerLg: {
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing[1],
  },
  barSm: {
    height: 4,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barMd: {
    height: 6,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  barLg: {
    height: 8,
    borderRadius: theme.borderRadius.full,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: theme.borderRadius.full,
  },
  textSm: {
    fontSize: theme.typography.fontSize.xs,
    marginTop: theme.spacing[1],
    textAlign: 'center',
  },
  textMd: {
    fontSize: theme.typography.fontSize.sm,
    marginTop: theme.spacing[1],
    textAlign: 'center',
  },
  textLg: {
    fontSize: theme.typography.fontSize.base,
    marginTop: theme.spacing[2],
    textAlign: 'center',
  },
  labelSm: {
    fontSize: theme.typography.fontSize.xs,
    fontWeight: theme.typography.fontWeight.medium,
  },
  labelMd: {
    fontSize: theme.typography.fontSize.sm,
    fontWeight: theme.typography.fontWeight.medium,
  },
  labelLg: {
    fontSize: theme.typography.fontSize.base,
    fontWeight: theme.typography.fontWeight.medium,
  },
});
