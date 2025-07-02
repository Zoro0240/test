import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { DashboardCard } from '@/components/DashboardCard';
import { ExpenseChart } from '@/components/ExpenseChart';
import { QuickStats } from '@/components/QuickStats';
import { RecentExpenses } from '@/components/RecentExpenses';
import { TagCloud } from '@/components/TagCloud';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { SpendingInsights } from '@/components/SpendingInsights';
import { MonthlyComparison } from '@/components/MonthlyComparison';
import { TrendingUp, TrendingDown, DollarSign, Calendar, Target, TriangleAlert as AlertTriangle, Sparkles } from 'lucide-react-native';
import Animated, { FadeInDown, FadeInRight, SlideInUp, FadeInUp } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const theme = useTheme();
  const { getDashboardData, settings, budgets, getBudgetProgress } = useExpenseStore();
  const [dashboardData, setDashboardData] = useState(getDashboardData());
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setDashboardData(getDashboardData());
    }, 1000);

    return () => clearInterval(interval);
  }, [getDashboardData]);

  const onRefresh = async () => {
    setRefreshing(true);
    setDashboardData(getDashboardData());
    setTimeout(() => setRefreshing(false), 1000);
  };

  const monthlyChange = dashboardData.thisMonthExpenses - dashboardData.lastMonthExpenses;
  const monthlyChangePercentage = dashboardData.lastMonthExpenses > 0 
    ? (monthlyChange / dashboardData.lastMonthExpenses) * 100 
    : 0;

  const overBudgetCount = budgets.filter(budget => {
    const progress = getBudgetProgress(budget.id);
    return progress.percentage > 100;
  }).length;

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
      paddingBottom: theme.spacing.xxl,
      backgroundColor: theme.colors.surface,
      borderBottomLeftRadius: theme.borderRadius.xxxl,
      borderBottomRightRadius: theme.borderRadius.xxxl,
      ...theme.shadows.lg,
    },
    headerTop: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: theme.spacing.lg,
    },
    greetingContainer: {
      flex: 1,
    },
    greeting: {
      fontSize: theme.typography.fontSize.xxxxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xxxxl,
    },
    subGreeting: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      lineHeight: theme.typography.lineHeight.normal * theme.typography.fontSize.md,
    },
    profileButton: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: theme.colors.primary + '15',
      justifyContent: 'center',
      alignItems: 'center',
      marginLeft: theme.spacing.md,
    },
    quickSummary: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginTop: theme.spacing.md,
    },
    summaryItem: {
      alignItems: 'center',
      flex: 1,
    },
    summaryValue: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    summaryLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    summaryDivider: {
      width: 1,
      height: 32,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.md,
    },
    scrollContainer: {
      paddingHorizontal: theme.spacing.lg,
      paddingTop: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.lg,
      marginTop: theme.spacing.xl,
    },
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.sm,
      marginBottom: theme.spacing.xl,
    },
    statCard: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      width: (width - theme.spacing.lg * 2 - theme.spacing.sm * 2) / 2,
      marginHorizontal: theme.spacing.sm,
      marginBottom: theme.spacing.md,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    statHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    statIcon: {
      marginRight: theme.spacing.sm,
    },
    statValue: {
      fontSize: theme.typography.fontSize.xxl,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
      lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xxl,
    },
    statLabel: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      textTransform: 'uppercase',
      letterSpacing: 0.5,
    },
    statChange: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: theme.spacing.xs,
    },
    chartContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.xl,
      marginBottom: theme.spacing.xl,
      ...theme.shadows.md,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    alertBanner: {
      backgroundColor: theme.colors.error + '10',
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.xl,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.error + '30',
    },
    alertText: {
      color: theme.colors.error,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      marginLeft: theme.spacing.md,
      flex: 1,
    },
  });

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View entering={SlideInUp.delay(100)} style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greetingContainer}>
            <Text style={styles.greeting}>
              {getGreeting()}
            </Text>
            <Text style={styles.subGreeting}>
              Here's your financial overview
            </Text>
          </View>
          <Pressable style={styles.profileButton}>
            <Sparkles size={24} color={theme.colors.primary} />
          </Pressable>
        </View>

        <Animated.View entering={FadeInUp.delay(200)} style={styles.quickSummary}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {settings.currency}{dashboardData.todayExpenses.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>Today</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {settings.currency}{dashboardData.thisMonthExpenses.toFixed(0)}
            </Text>
            <Text style={styles.summaryLabel}>This Month</Text>
          </View>
          
          <View style={styles.summaryDivider} />
          
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>
              {budgets.length}
            </Text>
            <Text style={styles.summaryLabel}>Budgets</Text>
          </View>
        </Animated.View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollContainer} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {overBudgetCount > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.alertBanner}>
            <AlertTriangle size={24} color={theme.colors.error} />
            <Text style={styles.alertText}>
              {overBudgetCount} budget{overBudgetCount > 1 ? 's' : ''} exceeded this month
            </Text>
          </Animated.View>
        )}

        <Animated.View entering={FadeInRight.delay(300)} style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <DollarSign size={20} color={theme.colors.primary} style={styles.statIcon} />
            </View>
            <Text style={styles.statLabel}>AVERAGE DAILY</Text>
            <Text style={styles.statValue}>
              {settings.currency}{(dashboardData.thisMonthExpenses / new Date().getDate()).toFixed(0)}
            </Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Calendar size={20} color={theme.colors.accent} style={styles.statIcon} />
            </View>
            <Text style={styles.statLabel}>THIS WEEK</Text>
            <Text style={styles.statValue}>
              {settings.currency}{dashboardData.dailyTrend.slice(-7).reduce((sum, day) => sum + day.amount, 0).toFixed(0)}
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              {monthlyChange >= 0 ? (
                <TrendingUp size={20} color={theme.colors.error} style={styles.statIcon} />
              ) : (
                <TrendingDown size={20} color={theme.colors.success} style={styles.statIcon} />
              )}
            </View>
            <Text style={styles.statLabel}>MONTHLY CHANGE</Text>
            <Text style={[
              styles.statValue,
              { color: monthlyChange >= 0 ? theme.colors.error : theme.colors.success }
            ]}>
              {Math.abs(monthlyChangePercentage).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <Target size={20} color={theme.colors.warning} style={styles.statIcon} />
            </View>
            <Text style={styles.statLabel}>CATEGORIES</Text>
            <Text style={styles.statValue}>
              {dashboardData.categoryBreakdown.length}
            </Text>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)}>
          <MonthlyComparison data={dashboardData} />
        </Animated.View>

        {dashboardData.categoryBreakdown.length > 0 && (
          <Animated.View entering={FadeInDown.delay(500)} style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>Spending by Category</Text>
            <ExpenseChart data={dashboardData.categoryBreakdown} />
          </Animated.View>
        )}

        <Animated.View entering={FadeInDown.delay(600)}>
          <Text style={styles.sectionTitle}>Quick Insights</Text>
          <QuickStats data={dashboardData} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)}>
          <SpendingInsights data={dashboardData} />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(800)}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          <RecentExpenses />
        </Animated.View>

        {dashboardData.topTags.length > 0 && (
          <Animated.View entering={FadeInDown.delay(900)}>
            <Text style={styles.sectionTitle}>Popular Tags</Text>
            <TagCloud tags={dashboardData.topTags} />
          </Animated.View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      <FloatingActionButton />
    </SafeAreaView>
  );
}