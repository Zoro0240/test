import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { router } from 'expo-router';
import { ArrowRight, Clock } from 'lucide-react-native';
import * as Icons from 'lucide-react-native';

export function RecentExpenses() {
  const theme = useTheme();
  const { expenses, categories, settings } = useExpenseStore();

  const recentExpenses = expenses
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 4);

  const getIconComponent = (iconName: string) => {
    const iconMap: { [key: string]: any } = {
      'utensils': Icons.Utensils,
      'car': Icons.Car,
      'shopping-bag': Icons.ShoppingBag,
      'receipt': Icons.Receipt,
      'film': Icons.Film,
      'heart': Icons.Heart,
      'book': Icons.Book,
      'plane': Icons.Plane,
      'home': Icons.Home,
      'gamepad': Icons.Gamepad2,
      'dumbbell': Icons.Dumbbell,
      'coffee': Icons.Coffee,
    };

    const IconComponent = iconMap[iconName] || Icons.Circle;
    return IconComponent;
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - new Date(date).getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.xl,
      padding: theme.spacing.lg,
      marginBottom: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
      ...theme.shadows.sm,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.lg,
    },
    headerTitle: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    viewAllButton: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.xs,
      paddingHorizontal: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      backgroundColor: theme.colors.surfaceVariant,
    },
    viewAllText: {
      color: theme.colors.primary,
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      marginRight: theme.spacing.xs,
    },
    expensesList: {
      gap: theme.spacing.sm,
    },
    expenseItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
    },
    iconContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    expenseContent: {
      flex: 1,
    },
    expenseCategory: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginBottom: 2,
    },
    expenseDetails: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    expenseNote: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      flex: 1,
      marginRight: theme.spacing.sm,
    },
    expenseTime: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textTertiary,
      flexDirection: 'row',
      alignItems: 'center',
    },
    expenseAmount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
      marginLeft: theme.spacing.md,
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.sm,
    },
  });

  if (recentExpenses.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.headerTitle}>Recent Expenses</Text>
        <View style={styles.emptyState}>
          <Clock size={32} color={theme.colors.textTertiary} />
          <Text style={styles.emptyText}>No expenses yet</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Recent Expenses</Text>
        <Pressable 
          style={styles.viewAllButton}
          onPress={() => router.push('/(tabs)/timeline')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ArrowRight size={14} color={theme.colors.primary} />
        </Pressable>
      </View>

      <View style={styles.expensesList}>
        {recentExpenses.map((expense) => {
          const category = categories.find(c => c.id === expense.category);
          const IconComponent = getIconComponent(category?.icon || 'circle');
          
          return (
            <View key={expense.id} style={styles.expenseItem}>
              <View style={[
                styles.iconContainer,
                { backgroundColor: (category?.color || theme.colors.primary) + '20' }
              ]}>
                <IconComponent
                  size={18}
                  color={category?.color || theme.colors.primary}
                />
              </View>
              
              <View style={styles.expenseContent}>
                <Text style={styles.expenseCategory}>
                  {category?.name || 'Unknown'}
                </Text>
                <View style={styles.expenseDetails}>
                  {expense.note && (
                    <Text style={styles.expenseNote} numberOfLines={1}>
                      {expense.note}
                    </Text>
                  )}
                  <Text style={styles.expenseTime}>
                    {formatTimeAgo(expense.date)}
                  </Text>
                </View>
              </View>
              
              <Text style={styles.expenseAmount}>
                {settings.currency}{expense.amount.toFixed(0)}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
}