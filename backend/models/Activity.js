const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    userId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ['medication_added', 'medication_taken', 'medication_skipped', 'medication_modified', 'medication_deleted',
             'prescription_added', 'prescription_filled', 'prescription_deleted', 'reminder_created', 'reminder_modified'],
      required: true,
    },
    medication: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Medication',
    },
    prescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prescription',
    },
    details: {
      type: Object,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// Index for efficient querying of recent activity
activitySchema.index({ user: 1, timestamp: -1 });

const Activity = mongoose.model('Activity', activitySchema);

module.exports = Activity; 