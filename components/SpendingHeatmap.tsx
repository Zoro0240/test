import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Expense } from '@/types/expense';

interface SpendingHeatmapProps {
  expenses: Expense[];
}

export function SpendingHeatmap({ expenses }: SpendingHeatmapProps) {
  const theme = useTheme();

  const generateHeatmapData = () => {
    const heatmapData: { [key: string]: number } = {};
    const maxAmount = Math.max(...expenses.map(e => e.amount));
    
    // Get last 35 days
    const today = new Date();
    for (let i = 34; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = date.toISOString().split('T')[0];
      
      const dayExpenses = expenses.filter(expense => {
        const expenseDate = new Date(expense.date).toISOString().split('T')[0];
        return expenseDate === dateKey;
      });
      
      const dayTotal = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
      heatmapData[dateKey] = dayTotal;
    }
    
    return { heatmapData, maxAmount };
  };

  const { heatmapData, maxAmount } = generateHeatmapData();

  const getIntensity = (amount: number) => {
    if (amount === 0) return 0;
    return Math.min(1, amount / (maxAmount * 0.8));
  };

  const getHeatmapColor = (intensity: number) => {
    if (intensity === 0) return theme.colors.borderLight;
    
    const baseColor = theme.colors.primary;
    const alpha = Math.max(0.1, intensity);
    return baseColor + Math.round(alpha * 255).toString(16).padStart(2, '0');
  };

  const styles = StyleSheet.create({
    container: {
      gap: theme.spacing.sm,
    },
    weekRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: theme.spacing.xs,
    },
    dayCell: {
      width: 32,
      height: 32,
      borderRadius: theme.borderRadius.sm,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.borderLight,
    },
    dayText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    legend: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: theme.spacing.md,
      gap: theme.spacing.sm,
    },
    legendText: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 2,
      marginHorizontal: 2,
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

  if (expenses.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          No spending data available for heatmap
        </Text>
      </View>
    );
  }

  const dates = Object.keys(heatmapData).sort();
  const weeks: string[][] = [];
  
  // Group dates into weeks
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <View style={styles.container}>
      {weeks.map((week, weekIndex) => (
        <View key={weekIndex} style={styles.weekRow}>
          {week.map((date) => {
            const amount = heatmapData[date];
            const intensity = getIntensity(amount);
            const backgroundColor = getHeatmapColor(intensity);
            const day = new Date(date).getDate();
            
            return (
              <View
                key={date}
                style={[
                  styles.dayCell,
                  { backgroundColor }
                ]}
              >
                <Text style={[
                  styles.dayText,
                  { 
                    color: intensity > 0.5 ? theme.colors.surface : theme.colors.text,
                    opacity: intensity === 0 ? 0.5 : 1,
                  }
                ]}>
                  {day}
                </Text>
              </View>
            );
          })}
        </View>
      ))}
      
      <View style={styles.legend}>
        <Text style={styles.legendText}>Less</Text>
        {[0, 0.25, 0.5, 0.75, 1].map((intensity, index) => (
          <View
            key={index}
            style={[
              styles.legendDot,
              { backgroundColor: getHeatmapColor(intensity) }
            ]}
          />
        ))}
        <Text style={styles.legendText}>More</Text>
      </View>
    </View>
  );
}