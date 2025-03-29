const express = require('express');
const router = express.Router();
const Medication = require('../models/Medication');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Get all medications for a user
router.get('/', async (req, res) => {
  try {
    // Use userId from query parameter if available (from email or id)
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    console.log('Fetching medications for userId:', userId);
    
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
    
    console.log('Medication query:', JSON.stringify(query));
    const medications = await Medication.find(query);
    console.log(`Found ${medications.length} medications`);
    
    res.json(medications);
  } catch (error) {
    console.error('Error fetching medications:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single medication by ID
router.get('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    res.json(medication);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new medication
router.post('/', async (req, res) => {
  try {
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
    
    // Create medication with appropriate user reference
    const medicationData = {
      ...req.body,
      userId: userId // Always store as string
    };
    
    // Only set 'user' field if it's a valid ObjectId
    if (isValidObjectId(userId)) {
      medicationData.user = userId;
    } else {
      // If it's not a valid ObjectId (e.g., an email), don't include the user field
      medicationData.user = undefined;
    }
    
    const medication = new Medication(medicationData);
    const savedMedication = await medication.save();
    
    // Create activity log (if we have Activity model)
    try {
      await Activity.create({
        userId: userId, // Store as string
        user: isValidObjectId(userId) ? userId : undefined, // Only set if valid ObjectId
        type: 'medication_added',
        medication: savedMedication._id,
        details: { name: savedMedication.name },
      });
    } catch (activityError) {
      console.error('Error creating activity log:', activityError);
      // Don't fail if activity creation fails
    }
    
    res.status(201).json(savedMedication);
  } catch (error) {
    console.error('Error creating medication:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a medication
router.put('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'medication_modified',
      medication: medication._id,
      details: { name: medication.name },
    });
    
    res.json(medication);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a medication
router.delete('/:id', async (req, res) => {
  try {
    const medication = await Medication.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!medication) {
      return res.status(404).json({ message: 'Medication not found' });
    }
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'medication_deleted',
      details: { name: medication.name },
    });
    
    res.json({ message: 'Medication deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 