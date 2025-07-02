const cron = require('node-cron');
const WhatsAppNotification = require('../models/WhatsAppNotification');
const User = require('../models/User');
const UserData = require('../models/UserData');
const BillReminder = require('../models/BillReminder');
const axios = require('axios');

// Send pending WhatsApp notifications every minute
cron.schedule('* * * * *', async () => {
  try {
    const pendingNotifications = await WhatsAppNotification.find({
      sent: false,
      scheduledFor: { $lte: new Date() },
      retryCount: { $lt: 3 },
    }).limit(10);

    for (const notification of pendingNotifications) {
      try {
        await sendWhatsAppMessage(notification);
      } catch (error) {
        console.error(`Failed to send notification ${notification._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Cron notification error:', error);
  }
});

// Send daily summaries at 8 PM
cron.schedule('0 20 * * *', async () => {
  try {
    const users = await User.find({
      'preferences.notifications.whatsapp': true,
      'preferences.reminderFrequency': 'daily',
      phoneNumber: { $exists: true, $ne: '' },
    });

    for (const user of users) {
      try {
        await sendDailySummary(user);
      } catch (error) {
        console.error(`Failed to send daily summary to user ${user._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Daily summary cron error:', error);
  }
});

// Send weekly summaries on Monday at 9 AM
cron.schedule('0 9 * * 1', async () => {
  try {
    const users = await User.find({
      'preferences.notifications.whatsapp': true,
      'preferences.reminderFrequency': 'weekly',
      phoneNumber: { $exists: true, $ne: '' },
    });

    for (const user of users) {
      try {
        await sendWeeklySummary(user);
      } catch (error) {
        console.error(`Failed to send weekly summary to user ${user._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Weekly summary cron error:', error);
  }
});

// Check bill reminders every hour
cron.schedule('0 * * * *', async () => {
  try {
    const now = new Date();
    const billReminders = await BillReminder.find({
      isActive: true,
      nextReminder: { $lte: now },
    }).populate('userId');

    for (const reminder of billReminders) {
      try {
        await sendBillReminder(reminder);
        
        // Update next reminder date
        const nextReminder = new Date(reminder.dueDate);
        nextReminder.setDate(nextReminder.getDate() - reminder.reminderDays);
        
        if (reminder.frequency !== 'one-time') {
          // Calculate next due date based on frequency
          const nextDue = new Date(reminder.dueDate);
          switch (reminder.frequency) {
            case 'monthly':
              nextDue.setMonth(nextDue.getMonth() + 1);
              break;
            case 'quarterly':
              nextDue.setMonth(nextDue.getMonth() + 3);
              break;
            case 'yearly':
              nextDue.setFullYear(nextDue.getFullYear() + 1);
              break;
          }
          reminder.dueDate = nextDue;
          reminder.nextReminder = new Date(nextDue);
          reminder.nextReminder.setDate(reminder.nextReminder.getDate() - reminder.reminderDays);
        } else {
          reminder.isActive = false;
        }
        
        reminder.lastReminded = now;
        await reminder.save();
      } catch (error) {
        console.error(`Failed to send bill reminder ${reminder._id}:`, error);
      }
    }
  } catch (error) {
    console.error('Bill reminder cron error:', error);
  }
});

async function sendWhatsAppMessage(notification) {
  const apiUrl = process.env.WHATSAPP_API_URL;
  const token = process.env.WHATSAPP_API_TOKEN;

  if (!apiUrl || !token) {
    throw new Error('WhatsApp API configuration missing');
  }

  const response = await axios.post(`${apiUrl}/messages/chat`, {
    token,
    to: notification.phoneNumber,
    body: notification.message,
  });

  if (response.data.sent) {
    notification.sent = true;
    notification.sentAt = new Date();
  } else {
    notification.error = response.data.message || 'Failed to send';
    notification.retryCount += 1;
  }

  await notification.save();
  return response.data;
}

async function sendDailySummary(user) {
  const userData = await UserData.findOne({ userId: user._id });
  if (!userData) return;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayExpenses = userData.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= today && expenseDate < tomorrow;
  });

  const totalSpent = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currency = user.preferences.currency || '₹';

  const message = `💰 Daily Expense Summary\n\nToday's spending: ${currency}${totalSpent.toFixed(2)}\nTransactions: ${todayExpenses.length}\n\nKeep tracking your expenses! 📊`;

  const notification = new WhatsAppNotification({
    userId: user._id,
    type: 'daily_summary',
    message,
    phoneNumber: user.phoneNumber,
    scheduledFor: new Date(),
  });

  await notification.save();
  await sendWhatsAppMessage(notification);
}

async function sendWeeklySummary(user) {
  const userData = await UserData.findOne({ userId: user._id });
  if (!userData) return;

  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const weekExpenses = userData.expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate >= weekAgo;
  });

  const totalSpent = weekExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const currency = user.preferences.currency || '₹';

  // Get top category
  const categoryTotals = {};
  weekExpenses.forEach(expense => {
    categoryTotals[expense.category] = (categoryTotals[expense.category] || 0) + expense.amount;
  });

  const topCategory = Object.entries(categoryTotals)
    .sort(([,a], [,b]) => b - a)[0];

  const topCategoryName = topCategory ? 
    userData.categories.find(c => c.id === topCategory[0])?.name || 'Unknown' : 
    'N/A';

  const message = `📊 Weekly Expense Report\n\nTotal spent: ${currency}${totalSpent.toFixed(2)}\nTransactions: ${weekExpenses.length}\nTop category: ${topCategoryName}\n\nStay on track with your budget! 🎯`;

  const notification = new WhatsAppNotification({
    userId: user._id,
    type: 'weekly_summary',
    message,
    phoneNumber: user.phoneNumber,
    scheduledFor: new Date(),
  });

  await notification.save();
  await sendWhatsAppMessage(notification);
}

async function sendBillReminder(reminder) {
  const user = reminder.userId;
  const daysUntilDue = Math.ceil((reminder.dueDate - new Date()) / (1000 * 60 * 60 * 24));
  const currency = user.preferences.currency || '₹';

  const message = `🔔 Bill Reminder\n\n${reminder.title}\nAmount: ${currency}${reminder.amount.toFixed(2)}\nDue in ${daysUntilDue} day${daysUntilDue !== 1 ? 's' : ''}\n\nDon't forget to pay! 💡`;

  const notification = new WhatsAppNotification({
    userId: user._id,
    type: 'bill_reminder',
    message,
    phoneNumber: user.phoneNumber,
    scheduledFor: new Date(),
  });

  await notification.save();
  await sendWhatsAppMessage(notification);
}

module.exports = {
  sendWhatsAppMessage,
  sendDailySummary,
  sendWeeklySummary,
  sendBillReminder,
};