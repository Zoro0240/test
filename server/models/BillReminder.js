const mongoose = require('mongoose');

const billReminderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  dueDate: {
    type: Date,
    required: true,
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly', 'one-time'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  reminderDays: {
    type: Number,
    default: 3,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastReminded: Date,
  nextReminder: Date,
}, {
  timestamps: true,
});

// Index for efficient querying
billReminderSchema.index({ userId: 1, nextReminder: 1, isActive: 1 });

module.exports = mongoose.model('BillReminder', billReminderSchema);