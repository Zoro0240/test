import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { DashboardData } from '@/types/expense';
import { Lightbulb, TrendingUp, Target, Calendar } from 'lucide-react-native';

interface SpendingInsightsProps {
  data: DashboardData;
}

export function SpendingInsights({ data }: SpendingInsightsProps) {
  const theme = useTheme();
  const { settings } = useExpenseStore();

  const generateInsights = () => {
    const insights = [];
    
    // Daily average insight
    const dailyAverage = data.thisMonthExpenses / new Date().getDate();
    if (dailyAverage > 0) {
      insights.push({
        icon: <Calendar size={16} color={theme.colors.info} />,
        text: `You spend an average of ${settings.currency}${dailyAverage.toFixed(0)} per day`,
        type: 'info' as const,
      });
    }

    // Top category insight
    if (data.categoryBreakdown.length > 0) {
      const topCategory = data.categoryBreakdown[0];
      insights.push({
        icon: <TrendingUp size={16} color={theme.colors.warning} />,
        text: `${topCategory.category} is your biggest expense (${topCategory.percentage.toFixed(0)}%)`,
        type: 'warning' as const,
      });
    }

    // Spending trend insight
    const recentTrend = data.dailyTrend.slice(-3);
    const isIncreasing = recentTrend.every((day, index) => 
      index === 0 || day.amount >= recentTrend[index - 1].amount
    );
    
    if (isIncreasing && recentTrend.length > 1) {
      insights.push({
        icon: <Target size={16} color={theme.colors.error} />,
        text: 'Your spending has been increasing over the last 3 days',
        type: 'error' as const,
      });
    }

    // Positive insight
    if (data.thisMonthExpenses < data.lastMonthExpenses) {
      const savings = data.lastMonthExpenses - data.thisMonthExpenses;
      insights.push({
        icon: <Lightbulb size={16} color={theme.colors.success} />,
        text: `Great job! You've saved ${settings.currency}${savings.toFixed(0)} compared to last month`,
        type: 'success' as const,
      });
    }

    return insights.slice(0, 3); // Show max 3 insights
  };

  const insights = generateInsights();

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.lg,
    },
    title: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    insightCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'flex-start',
      ...theme.shadows.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    insightIcon: {
      marginRight: theme.spacing.sm,
      marginTop: 2,
    },
    insightText: {
      flex: 1,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.sm,
    },
    emptyState: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xl,
      alignItems: 'center',
      ...theme.shadows.sm,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (insights.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Insights</Text>
        <View style={styles.emptyState}>
          <Lightbulb size={32} color={theme.colors.textTertiary} />
          <Text style={styles.emptyText}>
            Add more expenses to get personalized insights
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Insights</Text>
      {insights.map((insight, index) => (
        <View key={index} style={styles.insightCard}>
          <View style={styles.insightIcon}>
            {insight.icon}
          </View>
          <Text style={styles.insightText}>
            {insight.text}
          </Text>
        </View>
      ))}
    </View>
  );
}