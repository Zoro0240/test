import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { Category } from '@/types/expense';
import * as Icons from 'lucide-react-native';

interface CategoryPickerProps {
  selectedCategory: string;
  onSelectCategory: (categoryId: string) => void;
  categories: Category[];
}

export function CategoryPicker({ selectedCategory, onSelectCategory, categories }: CategoryPickerProps) {
  const theme = useTheme();

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

  const styles = StyleSheet.create({
    container: {
      marginBottom: theme.spacing.md,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: theme.spacing.md,
    },
    categoryItem: {
      width: '22%',
      aspectRatio: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderRadius: theme.borderRadius.xl,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: 'transparent',
      ...theme.shadows.sm,
    },
    categoryItemSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '15',
      transform: [{ scale: 1.05 }],
    },
    categoryIcon: {
      marginBottom: theme.spacing.xs,
    },
    categoryName: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
      lineHeight: theme.typography.lineHeight.tight * theme.typography.fontSize.xs,
    },
    categoryNameSelected: {
      color: theme.colors.primary,
      fontFamily: theme.typography.fontFamily.semiBold,
    },
  });

  return (
    <View style={styles.container}>
      <View style={styles.grid}>
        {categories.map((category) => {
          const IconComponent = getIconComponent(category.icon);
          const isSelected = selectedCategory === category.id;
          
          return (
            <Pressable
              key={category.id}
              style={[
                styles.categoryItem,
                isSelected && styles.categoryItemSelected,
              ]}
              onPress={() => onSelectCategory(category.id)}
            >
              <IconComponent
                size={22}
                color={isSelected ? theme.colors.primary : category.color}
                style={styles.categoryIcon}
              />
              <Text style={[
                styles.categoryName,
                isSelected && styles.categoryNameSelected,
              ]}>
                {category.name}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}