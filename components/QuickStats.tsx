import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { DashboardData } from '@/types/expense';
import { TrendingUp, TrendingDown, Calendar, Hash, Target, DollarSign, Zap } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface QuickStatsProps {
  data: DashboardData;
}

export function QuickStats({ data }: QuickStatsProps) {
  const theme = useTheme();
  const { settings, budgets } = useExpenseStore();

  const avgDailySpend = data.thisMonthExpenses / new Date().getDate();
  const mostExpensiveDay = data.dailyTrend.reduce((max, day) => 
    day.amount > max.amount ? day : max, data.dailyTrend[0] || { amount: 0, date: '' }
  );

  const stats = [
    {
      icon: <Calendar size={20} color={theme.colors.info} />,
      label: 'Daily Average',
      value: `${settings.currency}${avgDailySpend.toFixed(0)}`,
      subtitle: 'This month',
      color: theme.colors.info,
    },
    {
      icon: <TrendingUp size={20} color={theme.colors.warning} />,
      label: 'Highest Day',
      value: `${settings.currency}${mostExpensiveDay?.amount.toFixed(0) || 0}`,
      subtitle: 'Peak spending',
      color: theme.colors.warning,
    },
    {
      icon: <Hash size={20} color={theme.colors.accent} />,
      label: 'Active Tags',
      value: data.topTags.length.toString(),
      subtitle: 'In use',
      color: theme.colors.accent,
    },
    {
      icon: <Target size={20} color={theme.colors.primary} />,
      label: 'Budgets',
      value: budgets.length.toString(),
      subtitle: 'Set up',
      color: theme.colors.primary,
    },
  ];

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.xl,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.sm,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: '48%',
      marginHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.md,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      flex: 1,
    },
    statValue: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xl,
    },
    statSubtitle: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textTertiary,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <Animated.View 
            key={index} 
            entering={FadeInDown.delay(100 + index * 50)}
            style={styles.statCard}
          >
            <View style={styles.statHeader}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: stat.color + '15' }
              ]}>
                {stat.icon}
              </View>
            </View>
            <Text style={styles.statLabel}>{stat.label}</Text>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statSubtitle}>{stat.subtitle}</Text>
          </Animated.View>
        ))}
      </View>
    </View>
  );
}