import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { ExpenseChart } from '@/components/ExpenseChart';
import { TrendChart } from '@/components/TrendChart';
import { CategoryAnalysis } from '@/components/CategoryAnalysis';
import { SpendingHeatmap } from '@/components/SpendingHeatmap';
import { ChartBar as BarChart3, ChartPie as PieChart, TrendingUp, Calendar, Filter } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function AnalyticsScreen() {
  const theme = useTheme();
  const { getDashboardData, getExpensesByDateRange, categories, settings } = useExpenseStore();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedChart, setSelectedChart] = useState<'pie' | 'trend' | 'category' | 'heatmap'>('pie');
  const [analyticsData, setAnalyticsData] = useState(getDashboardData());

  useEffect(() => {
    setAnalyticsData(getDashboardData());
  }, [getDashboardData, selectedPeriod]);

  const getDateRange = () => {
    const now = new Date();
    let startDate: Date;
    
    switch (selectedPeriod) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'quarter':
        startDate = new Date(now.getFullYear(), Math.floor(now.getMonth() / 3) * 3, 1);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    
    return { startDate, endDate: now };
  };

  const { startDate, endDate } = getDateRange();
  const periodExpenses = getExpensesByDateRange(startDate, endDate);
  const totalAmount = periodExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.md,
      paddingBottom: theme.spacing.lg,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxl,
      borderBottomRightRadius: theme.borderRadius.xxl,
      ...theme.shadows.md,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.xxxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    periodSelector: {
      flexDirection: 'row',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.xs,
    },
    periodButton: {
      flex: 1,
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
    },
    periodButtonActive: {
      backgroundColor: theme.colors.primary,
      ...theme.shadows.sm,
    },
    periodText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    periodTextActive: {
      color: theme.colors.surface,
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.lg,
    },
    summaryCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    summaryTitle: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    summaryAmount: {
      fontSize: theme.typography.fontSize.xxxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.primary,
      marginBottom: theme.spacing.xs,
    },
    summarySubtext: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    chartSelector: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: theme.spacing.lg,
    },
    chartButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.xs,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      ...theme.shadows.sm,
    },
    chartButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    chartButtonText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    chartButtonTextActive: {
      color: theme.colors.surface,
    },
    chartContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
  });

  const renderChart = () => {
    switch (selectedChart) {
      case 'pie':
        return <ExpenseChart data={analyticsData.categoryBreakdown} />;
      case 'trend':
        return <TrendChart data={analyticsData.dailyTrend} />;
      case 'category':
        return <CategoryAnalysis expenses={periodExpenses} categories={categories} />;
      case 'heatmap':
        return <SpendingHeatmap expenses={periodExpenses} />;
      default:
        return <ExpenseChart data={analyticsData.categoryBreakdown} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Analytics</Text>
        <View style={styles.periodSelector}>
          {(['week', 'month', 'quarter', 'year'] as const).map((period) => (
            <Pressable
              key={period}
              style={[
                styles.periodButton,
                selectedPeriod === period && styles.periodButtonActive,
              ]}
              onPress={() => setSelectedPeriod(period)}
            >
              <Text style={[
                styles.periodText,
                selectedPeriod === period && styles.periodTextActive,
              ]}>
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Total Spent ({selectedPeriod})
          </Text>
          <Text style={styles.summaryAmount}>
            {settings.currency}{totalAmount.toFixed(0)}
          </Text>
          <Text style={styles.summarySubtext}>
            {periodExpenses.length} transactions
          </Text>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.chartSelector}>
          <Pressable
            style={[
              styles.chartButton,
              selectedChart === 'pie' && styles.chartButtonActive,
            ]}
            onPress={() => setSelectedChart('pie')}
          >
            <PieChart 
              size={20} 
              color={selectedChart === 'pie' ? theme.colors.surface : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.chartButtonText,
              selectedChart === 'pie' && styles.chartButtonTextActive,
            ]}>
              Categories
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chartButton,
              selectedChart === 'trend' && styles.chartButtonActive,
            ]}
            onPress={() => setSelectedChart('trend')}
          >
            <TrendingUp 
              size={20} 
              color={selectedChart === 'trend' ? theme.colors.surface : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.chartButtonText,
              selectedChart === 'trend' && styles.chartButtonTextActive,
            ]}>
              Trends
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chartButton,
              selectedChart === 'category' && styles.chartButtonActive,
            ]}
            onPress={() => setSelectedChart('category')}
          >
            <BarChart3 
              size={20} 
              color={selectedChart === 'category' ? theme.colors.surface : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.chartButtonText,
              selectedChart === 'category' && styles.chartButtonTextActive,
            ]}>
              Analysis
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.chartButton,
              selectedChart === 'heatmap' && styles.chartButtonActive,
            ]}
            onPress={() => setSelectedChart('heatmap')}
          >
            <Calendar 
              size={20} 
              color={selectedChart === 'heatmap' ? theme.colors.surface : theme.colors.textSecondary} 
            />
            <Text style={[
              styles.chartButtonText,
              selectedChart === 'heatmap' && styles.chartButtonTextActive,
            ]}>
              Heatmap
            </Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>
            {selectedChart === 'pie' && 'Category Breakdown'}
            {selectedChart === 'trend' && 'Spending Trends'}
            {selectedChart === 'category' && 'Category Analysis'}
            {selectedChart === 'heatmap' && 'Spending Heatmap'}
          </Text>
          {renderChart()}
        </Animated.View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}