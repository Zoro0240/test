import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { useTheme } from '@/components/ThemeProvider';

const { width } = Dimensions.get('window');

interface ExpenseChartProps {
  data: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
}

export function ExpenseChart({ data }: ExpenseChartProps) {
  const theme = useTheme();

  const chartData = data.slice(0, 6).map(item => ({
    name: item.category,
    population: item.amount,
    color: item.color,
    legendFontColor: theme.colors.textSecondary,
    legendFontSize: theme.typography.fontSize.sm,
  }));

  const chartConfig = {
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientFromOpacity: 0,
    backgroundGradientTo: theme.colors.surface,
    backgroundGradientToOpacity: 0,
    color: (opacity = 1) => theme.colors.primary + Math.round(opacity * 255).toString(16),
    strokeWidth: 2,
    barPercentage: 0.5,
    useShadowColorFromDataset: false,
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    emptyState: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: theme.spacing.xl,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
    },
  });

  if (chartData.length === 0) {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyText}>
          No category data available
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <PieChart
        data={chartData}
        width={width - theme.spacing.lg * 4}
        height={220}
        chartConfig={chartConfig}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        center={[10, 0]}
        absolute
        hasLegend={true}
        style={{
          borderRadius: theme.borderRadius.lg,
        }}
      />
    </View>
  );
}