import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Expense } from '@/types/expense';
import * as Icons from 'lucide-react-native';

interface ExpenseItemProps {
  expense: Expense;
}

export function ExpenseItem({ expense }: ExpenseItemProps) {
  const theme = useTheme();
  const { categories, settings } = useExpenseStore();

  const category = categories.find(c => c.id === expense.category);

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

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    iconContainer: {
      width: 48,
      height: 48,
      borderRadius: 24,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: theme.spacing.md,
    },
    content: {
      flex: 1,
    },
    categoryName: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 2,
    },
    note: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: 4,
    },
    time: {
      fontSize: 12,
      color: theme.colors.textSecondary,
    },
    tags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: 4,
    },
    tag: {
      backgroundColor: theme.colors.primary + '20',
      paddingHorizontal: 6,
      paddingVertical: 2,
      borderRadius: 4,
      marginRight: 4,
      marginBottom: 2,
    },
    tagText: {
      fontSize: 10,
      color: theme.colors.primary,
      fontWeight: '500',
    },
    amount: {
      fontSize: 18,
      fontWeight: '700',
      color: theme.colors.primary,
    },
  });

  const IconComponent = getIconComponent(category?.icon || 'circle');

  return (
    <Pressable style={styles.container}>
      <View style={[
        styles.iconContainer,
        { backgroundColor: (category?.color || theme.colors.primary) + '20' }
      ]}>
        <IconComponent
          size={24}
          color={category?.color || theme.colors.primary}
        />
      </View>
      
      <View style={styles.content}>
        <Text style={styles.categoryName}>
          {category?.name || 'Unknown Category'}
        </Text>
        
        {expense.note && (
          <Text style={styles.note} numberOfLines={1}>
            {expense.note}
          </Text>
        )}
        
        <Text style={styles.time}>
          {formatTime(expense.date)}
        </Text>
        
        {expense.tags.length > 0 && (
          <View style={styles.tags}>
            {expense.tags.map((tag) => (
              <View key={tag} style={styles.tag}>
                <Text style={styles.tagText}>#{tag}</Text>
              </View>
            ))}
          </View>
        )}
      </View>
      
      <Text style={styles.amount}>
        {settings.currency}{expense.amount.toFixed(0)}
      </Text>
    </Pressable>
  );
}