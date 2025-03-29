import React, { useState, useEffect } from 'react';
import { reminderApi, medicationApi } from '../services/api';
import { useAuth } from '@clerk/clerk-react';
import { X, Edit, Bell, Check, Clock, Trash2, Calendar } from 'lucide-react';
import ReminderForm from './ReminderForm';

const ReminderList = () => {
  const { getToken, userId, user } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingReminder, setEditingReminder] = useState(null);

  // Fetch reminders on component mount
  useEffect(() => {
    fetchReminders();
    fetchMedications();
  }, []);

  // Function to fetch reminders
  const fetchReminders = async () => {
    try {
      setLoading(true);
      
      // Get user identifier (email or ID)
      const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
      
      if (!userIdentifier) {
        throw new Error('User not authenticated');
      }
      
      const data = await reminderApi.getReminders(userIdentifier);
      setReminders(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load reminders');
      console.error(err);
      setLoading(false);
    }
  };

  // Function to fetch medications
  const fetchMedications = async () => {
    try {
      const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
      
      if (!userIdentifier) {
        throw new Error('User not authenticated');
      }
      
      const data = await medicationApi.getMedications(userIdentifier);
      setMedications(data);
    } catch (err) {
      console.error('Failed to load medications:', err);
    }
  };

  // Function to handle completing a reminder
  const handleComplete = async (id) => {
    try {
      const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
      
      if (!userIdentifier) {
        throw new Error('User not authenticated');
      }
      
      await reminderApi.completeReminder(id, userIdentifier);
      // Refresh reminders after completing
      fetchReminders();
    } catch (err) {
      setError('Failed to complete reminder');
      console.error(err);
    }
  };

  // Function to handle snoozing a reminder
  const handleSnooze = async (id, duration = 15) => {
    try {
      const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
      
      if (!userIdentifier) {
        throw new Error('User not authenticated');
      }
      
      await reminderApi.snoozeReminder(id, duration, userIdentifier);
      // Refresh reminders after snoozing
      fetchReminders();
    } catch (err) {
      setError('Failed to snooze reminder');
      console.error(err);
    }
  };

  // Function to handle deleting a reminder
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this reminder?')) {
      try {
        const userIdentifier = user?.primaryEmailAddress?.emailAddress || userId;
        
        if (!userIdentifier) {
          throw new Error('User not authenticated');
        }
        
        await reminderApi.deleteReminder(id, userIdentifier);
        // Refresh reminders after deleting
        fetchReminders();
      } catch (err) {
        setError('Failed to delete reminder');
        console.error(err);
      }
    }
  };

  // Function to handle editing a reminder
  const handleEdit = (reminder) => {
    setEditingReminder(reminder);
    setShowForm(true);
  };

  // Function to format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  // Function to handle form submission success
  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingReminder(null);
    fetchReminders();
  };

  // Render loading state
  if (loading && reminders.length === 0) {
    return <div className="p-4 text-center">Loading reminders...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow ">
      <div className="p-4 border-b flex justify-between items-center ">
        <h2 className="text-xl font-semibold ">Medication Reminders</h2>
        <button
          onClick={() => {
            setEditingReminder(null);
            setShowForm(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add Reminder
        </button>
      </div>

      {error && (
        <div className="m-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      {showForm ? (
        <div className="p-4">
          <ReminderForm
            existingReminder={editingReminder}
            onSuccess={handleFormSuccess}
            onCancel={() => {
              setShowForm(false);
              setEditingReminder(null);
            }}
          />
        </div>
      ) : (
        <div>
          {reminders.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No reminders scheduled. Create a reminder to get started.</p>
            </div>
          ) : (
            <ul className="divide-y">
              {reminders.map((reminder) => {
                const medication = medications.find(m => m._id === reminder.medication) || {};
                
                return (
                  <li key={reminder._id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{medication.name || 'Medication'}</h3>
                        <p className="text-gray-600 text-sm">{medication.dosage || ''}</p>
                        <div className="mt-1 flex items-center text-sm text-gray-500">
                          <Clock className="w-4 h-4 mr-1" />
                          {formatDate(reminder.scheduledTime)}
                        </div>
                        
                        {reminder.status === 'snoozed' && (
                          <div className="mt-1 text-sm text-orange-500">
                            Snoozed until {formatDate(reminder.snoozedUntil)}
                          </div>
                        )}
                        
                        {reminder.notes && (
                          <p className="mt-2 text-sm text-gray-600">{reminder.notes}</p>
                        )}
                      </div>
                      
                      <div className="flex space-x-2">
                        {reminder.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleComplete(reminder._id)}
                              className="p-1 text-green-600 hover:bg-green-100 rounded"
                              title="Mark as completed"
                            >
                              <Check className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleSnooze(reminder._id)}
                              className="p-1 text-orange-600 hover:bg-orange-100 rounded"
                              title="Snooze for 15 minutes"
                            >
                              <Clock className="w-5 h-5" />
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => handleEdit(reminder)}
                          className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                          title="Edit reminder"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(reminder._id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                          title="Delete reminder"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    
                    {reminder.calendarIntegration?.enabled && (
                      <div className="mt-2 text-xs flex items-center text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        Added to {reminder.calendarIntegration.type} Calendar
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default ReminderList; 