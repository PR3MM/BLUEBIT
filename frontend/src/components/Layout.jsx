import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  const location = useLocation();
  const [showNavbar, setShowNavbar] = useState(true);
  const [showFooter, setShowFooter] = useState(true);
  
  useEffect(() => {
    // Check if current route is dashboard
    const isDashboard = location.pathname === '/dashboard';
    
    // Hide the navbar and footer on dashboard page
    setShowNavbar(!isDashboard);
    setShowFooter(!isDashboard);
  }, [location]);

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbar && <Navbar />}
      <main className="flex-grow">
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
};

export default Layout; 