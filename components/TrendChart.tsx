import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { useTheme } from '@/components/ThemeProvider';

const { width } = Dimensions.get('window');

interface TrendChartProps {
  data: Array<{
    date: string;
    amount: number;
  }>;
}

export function TrendChart({ data }: TrendChartProps) {
  const theme = useTheme();

  if (data.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
          No trend data available
        </Text>
      </View>
    );
  }

  const chartData = {
    labels: data.map(item => {
      const date = new Date(item.date);
      return date.getDate().toString();
    }),
    datasets: [
      {
        data: data.map(item => item.amount),
        color: (opacity = 1) => theme.colors.primary + Math.round(opacity * 255).toString(16),
        strokeWidth: 3,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: theme.colors.surface,
    backgroundGradientFrom: theme.colors.surface,
    backgroundGradientTo: theme.colors.surface,
    decimalPlaces: 0,
    color: (opacity = 1) => theme.colors.primary + Math.round(opacity * 255).toString(16),
    labelColor: (opacity = 1) => theme.colors.textSecondary + Math.round(opacity * 255).toString(16),
    style: {
      borderRadius: theme.borderRadius.lg,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: theme.colors.primary,
      fill: theme.colors.surface,
    },
    propsForBackgroundLines: {
      strokeDasharray: '',
      stroke: theme.colors.borderLight,
      strokeWidth: 1,
    },
  };

  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      height: 200,
    },
    emptyText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
    },
  });

  return (
    <View style={styles.container}>
      <LineChart
        data={chartData}
        width={width - 80}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={{
          marginVertical: 8,
          borderRadius: theme.borderRadius.lg,
        }}
        withInnerLines={true}
        withOuterLines={false}
        withVerticalLines={false}
        withHorizontalLines={true}
        withDots={true}
        withShadow={false}
      />
    </View>
  );
}