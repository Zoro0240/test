import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Budget, Category } from '@/types/expense';
import { TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface BudgetCardProps {
  budget: Budget;
  category?: Category;
  progress: {
    spent: number;
    remaining: number;
    percentage: number;
  };
}

export function BudgetCard({ budget, category, progress }: BudgetCardProps) {
  const theme = useTheme();
  const { settings } = useExpenseStore();

  const getStatusIcon = () => {
    if (progress.percentage >= 100) {
      return <AlertTriangle size={20} color={theme.colors.error} />;
    } else if (progress.percentage >= 80) {
      return <Clock size={20} color={theme.colors.warning} />;
    } else {
      return <CheckCircle size={20} color={theme.colors.success} />;
    }
  };

  const getStatusColor = () => {
    if (progress.percentage >= 100) {
      return theme.colors.error;
    } else if (progress.percentage >= 80) {
      return theme.colors.warning;
    } else {
      return theme.colors.success;
    }
  };

  const getPeriodText = () => {
    switch (budget.period) {
      case 'weekly':
        return 'this week';
      case 'monthly':
        return 'this month';
      case 'yearly':
        return 'this year';
      default:
        return 'this period';
    }
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    categoryName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    period: {
      fontSize: 12,
      color: theme.colors.textSecondary,
      textTransform: 'capitalize',
    },
    statusContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    progressContainer: {
      marginBottom: theme.spacing.md,
    },
    progressBar: {
      height: 8,
      backgroundColor: theme.colors.border,
      borderRadius: 4,
      overflow: 'hidden',
      marginBottom: theme.spacing.sm,
    },
    progressFill: {
      height: '100%',
      borderRadius: 4,
    },
    progressText: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    amountContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    amountItem: {
      flex: 1,
      alignItems: 'center',
    },
    amountValue: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 2,
    },
    amountLabel: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    divider: {
      width: 1,
      height: 30,
      backgroundColor: theme.colors.border,
      marginHorizontal: theme.spacing.sm,
    },
  });

  return (
    <Pressable style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.categoryName}>
            {category?.name || 'Unknown Category'}
          </Text>
          <Text style={styles.period}>
            {getPeriodText()}
          </Text>
        </View>
        <View style={styles.statusContainer}>
          {getStatusIcon()}
        </View>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${Math.min(progress.percentage, 100)}%`,
                backgroundColor: getStatusColor(),
              },
            ]}
          />
        </View>
        <Text style={styles.progressText}>
          {progress.percentage.toFixed(1)}% used
        </Text>
      </View>

      <View style={styles.amountContainer}>
        <View style={styles.amountItem}>
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>
            {settings.currency}{progress.spent.toFixed(0)}
          </Text>
          <Text style={styles.amountLabel}>Spent</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.amountItem}>
          <Text style={[styles.amountValue, { color: theme.colors.text }]}>
            {settings.currency}{budget.amount.toFixed(0)}
          </Text>
          <Text style={styles.amountLabel}>Budget</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.amountItem}>
          <Text style={[
            styles.amountValue,
            { color: progress.remaining < 0 ? theme.colors.error : theme.colors.success }
          ]}>
            {settings.currency}{Math.abs(progress.remaining).toFixed(0)}
          </Text>
          <Text style={styles.amountLabel}>
            {progress.remaining < 0 ? 'Over' : 'Left'}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}