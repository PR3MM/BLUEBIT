import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react'
import './App.css'

// Import all components
import Navbar from './components/Navbar'
import Footer from './components/Footer'

// Page components
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import HowItWorksSection from './components/HowItWorksSection'
import AppPreviewSection from './components/AppPreviewSection'
import BenefitsSection from './components/BenefitsSection'
import TrustSection from './components/TrustSection'
import CtaSection from './components/CtaSection'
import AuthPage from './components/AuthPage'
import Dashboard from './components/Dashboard'
import PrescriptionScanPage from './components/PrescriptionScanPage'

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

// Auth route protection wrapper
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  return isAuthenticated ? children : <Navigate to="/signin" />;
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
          <Route path="/signin" element={<AuthPage initialTab="signin" />} />
          <Route path="/signup" element={<AuthPage initialTab="signup" />} />
          
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
