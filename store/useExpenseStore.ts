import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense, Category, Budget, Tag, AppSettings, DashboardData } from '@/types/expense';

interface ExpenseStore {
  // State
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  tags: Tag[];
  settings: AppSettings;
  isLoading: boolean;
  
  // Actions
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateExpense: (id: string, expense: Partial<Expense>) => Promise<void>;
  deleteExpense: (id: string) => Promise<void>;
  
  addCategory: (category: Omit<Category, 'id' | 'createdAt'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  
  addBudget: (budget: Omit<Budget, 'id' | 'createdAt' | 'updatedAt'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  
  // Data operations
  loadData: () => Promise<void>;
  exportData: () => Promise<string>;
  importData: (data: string) => Promise<void>;
  clearAllData: () => Promise<void>;
  
  // Computed data
  getDashboardData: () => DashboardData;
  getExpensesByDateRange: (startDate: Date, endDate: Date) => Expense[];
  getCategoryExpenses: (categoryId: string, period?: 'week' | 'month' | 'year') => number;
  getBudgetProgress: (budgetId: string) => { spent: number; remaining: number; percentage: number };
  getSuggestedCategories: (amount: number, note?: string) => string[];
  getPopularTags: () => Tag[];
}

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', icon: 'utensils', color: '#EF4444', createdAt: new Date() },
  { id: '2', name: 'Transport', icon: 'car', color: '#3B82F6', createdAt: new Date() },
  { id: '3', name: 'Shopping', icon: 'shopping-bag', color: '#8B5CF6', createdAt: new Date() },
  { id: '4', name: 'Bills', icon: 'receipt', color: '#F59E0B', createdAt: new Date() },
  { id: '5', name: 'Entertainment', icon: 'film', color: '#10B981', createdAt: new Date() },
  { id: '6', name: 'Health', icon: 'heart', color: '#EC4899', createdAt: new Date() },
  { id: '7', name: 'Education', icon: 'book', color: '#6366F1', createdAt: new Date() },
  { id: '8', name: 'Travel', icon: 'plane', color: '#14B8A6', createdAt: new Date() },
];

const defaultSettings: AppSettings = {
  theme: 'auto',
  currency: '₹',
  defaultCategories: true,
  notifications: true,
};

export const useExpenseStore = create<ExpenseStore>((set, get) => ({
  expenses: [],
  categories: defaultCategories,
  budgets: [],
  tags: [],
  settings: defaultSettings,
  isLoading: false,

  addExpense: async (expenseData) => {
    const id = Date.now().toString();
    const now = new Date();
    const expense: Expense = {
      ...expenseData,
      id,
      date: new Date(expenseData.date),
      createdAt: now,
      updatedAt: now,
    };

    const expenses = [...get().expenses, expense];
    set({ expenses });
    
    // Update tags
    const existingTags = get().tags;
    const updatedTags = [...existingTags];
    
    expense.tags.forEach(tagName => {
      const existingTag = updatedTags.find(t => t.name === tagName);
      if (existingTag) {
        existingTag.count++;
        existingTag.lastUsed = now;
      } else {
        updatedTags.push({
          id: Date.now().toString() + Math.random(),
          name: tagName,
          count: 1,
          lastUsed: now,
        });
      }
    });
    
    set({ tags: updatedTags });
    await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
    await AsyncStorage.setItem('tags', JSON.stringify(updatedTags));
  },

  updateExpense: async (id, expenseData) => {
    const expenses = get().expenses.map(expense =>
      expense.id === id
        ? { ...expense, ...expenseData, updatedAt: new Date() }
        : expense
    );
    set({ expenses });
    await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
  },

  deleteExpense: async (id) => {
    const expenses = get().expenses.filter(expense => expense.id !== id);
    set({ expenses });
    await AsyncStorage.setItem('expenses', JSON.stringify(expenses));
  },

  addCategory: async (categoryData) => {
    const id = Date.now().toString();
    const category: Category = {
      ...categoryData,
      id,
      createdAt: new Date(),
    };
    const categories = [...get().categories, category];
    set({ categories });
    await AsyncStorage.setItem('categories', JSON.stringify(categories));
  },

  updateCategory: async (id, categoryData) => {
    const categories = get().categories.map(category =>
      category.id === id ? { ...category, ...categoryData } : category
    );
    set({ categories });
    await AsyncStorage.setItem('categories', JSON.stringify(categories));
  },

  deleteCategory: async (id) => {
    const categories = get().categories.filter(category => category.id !== id);
    set({ categories });
    await AsyncStorage.setItem('categories', JSON.stringify(categories));
  },

  addBudget: async (budgetData) => {
    const id = Date.now().toString();
    const now = new Date();
    const budget: Budget = {
      ...budgetData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    const budgets = [...get().budgets, budget];
    set({ budgets });
    await AsyncStorage.setItem('budgets', JSON.stringify(budgets));
  },

  updateBudget: async (id, budgetData) => {
    const budgets = get().budgets.map(budget =>
      budget.id === id
        ? { ...budget, ...budgetData, updatedAt: new Date() }
        : budget
    );
    set({ budgets });
    await AsyncStorage.setItem('budgets', JSON.stringify(budgets));
  },

  deleteBudget: async (id) => {
    const budgets = get().budgets.filter(budget => budget.id !== id);
    set({ budgets });
    await AsyncStorage.setItem('budgets', JSON.stringify(budgets));
  },

  updateSettings: async (settingsData) => {
    const settings = { ...get().settings, ...settingsData };
    set({ settings });
    await AsyncStorage.setItem('settings', JSON.stringify(settings));
  },

  loadData: async () => {
    set({ isLoading: true });
    try {
      const [expensesData, categoriesData, budgetsData, tagsData, settingsData] = await Promise.all([
        AsyncStorage.getItem('expenses'),
        AsyncStorage.getItem('categories'),
        AsyncStorage.getItem('budgets'),
        AsyncStorage.getItem('tags'),
        AsyncStorage.getItem('settings'),
      ]);

      set({
        expenses: expensesData ? JSON.parse(expensesData).map((e: any) => ({
          ...e,
          date: new Date(e.date),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
        })) : [],
        categories: categoriesData ? JSON.parse(categoriesData).map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })) : defaultCategories,
        budgets: budgetsData ? JSON.parse(budgetsData).map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        })) : [],
        tags: tagsData ? JSON.parse(tagsData).map((t: any) => ({
          ...t,
          lastUsed: new Date(t.lastUsed),
        })) : [],
        settings: settingsData ? JSON.parse(settingsData) : defaultSettings,
      });
    } catch (error) {
      console.error('Error loading data:', error);
    }
    set({ isLoading: false });
  },

  exportData: async () => {
    const { expenses, categories, budgets, tags, settings } = get();
    const data = {
      expenses,
      categories,
      budgets,
      tags,
      settings,
      exportDate: new Date().toISOString(),
    };
    return JSON.stringify(data);
  },

  importData: async (data) => {
    try {
      const parsedData = JSON.parse(data);
      set({
        expenses: parsedData.expenses?.map((e: any) => ({
          ...e,
          date: new Date(e.date),
          createdAt: new Date(e.createdAt),
          updatedAt: new Date(e.updatedAt),
        })) || [],
        categories: parsedData.categories?.map((c: any) => ({
          ...c,
          createdAt: new Date(c.createdAt),
        })) || defaultCategories,
        budgets: parsedData.budgets?.map((b: any) => ({
          ...b,
          createdAt: new Date(b.createdAt),
          updatedAt: new Date(b.updatedAt),
        })) || [],
        tags: parsedData.tags?.map((t: any) => ({
          ...t,
          lastUsed: new Date(t.lastUsed),
        })) || [],
        settings: parsedData.settings || defaultSettings,
      });
      
      // Save to AsyncStorage
      await Promise.all([
        AsyncStorage.setItem('expenses', JSON.stringify(parsedData.expenses || [])),
        AsyncStorage.setItem('categories', JSON.stringify(parsedData.categories || defaultCategories)),
        AsyncStorage.setItem('budgets', JSON.stringify(parsedData.budgets || [])),
        AsyncStorage.setItem('tags', JSON.stringify(parsedData.tags || [])),
        AsyncStorage.setItem('settings', JSON.stringify(parsedData.settings || defaultSettings)),
      ]);
    } catch (error) {
      throw new Error('Invalid data format');
    }
  },

  clearAllData: async () => {
    set({
      expenses: [],
      categories: defaultCategories,
      budgets: [],
      tags: [],
      settings: defaultSettings,
    });
    await AsyncStorage.multiRemove(['expenses', 'categories', 'budgets', 'tags', 'settings']);
  },

  getDashboardData: () => {
    const { expenses, categories } = get();
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const thisMonthExpenses = expenses
      .filter(expense => expense.date >= startOfMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const lastMonthExpenses = expenses
      .filter(expense => expense.date >= startOfLastMonth && expense.date <= endOfLastMonth)
      .reduce((sum, expense) => sum + expense.amount, 0);
    const todayExpenses = expenses
      .filter(expense => expense.date >= startOfToday)
      .reduce((sum, expense) => sum + expense.amount, 0);

    // Category breakdown
    const categoryMap = new Map();
    expenses.forEach(expense => {
      const current = categoryMap.get(expense.category) || 0;
      categoryMap.set(expense.category, current + expense.amount);
    });

    const categoryBreakdown = Array.from(categoryMap.entries()).map(([categoryId, amount]) => {
      const category = categories.find(c => c.id === categoryId);
      return {
        category: category?.name || 'Unknown',
        amount,
        percentage: (amount / totalExpenses) * 100,
        color: category?.color || '#666',
      };
    }).sort((a, b) => b.amount - a.amount);

    // Daily trend (last 7 days)
    const dailyTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      const dayEnd = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
      
      const dayAmount = expenses
        .filter(expense => expense.date >= dayStart && expense.date < dayEnd)
        .reduce((sum, expense) => sum + expense.amount, 0);
      
      dailyTrend.push({
        date: date.toISOString().split('T')[0],
        amount: dayAmount,
      });
    }

    // Top tags
    const tagMap = new Map();
    expenses.forEach(expense => {
      expense.tags.forEach(tag => {
        const current = tagMap.get(tag) || { count: 0, amount: 0 };
        tagMap.set(tag, {
          count: current.count + 1,
          amount: current.amount + expense.amount,
        });
      });
    });

    const topTags = Array.from(tagMap.entries())
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    return {
      totalExpenses,
      thisMonthExpenses,
      lastMonthExpenses,
      todayExpenses,
      categoryBreakdown,
      dailyTrend,
      topTags,
    };
  },

  getExpensesByDateRange: (startDate, endDate) => {
    return get().expenses.filter(expense => 
      expense.date >= startDate && expense.date <= endDate
    );
  },

  getCategoryExpenses: (categoryId, period = 'month') => {
    const now = new Date();
    let startDate: Date;
    
    switch (period) {
      case 'week':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'year':
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      default: // month
        startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    return get().expenses
      .filter(expense => expense.category === categoryId && expense.date >= startDate)
      .reduce((sum, expense) => sum + expense.amount, 0);
  },

  getBudgetProgress: (budgetId) => {
    const budget = get().budgets.find(b => b.id === budgetId);
    if (!budget) return { spent: 0, remaining: 0, percentage: 0 };

    const spent = get().getCategoryExpenses(budget.categoryId, budget.period);
    const remaining = Math.max(0, budget.amount - spent);
    const percentage = Math.min(100, (spent / budget.amount) * 100);

    return { spent, remaining, percentage };
  },

  getSuggestedCategories: (amount, note) => {
    const { expenses, categories } = get();
    
    // Simple ML-like suggestion based on amount ranges and note keywords
    const suggestions = [];
    
    // Amount-based suggestions
    if (amount < 100) {
      suggestions.push('Food', 'Transport');
    } else if (amount < 500) {
      suggestions.push('Shopping', 'Entertainment');
    } else {
      suggestions.push('Bills', 'Travel');
    }
    
    // Note-based suggestions
    if (note) {
      const lowerNote = note.toLowerCase();
      if (lowerNote.includes('food') || lowerNote.includes('restaurant') || lowerNote.includes('meal')) {
        suggestions.unshift('Food');
      }
      if (lowerNote.includes('gas') || lowerNote.includes('uber') || lowerNote.includes('taxi')) {
        suggestions.unshift('Transport');
      }
      if (lowerNote.includes('movie') || lowerNote.includes('game') || lowerNote.includes('fun')) {
        suggestions.unshift('Entertainment');
      }
    }
    
    // Remove duplicates and return top 3
    return [...new Set(suggestions)].slice(0, 3);
  },

  getPopularTags: () => {
    return get().tags.sort((a, b) => b.count - a.count).slice(0, 10);
  },
}));