const express = require('express');
const router = express.Router();
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Get all activities for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find({ user: userId })
      .populate('medication')
      .populate('prescription')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Activity.countDocuments({ user: userId });
    
    res.json({
      activities,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent activities for a user
router.get('/recent', async (req, res) => {
  try {
    // Use userId from query parameter if available
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Fetching activities for userId:', userId);
    
    // Check if userId looks like an email
    const isEmail = userId.includes('@');
    
    // Build the query based on userId type
    let query = {};
    if (isEmail) {
      // If it's an email, only search in userId field
      query = { userId: userId };
    } else {
      // Otherwise try both fields
      try {
        const objectId = new mongoose.Types.ObjectId(userId);
        query = { 
          $or: [
            { userId: userId },
            { user: objectId }
          ]
        };
      } catch (e) {
        // If conversion fails, just use string comparison
        query = { userId: userId };
      }
    }
    
    const limit = parseInt(req.query.limit) || 10;
    
    console.log('Activity query:', JSON.stringify(query));
    const activities = await Activity.find(query)
      .populate('medication')
      .populate('prescription')
      .sort({ timestamp: -1 })
      .limit(limit);
      
    console.log(`Found ${activities.length} activities`);
    res.json(activities);
  } catch (error) {
    console.error('Error fetching recent activities:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get activities filtered by type
router.get('/by-type/:type', async (req, res) => {
  try {
    const userId = req.user._id;
    const { type } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find({ 
      user: userId,
      type
    })
      .populate('medication')
      .populate('prescription')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Activity.countDocuments({ 
      user: userId,
      type
    });
    
    res.json({
      activities,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get activities related to a specific medication
router.get('/by-medication/:medicationId', async (req, res) => {
  try {
    const userId = req.user._id;
    const { medicationId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;
    
    const activities = await Activity.find({ 
      user: userId,
      medication: medicationId
    })
      .populate('medication')
      .populate('prescription')
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);
      
    const total = await Activity.countDocuments({ 
      user: userId,
      medication: medicationId
    });
    
    res.json({
      activities,
      page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 