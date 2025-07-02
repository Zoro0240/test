import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Expense } from '@/types/expense';

interface CalendarPickerProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  expenses: Expense[];
}

export function CalendarPicker({ selectedDate, onDateSelect, expenses }: CalendarPickerProps) {
  const theme = useTheme();

  const getCurrentMonth = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();
    return { year, month };
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const getExpenseAmountForDate = (date: Date) => {
    return expenses
      .filter(expense => {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getDate() === date.getDate() &&
          expenseDate.getMonth() === date.getMonth() &&
          expenseDate.getFullYear() === date.getFullYear()
        );
      })
      .reduce((sum, expense) => sum + expense.amount, 0);
  };

  const { year, month } = getCurrentMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const styles = StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      margin: theme.spacing.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginBottom: theme.spacing.md,
    },
    monthText: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
    },
    weekDaysContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: theme.spacing.sm,
    },
    weekDay: {
      width: 40,
      textAlign: 'center',
      fontSize: 12,
      fontWeight: '500',
      color: theme.colors.textSecondary,
    },
    daysContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayButton: {
      width: '14.28%',
      aspectRatio: 1,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: theme.borderRadius.sm,
      marginBottom: 2,
    },
    dayButtonSelected: {
      backgroundColor: theme.colors.primary,
    },
    dayButtonWithExpenses: {
      backgroundColor: theme.colors.accent + '20',
    },
    dayText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    dayTextSelected: {
      color: 'white',
    },
    dayTextDisabled: {
      color: theme.colors.textSecondary,
    },
    expenseIndicator: {
      width: 4,
      height: 4,
      borderRadius: 2,
      backgroundColor: theme.colors.accent,
      marginTop: 2,
    },
  });

  const renderCalendarDays = () => {
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayButton} />
      );
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isSelected = 
        selectedDate.getDate() === day &&
        selectedDate.getMonth() === month &&
        selectedDate.getFullYear() === year;
      const expenseAmount = getExpenseAmountForDate(date);
      const hasExpenses = expenseAmount > 0;

      days.push(
        <Pressable
          key={day}
          style={[
            styles.dayButton,
            isSelected && styles.dayButtonSelected,
            !isSelected && hasExpenses && styles.dayButtonWithExpenses,
          ]}
          onPress={() => onDateSelect(date)}
        >
          <Text style={[
            styles.dayText,
            isSelected && styles.dayTextSelected,
          ]}>
            {day}
          </Text>
          {!isSelected && hasExpenses && (
            <View style={styles.expenseIndicator} />
          )}
        </Pressable>
      );
    }

    return days;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.monthText}>
          {monthNames[month]} {year}
        </Text>
      </View>

      <View style={styles.weekDaysContainer}>
        {weekDays.map((day) => (
          <Text key={day} style={styles.weekDay}>
            {day}
          </Text>
        ))}
      </View>

      <View style={styles.daysContainer}>
        {renderCalendarDays()}
      </View>
    </View>
  );
}