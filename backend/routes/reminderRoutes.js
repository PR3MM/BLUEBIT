const express = require('express');
const router = express.Router();
const MedicationReminder = require('../models/MedicationReminder');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Get all reminders for a user
router.get('/', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching all reminders for userId:', userId);
    
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
    
    const reminders = await MedicationReminder.find(query)
      .populate('medication')
      .sort({ scheduledTime: 1 });
      
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching reminders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get upcoming reminders for today
router.get('/today', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching reminders for userId:', userId);
    
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
    
    // For today's reminders, let's be more flexible with date filtering
    // Instead of strict today/tomorrow boundaries, let's get reminders for a broader timeframe
    const now = new Date();
    
    // Look for reminders from start of today until end of tomorrow (to account for timezone differences)
    const startOfToday = new Date(now);
    startOfToday.setHours(0, 0, 0, 0);
    
    const endOfTomorrow = new Date(now);
    endOfTomorrow.setDate(endOfTomorrow.getDate() + 2); // +2 to include all of tomorrow
    endOfTomorrow.setHours(0, 0, 0, 0);
    
    console.log('Using more flexible date range:', {
      startOfToday: startOfToday.toISOString(),
      endOfTomorrow: endOfTomorrow.toISOString(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      serverTime: now.toISOString()
    });
    
    // Replace the strict query with more flexible date filtering
    query.scheduledTime = { $gte: startOfToday, $lt: endOfTomorrow };
    
    // Include all statuses except completed and missed for maximum visibility
    query.status = { $nin: ['completed', 'missed'] };
    
    console.log('Final query for today reminders:', JSON.stringify(query));
    
    console.log('Executing find with query, looking for reminders...');
    const reminders = await MedicationReminder.find(query)
      .populate('medication')
      .sort({ scheduledTime: 1 });
      
    res.json(reminders);
  } catch (error) {
    console.error('Error fetching today\'s reminders:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single reminder by ID
router.get('/:id', async (req, res) => {
  try {
    const reminder = await MedicationReminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('medication');
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new reminder
router.post('/', async (req, res) => {
  try {
    console.log('Creating reminder with request body:', req.body);
    
    // Get user ID from request body or from authenticated user
    const userId = req.body.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Using userId:', userId);
    
    // Check if userId is a valid ObjectId or just a string (like email)
    const isValidObjectId = (id) => {
      try {
        return new mongoose.Types.ObjectId(id).toString() === id;
      } catch (e) {
        return false;
      }
    };
    
    // Create reminder with appropriate user reference
    const reminderData = {
      ...req.body,
      userId: userId // Always store as string
    };
    
    // Only set 'user' field if it's a valid ObjectId
    if (isValidObjectId(userId)) {
      reminderData.user = userId;
    } else {
      // If it's not a valid ObjectId (e.g., an email), set user to null
      // Setting to null is better than undefined with Mongoose
      reminderData.user = null;
      
      // Make sure userId is properly set
      console.log('Using email address as userId:', userId);
    }
    
    console.log('Creating reminder with data:', { 
      medication: reminderData.medication,
      scheduledTime: reminderData.scheduledTime,
      userId: reminderData.userId,
      user: reminderData.user
    });
    
    const reminder = new MedicationReminder(reminderData);
    const savedReminder = await reminder.save();
    
    // Create activity log
    try {
      await Activity.create({
        userId: userId, // Store as string
        user: isValidObjectId(userId) ? userId : null, // Set to null if not valid ObjectId
        type: 'reminder_created',
        medication: savedReminder.medication,
      });
    } catch (activityError) {
      console.error('Error creating activity log:', activityError);
      // Don't fail if activity creation fails
    }
    
    res.status(201).json(savedReminder);
  } catch (error) {
    console.error('Error creating reminder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Mark reminder as completed
router.put('/:id/complete', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Completing reminder for userId:', userId);
    
    // Check if userId looks like an email
    const isEmail = userId.includes('@');
    
    // Build the query based on userId type
    let query = { _id: req.params.id };
    if (isEmail) {
      // If it's an email, only search in userId field
      query.userId = userId;
    } else {
      // Otherwise try both fields
      try {
        const objectId = new mongoose.Types.ObjectId(userId);
        query.$or = [
          { userId: userId },
          { user: objectId }
        ];
      } catch (e) {
        // If conversion fails, just use string comparison
        query.userId = userId;
      }
    }
    
    const reminder = await MedicationReminder.findOneAndUpdate(
      query,
      {
        $set: {
          status: 'completed',
          completedAt: new Date(),
        },
      },
      { new: true }
    ).populate('medication');
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Log the activity
    try {
      const isValidObjectId = (id) => {
        try {
          return new mongoose.Types.ObjectId(id).toString() === id;
        } catch (e) {
          return false;
        }
      };
      
      await Activity.create({
        userId: userId, // Store as string
        user: isValidObjectId(userId) ? userId : null, // Use null instead of undefined
        type: 'medication_taken',
        medication: reminder.medication,
      });
    } catch (error) {
      console.error('Error creating activity log:', error);
    }
    
    res.json(reminder);
  } catch (error) {
    console.error('Error completing reminder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Mark reminder as missed
router.put('/:id/miss', async (req, res) => {
  try {
    const reminder = await MedicationReminder.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    reminder.status = 'missed';
    
    await reminder.save();
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'medication_skipped',
      medication: reminder.medication,
    });
    
    res.json(reminder);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a reminder
router.put('/:id', async (req, res) => {
  try {
    console.log('Updating reminder:', req.params.id);
    
    // Get user ID from request body or from authenticated user
    const userId = req.body.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    // Check if userId is a valid ObjectId or just a string (like email)
    const isValidObjectId = (id) => {
      try {
        return new mongoose.Types.ObjectId(id).toString() === id;
      } catch (e) {
        return false;
      }
    };
    
    // Update data
    const updateData = {
      ...req.body,
      userId: userId // Always store as string
    };
    
    // Only set 'user' field if it's a valid ObjectId
    if (isValidObjectId(userId)) {
      updateData.user = userId;
    } else {
      // If it's not a valid ObjectId (e.g., an email), set user to null
      updateData.user = null;
    }
    
    console.log('Updating reminder with data:', {
      id: req.params.id,
      userId: updateData.userId,
      user: updateData.user
    });
    
    const reminder = await MedicationReminder.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json(reminder);
  } catch (error) {
    console.error('Error updating reminder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Snooze a reminder
router.put('/:id/snooze', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Snoozing reminder for userId:', userId);
    
    // Check if userId looks like an email
    const isEmail = userId.includes('@');
    
    // Build the query based on userId type
    let query = { _id: req.params.id };
    if (isEmail) {
      // If it's an email, only search in userId field
      query.userId = userId;
    } else {
      // Otherwise try both fields
      try {
        const objectId = new mongoose.Types.ObjectId(userId);
        query.$or = [
          { userId: userId },
          { user: objectId }
        ];
      } catch (e) {
        // If conversion fails, just use string comparison
        query.userId = userId;
      }
    }
    
    const snoozeDuration = req.body.snoozeDuration || 15; // Default to 15 minutes
    const snoozedUntil = new Date(Date.now() + snoozeDuration * 60 * 1000);
    
    const reminder = await MedicationReminder.findOneAndUpdate(
      query,
      {
        $set: {
          status: 'snoozed',
          snoozedUntil,
        },
      },
      { new: true }
    ).populate('medication');
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    // Log the activity
    try {
      const isValidObjectId = (id) => {
        try {
          return new mongoose.Types.ObjectId(id).toString() === id;
        } catch (e) {
          return false;
        }
      };
      
      await Activity.create({
        userId,
        user: isValidObjectId(userId) ? userId : null, // Use null instead of undefined
        type: 'reminder_snoozed',
        medication: reminder.medication._id,
      });
    } catch (error) {
      console.error('Error creating activity log:', error);
    }
    
    res.json(reminder);
  } catch (error) {
    console.error('Error snoozing reminder:', error);
    res.status(400).json({ message: error.message });
  }
});

// Delete a reminder
router.delete('/:id', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Deleting reminder for userId:', userId);
    
    // Check if userId looks like an email
    const isEmail = userId.includes('@');
    
    // Build the query based on userId type
    let query = { _id: req.params.id };
    
    if (isEmail) {
      // If it's an email, only search in userId field
      query.userId = userId;
    } else {
      // Otherwise try both fields
      try {
        const objectId = new mongoose.Types.ObjectId(userId);
        query.$or = [
          { userId: userId },
          { user: objectId }
        ];
      } catch (e) {
        // If conversion fails, just use string comparison
        query.userId = userId;
      }
    }
    
    const reminder = await MedicationReminder.findOneAndDelete(query);
    
    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }
    
    res.json({ message: 'Reminder deleted' });
  } catch (error) {
    console.error('Error deleting reminder:', error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 