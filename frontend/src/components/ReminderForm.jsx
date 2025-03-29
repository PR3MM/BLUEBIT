import React, { useState } from 'react';
import { medicationApi, reminderApi } from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import { addToCalendar } from '../utils/calendarIntegration';

// Helper function to check if a date is today
const isScheduledForToday = (date) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  return date >= today && date < tomorrow;
};

// Helper to get correct local datetime-local format for default time
const getDefaultDateTime = () => {
  const now = new Date();
  // Round to nearest 5 minutes in the future
  now.setMinutes(Math.ceil(now.getMinutes() / 5) * 5);
  // Convert to YYYY-MM-DDTHH:MM format required by datetime-local input
  return now.toISOString().slice(0, 16);
};

const ReminderForm = ({ onSuccess, medication = null, existingReminder = null, onCancel }) => {
  const { getToken, userId, user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    medicationId: medication?._id || '',
    medicationName: medication?.name || '',
    dosage: medication?.dosage || '',
    frequency: medication?.frequency || 'daily',
    scheduledTime: existingReminder?.scheduledTime || getDefaultDateTime(),
    notes: existingReminder?.notes || '',
    addToCalendar: false,
    calendarType: 'google', // 'google' or 'apple'
    sendNotifications: true,
    reminderBefore: 15, // minutes before
  });

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  // Handle medication selection if user is creating a reminder for a new medication
  const handleMedicationSelect = async (e) => {
    try {
      const medicationId = e.target.value;
      if (medicationId) {
        // Get the user identifier (email or ID)
        const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
        
        if (!userIdentifier) {
          throw new Error('User not authenticated');
        }
        
        const selectedMedication = await medicationApi.getMedicationById(medicationId, userIdentifier);
        setFormData({
          ...formData,
          medicationId,
          medicationName: selectedMedication.name,
          dosage: selectedMedication.dosage,
        });
      }
    } catch (err) {
      setError('Failed to load medication details');
      console.error(err);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Get the user identifier (email or ID) instead of the token
      const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
      
      if (!userIdentifier) {
        throw new Error('User not authenticated');
      }
      
      console.log('Using user identifier for reminders:', userIdentifier);
      
      // If no medication ID is provided, create a new medication
      let medicationId = formData.medicationId;
      let medicationObj;
      
      if (!medicationId) {
        const newMedication = await medicationApi.createMedication({
          name: formData.medicationName,
          dosage: formData.dosage,
          frequency: formData.frequency,
          startDate: new Date(),
          userId: userIdentifier,
        }, userIdentifier);
        
        medicationId = newMedication._id;
        medicationObj = newMedication;
      } else if (medication) {
        medicationObj = medication;
      }
      
      // Create a reminder based on the form data
      const scheduledTimeInput = new Date(formData.scheduledTime);
      console.log('Form scheduled time raw:', formData.scheduledTime);
      console.log('Form scheduled time parsed:', scheduledTimeInput);
      console.log('Form scheduled time ISO:', scheduledTimeInput.toISOString());
      console.log('Local timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      
      const reminderData = {
        medication: medicationId,
        scheduledTime: scheduledTimeInput,
        notes: formData.notes,
        status: 'pending',
        calendarIntegration: formData.addToCalendar ? {
          enabled: true,
          type: formData.calendarType
        } : { enabled: false },
        notification: {
          enabled: formData.sendNotifications,
          reminderBefore: formData.reminderBefore
        }
      };
      
      // Log the data being sent
      console.log('Creating reminder with data:', {
        medication: medicationId,
        scheduledTime: reminderData.scheduledTime,
        userId: userIdentifier,
        isToday: isScheduledForToday(scheduledTimeInput)
      });
      
      // If we're editing an existing reminder
      let savedReminder;
      if (existingReminder) {
        savedReminder = await reminderApi.updateReminder(existingReminder._id, reminderData, userIdentifier);
        setSuccess(true);
      } else {
        // Create a new reminder
        savedReminder = await reminderApi.createReminder(reminderData, userIdentifier);
        setSuccess(true);
      }
      
      // If user wants to add to calendar, handle calendar integration
      if (formData.addToCalendar && savedReminder) {
        // If we don't have medication object yet, fetch it
        if (!medicationObj && medicationId) {
          medicationObj = await medicationApi.getMedicationById(medicationId, userIdentifier);
        }
        
        // Add to calendar using the utility
        if (medicationObj) {
          addToCalendar(savedReminder, medicationObj, formData.calendarType);
        }
      }
      
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err.message || 'Failed to create reminder');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">
        {existingReminder ? 'Edit Reminder' : 'Create Medication Reminder'}
      </h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      {success && !onSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">
          Reminder {existingReminder ? 'updated' : 'created'} successfully!
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Medication Selection or Entry */}
        {!medication && (
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Medication</label>
            <input
              type="text"
              name="medicationName"
              value={formData.medicationName}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Medication Name"
              required
            />
          </div>
        )}
        
        {/* Dosage */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Dosage</label>
          <input
            type="text"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            placeholder="e.g., 10mg"
            required
          />
        </div>
        
        {/* Frequency */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Frequency</label>
          <select
            name="frequency"
            value={formData.frequency}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          >
            <option value="daily">Daily</option>
            <option value="twice_daily">Twice Daily</option>
            <option value="three_times_daily">Three Times Daily</option>
            <option value="weekly">Weekly</option>
            <option value="as_needed">As Needed</option>
            <option value="custom">Custom</option>
          </select>
        </div>
        
        {/* Scheduled Time */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Next Scheduled Time</label>
          <input
            type="datetime-local"
            name="scheduledTime"
            value={formData.scheduledTime}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
            
          />
        </div>
        
        {/* Notes */}
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Notes (Optional)</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="3"
            placeholder="Any special instructions"
          />
        </div>
        
        {/* Calendar Integration */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="addToCalendar"
              checked={formData.addToCalendar}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Add to Calendar</span>
          </label>
          
          {formData.addToCalendar && (
            <div className="mt-2 pl-6">
              <label className="block text-gray-700 mb-2">Calendar Type</label>
              <select
                name="calendarType"
                value={formData.calendarType}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="google">Google Calendar</option>
                <option value="apple">Apple Calendar</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Notifications */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="sendNotifications"
              checked={formData.sendNotifications}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Send Notifications</span>
          </label>
          
          {formData.sendNotifications && (
            <div className="mt-2 pl-6">
              <label className="block text-gray-700 mb-2">Remind me</label>
              <select
                name="reminderBefore"
                value={formData.reminderBefore}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="5">5 minutes before</option>
                <option value="15">15 minutes before</option>
                <option value="30">30 minutes before</option>
                <option value="60">1 hour before</option>
              </select>
            </div>
          )}
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end space-x-2">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded"
              disabled={loading}
            >
              Cancel
            </button>
          )}
          
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? 'Saving...' : existingReminder ? 'Update Reminder' : 'Create Reminder'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReminderForm; 