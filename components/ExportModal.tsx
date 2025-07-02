import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
} from 'react-native';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { exportService } from '@/services/export';
import { X, Download, FileText, Table } from 'lucide-react-native';
import { DatePicker } from '@/components/DatePicker';

interface ExportModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ExportModal({ visible, onClose }: ExportModalProps) {
  const theme = useTheme();
  const { expenses, categories, settings } = useExpenseStore();
  const [selectedFormat, setSelectedFormat] = useState<'pdf' | 'csv'>('pdf');
  const [useCustomRange, setUseCustomRange] = useState(false);
  const [startDate, setStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const [endDate, setEndDate] = useState(new Date());
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    
    try {
      let filteredExpenses = expenses;
      
      if (useCustomRange) {
        filteredExpenses = expenses.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate >= startDate && expenseDate <= endDate;
        });
      }

      let result: string | null = null;
      
      if (selectedFormat === 'pdf') {
        result = await exportService.exportToPDF(
          filteredExpenses,
          categories,
          settings.currency,
          useCustomRange ? { start: startDate, end: endDate } : undefined
        );
      } else {
        result = await exportService.exportToCSV(
          filteredExpenses,
          categories,
          settings.currency
        );
      }

      if (result) {
        Alert.alert(
          'Export Successful',
          `Your ${selectedFormat.toUpperCase()} file has been ${Platform.OS === 'web' ? 'downloaded' : 'shared'} successfully!`
        );
        onClose();
      } else {
        Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
      }
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Failed', 'There was an error exporting your data. Please try again.');
    } finally {
      setIsExporting(false);
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
      borderRadius: theme.borderRadius.xl,
      width: '90%',
      maxWidth: 400,
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
    formatContainer: {
      flexDirection: 'row',
      gap: theme.spacing.md,
    },
    formatButton: {
      flex: 1,
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.lg,
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.colors.border,
    },
    formatButtonActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    formatIcon: {
      marginBottom: theme.spacing.sm,
    },
    formatText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      color: theme.colors.text,
    },
    formatTextActive: {
      color: theme.colors.primary,
    },
    formatDescription: {
      fontSize: theme.typography.fontSize.xs,
      fontFamily: theme.typography.fontFamily.regular,
      color: theme.colors.textSecondary,
      textAlign: 'center',
      marginTop: theme.spacing.xs,
    },
    rangeToggle: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.lg,
      padding: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    rangeToggleActive: {
      borderColor: theme.colors.primary,
      backgroundColor: theme.colors.primary + '10',
    },
    rangeToggleText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.text,
      marginLeft: theme.spacing.sm,
    },
    rangeToggleTextActive: {
      color: theme.colors.primary,
    },
    dateRangeContainer: {
      marginTop: theme.spacing.md,
    },
    dateRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: theme.spacing.md,
    },
    dateLabel: {
      fontSize: theme.typography.fontSize.sm,
      fontFamily: theme.typography.fontFamily.medium,
      color: theme.colors.textSecondary,
      width: 60,
    },
    datePickerContainer: {
      flex: 1,
      marginLeft: theme.spacing.md,
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
    exportButton: {
      backgroundColor: theme.colors.primary,
      marginLeft: theme.spacing.sm,
    },
    exportButtonDisabled: {
      opacity: 0.5,
    },
    buttonText: {
      fontSize: theme.typography.fontSize.md,
      fontFamily: theme.typography.fontFamily.semiBold,
      marginLeft: theme.spacing.xs,
    },
    cancelButtonText: {
      color: theme.colors.text,
    },
    exportButtonText: {
      color: theme.colors.surface,
    },
  });

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Export Data</Text>
            <Pressable style={styles.closeButton} onPress={onClose}>
              <X size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Export Format</Text>
              <View style={styles.formatContainer}>
                <Pressable
                  style={[
                    styles.formatButton,
                    selectedFormat === 'pdf' && styles.formatButtonActive,
                  ]}
                  onPress={() => setSelectedFormat('pdf')}
                >
                  <FileText
                    size={32}
                    color={selectedFormat === 'pdf' ? theme.colors.primary : theme.colors.textSecondary}
                    style={styles.formatIcon}
                  />
                  <Text style={[
                    styles.formatText,
                    selectedFormat === 'pdf' && styles.formatTextActive,
                  ]}>
                    PDF
                  </Text>
                  <Text style={styles.formatDescription}>
                    Formatted report with charts
                  </Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.formatButton,
                    selectedFormat === 'csv' && styles.formatButtonActive,
                  ]}
                  onPress={() => setSelectedFormat('csv')}
                >
                  <Table
                    size={32}
                    color={selectedFormat === 'csv' ? theme.colors.primary : theme.colors.textSecondary}
                    style={styles.formatIcon}
                  />
                  <Text style={[
                    styles.formatText,
                    selectedFormat === 'csv' && styles.formatTextActive,
                  ]}>
                    CSV
                  </Text>
                  <Text style={styles.formatDescription}>
                    Spreadsheet compatible
                  </Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Date Range</Text>
              <Pressable
                style={[
                  styles.rangeToggle,
                  useCustomRange && styles.rangeToggleActive,
                ]}
                onPress={() => setUseCustomRange(!useCustomRange)}
              >
                <View style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: useCustomRange ? theme.colors.primary : theme.colors.border,
                  backgroundColor: useCustomRange ? theme.colors.primary : 'transparent',
                }} />
                <Text style={[
                  styles.rangeToggleText,
                  useCustomRange && styles.rangeToggleTextActive,
                ]}>
                  Custom Date Range
                </Text>
              </Pressable>

              {useCustomRange && (
                <View style={styles.dateRangeContainer}>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>From:</Text>
                    <View style={styles.datePickerContainer}>
                      <DatePicker date={startDate} onDateChange={setStartDate} />
                    </View>
                  </View>
                  <View style={styles.dateRow}>
                    <Text style={styles.dateLabel}>To:</Text>
                    <View style={styles.datePickerContainer}>
                      <DatePicker date={endDate} onDateChange={setEndDate} />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>

          <View style={styles.footer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
            </Pressable>
            <Pressable
              style={[
                styles.button,
                styles.exportButton,
                isExporting && styles.exportButtonDisabled,
              ]}
              onPress={handleExport}
              disabled={isExporting}
            >
              <Download size={16} color={theme.colors.surface} />
              <Text style={[styles.buttonText, styles.exportButtonText]}>
                {isExporting ? 'Exporting...' : 'Export'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}