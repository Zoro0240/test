import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Expense, Category } from '@/types/expense';
import * as Icons from 'lucide-react-native';

interface CategoryAnalysisProps {
  expenses: Expense[];
  categories: Category[];
}

export function CategoryAnalysis({ expenses, categories }: CategoryAnalysisProps) {
  const theme = useTheme();
  const { settings } = useExpenseStore();

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

  const getCategoryAnalysis = () => {
    const categoryMap = new Map();
    
    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || { 
        amount: 0, 
        count: 0, 
        avgAmount: 0 
      };
      categoryMap.set(expense.category, {
        amount: current.amount + expense.amount,
        count: current.count + 1,
        avgAmount: (current.amount + expense.amount) / (current.count + 1),
      });
    });

    return Array.from(categoryMap.entries()).map(([categoryId, data]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category,
        ...data,
      };
    }).sort((a, b) => b.amount - a.amount);
  };

  const analysisData = getCategoryAnalysis();
  const totalAmount = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const styles = StyleSheet.create({
    container: {
      gap: theme.spacing.md,
    },
    categoryItem: {
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    categoryInfo: {
      flex: 1,
    },
    categoryName: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    categoryStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.md,
    },
    statText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    amountContainer: {
      alignItems: 'flex-end',
    },
    amount: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.bold,
      color: theme.colors.text,
    },
    percentage: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      padding: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (analysisData.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No category data available for this period
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {analysisData.map((item, index) => {
        const IconComponent = getIconComponent(item.category?.icon || 'circle');
        const percentage = totalAmount > 0 ? (item.amount / totalAmount) * 100 : 0;
        
        return (
          <View key={item.category?.id || index} style={styles.categoryItem}>
            <View style={[
              styles.iconContainer,
              { backgroundColor: (item.category?.color || theme.colors.primary) + '20' }
            ]}>
              <IconComponent
                size={20}
                color={item.category?.color || theme.colors.primary}
              />
            </View>
            
            <View style={styles.categoryInfo}>
              <Text style={styles.categoryName}>
                {item.category?.name || 'Unknown Category'}
              </Text>
              <View style={styles.categoryStats}>
                <Text style={styles.statText}>
                  {item.count} transaction{item.count !== 1 ? 's' : ''}
                </Text>
                <Text style={styles.statText}>
                  Avg: {settings.currency}{item.avgAmount.toFixed(0)}
                </Text>
              </View>
            </View>
            
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>
                {settings.currency}{item.amount.toFixed(0)}
              </Text>
              <Text style={styles.percentage}>
                {percentage.toFixed(1)}%
              </Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}