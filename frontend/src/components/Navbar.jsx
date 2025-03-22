import React, { useState, useEffect } from 'react';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white text-gray-800 shadow-md py-3' 
          : 'bg-transparent text-white py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div className={`h-8 w-8 rounded-md ${isScrolled ? 'bg-indigo-600' : 'bg-white'} flex items-center justify-center mr-2`}>
              <span className={`font-bold ${isScrolled ? 'text-white' : 'text-indigo-600'}`}>M</span>
            </div>
            <span className="font-bold text-xl">MediScanAI</span>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Benefits', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className={`font-medium hover:${isScrolled ? 'text-indigo-600' : 'text-gray-200'} transition`}
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <button className={`
              px-4 py-2 rounded-lg transition-all font-medium
              ${isScrolled 
                ? 'text-gray-700 hover:text-indigo-600' 
                : 'text-white hover:text-gray-200'}
            `}>
              Sign In
            </button>
            <button className={`
              px-4 py-2 rounded-lg transition-all font-medium
              ${isScrolled 
                ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
                : 'bg-white text-indigo-600 hover:bg-gray-100'}
            `}>
              Sign Up
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10"
            >
              {!isMobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 mt-3 py-4 shadow-lg">
          <div className="flex flex-col space-y-3 px-4">
            {['Features', 'How It Works', 'Benefits', 'FAQ'].map((item) => (
              <a 
                key={item} 
                href={`#${item.toLowerCase().replace(' ', '-')}`}
                className="font-medium py-2 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            <div className="flex flex-col space-y-3 mt-3">
              <button className="w-full py-2 text-gray-700 font-medium hover:text-indigo-600 border border-gray-200 rounded-lg">
                Sign In
              </button>
              <button className="w-full py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 