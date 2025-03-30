import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser, useAuth } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { medicationApi, activityApi, prescriptionApi ,reminderApi} from '../services/api';
import SearchBar from './SearchBar';
import GoogleTranslate from '../services/GoogleTranslate.jsx';
// import { medicationApi, activityApi, prescriptionApi, reminderApi } from '../services/api';
const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('saved');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [medications, setMedications] = useState([]);
  const [activities, setActivities] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [upcomingReminders, setUpcomingReminders] = useState([]);
  const [error, setError] = useState(null);
  const [reminders, setReminders] = useState([]);
  const [allReminders, setAllReminders] = useState([]);

  const [recommendedMedicines, setRecommendedMedicines] = useState([]);



  const generateRecommendationPrompt = (medicines) => `
    The user has taken the following medicines:
    ${medicines.map((med) => `- ${med.name}`).join("\n")}

    Your task:
    1. Identify medicines with **similar usage, function, and effectiveness** as alternatives.
    2. DO NOT suggest alternative chemical compounds or natural substances.
    3. Provide **commonly prescribed medicines** that serve the **same purpose** as the given medicines.
    4. Ensure the alternatives are actual **brand or generic medicines** used in real prescriptions.
    5. Provide the response in the following JSON format:

    [
      {
        "original": "Original Medicine",
        "alternatives": [
          {
            "name": "Alternative Medicine 1",
            "reason": "Why this alternative is recommended"
          },
          {
            "name": "Alternative Medicine 2",
            "reason": "Why this alternative is recommended"
          },
          {
            "name": "Alternative Medicine 3",
            "reason": "Why this alternative is recommended"
          }
        ]
      }
    ]
  `;

  // 🔹 Fetch medicine recommendations from Gemini API
  async function getRecommendations(medicines) {
    const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const prompt = generateRecommendationPrompt(medicines);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: prompt }],
              },
            ],
            generationConfig: {
              temperature: 0.2,
              maxOutputTokens: 1024,
            },
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || "Unknown error"}`);
      }

      const data = await response.json();
      console.log("Raw Gemini API Response:", data);

      // Extract text response from Gemini API
      const geminiText = data.candidates[0]?.content?.parts[0]?.text || "";

      // Find the JSON data in the response (removes unwanted markdown formatting)
      const jsonMatch = geminiText.match(/\[\s*\{.*\}\s*\]/s);
      if (!jsonMatch) {
        throw new Error("Could not parse medication data from API response");
      }

      // Parse JSON safely
      const medications = JSON.parse(jsonMatch[0]);
      console.log("Parsed Recommendations:", medications);
      return medications;
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      return [];
    }
  }


  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;

      try {
        setLoading(true);

        // Get auth token
        let token = "";
        try {
          token = user.primaryEmailAddress?.emailAddress || user.id;
        } catch (tokenError) {
          console.error("Error getting token:", tokenError);
          token = user.id || "anonymous";
        }

        // Fetch medications
        const medicationsData = await medicationApi.getMedications(token);
        setMedications(medicationsData);

        // Fetch recent activities
        const activitiesData = await activityApi.getRecentActivities(10, token);
        setActivities(activitiesData);

        // Fetch recent prescriptions
        const prescriptionsData = await prescriptionApi.getRecentPrescriptions(3, token);
        setPrescriptions(prescriptionsData);
        console.log("Fetched Prescriptions:", prescriptionsData);

        // Extract medicines from prescriptions
        if (!prescriptionsData || prescriptionsData.length === 0) {
          setLoading(false);
          return;
        }

        const medicines = prescriptionsData.map((prescription) => ({
          name: prescription.medication.name,
        }));

        console.log("Extracted Medicines:", medicines);

        // Fetch recommendations separately
        fetchRecommendations(medicines);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load your data. Please try again later.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoaded, user]);

  // 🔹 Fetch recommendations separately to avoid nesting
  const fetchRecommendations = async (medicines) => {
    try {
      if (!medicines || medicines.length === 0) return;
      setLoading(true);

      const recommendations = await getRecommendations(medicines);
      console.log("Fetched Recommendations:", recommendations);

      setRecommendedMedicines(recommendations);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching recommendations:", err);
      setLoading(false);
    }
  };

  // 🔹 Debug: Log changes when `recommendedMedicines` updates
  useEffect(() => {
    console.log("Updated Recommended Medicines:", recommendedMedicines);
  }, [recommendedMedicines]);
  
  // Fetch user's medications, activities, and prescriptions from the database
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoaded || !user) return;
      
      try {
        setLoading(true);
        
        // Get auth token - use a simpler direct approach
        let token = '';
        
        try {
          // Try different ways to get the token from Clerk
          token = user.primaryEmailAddress?.emailAddress || user.id;
        } catch (tokenError) {
          console.error('Error getting token:', tokenError);
          token = user.id || 'anonymous';
        }
        
        // Fetch medications
        const medicationsData = await medicationApi.getMedications(token);
        setMedications(medicationsData);
        
        // Fetch recent activities
        const activitiesData = await activityApi.getRecentActivities(10, token);
        setActivities(activitiesData);
        
        // Fetch recent prescriptions
        const prescriptionsData = await prescriptionApi.getRecentPrescriptions(3, token);
        setPrescriptions(prescriptionsData);
        
        // Call the fetchReminders function instead of directly calling the API
        // This ensures we use the same logic for initial load and refresh
        await fetchReminders(token);
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error);
        setError('Failed to load user data. Please try again later.');
        setLoading(false);
      }
    };  
    fetchUserData();
    if (location.hash) {
      const elementId = location.hash.substring(1); // Remove the '#' from the hash
      const element = document.getElementById(elementId); // Find the element by ID
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' }); // Scroll to the element
      }
    }
  }, [isLoaded, user , location]);
  


  
  // Mock data for the dashboard - will be replaced with real data
  const medicationReminders = [
    {
      id: 301,
      medication: 'Lisinopril 10mg',
      time: '8:00 AM',
      dosage: '1 tablet',
      status: 'taken'
    },
    {
      id: 302,
      medication: 'Metformin 500mg',
      time: '8:00 AM',
      dosage: '1 tablet',
      status: 'taken'
    },
    {
      id: 303,
      medication: 'Metformin 500mg',
      time: '6:00 PM',
      dosage: '1 tablet',
      status: 'upcoming'
    },
    {
      id: 304,
      medication: 'Atorvastatin 20mg',
      time: '9:00 PM',
      dosage: '1 tablet',
      status: 'upcoming'
    }
  ];
  
  const recentScans = [
    {
      id: 101,
      date: '2023-11-20',
      type: 'Prescription',
      status: 'Analyzed',
      medications: ['Lipitor 20mg', 'Metformin 500mg']
    },
    {
      id: 102,
      date: '2023-11-10',
      type: 'Prescription',
      status: 'Analyzed',
      medications: ['Advair Diskus 250/50']
    },
    {
      id: 103,
      date: '2023-10-05',
      type: 'Manual Entry',
      status: 'Analyzed',
      medications: ['Synthroid 100mcg']
    }
  ];

  const recentPrescriptions = [
    {
      id: 201,
      name: 'Lisinopril 10mg',
      doctor: 'Dr. Sarah Johnson',
      date: '2023-11-18',
      refillsRemaining: 2,
      nextRefill: '2023-12-18',
      pharmacy: 'Walgreens'
    },
    {
      id: 202,
      name: 'Metformin 500mg',
      doctor: 'Dr. Michael Chen',
      date: '2023-11-05',
      refillsRemaining: 5,
      nextRefill: '2023-12-05',
      pharmacy: 'CVS Pharmacy'
    },
    {
      id: 203,
      name: 'Atorvastatin 20mg',
      doctor: 'Dr. Sarah Johnson',
      date: '2023-10-22',
      refillsRemaining: 3,
      nextRefill: '2023-11-22',
      pharmacy: 'Walgreens'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
  // Mock data for new components
  const savingsData = [
    { month: 'Jan', savings: 45 },
    { month: 'Feb', savings: 85 },
    { month: 'Mar', savings: 120 },
    { month: 'Apr', savings: 178 },
    { month: 'May', savings: 156 },
    { month: 'Jun', savings: 210 },
    { month: 'Jul', savings: 248 },
    { month: 'Aug', savings: 320 },
    { month: 'Sep', savings: 265 },
    { month: 'Oct', savings: 312 },
    { month: 'Nov', savings: 352 },
    { month: 'Dec', savings: 421 },
  ];

  // Mock activity timeline data if no real activities are available
  const mockActivityTimeline = [
    {
      id: 401,
      type: 'scan',
      title: 'Prescription Scanned',
      description: 'You scanned a new prescription from Dr. Sarah Johnson',
      time: '2 hours ago'
    },
    {
      id: 402,
      type: 'savings',
      title: 'Savings Alert',
      description: 'Save 65% by switching Lipitor to generic alternative',
      time: '1 day ago'
    },
    {
      id: 403,
      type: 'reminder',
      title: 'Medication Reminder',
      description: 'Time to take your Metformin 500mg',
      time: '2 days ago'
    },
    {
      id: 404,
      type: 'refill',
      title: 'Refill Needed',
      description: 'Your Lisinopril prescription needs to be refilled',
      time: '3 days ago'
    }
  ];

  // Function to format saved medications from the database
  const formatMedications = () => {
    if (!medications || medications.length === 0) {
      return [];
    }
    
    return medications.map(med => ({
      id: med._id,
      originalMed: `${med.name} ${med.dosage}`,
      date: med.createdAt,
      description: med.instructions,
      frequency: med.frequency,
      timeOfDay: med.timeOfDay.join(', '),
      active: med.active
    }));
  };

  // Replace the fetchReminders function
  const fetchReminders = async (userToken = null) => {
    if ((!isLoaded || !user) && !userToken) return;
    
    try {
      // Use provided token or get from user
      const userIdentifier = userToken || user.primaryEmailAddress?.emailAddress || user.id;
      
      // console.log('🔄 Fetching reminders with user identifier:', userIdentifier);
      // console.log('Current time:', new Date().toLocaleString(), 'Timezone:', Intl.DateTimeFormat().resolvedOptions().timeZone);
      
      // First try to fetch all reminders to see what's available
      // console.log('Fetching ALL reminders first to see what exists:');
      const allRemindersData = await reminderApi.getReminders(userIdentifier);
      // console.log('ALL reminders from API:', allRemindersData?.map(r => ({
      //   id: r._id,
      //   status: r.status,
      //   scheduledTime: new Date(r.scheduledTime).toLocaleString(),
      //   medication: r.medication
      // })));
      
      // Store all reminders in state
      setAllReminders(allRemindersData || []);
      
      // Now fetch today's reminders
      // console.log('Now fetching TODAY reminders:');
      const remindersData = await reminderApi.getTodayReminders(userIdentifier);
      // console.log('TODAY reminders from API:', remindersData);
      // console.log('all reminders from API:', allRemindersData);
      
      if (!remindersData || remindersData.length === 0) {
        // console.log('⚠️ No reminders for today - this could be due to:');
        // console.log('1. No reminders exist at all');
        // console.log('2. Reminders exist but are not scheduled for today');
        // console.log('3. Reminders exist for today but have wrong status (completed/missed)');
        // console.log('4. Date filtering on the backend is too restrictive');
      } else {
        // console.log('✅ Found reminders for today:', remindersData.length);
      }
      
      setUpcomingReminders(remindersData || []);
    } catch (error) {
      console.error('❌ Error fetching reminders:', error);
    }
  };
  
  // Format activities for the timeline
  const formatActivities = () => {
    if (!activities || activities.length === 0) {
      return [];
    }
    
    return activities.map(activity => {
      let activityDetails = {
        id: activity._id,
        time: new Date(activity.timestamp).toLocaleString(),
      };
      
      switch (activity.type) {
        case 'medication_added':
          activityDetails.type = 'addition';
          activityDetails.title = 'Added new medication';
          activityDetails.description = `Added ${activity.details?.name || 'a medication'} to your list`;
          break;
        case 'medication_modified':
          activityDetails.type = 'update';
          activityDetails.title = 'Updated medication';
          activityDetails.description = `Updated ${activity.details?.name || 'a medication'} details`;
          break;
        case 'medication_deleted':
          activityDetails.type = 'deletion';
          activityDetails.title = 'Removed medication';
          activityDetails.description = `Removed ${activity.details?.name || 'a medication'} from your list`;
          break;
        case 'medication_taken':
          activityDetails.type = 'taken';
          activityDetails.title = 'Medication taken';
          activityDetails.description = `Took your ${activity.medication?.name || 'medication'}`;
          break;
        default:
          activityDetails.type = 'scan';
          activityDetails.title = 'Scanned prescription';
          activityDetails.description = 'Processed a prescription scan';
      }
      
      return activityDetails;
    });
  };

  // Function to get user's full name from Clerk
  const getUserFullName = () => {
    if (!isLoaded || !user)  setLoading(false);
    return `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.username || 'User';
  };

  // Function to get user's initials from Clerk
  const getUserInitials = () => {
    if (!isLoaded || !user)  setLoading(false);
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    if (firstName && lastName) {
      return `${firstName.charAt(0)}${lastName.charAt(0)}`;
    } else if (firstName) {
      return firstName.charAt(0);
    } else if (user.username) {
      return user.username.charAt(0);
    }
    return 'U';
  };

  // Function to get user's email from Clerk
  const getUserEmail = () => {
    if (!isLoaded || !user)  setLoading(false);
    return user.primaryEmailAddress?.emailAddress || 'No email available';
  };

  // Function to get user's profile image URL from Clerk
  const getUserImageUrl = () => {
    if (!isLoaded || !user)  setLoading(false);
    return user.imageUrl || '';
  };

  // Now that all functions are defined, create the activityTimeline
  const activityTimeline = activities.length > 0 ? formatActivities() : mockActivityTimeline;

  // Function to format prescriptions from the database
  const formatPrescriptions = () => {
    if (!prescriptions || prescriptions.length === 0) {
      return [];
    }
    
    return prescriptions.map(prescription => ({
      id: prescription._id,
      name: prescription.medication?.name || 'Unknown Medication',
      doctor: prescription.doctor || 'Unknown Doctor',
      date: prescription.prescribedDate || prescription.createdAt,
      refillsRemaining: prescription.refills?.remaining || 0,
      nextRefill: calculateNextRefillDate(prescription.prescribedDate || prescription.createdAt),
      pharmacy: prescription.pharmacy || 'Not specified'
    }));
  };
  
  // Helper function to calculate next refill date (typically 30 days after prescription date)
  const calculateNextRefillDate = (date) => {
    if (!date) return new Date();
    
    const prescriptionDate = new Date(date);
    const nextRefillDate = new Date(prescriptionDate);
    nextRefillDate.setDate(prescriptionDate.getDate() + 30);
    return nextRefillDate;
  };

  // Format upcoming reminders
  const formatReminders = () => {
    // if (!allReminders || allReminders.length === 0) {
    //   return (
    //     <div className="flex flex-col items-center justify-center py-8 px-4">
    //       <div className="rounded-full bg-gray-100 p-3 mb-3">
    //         <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    //           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    //         </svg>
    //       </div>
    //       <p className="text-gray-500 text-center font-medium mb-1">No reminders found</p>
    //       <p className="text-gray-400 text-sm text-center">Create reminders from the Manage page</p>
    //       <Link to="/reminders" className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors duration-200">
    //         Create Reminder
    //       </Link>
    //     </div>
    //   );
    // }

    // Sort reminders by scheduledTime
    // const sortedReminders = [...allReminders]
    //   .filter(reminder => ['pending', 'snoozed'].includes(reminder.status))
    //   .sort((a, b) => new Date(a.scheduledTime) - new Date(b.scheduledTime))
    //   .slice(0, 5); // Show the next 5 reminders

    // const allReminders = [...allReminders]
    
    if (allReminders.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-8 px-4">
          <div className="rounded-full bg-gray-100 p-3 mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-gray-500 text-center font-medium">All caught up!</p>
          <p className="text-gray-400 text-sm text-center">No pending reminders</p>
          <button 
            onClick={createTestReminder}
            className="mt-4 px-4 py-2 bg-indigo-100 text-indigo-600 rounded-lg text-sm font-medium hover:bg-indigo-200 transition-colors duration-200"
          >
            Create Test Reminder
          </button>
        </div>
      );
    }

    return (
      <ul className="space-y-3">
        {allReminders.map((reminder) => {
          // Check if the medication is populated already from the API response
          let medicationDisplay;
          
          if (reminder.medication && typeof reminder.medication === 'object' && reminder.medication.name) {
            // If the medication is already populated by the backend
            medicationDisplay = reminder.medication;
          } else {
            // Otherwise find it in our medications array
            const matchedMedication = medications.find(med => med._id === reminder.medication);
            medicationDisplay = matchedMedication || { name: 'Unknown Medication', dosage: 'Unknown Dosage' };
          }
          
          const reminderTime = new Date(reminder.scheduledTime);
          const formattedTime = reminderTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          const formattedDate = reminderTime.toLocaleDateString([], { month: 'short', day: 'numeric' });
          const isToday = new Date().toDateString() === reminderTime.toDateString();
          
          return (
            <li key={reminder._id} className="py-3 px-4 flex justify-between items-center bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-200">
              <div className="flex items-center space-x-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                  reminder.status === 'pending' ? 'bg-indigo-100 text-indigo-600' : 'bg-orange-100 text-orange-600'
                }`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <div className="font-medium text-gray-800">{medicationDisplay.name}</div>
                  <div className="text-sm text-gray-500">{medicationDisplay.dosage}</div>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      reminder.status === 'pending' ? 'bg-indigo-100 text-indigo-800' : 'bg-orange-100 text-orange-800'
                    }`}>
                      {/* {reminder.status === 'pending' ? 'Pending' : 'Snoozed'} */}
                    </span>
                    {reminder.notes && (
                      <span className="ml-2 text-xs text-gray-500">{reminder.notes}</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end">
                <div className={`text-sm font-medium ${isToday ? 'text-indigo-600' : 'text-gray-600'}`}>
                  {formattedTime}
                </div>
                <div className="text-xs text-gray-500">
                  {isToday ? 'Today' : formattedDate}
                </div>
                <div className="flex space-x-1 mt-2">
                  {reminder.status === 'pending' && (
                    <>
                      <button
                        onClick={async () => {
                          const userIdentifier = user.primaryEmailAddress?.emailAddress || user.id;
                          await reminderApi.completeReminder(reminder._id, userIdentifier);
                          fetchReminders();
                        }}
                        className="p-1.5 text-green-600 hover:bg-green-100 rounded-full transition-colors duration-200"
                        title="Mark as completed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </button>
                      <button
                        onClick={async () => {
                          const userIdentifier = user.primaryEmailAddress?.emailAddress || user.id;
                          await reminderApi.snoozeReminder(reminder._id, 15, userIdentifier);
                          fetchReminders();
                        }}
                        className="p-1.5 text-orange-600 hover:bg-orange-100 rounded-full transition-colors duration-200"
                        title="Snooze for 15 minutes"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    );
  };

  // Show loading screen if user data is not loaded yet
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* App logo and name */}
            <div className="flex items-center justify-center mb-8">
              <svg className="h-12 w-12 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <span className="ml-3 text-3xl font-bold text-indigo-600">MediScanAI</span>
            </div>
            
            {/* Loading spinner */}
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600 mx-auto"></div>
            <h2 className="mt-8 text-lg font-medium text-gray-600">Loading your dashboard...</h2>
            <p className="mt-2 text-sm text-gray-500">Please wait while we fetch your personalized information</p>
          </div>
          
          {/* Loading skeleton for content */}
          <div className="mt-16 max-w-3xl mx-auto">
            <div className="animate-pulse">
              <div className="rounded-xl bg-gray-200 h-32 w-full mb-6"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="col-span-2 rounded-xl bg-gray-200 h-80"></div>
                <div className="rounded-xl bg-gray-200 h-80"></div>
              </div>
              <div className="rounded-xl bg-gray-200 h-64 mb-6"></div>
              <div className="rounded-xl bg-gray-200 h-48"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  // Handle prescription refill
  const handleRefill = async (prescriptionId) => {
    if (!isLoaded || !user) return;
    
    try {
      // Get token
      const token = user.primaryEmailAddress?.emailAddress || user.id;
      
      // Call the refill API
      await prescriptionApi.refillPrescription(prescriptionId, token);
      
      // Refresh prescriptions data
      const updatedPrescriptions = await prescriptionApi.getRecentPrescriptions(3, token);
      setPrescriptions(updatedPrescriptions);
      
      // Show success message (could add a toast notification here)
      // console.log("Prescription refilled successfully");
    } catch (error) {
      console.error("Error refilling prescription:", error);
      // Show error message
    }
  };
  
  // Function to create a test prescription (for development testing)
  const createTestPrescription = async () => {
    if (!isLoaded || !user) return;
    
    try {
      // Get token
      const token = user.primaryEmailAddress?.emailAddress || user.id;
      
      // First create a medication
      const medicationData = {
        name: "Test Medication " + Date.now(),
        dosage: "10mg",
        frequency: "daily",
        timeOfDay: ["morning"],
        startDate: new Date(),
        instructions: "Take with food",
        active: true
      };
      
      const savedMedication = await medicationApi.createMedication(medicationData, token);
      // console.log("Created test medication:", savedMedication);
      
      // Then create a prescription
      const prescriptionData = {
        medication: savedMedication._id,
        doctor: "Dr. Test Doctor",
        prescribedDate: new Date(),
        refills: {
          total: 3,
          remaining: 3
        },
        pharmacy: "Test Pharmacy",
        notes: "Test prescription created from dashboard",
        status: "active"
      };
      
      const savedPrescription = await prescriptionApi.createPrescription(prescriptionData, token);
      //  console.log("Created test prescription:", savedPrescription);
      
      // Refresh prescription data
      const updatedPrescriptions = await prescriptionApi.getRecentPrescriptions(3, token);
      setPrescriptions(updatedPrescriptions);
      
      alert("Test prescription created successfully!");
    } catch (error) {
      console.error("Error creating test prescription:", error);
      alert("Error creating test prescription: " + error.message);
    }
  };
  
  // Create a test reminder for immediate testing
  const createTestReminder = async () => {
    if (!isLoaded || !user) return;
    
    try {
      // Get the user identifier
      const userIdentifier = user.primaryEmailAddress?.emailAddress || user.id;
      // console.log('Creating test reminder for user:', userIdentifier);
      
      // First ensure we have a medication to reference
      let medicationId;
      let medication;
      
      // Check if we already have any medications
      if (medications.length > 0) {
        medication = medications[0];
        medicationId = medication._id;
        // console.log('Using existing medication:', medication.name, medicationId);
      } else {
        // Create a test medication
        const medicationData = {
          name: "Test Medication",
          dosage: "10mg",
          frequency: "daily",
          startDate: new Date(),
          userId: userIdentifier
        };
        
        // console.log('Creating new test medication:', medicationData);
        const newMed = await medicationApi.createMedication(medicationData, userIdentifier);
        medicationId = newMed._id;
        medication = newMed;
        
        // console.log('Created new medication with ID:', medicationId);
        
        // Update medications state
        setMedications([...medications, newMed]);
      }
      
      // Create a reminder for 5 minutes from now
      const scheduledTime = new Date();
      scheduledTime.setMinutes(scheduledTime.getMinutes() + 5);
      
      const reminderData = {
        medication: medicationId,
        scheduledTime: scheduledTime,
        notes: "Test reminder created from Dashboard",
        status: "pending",
        userId: userIdentifier
      };
      
      // console.log('Creating test reminder with data:', reminderData);
      
      const savedReminder = await reminderApi.createReminder(reminderData, userIdentifier);
      // console.log('Test reminder created:', savedReminder);
      
      // Fetch reminders again to update the display
      fetchReminders();
      
    } catch (error) {
      console.error('Error creating test reminder:', error);
    }
  };
  
  // Add these handler functions for edit and delete prescriptions
  const handleEditPrescription = async (prescriptionId) => {
    if (!isLoaded || !user) return;
    
    try {
      // Get user identifier
      const userIdentifier = user.primaryEmailAddress?.emailAddress || user.id;
      
      // Find the prescription to edit
      const prescriptionToEdit = prescriptions.find(p => p._id === prescriptionId);
      
      if (!prescriptionToEdit) {
        console.error('Prescription not found');
        return;
      }
      
      // For this example, we'll just update a simple field like the doctor's name
      // In a real app, you would open a modal or navigate to an edit page
      const updatedDoctor = prompt('Enter new doctor name:', prescriptionToEdit.doctor);
      
      if (updatedDoctor === null) return; // User cancelled
      
      // Prepare update data
      const updateData = {
        ...prescriptionToEdit,
        doctor: updatedDoctor
      };
      
      // Call the API to update the prescription
      await prescriptionApi.updatePrescription(prescriptionId, updateData, userIdentifier);
      
      // Refresh the prescriptions list
      const updatedPrescriptions = await prescriptionApi.getRecentPrescriptions(3, userIdentifier);
      setPrescriptions(updatedPrescriptions);
      
    } catch (error) {
      console.error('Error updating prescription:', error);
      alert('Failed to update prescription. Please try again.');
    }
  };
  
  const handleDeletePrescription = async (prescriptionId) => {
    if (!isLoaded || !user) return;
    
    try {
      // Get user identifier
      const userIdentifier = user.primaryEmailAddress?.emailAddress || user.id;
      
      // Confirm deletion
      if (!confirm('Are you sure you want to delete this prescription?')) {
        return;
      }
      
      // Call the API to delete the prescription
      await prescriptionApi.deletePrescription(prescriptionId, userIdentifier);
      
      // Refresh the prescriptions list
      const updatedPrescriptions = await prescriptionApi.getRecentPrescriptions(3, userIdentifier);
      setPrescriptions(updatedPrescriptions);
      
    } catch (error) {
      console.error('Error deleting prescription:', error);
      alert('Failed to delete prescription. Please try again.');
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-700 to-purple-700 shadow-xl fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2 text-white md:hidden focus:outline-none focus:ring-2 focus:ring-white"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
                <div className="h-9 w-9 rounded-lg bg-white flex items-center justify-center shadow-md transition-transform duration-300 hover:scale-105">
                  <span className="font-bold text-lg text-indigo-700">M</span>
                </div>
                <span className="ml-3 text-xl font-bold text-white">
                  <button onClick={() => navigate('/')} className="focus:outline-none transition-transform duration-300 hover:scale-105">MediScanAI</button>
                </span>
            <GoogleTranslate/>

              </div>
            </div>
            
            {/* Search Bar */}
            {/* <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border-0 rounded-full leading-5 bg-indigo-600 bg-opacity-30 text-white placeholder-indigo-200 focus:outline-none focus:ring-2 focus:ring-white focus:text-white sm:text-sm transition-all duration-200"
                  placeholder="Search medications, pharmacies..."
                />
              </div>
            </div> */}
            <SearchBar />
            
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-3">
              <Link 
                to="/scan-prescription"
                className="w-32 inline-flex items-center px-3.5 py-1.5 border border-transparent rounded-full shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Scan New
              </Link>
              <Link
                to="/scan-prescription"
                className="inline-flex items-center px-3.5 py-1.5 border border-indigo-300 rounded-full shadow-sm text-sm font-medium text-white bg-transparent hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                </svg>
                Upload
              </Link>
            </div>
            
            {/* User Profile & Notifications */}
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              <div className="relative">
                <button 
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-1 rounded-full text-white hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150"
                >
                  <span className="sr-only">View notifications</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-400 ring-2 ring-indigo-600"></span>
                </button>
                
                {/* Notifications Dropdown */}
                {notificationsOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-50 overflow-hidden">
                    <div className="py-1">
                      <div className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500">
                        <h3 className="text-sm font-medium text-white flex items-center justify-between">
                          <span>Notifications</span>
                          <span className="bg-white text-indigo-700 px-2 py-0.5 rounded-full text-xs">3 New</span>
                        </h3>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {[1, 2, 3].map((item) => (
                          <a key={item} href="#" className="block px-4 py-3 hover:bg-indigo-50 border-b border-gray-100 transition-colors duration-150">
                            <div className="flex">
                              <div className="flex-shrink-0">
                                <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                  </svg>
                                </div>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">Price Alert</p>
                                <p className="text-sm text-gray-500">Atorvastatin is now 15% cheaper at ValueMeds!</p>
                                <p className="text-xs text-gray-400 mt-1">10 minutes ago</p>
                              </div>
                            </div>
                          </a>
                        ))}
                      </div>
                      <a href="#" className="block text-center px-4 py-2 text-sm text-indigo-600 hover:bg-indigo-50 font-medium">
                        View all notifications
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              {/* User Profile */}
              <div className="relative ml-3">
                {isLoaded && user ? (
                  <div>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center max-w-xs text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white"
                    >
                      <span className="sr-only">Open user menu</span>
                      <img
                        className="h-8 w-8 rounded-full bg-gray-300 object-cover"
                        src={getUserImageUrl()}
                        alt=""
                      />
                      <span className="hidden md:block ml-2 text-sm font-medium text-white">{getUserFullName()}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" className="hidden md:block h-4 w-4 ml-1 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                ) : (
                  <div className="animate-pulse">
                    <div className="h-8 w-8 rounded-full bg-indigo-400"></div>
                  </div>
                )}

                {/* Profile dropdown */}
                {profileDropdownOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                    <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="user-menu">
                      <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Your Profile</a>
                      <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">Settings</a>
                      <button
                        onClick={() => {
                          window.Clerk.signOut().then(() => {
                            navigate('/');
                          });
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Mobile Quick Actions */}
          <div className="md:hidden py-2 flex justify-between border-t border-indigo-500">
            <Link to="/scan-prescription" className="flex-1 inline-flex flex-col items-center px-3 py-1 text-xs font-medium text-indigo-100 hover:text-white hover:bg-indigo-500 rounded transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
              <span>Scan</span>
            </Link>
            <Link to="/upload" className="flex-1 inline-flex flex-col items-center px-3 py-1 text-xs font-medium text-indigo-100 hover:text-white hover:bg-indigo-500 rounded transition-colors duration-150">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              <span>Upload</span>
            </Link>
            {/* Add more links as needed */}
          </div>
        </div>
      </header>

      {/* Main Content with Sidebar and Dashboard */}
      <div className="pt-16 md:pt-16 flex">
        {/* Sidebar Navigation - Desktop */}
        <div className={`bg-white shadow-xl z-20 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-300 ease-in-out w-64 md:pt-16 pt-0 md:static md:h-screen md:overflow-y-auto hidden md:flex rounded-tr-xl rounded-br-xl`}>
          <div className="h-full flex flex-col">
            {/* Close button - mobile only */}
            <div className="md:hidden p-4 flex justify-end">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors duration-200 focus:outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User Profile Summary */}
            <div className="px-5 py-6 border-b border-gray-200 z-1">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-14 w-14 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                    {getUserInitials()}
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Welcome back,</p>
                  <h3 className="text-lg font-bold text-gray-900">{getUserFullName()}</h3>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="px-3 py-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { name: "Dashboard", icon: "M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6", path: "/dashboard" },
                  { name: "My Prescriptions", icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", path: "/prescriptions"},
                  { name: "Saved Medications", icon: "M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z", path: "/dashboard#saved-alternatives"},
                  { name: "Nearby Pharmacies", icon: "M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 10a3 3 0 11-6 0 3 3 0 016 0z", path: "/nearby-pharmacies" },
                  ].map((item) => (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                      location.hash === item.path.split('#')[1]
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md' 
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className={`mr-3 h-5 w-5 ${item.active ? 'text-white' : 'text-gray-500 group-hover:text-indigo-500'}`} 
                      fill="none" viewBox="0 0 24 24" stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                    </svg>
                    <span className="flex-1">{item.name}</span>
                    {item.count && (
                      <span className={`ml-auto inline-block px-2 py-0.5 rounded-full text-xs font-medium ${item.active ? 'bg-white text-indigo-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {item.count}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
              <div className="mt-8">
                <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Support
                </h3>
                <div className="mt-1 space-y-1">
                  {[
                    { name: 'Account Settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
                    { name: 'Help & Support', icon: 'M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z' }
                  ].map((item) => (
                    <a
                      key={item.name}
                      href="#"
                      className="group flex items-center px-3 py-2 text-sm font-medium rounded-lg text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-150"
                    >
                      <svg 
                        xmlns="http://www.w3.org/2000/svg" 
                        className="mr-3 h-5 w-5 text-gray-500 group-hover:text-indigo-500" 
                        fill="none" viewBox="0 0 24 24" stroke="currentColor"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
            </nav>
            
            {/* Quick Scan Button & Storage Usage */}
            <div className="p-4 border-t border-gray-200">
              <button className="w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-lg shadow-md text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Quick Scan
              </button>
              
              {/* <div className="mt-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div className="flex justify-between text-sm font-medium text-gray-900">
                  <span>Storage</span>
                  <span className="text-indigo-600 font-semibold">65% used</span>
                </div>
                <div className="mt-2 relative pt-1">
                  <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                    <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"></div>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500 flex justify-between">
                  <span>6.5 GB used</span>
                  <span>10 GB total</span>
                </div>
              </div> */}
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Card with Stats */}
            <div className="mb-8 bg-white max-sm:mt-12 max-lg:mt-10 shadow-lg rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100">
              <div className="p-6 sm:p-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold">Welcome back, {getUserFullName()}</h1>
                    <p className="mt-2 text-indigo-100 text-sm sm:text-base">
                      Here's what's happening with your medications and prescriptions
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-0 flex space-x-3">
                    <Link to="/scan-prescription">
                      <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-full shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        </svg>
                        New Scan
                      </button>
                    </Link>
                    <button className="inline-flex items-center px-4 py-2 border border-white rounded-full text-sm font-medium text-white bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-200">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Total Savings</p>
                    <h3 className="text-lg font-bold text-gray-900 flex items-center">
                      $732.42
                      <span className="ml-2 text-xs font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">+12% ↑</span>
                    </h3>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-purple-50">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Medications</p>
                    <h3 className="text-lg font-bold text-gray-900">{medications.length || 0} medications</h3>
                  </div>
                </div>
                <div className="flex items-center p-3 rounded-xl transition-all duration-200 hover:bg-indigo-50">
                  <div className="flex-shrink-0 h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center shadow-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Average Savings</p>
                    <h3 className="text-lg font-bold text-gray-900">72%</h3>
                  </div>
                </div>
              </div> */}
            </div>

            {/* Dashboard grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mt-8">
              {/* Medications column */}
              <div className="md:col-span-4">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
                  <div className="border-b px-5 py-4 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      Your Medications
                    </h2>
                    <Link to="/medications" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
                  </div>
                  <div className="p-5">
                    {medications && medications.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {medications.map((med) => (
                          <li key={med._id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors duration-200">
                            <div>
                              <div className="font-medium text-gray-800">{med.name} {med.dosage} <button 
  onClick={() => navigate(`/medicine/${encodeURIComponent(med.name)}`)}
  className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
>
  Learn More
</button>
</div>
                              <div className="text-sm text-gray-500">{med.frequency}{med.timeOfDay && med.timeOfDay.length > 0 ? ` • ${med.timeOfDay.join(', ')}` : ''}</div>
                            </div>
                            <div>
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${med.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                {med.active ? 'Active' : 'Inactive'}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center py-8 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mb-2">No medications added yet.</p>
                        <Link to="/medications/add" className="text-indigo-600 hover:text-indigo-800 font-medium text-sm">
                          + Add medication
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Upcoming reminders column */}
              <div className="md:col-span-4">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100 overflow-hidden">
                  <div className="flex items-center justify-between p-5 border-b">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      All Reminders
                    </h2>
                    <div className="flex space-x-4">
                      <button 
                        onClick={fetchReminders} 
                        className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        Refresh
                      </button>
                      <Link to="/reminders" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                        Manage
                      </Link>
                    </div>
                  </div>
                  <div className="p-5">
                    {formatReminders()}
                  </div>
                </div>
              </div>

              {/* Prescriptions column */}
              <div className="md:col-span-4">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
                  <div className="border-b px-5 py-4 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Recent Prescriptions
                    </h2>
                    <Link to="/prescriptions" className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</Link>
                  </div>
                  <div className="p-5">
                    {prescriptions && prescriptions.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {formatPrescriptions().map((prescription) => (
                          <li key={prescription.id} className="py-3 flex justify-between items-center hover:bg-gray-50 px-2 rounded-lg transition-colors duration-200">
                            <div>
                              <div className="font-medium text-gray-800">{prescription.name}</div>
                              <div className="text-sm text-gray-500">Dr. {prescription.doctor}</div>
                              <div className="text-xs text-gray-400">{new Date(prescription.date).toLocaleDateString()}</div>
                            </div>
                            <div className="flex flex-col items-end">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-2`}>
                                {prescription.refillsRemaining} refills left
                              </span>
                              <div className="flex space-x-2">
                                <button 
                                  onClick={() => handleEditPrescription(prescription.id)}
                                  className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors duration-200"
                                  title="Edit prescription"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                  </svg>
                                </button>
                                <button 
                                  onClick={() => handleDeletePrescription(prescription.id)}
                                  className="p-1.5 text-red-600 hover:bg-red-100 rounded-full transition-colors duration-200"
                                  title="Delete prescription"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center py-8 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <p className="mb-2">No prescriptions added yet.</p>
                        <button 
                          onClick={createTestPrescription}
                          className="text-indigo-600 hover:text-indigo-800 font-medium text-sm"
                        >
                          + Add prescription
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            
              {/* Activity column */}
              <div className="md:col-span-8">
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-full border border-gray-100">
                  <div className="border-b px-5 py-4 flex justify-between items-center">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Recent Activity
                    </h2>
                    <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">View All</button>
                  </div>
                  <div className="p-5">
                    {activityTimeline && activityTimeline.length > 0 ? (
                      <ul className="divide-y divide-gray-100">
                        {activityTimeline.map((activity) => (
                          <li key={activity.id} className="py-3 flex items-start hover:bg-gray-50 px-2 rounded-lg transition-colors duration-200">
                            <div className="mr-4 mt-1">
                              <div className={`h-9 w-9 rounded-full flex items-center justify-center shadow-sm ${
                                activity.type === 'taken' ? 'bg-green-100' : 
                                activity.type === 'addition' ? 'bg-blue-100' : 
                                activity.type === 'update' ? 'bg-yellow-100' : 
                                activity.type === 'deletion' ? 'bg-red-100' : 'bg-purple-100'
                              }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${
                                  activity.type === 'taken' ? 'text-green-600' : 
                                  activity.type === 'addition' ? 'text-blue-600' : 
                                  activity.type === 'update' ? 'text-yellow-600' : 
                                  activity.type === 'deletion' ? 'text-red-600' : 'text-purple-600'
                                }`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={
                                    activity.type === 'taken' ? 'M5 13l4 4L19 7' : 
                                    activity.type === 'addition' ? 'M12 6v6m0 0v6m0-6h6m-6 0H6' : 
                                    activity.type === 'update' ? 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15' : 
                                    activity.type === 'deletion' ? 'M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' : 
                                    'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                                  } />
                                </svg>
                              </div>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-gray-800">{activity.title}</div>
                              <div className="text-sm text-gray-500">{activity.description}</div>
                              <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                            </div>
                            <div className="ml-2">
                              <button className="text-indigo-600 hover:text-indigo-800 text-sm">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-gray-500 text-center py-12 px-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <p className="mb-2">No activity recorded yet.</p>
                        <p className="text-sm text-gray-400">Your recent medication activities will appear here</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              
              {/* Stats & Quick Actions */}
              <div className="md:col-span-4">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 mb-6">
                  <div className="border-b px-5 py-4">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Quick Actions
                    </h2>
                  </div>
                  <div className="p-5 space-y-3">
                    <Link 
                      to="/medications/add" 
                      className="block w-full text-center py-2.5 px-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-sm font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Add Medication
                    </Link>
                    <Link 
                      to="/reminders" 
                      className="block w-full text-center py-2.5 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Manage Reminders
                    </Link>
                    <button 
                      onClick={createTestReminder}
                      className="block w-full text-center py-2.5 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                      Create Test Reminder
                    </button>
                    <button 
                      onClick={createTestPrescription}
                      className="block w-full text-center py-2.5 px-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all duration-200 font-medium flex items-center justify-center"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Create Test Prescription
                    </button>
                  </div>
                </div>
                
                {/* Storage Usage Card */}
                <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 mb-6">
                  <div className="border-b px-5 py-4">
                    <h2 className="font-semibold text-gray-800 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                      </svg>
                      Storage
                    </h2>
                  </div>
                  <div className="p-5">
                    <div className="flex justify-between text-sm font-medium text-gray-900">
                      <span>Used Space</span>
                      <span className="text-indigo-600 font-semibold">65% used</span>
                    </div>
                    <div className="mt-3 relative pt-1">
                      <div className="overflow-hidden h-3 text-xs flex rounded-full bg-gray-200">
                        <div style={{ width: "65%" }} className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"></div>
                      </div>
                    </div>
                    <div className="mt-2 text-xs text-gray-500 flex justify-between">
                      <span>6.5 GB used</span>
                      <span>10 GB total</span>
                    </div>
                    <button className="mt-4 w-full text-center py-2 px-4 border border-indigo-300 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-all duration-200 text-sm font-medium">
                      Manage Storage
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* End of Dashboard grid */}

            {recommendedMedicines.length > 0 && (
  <div className="p-6 bg-white border-t border-gray-200 rounded-lg shadow-md mt-4">
    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16l-4-4m0 0l4-4m-4 4h16" />
      </svg>
      Recommended Alternatives
    </h2>

    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {recommendedMedicines.map((med, index) => (
        <div key={index} className="bg-gray-50 p-4 border border-gray-200 rounded-lg shadow-sm">
          <h3 className="text-md font-semibold text-gray-900 mb-2">{med.original}</h3>
          <ul className="space-y-2">
            {med.alternatives.map((alt, i) => (
              <li key={i} className="flex items-start text-sm text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <div>
                  <span className="font-medium text-gray-900">{alt.name}</span>
                  <p className="text-xs text-gray-600">{alt.reason}</p>
                </div>
              </li>
            ))}
          </ul>
          <button 
            onClick={() => window.location.href = `/medicine/${encodeURIComponent(med.original)}`}
            className="mt-3 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-md shadow-sm transition-colors duration-150 ease-in-out flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            View Details
          </button>
        </div>
      ))}
    </div>
  </div>
)}

            {/* Dashboard Tabs */}
            <div className="mb-6 bg-white rounded-xl shadow-md p-1.5 mt-8 border border-gray-100" id='saved-alternatives'>
              <nav className="flex space-x-2" aria-label="Tabs">
                {[
                  { name: 'Saved Alternatives', key: 'saved', icon: 'M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z' },
                  { name: 'Recent Scans', key: 'scans', icon: 'M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z' },
                  { name: 'Account Settings', key: 'settings', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-medium text-sm transition-all duration-200`}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${activeTab === tab.key ? 'text-white' : 'text-gray-500'} mr-2`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
                    </svg>
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Saved Alternatives Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                {loading ? (
                  <div className="p-6 text-center">
                    <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-3"></div>
                    <p className="text-gray-600">Loading your saved medications...</p>
                  </div>
                ) : error ? (
                  <div className="p-6 text-center bg-white rounded-xl shadow-md">
                    <div className="rounded-full bg-red-100 p-3 mx-auto mb-4 w-16 h-16 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-800 font-medium mb-2">{error}</p>
                    <button 
                      onClick={() => window.location.reload()}
                      className="text-indigo-600 font-medium hover:text-indigo-800"
                    >
                      Try Again
                    </button>
                  </div>
                ) : medications.length === 0 ? (
                  <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-8 text-center">
                    <div className="flex justify-center mb-6">
                      <div className="p-4 bg-indigo-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No Medications Found
                    </h3>
                    <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                      You haven't saved any medications yet. Scan a prescription to identify and save medications.
                    </p>
                    <Link 
                      to="/scan-prescription" 
                      className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg font-medium shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                    >
                      Scan a Prescription
                    </Link>
                  </div>
                ) : (
                  medications.map((med) => {
                    const formattedMed = {
                      id: med._id,
                      originalMed: `${med.name} ${med.dosage}`,
                      date: med.createdAt,
                      description: med.instructions,
                      frequency: med.frequency,
                      timeOfDay: med.timeOfDay ? med.timeOfDay.join(', ') : '',
                      active: med.active
                    };
                    return (
                      <div key={med._id} className="bg-white overflow-hidden shadow-md rounded-xl divide-y divide-gray-200 transition-all duration-300 hover:shadow-lg">
                        <div className="px-6 py-5 flex justify-between items-center">
                          <div>
                            <h3 className="text-lg font-bold text-gray-900">{formattedMed.originalMed} <button 
  onClick={() => navigate(`/medicine/${encodeURIComponent(formattedMed.originalMed)}`)}
  className="px-2 py-1 bg-indigo-600 text-white text-xs rounded-md hover:bg-indigo-700 transition-colors"
>
  Learn More
</button>
</h3>
                            <p className="mt-1 text-sm text-gray-500">Added on {new Date(formattedMed.date).toLocaleDateString()}</p>
                          </div>
                          <span className={`inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium ${formattedMed.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                            {formattedMed.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <div className="px-6 py-5">
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Instructions</h4>
                            <p className="text-gray-900">{formattedMed.description || "No instructions provided"}</p>
                          </div>
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-500 mb-1">Frequency</h4>
                            <p className="text-gray-900">{formattedMed.frequency} • {formattedMed.timeOfDay}</p>
                          </div>
                          
                          <div className="mt-4 grid grid-cols-2 gap-2">
                            <button className="inline-flex justify-center items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                              </svg>
                              Refill
                            </button>
                            <button className="inline-flex justify-center items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-indigo-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                              </svg>
                              Details
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                
                {medications.length > 0 && (
                  <div className="flex justify-center mt-6">
                    <Link
                      to="/scan-prescription"
                      className="inline-flex items-center px-4 py-2 bg-indigo-50 rounded-md text-indigo-700 hover:bg-indigo-100 transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add More Medications
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Recent Scans Tab */}
            {activeTab === 'scans' && (
              <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {recentScans.map((scan) => (
                    <li key={scan.id}>
                      <div className="px-6 py-5 hover:bg-indigo-50 transition-colors duration-150">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <div className="flex-shrink-0">
                              <div className="h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-indigo-600">
                                Scan #{scan.id}
                              </div>
                              <div className="text-sm text-gray-500">
                                {new Date(scan.date).toLocaleDateString()} • {scan.type}
                              </div>
                            </div>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-3 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {scan.status}
                            </p>
                          </div>
                        </div>
                        <div className="mt-4 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                              </svg>
                              {scan.medications.join(', ')}
                            </p>
                          </div>
                          <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            <Link 
                              to={`/scan/${scan.id}`} 
                              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-indigo-600 bg-white hover:bg-gray-50 transition-colors duration-150"
                            >
                              <span>View Results</span>
                              <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Account Settings Tab */}
            {activeTab === 'settings' && (
              <div className="bg-white shadow-md rounded-xl overflow-hidden">
                <div className="px-6 py-5">
                  <h3 className="text-lg leading-6 font-bold text-gray-900">Account Settings</h3>
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <dl className="divide-y divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Full name</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="flex-grow">{getUserFullName()}</span>
                          <span className="ml-4 flex-shrink-0">
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150">
                              Update
                            </button>
                          </span>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Email address</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="flex-grow">{getUserEmail()}</span>
                          <span className="ml-4 flex-shrink-0">
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150">
                              Update
                            </button>
                          </span>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Password</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="flex-grow">••••••••</span>
                          <span className="ml-4 flex-shrink-0">
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150">
                              Change
                            </button>
                          </span>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Notifications</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center">
                            <input
                              id="email-notifications"
                              name="email-notifications"
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              defaultChecked
                            />
                            <label htmlFor="email-notifications" className="ml-2 block text-sm text-gray-900">
                              Receive email notifications about savings opportunities
                            </label>
                          </div>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                        <dt className="text-sm font-medium text-gray-500">Location</dt>
                        <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <span className="flex-grow">San Francisco, CA</span>
                          <span className="ml-4 flex-shrink-0">
                            <button type="button" className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150">
                              Update
                            </button>
                          </span>
                        </dd>
                      </div>
                    </dl>
                  </div>
                  <div className="mt-6">
                    <div className="rounded-md bg-red-50 p-4">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-red-800">Delete Account</h3>
                          <div className="mt-2 text-sm text-red-700">
                            <p>Once you delete your account, you will lose all data associated with it.</p>
                          </div>
                          <div className="mt-4">
                            <button
                              type="button"
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                            >
                              Delete Account
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Dashboard Footer - Stats */}
            {/* <div className="mt-8 bg-white overflow-hidden shadow rounded-lg">
              <div className="p-5">
                <h3 className="text-lg font-medium text-gray-900">Your Savings</h3>
                <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6 text-center">
                      <dt className="text-sm font-medium text-white truncate">Total Saved</dt>
                      <dd className="mt-1 text-3xl font-semibold text-white">$732.42</dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6 text-center">
                      <dt className="text-sm font-medium text-gray-500 truncate">Medications Analyzed</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">8</dd>
                    </div>
                  </div>
                  <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200">
                    <div className="px-4 py-5 sm:p-6 text-center">
                      <dt className="text-sm font-medium text-gray-500 truncate">Average Savings</dt>
                      <dd className="mt-1 text-3xl font-semibold text-gray-900">72%</dd>
                    </div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
// export default Dashboard; 