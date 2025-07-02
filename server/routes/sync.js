const express = require('express');
const UserData = require('../models/UserData');
const auth = require('../middleware/auth');
const router = express.Router();

// Sync user data
router.post('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { expenses, categories, budgets, tags, settings } = req.body;

    // Find existing user data or create new
    let userData = await UserData.findOne({ userId });
    
    if (!userData) {
      userData = new UserData({
        userId,
        expenses: [],
        categories: [],
        budgets: [],
        tags: [],
        settings: {},
      });
    }

    // Merge data (simple strategy - replace all)
    userData.expenses = expenses || userData.expenses;
    userData.categories = categories || userData.categories;
    userData.budgets = budgets || userData.budgets;
    userData.tags = tags || userData.tags;
    userData.settings = { ...userData.settings, ...settings };
    userData.lastSync = new Date();

    await userData.save();

    // Update user's last sync time
    req.user.lastSync = new Date();
    await req.user.save();

    res.json({
      success: true,
      data: {
        expenses: userData.expenses,
        categories: userData.categories,
        budgets: userData.budgets,
        tags: userData.tags,
        settings: userData.settings,
        lastSync: userData.lastSync,
      },
    });
  } catch (error) {
    console.error('Sync error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to sync data',
    });
  }
});

// Get user data
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user._id;
    
    const userData = await UserData.findOne({ userId });
    
    if (!userData) {
      return res.json({
        success: true,
        data: {
          expenses: [],
          categories: [],
          budgets: [],
          tags: [],
          settings: {},
          lastSync: new Date(),
        },
      });
    }

    res.json({
      success: true,
      data: {
        expenses: userData.expenses,
        categories: userData.categories,
        budgets: userData.budgets,
        tags: userData.tags,
        settings: userData.settings,
        lastSync: userData.lastSync,
      },
    });
  } catch (error) {
    console.error('Get data error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user data',
    });
  }
});

module.exports = router;