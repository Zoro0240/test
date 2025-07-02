export interface Expense {
  id: string;
  amount: number;
  category: string;
  note?: string;
  tags: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  createdAt: Date;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: 'weekly' | 'monthly' | 'yearly';
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  name: string;
  count: number;
  lastUsed: Date;
}

export interface AppSettings {
  theme: 'light' | 'dark' | 'auto';
  currency: string;
  defaultCategories: boolean;
  notifications: boolean;
}

export interface DashboardData {
  totalExpenses: number;
  thisMonthExpenses: number;
  lastMonthExpenses: number;
  todayExpenses: number;
  categoryBreakdown: Array<{
    category: string;
    amount: number;
    percentage: number;
    color: string;
  }>;
  dailyTrend: Array<{
    date: string;
    amount: number;
  }>;
  topTags: Array<{
    name: string;
    count: number;
    amount: number;
  }>;
}