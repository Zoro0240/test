import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { ExpenseItem } from '@/components/ExpenseItem';
import { CalendarPicker } from '@/components/CalendarPicker';
import { Calendar, Filter, Search } from 'lucide-react-native';
import { Expense } from '@/types/expense';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function TimelineScreen() {
  const theme = useTheme();
  const { expenses, settings } = useExpenseStore();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'day' | 'week' | 'month'>('day');
  const [filteredExpenses, setFilteredExpenses] = useState<Expense[]>([]);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    filterExpenses();
  }, [expenses, selectedDate, viewMode]);

  const filterExpenses = () => {
    let filtered: Expense[] = [];
    const now = new Date(selectedDate);

    switch (viewMode) {
      case 'day':
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getDate() === now.getDate() &&
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        });
        break;
      case 'week':
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startOfWeek && expenseDate <= endOfWeek;
        });
        break;
      case 'month':
        filtered = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === now.getMonth() &&
            expenseDate.getFullYear() === now.getFullYear()
          );
        });
        break;
    }

    setFilteredExpenses(filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  };

  const getTotalAmount = () => {
    return filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  const getDateRangeText = () => {
    const date = new Date(selectedDate);
    
    switch (viewMode) {
      case 'day':
        return date.toLocaleDateString('en-US', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      case 'week':
        const startOfWeek = new Date(date);
        startOfWeek.setDate(date.getDate() - date.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);
        return `${startOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${endOfWeek.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
      case 'month':
        return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
      default:
        return '';
    }
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    header: {
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 24,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: theme.spacing.sm,
    },
    viewModeContainer: {
      flexDirection: 'row',
      marginBottom: theme.spacing.md,
    },
    viewModeButton: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.md,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    viewModeButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    viewModeText: {
      color: theme.colors.text,
      fontWeight: '500',
    },
    viewModeTextActive: {
      color: 'white',
    },
    dateContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    dateText: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: '500',
    },
    totalContainer: {
      backgroundColor: theme.colors.surface,
      marginHorizontal: theme.spacing.lg,
      marginVertical: theme.spacing.md,
      padding: theme.spacing.lg,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    totalLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginBottom: theme.spacing.xs,
    },
    totalAmount: {
      fontSize: 28,
      fontWeight: '700',
      color: theme.colors.primary,
    },
    expenseCount: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: theme.spacing.xs,
    },
    listContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: theme.spacing.xxl,
    },
    emptyText: {
      fontSize: 16,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
    calendarButton: {
      padding: theme.spacing.sm,
    },
  });

  const renderExpenseItem = ({ item, index }: { item: Expense; index: number }) => (
    <Animated.View entering={FadeInDown.delay(index * 100)}>
      <ExpenseItem expense={item} />
    </Animated.View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Timeline</Text>
        
        <View style={styles.viewModeContainer}>
          {(['day', 'week', 'month'] as const).map((mode) => (
            <Pressable
              key={mode}
              style={[
                styles.viewModeButton,
                viewMode === mode && styles.viewModeButtonActive
              ]}
              onPress={() => setViewMode(mode)}
            >
              <Text style={[
                styles.viewModeText,
                viewMode === mode && styles.viewModeTextActive
              ]}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.dateContainer}>
          <Text style={styles.dateText}>{getDateRangeText()}</Text>
          <Pressable 
            style={styles.calendarButton}
            onPress={() => setShowCalendar(!showCalendar)}
          >
            <Calendar size={20} color={theme.colors.primary} />
          </Pressable>
        </View>
      </View>

      {showCalendar && (
        <CalendarPicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          expenses={expenses}
        />
      )}

      <View style={styles.totalContainer}>
        <Text style={styles.totalLabel}>Total Spent</Text>
        <Text style={styles.totalAmount}>
          {settings.currency}{getTotalAmount().toFixed(2)}
        </Text>
        <Text style={styles.expenseCount}>
          {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''}
        </Text>
      </View>

      <View style={styles.listContainer}>
        {filteredExpenses.length > 0 ? (
          <FlatList
            data={filteredExpenses}
            renderItem={renderExpenseItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 100 }}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              No expenses found for this {viewMode}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}