import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css'
import { SignIn, SignUp, useAuth } from '@clerk/clerk-react';

// Import all components
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AddReceipt from './components/AddReceipt';
import UserList from './components/UserList';

// Page components
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import AppPreviewSection from './components/AppPreviewSection'
import BenefitsSection from './components/BenefitsSection'
import TrustSection from './components/TrustSection'
import CtaSection from './components/CtaSection'
import Dashboard from './components/Dashboard'
import PrescriptionScanPage from './components/PrescriptionScanPage'
import MedicationIdentificationPage from './components/MedicationIdentificationPage'

// Create a HomePage component that combines all landing page sections
const HomePage = () => (
  <>
    <HeroSection />
    <FeaturesSection />
    <HowItWorksSection />
    <AppPreviewSection />
    <BenefitsSection />
    <TrustSection />
    <CtaSection />
  </>
);

// Auth route protection wrapper using Clerk
const ProtectedRoute = ({ children }) => {
  const { isSignedIn, isLoaded } = useAuth();
  
  if (!isLoaded) {
    // You can show a loading spinner here if you want
    return <div className="text-center">
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
  </div>;
  }
  
  return isSignedIn ? children : <Navigate to="/signin" />;
};

// Wrapper for the app layout with conditional navbar
const AppLayout = () => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  
  useEffect(() => {
    // Check if current route is dashboard or scan-prescription
    const isDashboard = location.pathname === '/dashboard';
    const isScanPage = location.pathname === '/scan-prescription';
    
    // Hide the navbar and footer on dashboard page
    setShowNavbar(!isDashboard);
    setShowFooter(!isDashboard && !isScanPage);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/users" element={<UserList />} />
          <Route 
            path="/signin" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                  <SignIn routing="path" path="/signin" fallbackRedirectUrl="/dashboard" />
                </div>
              </div>
            } 
          />
          <Route 
            path="/signup" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                  <SignUp routing="path" path="/signup" fallbackRedirectUrl="/dashboard" />
                </div>
              </div>
            } 
          />
           <Route 
            path="/addreceipt" 
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                  <AddReceipt/>
                </div>
              </div>
            } 
          />
           <Route path="/addreceipt" element={<AddReceipt />} />
          {/* Protected routes */}
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          
          <Route 
            path="/scan-prescription" 
            element={
              <ProtectedRoute>
                <PrescriptionScanPage />
              </ProtectedRoute>
            } 
          />
          
          <Route path="/medications" element={<MedicationIdentificationPage />} />
          
          {/* Catch-all route for 404 */}
          <Route 
            path="*" 
            element={
              <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white">
                <h1 className="text-4xl font-bold text-gray-900 mb-4">404 - Page Not Found</h1>
                <p className="text-lg text-gray-700 mb-8">The page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  Return Home
                </a>
              </div>
            } 
          />
        </Routes>
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

const App = () => {
  // Scroll to top button state
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  return (
    <BrowserRouter>
      <AppLayout />
      
      {/* Scroll to top button */}
      {showScrollTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all duration-300 z-50"
          aria-label="Scroll to top"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </BrowserRouter>
  )
}

export default App
