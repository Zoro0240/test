const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
  id: String,
  amount: Number,
  category: String,
  note: String,
  tags: [String],
  date: Date,
  createdAt: Date,
  updatedAt: Date,
});

const categorySchema = new mongoose.Schema({
  id: String,
  name: String,
  icon: String,
  color: String,
  createdAt: Date,
});

const budgetSchema = new mongoose.Schema({
  id: String,
  categoryId: String,
  amount: Number,
  period: {
    type: String,
    enum: ['weekly', 'monthly', 'yearly'],
  },
  createdAt: Date,
  updatedAt: Date,
});

const tagSchema = new mongoose.Schema({
  id: String,
  name: String,
  count: Number,
  lastUsed: Date,
});

const userDataSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  expenses: [expenseSchema],
  categories: [categorySchema],
  budgets: [budgetSchema],
  tags: [tagSchema],
  settings: {
    theme: String,
    currency: String,
    defaultCategories: Boolean,
    notifications: Boolean,
  },
  lastSync: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserData', userDataSchema);