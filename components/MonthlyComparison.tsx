import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { DashboardData } from '@/types/expense';
import { TrendingUp, TrendingDown, Minus, ArrowRight } from 'lucide-react-native';
import Animated, { FadeInLeft, FadeInRight } from 'react-native-reanimated';

interface MonthlyComparisonProps {
  data: DashboardData;
}

export function MonthlyComparison({ data }: MonthlyComparisonProps) {
  const theme = useTheme();
  const { settings } = useExpenseStore();

  const difference = data.thisMonthExpenses - data.lastMonthExpenses;
  const percentageChange = data.lastMonthExpenses > 0 
    ? (difference / data.lastMonthExpenses) * 100 
    : 0;

  const getTrendIcon = () => {
    if (difference > 0) {
      return <TrendingUp size={24} color={theme.colors.error} />;
    } else if (difference < 0) {
      return <TrendingDown size={24} color={theme.colors.success} />;
    } else {
      return <Minus size={24} color={theme.colors.textSecondary} />;
    }
  };

  const getTrendColor = () => {
    if (difference > 0) return theme.colors.error;
    if (difference < 0) return theme.colors.success;
    return theme.colors.textSecondary;
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    title: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xl,
    },
    comparisonContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.xl,
    },
    monthContainer: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
    monthLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    monthAmount: {
      fontSize: theme.typography.fontSize.xxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    arrowContainer: {
      alignItems: 'center',
      paddingHorizontal: theme.spacing.lg,
    },
    changeContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
    },
    changeText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.md,
    },
    changeSubtext: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.md,
    },
  });

  const getCurrentMonthName = () => {
    return new Date().toLocaleDateString('en-US', { month: 'short' });
  };

  const getLastMonthName = () => {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return lastMonth.toLocaleDateString('en-US', { month: 'short' });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Comparison</Text>
      
      <View style={styles.comparisonContainer}>
        <Animated.View entering={FadeInLeft.delay(100)} style={styles.monthContainer}>
          <Text style={styles.monthLabel}>{getLastMonthName()}</Text>
          <Text style={styles.monthAmount}>
            {settings.currency}{data.lastMonthExpenses.toFixed(0)}
          </Text>
        </Animated.View>

        <View style={styles.arrowContainer}>
          <ArrowRight size={20} color={theme.colors.textTertiary} />
        </View>

        <Animated.View entering={FadeInRight.delay(200)} style={styles.monthContainer}>
          <Text style={styles.monthLabel}>{getCurrentMonthName()}</Text>
          <Text style={styles.monthAmount}>
            {settings.currency}{data.thisMonthExpenses.toFixed(0)}
          </Text>
        </Animated.View>
      </View>

      <View style={styles.changeContainer}>
        {getTrendIcon()}
        <Text style={[styles.changeText, { color: getTrendColor() }]}>
          {settings.currency}{Math.abs(difference).toFixed(0)} ({Math.abs(percentageChange).toFixed(1)}%)
        </Text>
      </View>
      
      <Text style={styles.changeSubtext}>
        {difference > 0 ? 'More' : difference < 0 ? 'Less' : 'Same'} than last month
      </Text>
    </View>
  );
}