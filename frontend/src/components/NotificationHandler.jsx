import React, { useState, useEffect } from 'react';
import { useAuth } from '@clerk/clerk-react';
import { reminderApi } from '../services/api';

const NotificationHandler = () => {
  const { getToken, isLoaded, userId } = useAuth();
  const [hasPermission, setHasPermission] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [notificationInterval, setNotificationInterval] = useState(null);

  // Request notification permission on mount
  useEffect(() => {
    if (!('Notification' in window)) {
      console.log('This browser does not support desktop notification');
      return;
    }

    // Check if permission is already granted
    if (Notification.permission === 'granted') {
      setHasPermission(true);
    } else if (Notification.permission !== 'denied') {
      Notification.requestPermission().then(permission => {
        if (permission === 'granted') {
          setHasPermission(true);
        }
      });
    }
  }, []);

  // Set up regular checking for due reminders
  useEffect(() => {
    if (isLoaded && userId && hasPermission) {
      // Fetch reminders immediately on load
      fetchDueReminders();
      
      // Set up interval to check for reminders every minute
      const intervalId = setInterval(fetchDueReminders, 60000);
      setNotificationInterval(intervalId);
      
      // Cleanup interval on unmount
      return () => {
        if (notificationInterval) {
          clearInterval(notificationInterval);
        }
      };
    }
  }, [isLoaded, userId, hasPermission]);

  // Fetch due reminders
  const fetchDueReminders = async () => {
    if (!isLoaded || !userId) return;
    
    try {
      const token = await getToken();
      const todayReminders = await reminderApi.getTodayReminders(token);
      
      // Process reminders that are due now or in the next minute
      const now = new Date();
      const dueReminders = todayReminders.filter(reminder => {
        const reminderTime = new Date(reminder.scheduledTime);
        const timeDiff = (reminderTime - now) / (1000 * 60); // Difference in minutes
        
        // Include reminders that are due in the next minute or are past due but less than 5 minutes late
        return (
          reminder.status === 'pending' && 
          !reminder.notificationSent && 
          timeDiff > -5 && 
          timeDiff <= 1
        );
      });
      
      // Send notifications for due reminders
      dueReminders.forEach(sendNotification);
      
      setReminders(todayReminders);
    } catch (error) {
      console.error('Error fetching reminders for notifications:', error);
    }
  };

  // Function to send notification
  const sendNotification = async (reminder) => {
    try {
      // Find medication details if available
      const medicationName = reminder.medication?.name || 'Medication';
      const dosage = reminder.medication?.dosage || '';
      
      // Create notification title and body
      const title = `Medication Reminder: ${medicationName}`;
      const body = `Time to take your ${dosage} ${medicationName}. ${reminder.notes || ''}`;
      
      // Show the notification
      const notification = new Notification(title, {
        body,
        icon: '/icon.png', // Add your app icon path
        badge: '/badge.png', // Add your app badge path
        tag: reminder._id, // Prevent duplicate notifications
        renotify: true,
      });
      
      // Handle notification click
      notification.onclick = () => {
        // Open the app or focus on it
        window.focus();
        notification.close();
        
        // Navigate to the reminders page if needed
        window.location.hash = '#reminders';
      };
      
      // Mark the reminder as notification sent
      const token = await getToken();
      if (reminder._id) {
        const updatedReminder = { ...reminder, notificationSent: true };
        await reminderApi.updateReminder(reminder._id, updatedReminder, token);
      }
    } catch (error) {
      console.error('Error sending notification:', error);
    }
  };

  // Permission request button
  const requestPermission = () => {
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        setHasPermission(true);
      }
    });
  };

  // Render nothing, this is a background component
  return (
    <>
      {/* Optional debugging/permission UI can go here */}
      {!hasPermission && (
        <div className="fixed bottom-4 right-4 bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded shadow-lg max-w-xs">
          <p className="font-bold">Notification Permission</p>
          <p className="text-sm">Please enable notifications to receive medication reminders.</p>
          <button 
            onClick={requestPermission}
            className="mt-2 bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-1 px-2 rounded text-sm"
          >
            Enable Notifications
          </button>
        </div>
      )}
    </>
  );
};

export default NotificationHandler; 