import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { apiService } from './api';

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

class NotificationService {
  private expoPushToken: string | null = null;

  async initialize() {
    if (Platform.OS === 'web') {
      console.log('Notifications not supported on web');
      return;
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        console.log('Failed to get push token for push notification!');
        return;
      }
      
      try {
        const token = await Notifications.getExpoPushTokenAsync({
          projectId: 'your-expo-project-id', // Replace with your actual project ID
        });
        this.expoPushToken = token.data;
        console.log('Expo push token:', token.data);
      } catch (error) {
        console.log('Error getting push token:', error);
      }
    } else {
      console.log('Must use physical device for Push Notifications');
    }

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  }

  async scheduleLocalNotification(title: string, body: string, trigger?: Notifications.NotificationTriggerInput) {
    if (Platform.OS === 'web') {
      console.log('Local notifications not supported on web');
      return;
    }

    try {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title,
          body,
          sound: 'default',
        },
        trigger: trigger || null,
      });
      return id;
    } catch (error) {
      console.log('Error scheduling notification:', error);
    }
  }

  async scheduleDailyReminder(hour: number = 20, minute: number = 0) {
    return this.scheduleLocalNotification(
      'Daily Expense Reminder',
      "Don't forget to log your expenses for today!",
      {
        hour,
        minute,
        repeats: true,
      }
    );
  }

  async scheduleWeeklyReport(dayOfWeek: number = 1, hour: number = 9, minute: number = 0) {
    return this.scheduleLocalNotification(
      'Weekly Expense Report',
      'Check out your weekly spending summary!',
      {
        weekday: dayOfWeek,
        hour,
        minute,
        repeats: true,
      }
    );
  }

  async scheduleBudgetAlert(categoryName: string, percentage: number) {
    const title = percentage >= 100 
      ? `Budget Exceeded!` 
      : `Budget Alert`;
    
    const body = percentage >= 100
      ? `You've exceeded your ${categoryName} budget by ${(percentage - 100).toFixed(1)}%`
      : `You've used ${percentage.toFixed(1)}% of your ${categoryName} budget`;

    return this.scheduleLocalNotification(title, body);
  }

  async cancelAllNotifications() {
    if (Platform.OS === 'web') return;
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async cancelNotification(notificationId: string) {
    if (Platform.OS === 'web') return;
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  }

  // WhatsApp notification via API
  async sendWhatsAppNotification(phoneNumber: string, message: string) {
    try {
      const response = await apiService.scheduleWhatsAppNotification({
        userId: 'current-user-id', // This should be the actual user ID
        type: 'daily_summary',
        message,
        scheduledFor: new Date(),
      });

      return response;
    } catch (error) {
      console.log('Error sending WhatsApp notification:', error);
      return { success: false, error: 'Failed to send WhatsApp notification' };
    }
  }

  async sendDailySummaryWhatsApp(phoneNumber: string, totalSpent: number, currency: string) {
    const message = `💰 Daily Expense Summary\n\nToday's spending: ${currency}${totalSpent.toFixed(2)}\n\nKeep tracking your expenses! 📊`;
    return this.sendWhatsAppNotification(phoneNumber, message);
  }

  async sendWeeklySummaryWhatsApp(phoneNumber: string, weeklyData: { total: number; categories: any[]; currency: string }) {
    const topCategory = weeklyData.categories[0];
    const message = `📊 Weekly Expense Report\n\nTotal spent: ${weeklyData.currency}${weeklyData.total.toFixed(2)}\nTop category: ${topCategory?.name || 'N/A'} (${weeklyData.currency}${topCategory?.amount?.toFixed(2) || '0'})\n\nStay on track with your budget! 🎯`;
    return this.sendWhatsAppNotification(phoneNumber, message);
  }

  async sendBudgetAlertWhatsApp(phoneNumber: string, categoryName: string, percentage: number, currency: string, spent: number, budget: number) {
    const emoji = percentage >= 100 ? '🚨' : percentage >= 80 ? '⚠️' : '📊';
    const status = percentage >= 100 ? 'EXCEEDED' : 'WARNING';
    
    const message = `${emoji} Budget ${status}\n\nCategory: ${categoryName}\nSpent: ${currency}${spent.toFixed(2)}\nBudget: ${currency}${budget.toFixed(2)}\nUsage: ${percentage.toFixed(1)}%\n\nTime to review your spending! 💡`;
    return this.sendWhatsAppNotification(phoneNumber, message);
  }
}

export const notificationService = new NotificationService();