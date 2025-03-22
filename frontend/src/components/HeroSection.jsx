import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 to-indigo-50 py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center">
        {/* Left content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Save on Medicines with AI-Powered Prescription Analysis
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            Instantly find affordable alternatives to your prescribed medications
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a href="/signup" className="px-8 py-4 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-300 transform hover:scale-105">
              Get Started Free
            </a>
            <a href="#how-it-works" className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-gray-50 border border-gray-200 transition duration-300">
              How It Works
            </a>
          </div>
        </div>

        {/* Right content - Web App Browser Mockup */}
        <div className="lg:w-1/2 relative">
          <div className="relative mx-auto w-full max-w-[550px] bg-white rounded-xl shadow-2xl overflow-hidden">
            {/* Browser Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="mx-auto bg-white rounded-md flex items-center px-3 py-1 text-sm text-gray-500 shadow-sm">
                mediscanai.in
              </div>
            </div>
            
            {/* App Interface */}
            <div className="p-6 bg-indigo-50">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-md bg-indigo-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <span className="font-bold text-xl text-gray-800">MediScanAI</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/signin" className="text-gray-500 text-sm">Sign In</a>
                  <a href="/signup" className="bg-indigo-600 text-white text-sm py-2 px-4 rounded-lg">Sign Up</a>
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Prescription</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your prescription here or</p>
                  <button className="text-indigo-600 font-medium text-sm">Browse files</button>
                </div>
                <div className="mt-4 text-center">
                  <p className="text-xs text-gray-500">Or</p>
                  <button className="mt-2 text-indigo-600 font-medium text-sm flex items-center justify-center mx-auto">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take a photo
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Already have an account? <a href="/signin" className="text-indigo-600 font-medium">Sign in</a> to access your saved prescriptions</p>
              </div>
            </div>
          </div>
          
          {/* Abstract shapes */}
          <div className="absolute -bottom-16 -right-16 w-64 h-64 bg-indigo-300 rounded-full opacity-20 blur-3xl"></div>
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-blue-300 rounded-full opacity-20 blur-3xl"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection; 