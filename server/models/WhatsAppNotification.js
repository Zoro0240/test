const mongoose = require('mongoose');

const whatsAppNotificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['daily_summary', 'weekly_summary', 'budget_alert', 'bill_reminder'],
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  scheduledFor: {
    type: Date,
    required: true,
  },
  sent: {
    type: Boolean,
    default: false,
  },
  sentAt: Date,
  error: String,
  retryCount: {
    type: Number,
    default: 0,
  },
}, {
  timestamps: true,
});

// Index for efficient querying
whatsAppNotificationSchema.index({ userId: 1, scheduledFor: 1 });
whatsAppNotificationSchema.index({ sent: 1, scheduledFor: 1 });

module.exports = mongoose.model('WhatsAppNotification', whatsAppNotificationSchema);