import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
         BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState('saved');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Mock data for the dashboard
  const savedMedications = [
    {
      id: 1,
      originalMed: 'Lipitor 20mg',
      date: '2023-11-15',
      alternatives: [
        { name: 'Atorvastatin 20mg', savings: 85, provider: 'GenericPharm' },
        { name: 'Atorvastatin 20mg', savings: 82, provider: 'ValueMeds' }
      ]
    },
    {
      id: 2,
      originalMed: 'Advair Diskus 250/50',
      date: '2023-10-28',
      alternatives: [
        { name: 'Wixela Inhub 250/50', savings: 65, provider: 'RespiCare' },
        { name: 'Fluticasone/Salmeterol', savings: 60, provider: 'GenericPharm' }
      ]
    },
    {
      id: 3,
      originalMed: 'Synthroid 100mcg',
      date: '2023-10-02',
      alternatives: [
        { name: 'Levothyroxine 100mcg', savings: 70, provider: 'ValueMeds' },
        { name: 'Levothyroxine 100mcg', savings: 68, provider: 'MediSave' }
      ]
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

  const activityTimeline = [
    {
      id: 401,
      type: 'scan',
      title: 'Scanned new prescription',
      time: '2 hours ago',
      description: 'You scanned a prescription for Lisinopril 10mg'
    },
    {
      id: 402,
      type: 'savings',
      title: 'Found savings opportunity',
      time: '1 day ago',
      description: 'Save 65% on Atorvastatin 20mg at GenericPharm'
    },
    {
      id: 403,
      type: 'reminder',
      title: 'New medication reminder set',
      time: '2 days ago',
      description: 'Daily reminder for Metformin 500mg at 8:00 AM and 6:00 PM'
    },
    {
      id: 404,
      type: 'refill',
      title: 'Prescription refilled',
      time: '1 week ago',
      description: 'Refilled Metformin 500mg at CVS Pharmacy'
    }
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
  
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
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <header className="bg-gradient-to-r from-indigo-600 to-purple-600 shadow-lg fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and App Name */}
            <div className="flex items-center">
              <button 
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="mr-2 text-white md:hidden"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <div className="flex-shrink-0 flex items-center">
              <div
              className={`h-8 w-8 rounded-md bg-white
              } flex items-center justify-center mr-2`}
            >
              <span
                className={`font-bold text-indigo-600
                }`}
              >
                M
              </span>
            </div>
                <span className="ml-2 text-xl font-bold 
                text-white"> <button onClick={() => navigate('/')}>MediScanAI</button></span>
              </div>
            </div>
            
            {/* Search Bar */}
            <div className="hidden md:block flex-1 max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  name="search"
                  className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-indigo-500 bg-opacity-25 text-white placeholder-indigo-200 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
                  placeholder="Search medications, pharmacies..."
                />
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Link 
                to="/scan-prescription"
                className="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
                Scan New
              </Link>
              <Link
                to="/scan-prescription"
                className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md shadow-sm text-sm font-medium text-white bg-transparent hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150"
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
        <div className={`bg-white shadow-lg z-20 fixed inset-y-0 left-0 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition duration-200 ease-in-out w-64 md:pt-16 pt-0 md:static md:h-screen rounded-tr-xl rounded-br-xl hidden md:flex`}>
          <div className="h-full flex flex-col">
            {/* Close button - mobile only */}
            <div className="md:hidden p-4 flex justify-end">
              <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-700 transition-colors duration-150">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* User Profile Summary */}
            <div className="px-4 py-5 border-b border-gray-200 z-1 ">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                    {getUserInitials()}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">Welcome back,</p>
                  <h3 className="text-lg font-bold text-gray-900">{getUserFullName()}</h3>
                </div>
              </div>
            </div>
            
            {/* Navigation Menu */}
            <nav className="px-3 py-4 flex-1 overflow-y-auto">
              <div className="space-y-1">
                {[
                  { name: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6', active: true },
                  { name: 'My Prescriptions', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z', count: 8 },
                  { name: 'Saved Medications', icon: 'M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z', count: 12 },
                  { name: 'Price Alerts', icon: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9', count: 3 },
                  { name: 'Nearby Pharmacies', icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 10a3 3 0 11-6 0 3 3 0 016 0z' },
                ].map((item) => (
                  <a
                    key={item.name}
                    href="#"
                    className={`group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-150 ${
                      item.active 
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
                  </a>
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
              
              <div className="mt-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
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
              </div>
            </div>
          </div>
        </div>
        
        {/* Dashboard Content */}
        <div className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8 bg-gray-50">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Card with Stats */}
            <div className="mb-8 bg-white  max-sm:mt-12 max-lg:mt-10  shadow-md rounded-xl overflow-hidden">
              <div className="p-6 sm:p-9 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
                <div className="sm:flex sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-extrabold">Welcome back, {getUserFullName()}</h1>
                    <p className="mt-2 text-indigo-100">
                      Here's what's happening with your prescription savings
                    </p>
                  </div>
                  <div className="mt-5 sm:mt-0 flex space-x-3">
                      <Link to="/scan-prescription">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-indigo-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150">
                      <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      </svg>
                        New Scan
                    </button>
                      </Link>
                    <button className="inline-flex items-center px-4 py-2 border border-white rounded-lg text-sm font-medium text-white bg-indigo-500 bg-opacity-30 hover:bg-opacity-40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-indigo-600 focus:ring-white transition-all duration-150">
                      View Activity
                    </button>
                  </div>
                </div>
              </div>
              {/* <div className="px-6 sm:px-8 py-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
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
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <div className="ml-5">
                    <p className="text-sm font-medium text-gray-500">Medications Analyzed</p>
                    <h3 className="text-lg font-bold text-gray-900">8 medications</h3>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 rounded-lg bg-indigo-100 flex items-center justify-center">
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

            {/* Center Panel Grid Layout */}
            <div className="md:grid-cols-3 gap-6 mb-8">
              {/* Savings Overview Graph - Spans 2 columns */}
              {/* <div className="md:col-span-2 bg-white shadow-md rounded-xl p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Savings Overview</h2>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={savingsData}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => [`$${value}`, 'Savings']}
                        labelFormatter={(label) => `Month: ${label}`}
                        contentStyle={{ 
                          backgroundColor: 'white', 
                          border: '1px solid #e2e8f0',
                          borderRadius: '0.5rem',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Legend />
                      <Line 
                        type="monotone" 
                        dataKey="savings" 
                        stroke="#6366F1" 
                        strokeWidth={3}
                        activeDot={{ r: 8 }} 
                        dot={{ strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div> */}

              {/* Activity Timeline - Spans 1 column */}
              <div className="bg-white shadow-md rounded-xl p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
                  <button className="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200 -my-2">
                    {activityTimeline.map((activity) => (
                      <li key={activity.id} className="py-3">
                        <div className="flex items-start">
                          <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center 
                            ${activity.type === 'scan' ? 'bg-blue-100 text-blue-600' 
                            : activity.type === 'savings' ? 'bg-green-100 text-green-600' 
                            : activity.type === 'reminder' ? 'bg-purple-100 text-purple-600' 
                            : 'bg-yellow-100 text-yellow-600'}`}>
                            {activity.type === 'scan' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              </svg>
                            )}
                            {activity.type === 'savings' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {activity.type === 'reminder' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            )}
                            {activity.type === 'refill' && (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                              </svg>
                            )}
                          </div>
                          <div className="ml-3 min-w-0 flex-1">
                            <div className="text-sm font-medium text-gray-900 truncate">{activity.title}</div>
                            <div className="text-sm text-gray-500">{activity.description}</div>
                            <div className="text-xs text-gray-400 mt-1">{activity.time}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Recent Prescriptions */}
            <div className="mb-8 bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Recent Prescriptions</h2>
                <button className="text-sm text-indigo-600 hover:text-indigo-500">View all</button>
              </div>
              <div className="overflow-x-auto">
                <div className="inline-block min-w-full align-middle">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {recentPrescriptions.map((prescription) => (
                      <div key={prescription.id} className="border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-300">
                        <div className="p-4">
                          <div className="flex justify-between items-start">
                            <h3 className="text-lg font-semibold text-gray-900">{prescription.name}</h3>
                            <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                              {prescription.refillsRemaining} refills left
                            </span>
                          </div>
                          <div className="mt-1 text-sm text-gray-500">Prescribed by {prescription.doctor}</div>
                          <div className="mt-3 space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Prescribed:</span>
                              <span className="font-medium text-gray-900">{new Date(prescription.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Next Refill:</span>
                              <span className="font-medium text-gray-900">{new Date(prescription.nextRefill).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-500">Pharmacy:</span>
                              <span className="font-medium text-gray-900">{prescription.pharmacy}</span>
                            </div>
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
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Medication Reminders */}
            <div className="mb-8 bg-white shadow-md rounded-xl p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold text-gray-900">Medication Reminders</h2>
                <button className="inline-flex items-center px-3 py-1.5 border border-indigo-300 rounded-md text-sm font-medium text-indigo-600 bg-white hover:bg-indigo-50 transition-colors duration-150">
                  <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Reminder
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-white px-3 text-lg font-medium text-gray-900">Today</span>
                </div>
              </div>
              <div className="mt-4 space-y-4">
                {medicationReminders.map((reminder) => (
                  <div key={reminder.id} className={`relative flex items-center p-4 rounded-lg border ${
                    reminder.status === 'taken' ? 'border-green-200 bg-green-50' : 'border-indigo-200 bg-indigo-50'
                  }`}>
                    <div className="mr-4">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        reminder.status === 'taken' ? 'bg-green-100' : 'bg-indigo-100'
                      }`}>
                        {reminder.status === 'taken' ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className={`text-md font-semibold ${
                        reminder.status === 'taken' ? 'text-green-800' : 'text-indigo-800'
                      }`}>
                        {reminder.medication}
                      </h4>
                      <div className="flex items-center mt-1">
                        <span className={`text-sm ${
                          reminder.status === 'taken' ? 'text-green-600' : 'text-indigo-600'
                        }`}>
                          {reminder.time} • {reminder.dosage}
                        </span>
                      </div>
                    </div>
                    {reminder.status === 'upcoming' && (
                      <button className="ml-4 inline-flex items-center px-3 py-1.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Mark as Taken
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Dashboard Tabs */}
            <div className="mb-6 bg-white rounded-lg shadow-md p-1">
              <nav className="flex space-x-4" aria-label="Tabs">
                {[
                  { name: 'Saved Alternatives', key: 'saved' },
                  { name: 'Recent Scans', key: 'scans' },
                  { name: 'Account Settings', key: 'settings' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key)}
                    className={`${
                      activeTab === tab.key
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    } flex-1 whitespace-nowrap py-2 px-4 rounded-md font-medium text-sm transition-all duration-150`}
                  >
                    {tab.name}
                  </button>
                ))}
              </nav>
            </div>

            {/* Saved Alternatives Tab */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                {savedMedications.map((med) => (
                  <div key={med.id} className="bg-white overflow-hidden shadow-md rounded-xl divide-y divide-gray-200 transition-all duration-300 hover:shadow-lg">
                    <div className="px-6 py-5 flex justify-between items-center">
                      <div>
                        <h3 className="text-lg font-bold text-gray-900">{med.originalMed}</h3>
                        <p className="mt-1 text-sm text-gray-500">Saved on {new Date(med.date).toLocaleDateString()}</p>
                      </div>
                      <span className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        {med.alternatives.length} alternatives
                      </span>
                    </div>
                    <div className="px-6 py-5">
                      <h4 className="text-sm font-medium text-gray-500 mb-3">Alternative Medications</h4>
                      <ul className="space-y-4">
                        {med.alternatives.map((alt, idx) => (
                          <li key={idx} className="bg-gray-50 rounded-lg p-4 flex justify-between items-center transition-all duration-150 hover:bg-indigo-50 border border-gray-200 hover:border-indigo-200">
                            <div>
                              <p className="font-medium text-gray-900">{alt.name}</p>
                              <p className="text-sm text-gray-500">Provider: {alt.provider}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-lg font-semibold text-green-600">{alt.savings}% savings</p>
                              <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-500 inline-flex items-center">
                                Get Coupon
                                <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                              </button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="px-6 py-4 bg-gray-50 flex justify-end">
                      <button className="inline-flex items-center text-sm font-medium text-indigo-600 hover:text-indigo-500">
                        View Details
                        <svg xmlns="http://www.w3.org/2000/svg" className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
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