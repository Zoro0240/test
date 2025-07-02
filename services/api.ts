import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiResponse, SyncData, User, WhatsAppNotification, RecurringTransaction, BillReminder } from '@/types/api';

const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000/api' 
  : 'https://your-production-api.com/api';

class ApiService {
  private token: string | null = null;

  constructor() {
    this.initializeToken();
  }

  private async initializeToken() {
    this.token = await AsyncStorage.getItem('authToken');
  }

  private async getAuthHeaders() {
    if (!this.token) {
      this.token = await AsyncStorage.getItem('authToken');
    }
    return {
      'Authorization': `Bearer ${this.token}`,
      'Content-Type': 'application/json',
    };
  }

  // Auth Methods
  async login(email: string, password: string): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password,
      });
      
      if (response.data.success) {
        this.token = response.data.data.token;
        await AsyncStorage.setItem('authToken', this.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Login failed',
      };
    }
  }

  async register(userData: {
    email: string;
    password: string;
    name: string;
    phoneNumber?: string;
  }): Promise<ApiResponse<{ user: User; token: string }>> {
    try {
      const response = await axios.post(`${API_BASE_URL}/auth/register`, userData);
      
      if (response.data.success) {
        this.token = response.data.data.token;
        await AsyncStorage.setItem('authToken', this.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.data.data.user));
      }
      
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Registration failed',
      };
    }
  }

  async logout(): Promise<void> {
    this.token = null;
    await AsyncStorage.multiRemove(['authToken', 'user']);
  }

  // Data Sync Methods
  async syncData(localData: SyncData): Promise<ApiResponse<SyncData>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/sync`, localData, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Sync failed',
      };
    }
  }

  async fetchUserData(): Promise<ApiResponse<SyncData>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/user/data`, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch user data',
      };
    }
  }

  // WhatsApp Notifications
  async scheduleWhatsAppNotification(notification: Omit<WhatsAppNotification, 'id' | 'sent' | 'sentAt'>): Promise<ApiResponse<WhatsAppNotification>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/notifications/whatsapp`, notification, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to schedule notification',
      };
    }
  }

  async updateNotificationPreferences(preferences: any): Promise<ApiResponse<User>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.put(`${API_BASE_URL}/user/preferences`, preferences, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to update preferences',
      };
    }
  }

  // Recurring Transactions
  async createRecurringTransaction(transaction: Omit<RecurringTransaction, 'id' | 'userId' | 'createdAt'>): Promise<ApiResponse<RecurringTransaction>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/recurring-transactions`, transaction, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create recurring transaction',
      };
    }
  }

  async getRecurringTransactions(): Promise<ApiResponse<RecurringTransaction[]>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/recurring-transactions`, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch recurring transactions',
      };
    }
  }

  // Bill Reminders
  async createBillReminder(reminder: Omit<BillReminder, 'id' | 'userId'>): Promise<ApiResponse<BillReminder>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/bill-reminders`, reminder, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to create bill reminder',
      };
    }
  }

  async getBillReminders(): Promise<ApiResponse<BillReminder[]>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.get(`${API_BASE_URL}/bill-reminders`, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Failed to fetch bill reminders',
      };
    }
  }

  // Currency Exchange
  async getExchangeRates(baseCurrency: string = 'USD'): Promise<ApiResponse<{ [key: string]: number }>> {
    try {
      const response = await axios.get(`https://api.exchangerate-api.com/v4/latest/${baseCurrency}`);
      return {
        success: true,
        data: response.data.rates,
      };
    } catch (error: any) {
      return {
        success: false,
        error: 'Failed to fetch exchange rates',
      };
    }
  }

  // Export Data
  async exportData(format: 'pdf' | 'csv', dateRange?: { start: Date; end: Date }): Promise<ApiResponse<{ downloadUrl: string }>> {
    try {
      const headers = await this.getAuthHeaders();
      const response = await axios.post(`${API_BASE_URL}/export`, {
        format,
        dateRange,
      }, { headers });
      return response.data;
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || 'Export failed',
      };
    }
  }
}

export const apiService = new ApiService();