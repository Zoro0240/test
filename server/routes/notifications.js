const express = require('express');
const axios = require('axios');
const WhatsAppNotification = require('../models/WhatsAppNotification');
const User = require('../models/User');
const auth = require('../middleware/auth');
const router = express.Router();

// Schedule WhatsApp notification
router.post('/whatsapp', auth, async (req, res) => {
  try {
    const { type, message, scheduledFor } = req.body;
    const userId = req.user._id;

    // Get user's phone number
    const user = await User.findById(userId);
    if (!user.phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number not found in user profile',
      });
    }

    // Create notification record
    const notification = new WhatsAppNotification({
      userId,
      type,
      message,
      phoneNumber: user.phoneNumber,
      scheduledFor: new Date(scheduledFor),
    });

    await notification.save();

    // If scheduled for immediate delivery, send now
    if (new Date(scheduledFor) <= new Date()) {
      await sendWhatsAppMessage(notification);
    }

    res.json({
      success: true,
      data: notification,
    });
  } catch (error) {
    console.error('WhatsApp notification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to schedule WhatsApp notification',
    });
  }
});

// Send WhatsApp message using UltraMsg API
async function sendWhatsAppMessage(notification) {
  try {
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
  } catch (error) {
    console.error('WhatsApp send error:', error);
    notification.error = error.message;
    notification.retryCount += 1;
    await notification.save();
    throw error;
  }
}

// Get notification history
router.get('/history', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { page = 1, limit = 20, type } = req.query;

    const query = { userId };
    if (type) {
      query.type = type;
    }

    const notifications = await WhatsAppNotification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await WhatsAppNotification.countDocuments(query);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Notification history error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch notification history',
    });
  }
});

// Test WhatsApp connection
router.post('/whatsapp/test', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.phoneNumber) {
      return res.status(400).json({
        success: false,
        error: 'Phone number not found in user profile',
      });
    }

    const testNotification = new WhatsAppNotification({
      userId: user._id,
      type: 'daily_summary',
      message: '🧪 Test message from Expense Tracker App! Your WhatsApp notifications are working correctly.',
      phoneNumber: user.phoneNumber,
      scheduledFor: new Date(),
    });

    await testNotification.save();
    await sendWhatsAppMessage(testNotification);

    res.json({
      success: true,
      message: 'Test message sent successfully',
    });
  } catch (error) {
    console.error('WhatsApp test error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to send test message',
    });
  }
});

module.exports = router;