// API service for MongoDB backend

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// User API calls
export const userApi = {
  // Get all users
  getUsers: async () => {
    try {
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  // Register a new user
  registerUser: async (userData) => {
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },
};

// Medication API calls
export const medicationApi = {
  // Get all medications for the current user
  getMedications: async (token) => {
    try {
      // If token is provided, include it in the headers
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/medications?userId=${encodeURIComponent(token)}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching medications:', error);
      throw error;
    }
  },

  // Get a single medication by ID
  getMedicationById: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error(`Error fetching medication with ID ${id}:`, error);
      throw error;
    }
  },

  // Create a new medication
  createMedication: async (medicationData, token) => {
    try {
      // If token is provided, include it in the headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // Also include userId in the request body for more reliable identification
        medicationData.userId = token;
      }
      
      const response = await fetch(`${API_URL}/medications`, {
        method: 'POST',
        headers,
        body: JSON.stringify(medicationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create medication');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating medication:', error);
      throw error;
    }
  },

  // Update a medication
  updateMedication: async (id, medicationData, token) => {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(medicationData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update medication');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error updating medication with ID ${id}:`, error);
      throw error;
    }
  },

  // Delete a medication
  deleteMedication: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/medications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete medication');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error deleting medication with ID ${id}:`, error);
      throw error;
    }
  },

  // Get medication details by name
  getMedicationDetails: async (medicationName) => {
    try {
      const response = await fetch(`${API_URL}/medicine/medication/${encodeURIComponent(medicationName)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch medication details');
      }
      return await response.json();
    } catch (error) {
      console.error('Error in getMedicationDetails:', error);
      throw error;
    }
  }
};

// Prescription API calls
export const prescriptionApi = {
  // Get all prescriptions for the current user
  getPrescriptions: async (token) => {
    try {
      const response = await fetch(`${API_URL}/prescriptions`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching prescriptions:', error);
      throw error;
    }
  },

  // Get recent prescriptions
  getRecentPrescriptions: async (limit = 5, token) => {
    try {
      // If token is provided, include it in the headers
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/prescriptions/recent?limit=${limit}&userId=${encodeURIComponent(token)}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent prescriptions:', error);
      throw error;
    }
  },

  // Create a new prescription
  createPrescription: async (prescriptionData, token) => {
    try {
      // If token is provided, include it in the headers
      const headers = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
        // Also include userId in the request body for more reliable identification
        prescriptionData.userId = token;
      }
      
      const response = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers,
        body: JSON.stringify(prescriptionData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create prescription');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating prescription:', error);
      throw error;
    }
  },

  // Record a prescription refill
  refillPrescription: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/prescriptions/${id}/refill`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to refill prescription');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error refilling prescription with ID ${id}:`, error);
      throw error;
    }
  }
};

// Reminder API calls
export const reminderApi = {
  // Get all reminders for the current user
  getReminders: async (token) => {
    try {
      const response = await fetch(`${API_URL}/reminders`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching reminders:', error);
      throw error;
    }
  },

  // Get today's reminders
  getTodayReminders: async (token) => {
    try {
      const response = await fetch(`${API_URL}/reminders/today`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching today\'s reminders:', error);
      throw error;
    }
  },

  // Mark a reminder as completed
  completeReminder: async (id, token) => {
    try {
      const response = await fetch(`${API_URL}/reminders/${id}/complete`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to mark reminder as completed');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error completing reminder with ID ${id}:`, error);
      throw error;
    }
  },

  // Snooze a reminder
  snoozeReminder: async (id, snoozeDuration, token) => {
    try {
      const response = await fetch(`${API_URL}/reminders/${id}/snooze`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ snoozeDuration }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to snooze reminder');
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error snoozing reminder with ID ${id}:`, error);
      throw error;
    }
  }
};

// Activity API calls
export const activityApi = {
  // Get recent activities
  getRecentActivities: async (limit = 10, token) => {
    try {
      // If token is provided, include it in the headers
      const headers = {};
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch(`${API_URL}/activities/recent?limit=${limit}&userId=${encodeURIComponent(token)}`, {
        headers
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },
  
  // Create a new activity log
  createActivity: async (activityData, token) => {
    try {
      const response = await fetch(`${API_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(activityData),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create activity log');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error creating activity log:', error);
      throw error;
    }
  }
};

// Export all API services
export default {
  userApi,
  medicationApi,
  prescriptionApi,
  reminderApi,
  activityApi
};