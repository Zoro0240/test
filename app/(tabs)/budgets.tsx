import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { BudgetCard } from '@/components/BudgetCard';
import { AddBudgetModal } from '@/components/AddBudgetModal';
import { Plus, Target, TrendingUp, TriangleAlert as AlertTriangle } from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BudgetsScreen() {
  const theme = useTheme();
  const { budgets, categories, getBudgetProgress, settings } = useExpenseStore();
  const [showAddModal, setShowAddModal] = useState(false);

  const getTotalBudget = () => {
    return budgets.reduce((sum, budget) => sum + budget.amount, 0);
  };

  const getTotalSpent = () => {
    return budgets.reduce((sum, budget) => {
      const progress = getBudgetProgress(budget.id);
      return sum + progress.spent;
    }, 0);
  };

  const getOverBudgetCount = () => {
    return budgets.filter(budget => {
      const progress = getBudgetProgress(budget.id);
      return progress.percentage > 100;
    }).length;
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
    },
    addButton: {
      backgroundColor: theme.colors.primary,
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    overviewContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    overviewTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    overviewRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    overviewLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    overviewValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    warningContainer: {
      backgroundColor: theme.colors.warning + '10',
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginVertical: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.warning + '30',
      flexDirection: 'row',
      alignItems: 'center',
    },
    warningText: {
      color: theme.colors.warning,
      fontSize: 14,
      fontWeight: '500',
      marginLeft: theme.spacing.sm,
      flex: 1,
    },
    sectionTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
      marginTop: theme.spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyIcon: {
      marginBottom: theme.spacing.md,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    emptyText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginBottom: theme.spacing.lg,
    },
    emptyButton: {
      backgroundColor: theme.colors.primary,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    emptyButtonText: {
      color: 'white',
      fontWeight: '600',
      marginLeft: theme.spacing.sm,
    },
  });

  if (budgets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Budgets</Text>
          <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
            <Plus size={20} color="white" />
          </Pressable>
        </View>

        <View style={styles.emptyContainer}>
          <Target size={64} color={theme.colors.textSecondary} style={styles.emptyIcon} />
          <Text style={styles.emptyTitle}>No Budgets Yet</Text>
          <Text style={styles.emptyText}>
            Set up budgets to track your spending and stay on top of your finances
          </Text>
          <Pressable style={styles.emptyButton} onPress={() => setShowAddModal(true)}>
            <Plus size={16} color="white" />
            <Text style={styles.emptyButtonText}>Create Budget</Text>
          </Pressable>
        </View>

        <AddBudgetModal
          visible={showAddModal}
          onClose={() => setShowAddModal(false)}
          categories={categories}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budgets</Text>
        <Pressable style={styles.addButton} onPress={() => setShowAddModal(true)}>
          <Plus size={20} color="white" />
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.overviewContainer}>
          <Text style={styles.overviewTitle}>Overview</Text>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Budget</Text>
            <Text style={styles.overviewValue}>
              {settings.currency}{getTotalBudget().toFixed(0)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Total Spent</Text>
            <Text style={styles.overviewValue}>
              {settings.currency}{getTotalSpent().toFixed(0)}
            </Text>
          </View>
          <View style={styles.overviewRow}>
            <Text style={styles.overviewLabel}>Remaining</Text>
            <Text style={[
              styles.overviewValue,
              { color: getTotalBudget() - getTotalSpent() < 0 ? theme.colors.error : theme.colors.success }
            ]}>
              {settings.currency}{(getTotalBudget() - getTotalSpent()).toFixed(0)}
            </Text>
          </View>
        </Animated.View>

        {getOverBudgetCount() > 0 && (
          <Animated.View entering={FadeInDown.delay(200)} style={styles.warningContainer}>
            <AlertTriangle size={20} color={theme.colors.warning} />
            <Text style={styles.warningText}>
              {getOverBudgetCount()} budget{getOverBudgetCount() > 1 ? 's' : ''} exceeded
            </Text>
          </Animated.View>
        )}

        <Text style={styles.sectionTitle}>Your Budgets</Text>

        {budgets.map((budget, index) => {
          const category = categories.find(c => c.id === budget.categoryId);
          const progress = getBudgetProgress(budget.id);
          
          return (
            <Animated.View key={budget.id} entering={FadeInDown.delay(300 + index * 100)}>
              <BudgetCard
                budget={budget}
                category={category}
                progress={progress}
              />
            </Animated.View>
          );
        })}

        <View style={{ height: 100 }} />
      </ScrollView>

      <AddBudgetModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        categories={categories}
      />
    </SafeAreaView>
  );
}