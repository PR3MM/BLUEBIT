const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');
const Activity = require('../models/Activity');
const mongoose = require('mongoose');

// Get all prescriptions for a user
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;
    const prescriptions = await Prescription.find({ user: userId })
      .populate('medication')
      .sort({ createdAt: -1 });
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get recent prescriptions
router.get('/recent', async (req, res) => {
  try {
    // Use userId from query parameter if available
    const userId = req.query.userId || (req.user && req.user._id);
    
    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }
    
    console.log('Fetching prescriptions for userId:', userId);
    
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
    
    const limit = parseInt(req.query.limit) || 5;
    
    console.log('Prescription query:', JSON.stringify(query));
    const prescriptions = await Prescription.find(query)
      .populate('medication')
      .sort({ createdAt: -1 })
      .limit(limit);
      
    console.log(`Found ${prescriptions.length} prescriptions`);
    res.json(prescriptions);
  } catch (error) {
    console.error('Error fetching recent prescriptions:', error);
    res.status(500).json({ message: error.message });
  }
});

// Get a single prescription by ID
router.get('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('medication');
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    res.json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new prescription
router.post('/', async (req, res) => {
  try {
    console.log('Creating new prescription:', req.body);
    
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
    
    // Create prescription with appropriate user reference
    const prescriptionData = {
      ...req.body,
      userId: userId // Always store as string
    };
    
    // Only set 'user' field if it's a valid ObjectId
    if (isValidObjectId(userId)) {
      prescriptionData.user = userId;
    } else {
      // If it's not a valid ObjectId (e.g., an email), don't include the user field
      prescriptionData.user = undefined;
    }
    
    const prescription = new Prescription(prescriptionData);
    const savedPrescription = await prescription.save();
    
    // Create activity log
    try {
      await Activity.create({
        userId: userId, // Store as string
        user: isValidObjectId(userId) ? userId : undefined, // Only set if valid ObjectId
        type: 'prescription_added',
        prescription: savedPrescription._id,
        medication: savedPrescription.medication,
      });
    } catch (activityError) {
      console.error('Error creating activity log:', activityError);
      // Don't fail if activity creation fails
    }
    
    res.status(201).json(savedPrescription);
  } catch (error) {
    console.error('Error creating prescription:', error);
    res.status(400).json({ message: error.message });
  }
});

// Update a prescription
router.put('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'prescription_modified',
      prescription: prescription._id,
      medication: prescription.medication,
    });
    
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Record prescription refill
router.post('/:id/refill', async (req, res) => {
  try {
    const prescription = await Prescription.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Update refill count
    prescription.refills.remaining = Math.min(
      prescription.refills.total,
      prescription.refills.remaining + 1
    );
    
    await prescription.save();
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'prescription_filled',
      prescription: prescription._id,
      medication: prescription.medication,
    });
    
    res.json(prescription);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a prescription
router.delete('/:id', async (req, res) => {
  try {
    const prescription = await Prescription.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!prescription) {
      return res.status(404).json({ message: 'Prescription not found' });
    }
    
    // Create activity log
    await Activity.create({
      user: req.user._id,
      type: 'prescription_deleted',
      medication: prescription.medication,
    });
    
    res.json({ message: 'Prescription deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 