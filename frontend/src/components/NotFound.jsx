import React from 'react';

const NotFound = () => {
  return (
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
  );
};

export default NotFound;