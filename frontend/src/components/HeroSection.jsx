import React from 'react';

const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 py-24 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply opacity-30 filter blur-3xl animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply opacity-30 filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply opacity-30 filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center relative z-10">
        {/* Left content */}
        <div className="lg:w-1/2 text-center lg:text-left mb-12 lg:mb-0 relative">
          <div className="inline-block px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full mb-6">
            Smart Medicine Finder with AI 🚀
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
            Save on <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Medicines</span> with AI-Powered Analysis
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-2xl">
            Instantly find affordable alternatives to your prescribed medications with our cutting-edge AI technology
          </p>
          <div className="mt-10 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
            <a href="/signup" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition duration-300 transform hover:-translate-y-1 flex items-center justify-center group">
              Get Started Free
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
            <a href="#how-it-works" className="px-8 py-4 bg-white text-indigo-600 font-semibold rounded-lg shadow-md hover:bg-indigo-50 border border-indigo-100 transition duration-300 flex items-center justify-center group">
              How It Works
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 group-hover:translate-y-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
            </a>
          </div>
          
          {/* Trust badges */}
          {/* <div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6">
            <div className="text-sm text-gray-500 font-medium">Trusted by:</div>
            <div className="flex space-x-6 items-center">
              <div className="h-8 w-auto text-gray-400">CDSCO</div>
              <div className="h-8 w-auto text-gray-400">Apollo</div>
              <div className="h-8 w-auto text-gray-400">MedPlus</div>
              <div className="h-8 w-auto text-gray-400">1mg</div>
            </div>
          </div> */}
        </div>

        {/* Right content - Web App Browser Mockup */}
        <div className="lg:w-1/2 relative">
          <div className="relative mx-auto w-full max-w-[550px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
            {/* Browser Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="mx-auto bg-white rounded-md flex items-center px-3 py-1 text-sm text-gray-500 shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                mediscanai.in
              </div>
            </div>
            
            {/* App Interface */}
            <div className="p-6 bg-gradient-to-b from-indigo-50 to-white">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center mr-3">
                    <span className="text-white font-bold">M</span>
                  </div>
                  <span className="font-bold text-xl text-gray-800">MediScanAI</span>
                </div>
                <div className="flex items-center space-x-4">
                  <a href="/signin" className="text-gray-500 text-sm hover:text-indigo-600 transition-colors">Sign In</a>
                  <a href="/signup" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm py-2 px-4 rounded-lg flex items-center hover:shadow-md transition-all">
                    Sign Up
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                </div>
              </div>
              
              <div className="bg-white rounded-xl shadow-lg p-6 mb-6 transform transition-all hover:shadow-xl">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Upload Your Prescription</h2>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-8 text-center hover:border-indigo-400 transition-colors duration-300 cursor-pointer bg-gray-50 hover:bg-indigo-50/50">
                  <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500 mb-2">Drag and drop your prescription here or</p>
                  <button className="text-indigo-600 font-medium text-sm flex items-center justify-center mx-auto hover:text-indigo-800 transition-colors">
                    Browse files
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12h14"></path>
                      <path d="M12 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </div>
                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center">
                    <div className="h-px bg-gray-200 w-full"></div>
                    <p className="text-xs text-gray-500 px-2">Or</p>
                    <div className="h-px bg-gray-200 w-full"></div>
                  </div>
                  <button className="mt-3 text-indigo-600 font-medium text-sm flex items-center justify-center mx-auto hover:text-indigo-800 transition-colors rounded-lg border border-indigo-100 py-2 px-4 hover:bg-indigo-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Take a photo
                  </button>
                </div>
              </div>
              
              <div className="text-center text-sm text-gray-500">
                <p>Already have an account? <a href="/signin" className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors">Sign in</a> to access your saved prescriptions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Down arrow for scrolling */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
        <a href="#features" className="text-indigo-500 hover:text-indigo-700 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 13 12 18 17 13"></polyline>
            <polyline points="7 6 12 11 17 6"></polyline>
          </svg>
        </a>
      </div>
      
      {/* Add this to your CSS file or style tag */}
      <style>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default HeroSection; 