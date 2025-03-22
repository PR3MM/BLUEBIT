import React, { useState, useEffect } from 'react';
import { useAuth, UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

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
            <a href="/">
              <span
                className={`font-bold text-xl ${
                  isScrolled ? 'text-gray-800' : 'text-indigo-700'
                }`}
              >
                MediScanAI
              </span>
            </a>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex space-x-8">
            {['Features', 'How It Works', 'Benefits'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className={
                  isScrolled
                    ? 'font-medium text-gray-700 hover:text-indigo-600 transition'
                    : 'font-medium text-indigo-800 hover:text-indigo-600 transition'
                }
              >
                {item}
              </a>
            ))}
          </div>

          {/* Auth Buttons & Add Receipt */}
          <div className="hidden md:flex items-center space-x-4">
            {/* {isLoaded &&
              (isSignedIn ? ( */}
                <>
                  {/* Add Receipt Button */}
                  <a
                    href="/addreceipt"
                    className="px-4 py-2 rounded-lg transition-all font-medium bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    Add Receipt
                  </a>

                  {/* Sign Out Button */}
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 rounded-lg transition-all font-medium bg-red-500 text-white hover:bg-red-600"
                  >
                    Sign Out
                  </button>

                  {/* User Button */}
                  <UserButton afterSignOutUrl="/" />
                </>
              {/* ) : (
                <>
                  <a
                    href="/signin"
                    className={
                      isScrolled
                        ? 'px-4 py-2 rounded-lg transition-all font-medium text-gray-700 hover:text-indigo-600'
                        : 'px-4 py-2 rounded-lg transition-all font-medium text-indigo-800 hover:text-indigo-600'
                    }
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className={
                      isScrolled
                        ? 'px-4 py-2 rounded-lg transition-all font-medium bg-indigo-600 text-white hover:bg-indigo-700'
                        : 'px-4 py-2 rounded-lg transition-all font-medium bg-indigo-600 text-white hover:bg-indigo-700'
                    }
                  >
                    Sign Up
                  </a>
                </>
              ))} */}
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
                href={`#${item.toLowerCase().replace(/ /g, '-')}`}
                className="font-medium py-2 hover:text-indigo-600"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item}
              </a>
            ))}
            {isLoaded &&
              (isSignedIn ? (
                <>
                  <a
                    href="/addreceipt"
                    className="w-full py-2 text-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Add Receipt
                  </a>
                  <button
                    onClick={handleSignOut}
                    className="w-full py-2 text-center bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <a
                    href="/signin"
                    className="w-full py-2 text-center text-gray-700 font-medium hover:text-indigo-600 border border-gray-200 rounded-lg"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign In
                  </a>
                  <a
                    href="/signup"
                    className="w-full py-3 text-center bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Sign Up
                  </a>
                </>
              ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
