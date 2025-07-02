export interface User {
  id: string;
  email: string;
  name: string;
  phoneNumber?: string;
  preferences: {
    currency: string;
    notifications: {
      whatsapp: boolean;
      push: boolean;
      email: boolean;
    };
    reminderFrequency: 'daily' | 'weekly' | 'monthly';
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface SyncData {
  expenses: any[];
  categories: any[];
  budgets: any[];
  tags: any[];
  settings: any;
  lastSync: Date;
}

export interface WhatsAppNotification {
  id: string;
  userId: string;
  type: 'daily_summary' | 'weekly_summary' | 'budget_alert' | 'bill_reminder';
  message: string;
  scheduledFor: Date;
  sent: boolean;
  sentAt?: Date;
}

export interface RecurringTransaction {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDue: Date;
  isActive: boolean;
  createdAt: Date;
}

export interface BillReminder {
  id: string;
  userId: string;
  title: string;
  amount: number;
  dueDate: Date;
  frequency: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
  category: string;
  isActive: boolean;
  reminderDays: number; // Days before due date to remind
}