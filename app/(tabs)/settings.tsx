import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/components/ThemeProvider';
import { useExpenseStore } from '@/store/useExpenseStore';
import { AuthModal } from '@/components/AuthModal';
import { RecurringTransactionModal } from '@/components/RecurringTransactionModal';
import { BillReminderModal } from '@/components/BillReminderModal';
import { ExportModal } from '@/components/ExportModal';
import { notificationService } from '@/services/notifications';
import { apiService } from '@/services/api';
import { 
  Moon, 
  Sun, 
  Download, 
  Upload, 
  Trash2, 
  Bell, 
  DollarSign,
  Palette,
  Database,
  Info,
  ChevronRight,
  User,
  LogIn,
  LogOut,
  Repeat,
  Calendar,
  MessageSquare,
  Sync
} from 'lucide-react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function SettingsScreen() {
  const theme = useTheme();
  const { settings, updateSettings, exportData, importData, clearAllData, expenses } = useExpenseStore();
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRecurringModal, setShowRecurringModal] = useState(false);
  const [showBillReminderModal, setShowBillReminderModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);

  const handleExportData = async () => {
    setShowExportModal(true);
  };

  const handleSyncData = async () => {
    if (!isLoggedIn) {
      Alert.alert('Login Required', 'Please login to sync your data');
      return;
    }

    setIsLoading(true);
    try {
      const localData = {
        expenses,
        categories: [],
        budgets: [],
        tags: [],
        settings,
        lastSync: new Date(),
      };

      const response = await apiService.syncData(localData);
      if (response.success) {
        Alert.alert('Success', 'Data synced successfully');
      } else {
        Alert.alert('Sync Failed', response.error || 'Failed to sync data');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to sync data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearData = () => {
    Alert.alert(
      'Clear All Data',
      'This will permanently delete all your expenses, budgets, and settings. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            try {
              await clearAllData();
              Alert.alert('Success', 'All data has been cleared');
            } catch (error) {
              Alert.alert('Error', 'Failed to clear data');
            }
          }
        }
      ]
    );
  };

  const handleNotificationToggle = async (enabled: boolean) => {
    updateSettings({ notifications: enabled });
    
    if (enabled) {
      await notificationService.initialize();
      await notificationService.scheduleDailyReminder();
    } else {
      await notificationService.cancelAllNotifications();
    }
  };

  const handleWhatsAppToggle = async (enabled: boolean) => {
    if (enabled && !user?.phoneNumber) {
      Alert.alert(
        'Phone Number Required',
        'Please add your phone number in your profile to enable WhatsApp notifications'
      );
      return;
    }
    
    // Update user preferences via API
    if (isLoggedIn) {
      const response = await apiService.updateNotificationPreferences({
        whatsapp: enabled,
      });
      
      if (response.success) {
        Alert.alert('Success', `WhatsApp notifications ${enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  const handleLogin = (userData: any) => {
    setUser(userData);
    setIsLoggedIn(true);
  };

  const handleLogout = async () => {
    await apiService.logout();
    setUser(null);
    setIsLoggedIn(false);
  };

  const currencyOptions = ['₹', '$', '€', '£', '¥'];

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
    },
    scrollContainer: {
      flex: 1,
      paddingHorizontal: theme.spacing.lg,
    },
    section: {
      marginVertical: theme.spacing.md,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.md,
    },
    settingItem: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.sm,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    settingLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    settingIcon: {
      marginRight: theme.spacing.md,
    },
    settingText: {
      flex: 1,
    },
    settingTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: theme.colors.text,
    },
    settingDescription: {
      fontSize: 14,
      color: theme.colors.textSecondary,
      marginTop: 2,
    },
    themeOptions: {
      flexDirection: 'row',
      marginTop: theme.spacing.sm,
    },
    themeOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    themeOptionActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    themeOptionText: {
      color: theme.colors.text,
      fontSize: 14,
    },
    themeOptionTextActive: {
      color: 'white',
    },
    currencyOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginTop: theme.spacing.sm,
    },
    currencyOption: {
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.sm,
      borderRadius: theme.borderRadius.sm,
      marginRight: theme.spacing.sm,
      marginBottom: theme.spacing.sm,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    currencyOptionActive: {
      backgroundColor: theme.colors.primary,
      borderColor: theme.colors.primary,
    },
    currencyOptionText: {
      color: theme.colors.text,
      fontSize: 14,
    },
    currencyOptionTextActive: {
      color: 'white',
    },
    dangerButton: {
      backgroundColor: theme.colors.error + '10',
      borderColor: theme.colors.error + '30',
    },
    dangerText: {
      color: theme.colors.error,
    },
    statsContainer: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: theme.spacing.sm,
    },
    statsLabel: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
    statsValue: {
      fontSize: 16,
      fontWeight: '600',
      color: theme.colors.text,
    },
    userInfo: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.borderRadius.md,
      padding: theme.spacing.md,
      marginBottom: theme.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.border,
    },
    userName: {
      fontSize: 18,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: theme.spacing.xs,
    },
    userEmail: {
      fontSize: 14,
      color: theme.colors.textSecondary,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Settings</Text>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        <Animated.View entering={FadeInDown.delay(100)} style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          
          {isLoggedIn && user ? (
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.name}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
            </View>
          ) : null}

          <Pressable 
            style={styles.settingItem} 
            onPress={() => isLoggedIn ? handleLogout() : setShowAuthModal(true)}
          >
            <View style={styles.settingLeft}>
              {isLoggedIn ? (
                <LogOut size={20} color={theme.colors.error} style={styles.settingIcon} />
              ) : (
                <LogIn size={20} color={theme.colors.primary} style={styles.settingIcon} />
              )}
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, isLoggedIn && { color: theme.colors.error }]}>
                  {isLoggedIn ? 'Sign Out' : 'Sign In'}
                </Text>
                <Text style={styles.settingDescription}>
                  {isLoggedIn ? 'Sign out of your account' : 'Sync data across devices'}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          {isLoggedIn && (
            <Pressable style={styles.settingItem} onPress={handleSyncData}>
              <View style={styles.settingLeft}>
                <Sync size={20} color={theme.colors.primary} style={styles.settingIcon} />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Sync Data</Text>
                  <Text style={styles.settingDescription}>Backup and sync your data</Text>
                </View>
              </View>
              <ChevronRight size={20} color={theme.colors.textSecondary} />
            </Pressable>
          )}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200)} style={styles.section}>
          <Text style={styles.sectionTitle}>Appearance</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Palette size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Theme</Text>
                <Text style={styles.settingDescription}>Choose your preferred theme</Text>
                <View style={styles.themeOptions}>
                  {(['light', 'dark', 'auto'] as const).map((themeOption) => (
                    <Pressable
                      key={themeOption}
                      style={[
                        styles.themeOption,
                        settings.theme === themeOption && styles.themeOptionActive
                      ]}
                      onPress={() => updateSettings({ theme: themeOption })}
                    >
                      <Text style={[
                        styles.themeOptionText,
                        settings.theme === themeOption && styles.themeOptionTextActive
                      ]}>
                        {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <DollarSign size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Currency</Text>
                <Text style={styles.settingDescription}>Select your preferred currency</Text>
                <View style={styles.currencyOptions}>
                  {currencyOptions.map((currency) => (
                    <Pressable
                      key={currency}
                      style={[
                        styles.currencyOption,
                        settings.currency === currency && styles.currencyOptionActive
                      ]}
                      onPress={() => updateSettings({ currency })}
                    >
                      <Text style={[
                        styles.currencyOptionText,
                        settings.currency === currency && styles.currencyOptionTextActive
                      ]}>
                        {currency}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300)} style={styles.section}>
          <Text style={styles.sectionTitle}>Notifications</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Bell size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Push Notifications</Text>
                <Text style={styles.settingDescription}>Enable expense reminders</Text>
              </View>
            </View>
            <Switch
              value={settings.notifications}
              onValueChange={handleNotificationToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.primary + '30' }}
              thumbColor={settings.notifications ? theme.colors.primary : theme.colors.textSecondary}
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <MessageSquare size={20} color={theme.colors.success} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>WhatsApp Notifications</Text>
                <Text style={styles.settingDescription}>Get summaries via WhatsApp</Text>
              </View>
            </View>
            <Switch
              value={false} // This would come from user preferences
              onValueChange={handleWhatsAppToggle}
              trackColor={{ false: theme.colors.border, true: theme.colors.success + '30' }}
              thumbColor={false ? theme.colors.success : theme.colors.textSecondary}
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(400)} style={styles.section}>
          <Text style={styles.sectionTitle}>Automation</Text>
          
          <Pressable style={styles.settingItem} onPress={() => setShowRecurringModal(true)}>
            <View style={styles.settingLeft}>
              <Repeat size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Recurring Transactions</Text>
                <Text style={styles.settingDescription}>Set up automatic expenses</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem} onPress={() => setShowBillReminderModal(true)}>
            <View style={styles.settingLeft}>
              <Calendar size={20} color={theme.colors.warning} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Bill Reminders</Text>
                <Text style={styles.settingDescription}>Never miss a payment</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(500)} style={styles.section}>
          <Text style={styles.sectionTitle}>Data</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Total Expenses</Text>
              <Text style={styles.statsValue}>{expenses.length}</Text>
            </View>
            <View style={styles.statsRow}>
              <Text style={styles.statsLabel}>Storage Used</Text>
              <Text style={styles.statsValue}>
                {Math.round(JSON.stringify(expenses).length / 1024)} KB
              </Text>
            </View>
          </View>

          <Pressable style={styles.settingItem} onPress={handleExportData}>
            <View style={styles.settingLeft}>
              <Download size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Export Data</Text>
                <Text style={styles.settingDescription}>Download PDF or CSV reports</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>

          <Pressable style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Upload size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Import Data</Text>
                <Text style={styles.settingDescription}>Restore from backup</Text>
              </View>
            </View>
            <ChevronRight size={20} color={theme.colors.textSecondary} />
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600)} style={styles.section}>
          <Text style={styles.sectionTitle}>Danger Zone</Text>
          
          <Pressable 
            style={[styles.settingItem, styles.dangerButton]} 
            onPress={handleClearData}
          >
            <View style={styles.settingLeft}>
              <Trash2 size={20} color={theme.colors.error} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={[styles.settingTitle, styles.dangerText]}>Clear All Data</Text>
                <Text style={styles.settingDescription}>This action cannot be undone</Text>
              </View>
            </View>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(700)} style={styles.section}>
          <Text style={styles.sectionTitle}>About</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <Info size={20} color={theme.colors.primary} style={styles.settingIcon} />
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>Expense Tracker Pro</Text>
                <Text style={styles.settingDescription}>Version 2.0.0 - Enhanced with AI & WhatsApp</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={{ height: 50 }} />
      </ScrollView>

      <AuthModal
        visible={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onSuccess={handleLogin}
      />

      <RecurringTransactionModal
        visible={showRecurringModal}
        onClose={() => setShowRecurringModal(false)}
        onSave={(transaction) => {
          // Handle saving recurring transaction
          console.log('Recurring transaction:', transaction);
        }}
      />

      <BillReminderModal
        visible={showBillReminderModal}
        onClose={() => setShowBillReminderModal(false)}
        onSave={(reminder) => {
          // Handle saving bill reminder
          console.log('Bill reminder:', reminder);
        }}
      />

      <ExportModal
        visible={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </SafeAreaView>
  );
}