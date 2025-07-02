import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  Alert,
  ScrollView,
} from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { CategoryPicker } from '@/components/CategoryPicker';
import { DatePicker } from '@/components/DatePicker';
import { X, Save, Bell } from 'lucide-react-native';

interface BillReminderModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (reminder: any) => void;
}

export function BillReminderModal({ visible, onClose, onSave }: BillReminderModalProps) {
  const theme = useTheme();
  const { categories, settings } = useExpenseStore();
  
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    dueDate: new Date(),
    frequency: 'monthly' as 'monthly' | 'quarterly' | 'yearly' | 'one-time',
    reminderDays: '3',
  });

  const handleSave = () => {
    if (!formData.title || !formData.amount || !formData.category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    onSave({
      title: formData.title,
      amount: parseFloat(formData.amount),
      category: formData.category,
      dueDate: formData.dueDate,
      frequency: formData.frequency,
      reminderDays: parseInt(formData.reminderDays),
      isActive: true,
    });

    // Reset form
    setFormData({
      title: '',
      amount: '',
      category: '',
      dueDate: new Date(),
      frequency: 'monthly',
      reminderDays: '3',
    });
    onClose();
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
      borderRadius: theme.borderRadius.xl,
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
      fontSize: theme.typography.fontSize.xl,
      fontFamily: theme.typography.fontFamily.bold,
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
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    input: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.text,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    amountContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
    },
    currencyText: {
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      marginRight: theme.spacing.sm,
    },
    amountInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.lg,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    frequencyContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginHorizontal: -theme.spacing.xs,
    },
    frequencyButton: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      margin: theme.spacing.xs,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.colors.border,
      minWidth: '45%',
    },
    frequencyButtonActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    frequencyText: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
    },
    frequencyTextActive: {
      color: theme.colors.surface,
    },
    reminderContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      borderWidth: 1,
      borderColor: theme.colors.border,
      paddingHorizontal: theme.spacing.md,
    },
    reminderInput: {
      flex: 1,
      paddingVertical: theme.spacing.md,
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      textAlign: 'center',
    },
    reminderText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      marginLeft: theme.spacing.sm,
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
      borderRadius: theme.borderRadius.lg,
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
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.xs,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    saveButtonText: {
      color: theme.colors.surface,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Bill Reminder</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bill Title</Text>
              <TextInput
                style={styles.input}
                value={formData.title}
                onChangeText={(text) => setFormData({ ...formData, title: text })}
                placeholder="e.g., Electricity Bill"
                placeholderTextColor={theme.colors.textSecondary}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Amount</Text>
              <View style={styles.amountContainer}>
                <Text style={styles.currencyText}>{settings.currency}</Text>
                <TextInput
                  style={styles.amountInput}
                  value={formData.amount}
                  onChangeText={(text) => setFormData({ ...formData, amount: text })}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Category</Text>
              <CategoryPicker
                selectedCategory={formData.category}
                onSelectCategory={(category) => setFormData({ ...formData, category })}
                categories={categories}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Due Date</Text>
              <DatePicker
                date={formData.dueDate}
                onDateChange={(date) => setFormData({ ...formData, dueDate: date })}
              />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Frequency</Text>
              <View style={styles.frequencyContainer}>
                {(['one-time', 'monthly', 'quarterly', 'yearly'] as const).map((frequency) => (
                  <Pressable
                    key={frequency}
                    style={[
                      styles.frequencyButton,
                      formData.frequency === frequency && styles.frequencyButtonActive,
                    ]}
                    onPress={() => setFormData({ ...formData, frequency })}
                  >
                    <Text style={[
                      styles.frequencyText,
                      formData.frequency === frequency && styles.frequencyTextActive,
                    ]}>
                      {frequency === 'one-time' ? 'One Time' : frequency.charAt(0).toUpperCase() + frequency.slice(1)}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reminder</Text>
              <View style={styles.reminderContainer}>
                <TextInput
                  style={styles.reminderInput}
                  value={formData.reminderDays}
                  onChangeText={(text) => setFormData({ ...formData, reminderDays: text })}
                  keyboardType="numeric"
                />
                <Text style={styles.reminderText}>days before due date</Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <Bell size={16} color={theme.colors.surface} />
              <Text style={[styles.buttonText, styles.saveButtonText]}>Save Reminder</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}