import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { router } from 'expo-router';
import { Plus, X, Coffee, ShoppingBag, Car, Zap } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withSpring, 
  interpolate,
  runOnJS 
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FloatingActionButton() {
  const theme = useTheme();
  const { settings, addExpense, categories } = useExpenseStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const animatedValue = useSharedValue(0);

  const quickActions = [
    { 
      amount: 100, 
      label: 'Coffee', 
      icon: Coffee, 
      category: 'Food',
      color: theme.colors.warning 
    },
    { 
      amount: 500, 
      label: 'Groceries', 
      icon: ShoppingBag, 
      category: 'Shopping',
      color: theme.colors.success 
    },
    { 
      amount: 200, 
      label: 'Transport', 
      icon: Car, 
      category: 'Transport',
      color: theme.colors.info 
    },
  ];

  const toggleExpanded = () => {
    const newValue = isExpanded ? 0 : 1;
    animatedValue.value = withSpring(newValue, {
      damping: 15,
      stiffness: 150,
    });
    
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    setTimeout(() => {
      setIsExpanded(!isExpanded);
    }, 50);
  };

  const handleQuickAdd = async (amount: number, note: string, categoryName: string) => {
    try {
      const category = categories.find(c => c.name === categoryName) || categories[0];
      
      await addExpense({
        amount,
        category: category.id,
        note,
        tags: ['quick-add'],
        date: new Date(),
      });

      if (Platform.OS !== 'web') {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }

      toggleExpanded();
    } catch (error) {
      console.error('Failed to add quick expense:', error);
    }
  };

  const fabStyle = useAnimatedStyle(() => {
    const rotation = interpolate(animatedValue.value, [0, 1], [0, 45]);
    const scale = interpolate(animatedValue.value, [0, 1], [1, 1.1]);
    
    return {
      transform: [{ rotate: `${rotation}deg` }, { scale }],
    };
  });

  const quickButtonStyle = (index: number) => useAnimatedStyle(() => {
    const translateY = interpolate(
      animatedValue.value, 
      [0, 1], 
      [0, -(70 + index * 75)]
    );
    const opacity = interpolate(animatedValue.value, [0, 0.3, 1], [0, 0, 1]);
    const scale = interpolate(animatedValue.value, [0, 1], [0.8, 1]);
    
    return {
      transform: [{ translateY }, { scale }],
      opacity,
    };
  });

  const overlayStyle = useAnimatedStyle(() => {
    const opacity = interpolate(animatedValue.value, [0, 1], [0, 0.3]);
    
    return {
      opacity,
      pointerEvents: animatedValue.value > 0 ? 'auto' : 'none',
    };
  });

  const styles = StyleSheet.create({
    container: {
      position: 'absolute',
      bottom: 100,
      right: theme.spacing.lg,
      alignItems: 'center',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'black',
      zIndex: 1,
    },
    fab: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: theme.colors.primary,
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 3,
      ...theme.shadows.xl,
    },
    quickButton: {
      position: 'absolute',
      backgroundColor: theme.colors.surface,
      paddingHorizontal: theme.spacing.lg,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.xl,
      borderWidth: 1,
      borderColor: theme.colors.border,
      zIndex: 2,
      flexDirection: 'row',
      alignItems: 'center',
      minWidth: 140,
      ...theme.shadows.lg,
    },
    quickButtonIcon: {
      marginRight: theme.spacing.md,
    },
    quickButtonContent: {
      alignItems: 'flex-start',
    },
    quickAmount: {
      color: theme.colors.text,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.bold,
    },
    quickLabel: {
      color: theme.colors.textSecondary,
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
    },
    quickAddIndicator: {
      position: 'absolute',
      top: -4,
      right: -4,
      backgroundColor: theme.colors.accent,
      borderRadius: 8,
      padding: 2,
    },
  });

  return (
    <>
      <Animated.View style={[StyleSheet.absoluteFillObject, styles.overlay, overlayStyle]}>
        <Pressable style={StyleSheet.absoluteFillObject} onPress={toggleExpanded} />
      </Animated.View>

      <View style={styles.container}>
        {/* Quick Add Buttons */}
        {quickActions.map((action, index) => (
          <AnimatedPressable
            key={action.label}
            style={[
              styles.quickButton,
              quickButtonStyle(index),
              { 
                right: 0,
              },
            ]}
            onPress={() => handleQuickAdd(action.amount, action.label, action.category)}
          >
            <action.icon 
              size={22} 
              color={action.color} 
              style={styles.quickButtonIcon}
            />
            <View style={styles.quickButtonContent}>
              <Text style={styles.quickAmount}>
                {settings.currency}{action.amount}
              </Text>
              <Text style={styles.quickLabel}>{action.label}</Text>
            </View>
            <View style={styles.quickAddIndicator}>
              <Zap size={12} color={theme.colors.surface} />
            </View>
          </AnimatedPressable>
        ))}

        {/* Main FAB */}
        <AnimatedPressable
          style={[styles.fab, fabStyle]}
          onPress={() => {
            if (isExpanded) {
              toggleExpanded();
            } else {
              router.push('/(tabs)/add');
            }
          }}
          onLongPress={toggleExpanded}
        >
          <Plus size={28} color={theme.colors.surface} strokeWidth={2.5} />
        </AnimatedPressable>
      </View>
    </>
  );
}

export { FloatingActionButton }