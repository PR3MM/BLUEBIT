import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { medicationApi } from '../services/api';

const MedicationForm = () => {
  const navigate = useNavigate();
  const { user, isLoaded, isSignedIn } = useUser();
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 'daily',
    timeOfDay: ['morning'],
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    instructions: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Redirect if not signed in
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/signin');
    }
  }, [isLoaded, isSignedIn, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleTimeOfDayChange = (time) => {
    const currentTimeOfDay = [...formData.timeOfDay];
    if (currentTimeOfDay.includes(time)) {
      setFormData({
        ...formData,
        timeOfDay: currentTimeOfDay.filter(t => t !== time)
      });
    } else {
      setFormData({
        ...formData,
        timeOfDay: [...currentTimeOfDay, time]
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      if (!isSignedIn || !user) {
        throw new Error('You must be signed in to add a medication');
      }

      // Get auth token
      const token = user.primaryEmailAddress?.emailAddress || user.id;

      // Prepare medication data
      const medicationData = {
        ...formData,
        active: true,
      };

      // Save to database
      await medicationApi.createMedication(medicationData, token);
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      console.error('Error adding medication:', err);
      setError(err.message || 'Failed to add medication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isLoaded) {
    return <div className="p-8 text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Add New Medication
          </h1>
          <p className="mt-4 text-lg text-gray-600">
            Enter your medication details to add it to your profile.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-8 border border-gray-100">
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              {/* Medication Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Medication Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Lisinopril"
                />
              </div>

              {/* Dosage */}
              <div>
                <label htmlFor="dosage" className="block text-sm font-medium text-gray-700">
                  Dosage
                </label>
                <input
                  type="text"
                  id="dosage"
                  name="dosage"
                  required
                  value={formData.dosage}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., 10mg"
                />
              </div>

              {/* Frequency */}
              <div>
                <label htmlFor="frequency" className="block text-sm font-medium text-gray-700">
                  Frequency
                </label>
                <select
                  id="frequency"
                  name="frequency"
                  required
                  value={formData.frequency}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                  <option value="daily">Daily</option>
                  <option value="twice_daily">Twice Daily</option>
                  <option value="three_times_daily">Three Times Daily</option>
                  <option value="four_times_daily">Four Times Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="as_needed">As Needed</option>
                </select>
              </div>

              {/* Time of Day */}
              <div>
                <span className="block text-sm font-medium text-gray-700 mb-2">
                  Time of Day
                </span>
                <div className="flex flex-wrap gap-3">
                  {['morning', 'afternoon', 'evening', 'night'].map((time) => (
                    <label key={time} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        className="rounded border-gray-300 text-indigo-600 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                        checked={formData.timeOfDay.includes(time)}
                        onChange={() => handleTimeOfDayChange(time)}
                      />
                      <span className="ml-2 text-sm text-gray-700 capitalize">{time}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Start Date */}
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700">
                  Start Date
                </label>
                <input
                  type="date"
                  id="startDate"
                  name="startDate"
                  required
                  value={formData.startDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* End Date (Optional) */}
              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
                  End Date (Optional)
                </label>
                <input
                  type="date"
                  id="endDate"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
              </div>

              {/* Instructions */}
              <div>
                <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
                  Instructions (Optional)
                </label>
                <textarea
                  id="instructions"
                  name="instructions"
                  rows="3"
                  value={formData.instructions}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="e.g., Take with food"
                ></textarea>
              </div>
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="mr-4 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isSubmitting ? 'Saving...' : 'Add Medication'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MedicationForm; 