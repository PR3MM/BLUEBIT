import React, { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useNavigate, Link } from 'react-router-dom';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isSignedIn, isLoaded, signOut } = useAuth();
  const navigate = useNavigate();

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

  // Handle sign out and redirect to home
  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white text-gray-800 shadow-md py-3'
          : 'bg-transparent text-indigo-600 py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <div className="flex items-center">
            <div
              className={`h-8 w-8 rounded-md ${
                isScrolled ? 'bg-indigo-600' : 'bg-white'
              } flex items-center justify-center mr-2`}
            >
              <span
                className={`font-bold ${
                  isScrolled ? 'text-white' : 'text-indigo-600'
                }`}
              >
                M
              </span>
            </div>
            <Link to="/">
              <span
                className={`font-bold text-xl ${
                  isScrolled ? 'text-gray-800' : 'text-indigo-700'
                }`}
              >
                MediScanAI
              </span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Benefits'].map((item) => (
              <a
                key={item}  
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={`font-medium transition duration-300 ease-in-out ${
                  isScrolled
                    ? 'text-gray-700 hover:text-indigo-600'
                    : 'text-indigo-800 hover:text-indigo-600'
                }`}
              >
                {item}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <Link
                    to="/dashboard"
                    className="px-4 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-md"
                  >
                    Dashboard
                  </Link>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium bg-red-500 text-white hover:bg-red-600 shadow-md"
                  >
                    Sign Out
                  </button>

                  {/* User Button */}
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium ${
                      isScrolled
                        ? 'text-gray-700 hover:text-indigo-600'
                        : 'text-indigo-800 hover:text-indigo-600'
                    }`}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className={`px-4 py-2 rounded-lg transition-all duration-300 ease-in-out font-medium bg-indigo-600 text-white hover:bg-indigo-700 shadow-md`}
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex items-center justify-center h-10 w-10"
            >
              {!isMobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    isScrolled ? 'text-gray-800' : 'text-indigo-800'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 ${
                    isScrolled ? 'text-gray-800' : 'text-indigo-800'
                  }`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
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
            {['Features', 'How It Works', 'Benefits'].map((item) => (
              <a 
                key={item}
                href ={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={
                  isScrolled
                    ? 'font-medium text-gray-700 hover:text-indigo-600 transition'
                    : 'font-medium text-indigo-800 hover:text-indigo-600 transition'
                }
              >
                {item}
              </a>
            ))}
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <Link
                    to="/scan-prescription"
                    className="w-full py-2 text-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300 ease-in-out"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    New Scan
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 text-center bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition duration-300 ease-in-out"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/signin"
                    className="w-full py-2 text-center text-gray-700 font-medium hover:text-indigo-600 border border-gray-200 rounded-lg transition duration-300 ease-in-out"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="w-full py-3 text-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-300 ease-in-out"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
