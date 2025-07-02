import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Modal, 
  TextInput, 
  Pressable,
  ScrollView,
  Alert 
} from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { Category } from '@/types/expense';
import { X, Save } from 'lucide-react-native';

interface AddBudgetModalProps {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
}

export function AddBudgetModal({ visible, onClose, categories }: AddBudgetModalProps) {
  const theme = useTheme();
  const { addBudget } = useExpenseStore();
  
  const [selectedCategory, setSelectedCategory] = useState('');
  const [amount, setAmount] = useState('');
  const [period, setPeriod] = useState<'weekly' | 'monthly' | 'yearly'>('monthly');
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (!selectedCategory || !amount) {
      Alert.alert('Error', 'Please select a category and enter an amount');
      return;
    }

    setIsLoading(true);
    
    try {
      await addBudget({
        categoryId: selectedCategory,
        amount: parseFloat(amount),
        period,
      });

      // Reset form
      setSelectedCategory('');
      setAmount('');
      setPeriod('monthly');
      onClose();
    } catch (error) {
      Alert.alert('Error', 'Failed to create budget');
    } finally {
      setIsLoading(false);
    }
  };

  const styles = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modal: {
      backgroundColor: theme.colors.background,
      borderRadius: theme.borderRadius.lg,
      width: '90%',
      maxHeight: '80%',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: theme.spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.border,
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: theme.colors.text,
    },
    closeButton: {
      padding: theme.spacing.sm,
    },
    content: {
      padding: theme.spacing.lg,
    },
    section: {
      marginBottom: theme.spacing.xl,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      fontSize: 16,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    categoryGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.xs,
    },
    categoryButton: {
      width: '48%',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      margin: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    categoryButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    categoryName: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
      textAlign: 'center',
    },
    categoryNameSelected: {
      color: theme.colors.primary,
    },
    periodContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },
    periodButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginHorizontal: theme.spacing.xs,
      borderWidth: 1,
      borderColor: theme.colors.border,
      alignItems: 'center',
    },
    periodButtonSelected: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    periodText: {
      fontSize: 14,
      fontWeight: '500',
      color: theme.colors.text,
    },
    periodTextSelected: {
      color: theme.colors.primary,
    },
    footer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: theme.spacing.lg,
      borderTopWidth: 1,
      borderTopColor: theme.colors.border,
    },
    button: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      borderRadius: theme.borderRadius.md,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    cancelButton: {
      backgroundColor: theme.colors.surface,
      borderWidth: 1,
      borderColor: theme.colors.border,
      marginRight: theme.spacing.sm,
    },
    saveButton: {
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    buttonText: {
      fontSize: 16,
      fontWeight: '600',
      marginLeft: theme.spacing.xs,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    saveButtonText: {
      color: 'white',
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Create Budget</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <View style={styles.categoryGrid}>
                {categories.map((category) => (
                  <Pressable
                    key={category.id}
                    style={[
                      styles.categoryButton,
                      selectedCategory === category.id && styles.categoryButtonSelected,
                    ]}
                    onPress={() => setSelectedCategory(category.id)}
                  >
                    <Text style={[
                      styles.categoryName,
                      selectedCategory === category.id && styles.categoryNameSelected,
                    ]}>
                      {category.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Budget Amount</Text>
              <TextInput
                style={styles.input}
                value={amount}
                onChangeText={setAmount}
                placeholder="Enter budget amount"
                placeholderTextColor={theme.colors.textSecondary}
                keyboardType="numeric"
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Period</Text>
              <View style={styles.periodContainer}>
                {(['weekly', 'monthly', 'yearly'] as const).map((periodOption) => (
                  <Pressable
                    key={periodOption}
                    style={[
                      styles.periodButton,
                      period === periodOption && styles.periodButtonSelected,
                    ]}
                    onPress={() => setPeriod(periodOption)}
                  >
                    <Text style={[
                      styles.periodText,
                      period === periodOption && styles.periodTextSelected,
                    ]}>
                      {periodOption.charAt(0).toUpperCase() + periodOption.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable 
              style={[styles.button, styles.saveButton, { opacity: isLoading ? 0.5 : 1 }]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              <Save size={16} color="white" />
              <Text style={[styles.buttonText, styles.saveButtonText]}>
                {isLoading ? 'Creating...' : 'Create Budget'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}