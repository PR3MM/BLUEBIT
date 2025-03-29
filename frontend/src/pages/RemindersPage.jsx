import React from 'react';
import { useAuth } from '@clerk/clerk-react';
import ReminderList from '../components/ReminderList';
import NotificationHandler from '../components/NotificationHandler';

const RemindersPage = () => {
  const { isSignedIn } = useAuth();

  if (!isSignedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center p-8 max-w-md">
          <h1 className="text-2xl font-bold mb-4">Please Sign In</h1>
          <p className="mb-4">
            You need to be signed in to access medication reminders.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-10">
      {/* <h1 className="text-3xl font-bold mb-6">Medication Reminders</h1> */}
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ReminderList />
        </div>
        
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">About Reminders</h2>
            <p className="mb-3">
              Set up reminders for your medications to ensure you never miss a dose. Our reminder system helps you:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Schedule reminders for your medications</li>
              <li>Receive browser notifications</li>
              <li>Integrate with your calendar</li>
              <li>Get refill alerts based on your prescription</li>
            </ul>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-lg font-semibold mb-3 text-blue-800">Reminder Tips</h2>
            <ul className="space-y-2 text-blue-800">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Set reminders at times when you're usually available</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Use calendar integration for important medications</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Add notes for special instructions</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <span>Enable browser notifications for timely alerts</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Notification Handler - hidden component for handling notifications */}
      <NotificationHandler />
    </div>
  );
};

export default RemindersPage; 