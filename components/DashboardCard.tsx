import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';

interface DashboardCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon?: React.ReactNode;
  color?: string;
  trend?: {
    value: string;
    isPositive: boolean;
    icon: React.ReactNode;
  };
}

export function DashboardCard({ title, value, subtitle, icon, color, trend }: DashboardCardProps) {
  const theme = useTheme();

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      marginRight: theme.spacing.sm,
    },
    title: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      flex: 1,
    },
    value: {
      fontSize: theme.typography.fontSize.xxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: color || theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xxl,
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    subtitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    trendContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    trendText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      marginLeft: theme.spacing.xs,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
      </View>
      
      <Text style={styles.value}>{value}</Text>
      
      <View style={styles.footer}>
        {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        {trend && (
          <View style={styles.trendContainer}>
            {trend.icon}
            <Text style={[
              styles.trendText,
              { color: trend.isPositive ? theme.colors.success : theme.colors.error }
            ]}>
              {trend.value}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}