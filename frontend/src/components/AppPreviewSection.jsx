import React from 'react';

const AppPreviewSection = () => {
  const appScreens = [
    { name: "Scan Prescription", bgcolor: "bg-blue-100", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ) },
    { name: "Identify Medications", bgcolor: "bg-indigo-100", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ) },
    { name: "Compare Alternatives", bgcolor: "bg-purple-100", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ) },
    { name: "Save Results", bgcolor: "bg-teal-100", icon: (
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
      </svg>
    ) }
  ];

  // Array of realistic user avatars
  const userAvatars = [
    { initials: 'RD', color: 'bg-red-400' },
    { initials: 'SD', color: 'bg-blue-400' },
    { initials: 'OD', color: 'bg-green-400' },
    { initials: 'PD', color: 'bg-purple-400' }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-indigo-500 via-purple-500 to-purple-600 text-white relative overflow-hidden">
      {/* Abstract decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-10 left-1/3 w-80 h-80 bg-pink-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-white bg-white/20 rounded-full mb-4 backdrop-blur-sm">
            Interactive Demo
          </div>
          <h2 className="text-3xl md:text-5xl font-bold mb-4 drop-shadow-sm">Experience MediScanAI</h2>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            See how our platform helps you find affordable medication alternatives with just a few clicks
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Web App Browser Mockup with better shadow and animations */}
          <div className="w-full lg:w-1/2 relative mb-12 lg:mb-0 transform transition duration-700 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur-xl opacity-30 -m-2 transform -rotate-2"></div>
            <div className="relative mx-auto w-full max-w-[600px] bg-white rounded-xl shadow-2xl overflow-hidden border border-white/10">
              {/* Browser Header with more modern style */}
              <div className="bg-gray-100 px-4 py-3 border-b border-gray-200 flex items-center">
                <div className="flex space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="mx-auto flex items-center px-4 py-1.5 rounded-md bg-gray-50 shadow-sm border border-gray-200 text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  mediscanai.com/dashboard
                </div>
                <div className="w-8 h-8 flex items-center justify-center text-gray-400 ml-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </div>
              </div>
              
              {/* Web App Content */}
              <div className="flex h-[420px]">
                {/* Sidebar with modern styling */}
                <div className="w-48 bg-gradient-to-b from-indigo-900 to-indigo-800 text-white p-4 hidden md:block">
                  <div className="mb-8">
                    <div className="font-bold text-lg mb-4 flex items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                      </svg>
                      MediScanAI
                    </div>
                    <div className="h-12 w-12 rounded-lg bg-gradient-to-br from-indigo-400 to-indigo-600 mb-2 flex items-center justify-center shadow-lg">
                      <span className="font-bold">RD</span>
                    </div>
                    <div className="text-sm text-indigo-200">Rohit D</div>
                    <div className="text-xs text-indigo-300">Premium Plan</div>
                  </div>
                  
                  <nav className="space-y-1.5">
                    {appScreens.map((screen, index) => (
                      <div 
                        key={index} 
                        className={`py-2 px-3 rounded-md text-sm flex items-center ${index === 1 ? 'bg-indigo-700/70 text-white shadow-sm' : 'text-indigo-200 hover:bg-indigo-700/50 hover:text-white cursor-pointer transition-colors'}`}
                      >
                        {screen.icon}
                        {screen.name}
                      </div>
                    ))}
                  </nav>
                </div>
                
                {/* Main Content with better styling */}
                <div className="flex-1 bg-gray-50 p-6 overflow-auto">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-gray-800 font-semibold text-lg">Identified Medications</h3>
                    <div className="flex space-x-2">
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                      <button className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-medium text-gray-800 text-lg block">Lipitor (Atorvastatin)</span>
                        <span className="text-sm text-gray-500 block">20mg, Take once daily</span>
                      </div>
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2.5 py-1 rounded-full font-medium">Cholesterol</span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-1">
                      <div className="flex justify-between mb-3">
                        <div className="text-sm font-medium text-indigo-600">Generic Alternatives</div>
                        <div className="text-xs text-gray-500">Prices for 30-day supply</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 hover:shadow-sm transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Atorvastatin
                            </span>
                            <span className="text-green-600 font-bold text-lg">₹85</span>
                          </div>
                          <div className="text-xs text-green-600 mt-2 font-medium">
                            Save 78% (₹295 difference)
                          </div>
                          <button className="mt-2 w-full py-1.5 bg-white text-green-600 text-xs font-medium rounded border border-green-200 hover:bg-green-600 hover:text-white transition-colors">
                            Select Generic
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                              Lipitor
                            </span>
                            <span className="text-gray-600 font-bold text-lg">₹380</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            Brand name (Original)
                          </div>
                          <button className="mt-2 w-full py-1.5 bg-white text-gray-500 text-xs font-medium rounded border border-gray-200 hover:bg-gray-200 transition-colors">
                            Select Brand
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <span className="font-medium text-gray-800 text-lg block">Prinivil (Lisinopril)</span>
                        <span className="text-sm text-gray-500 block">10mg, Take once daily</span>
                      </div>
                      <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-1 rounded-full font-medium">Blood Pressure</span>
                    </div>
                    
                    <div className="border-t border-gray-100 pt-4 mt-1">
                      <div className="flex justify-between mb-3">
                        <div className="text-sm font-medium text-indigo-600">Generic Alternatives</div>
                        <div className="text-xs text-gray-500">Prices for 30-day supply</div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div className="bg-gradient-to-br from-green-50 to-green-100 p-3 rounded-lg border border-green-200 hover:shadow-sm transition-all">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center">
                              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                              Lisinopril
                            </span>
                            <span className="text-green-600 font-bold text-lg">₹58</span>
                          </div>
                          <div className="text-xs text-green-600 mt-2 font-medium">
                            Save 82% (₹267 difference)
                          </div>
                          <button className="mt-2 w-full py-1.5 bg-white text-green-600 text-xs font-medium rounded border border-green-200 hover:bg-green-600 hover:text-white transition-colors">
                            Select Generic
                          </button>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-medium flex items-center">
                              <span className="w-2 h-2 bg-gray-400 rounded-full mr-2"></span>
                              Prinivil
                            </span>
                            <span className="text-gray-600 font-bold text-lg">₹325</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-2 font-medium">
                            Brand name (Original)
                          </div>
                          <button className="mt-2 w-full py-1.5 bg-white text-gray-500 text-xs font-medium rounded border border-gray-200 hover:bg-gray-200 transition-colors">
                            Select Brand
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA Section with enhanced design */}
          <div className="w-full lg:w-1/2 text-center lg:text-left">
            <div className="bg-white/10 backdrop-blur-sm p-1 rounded-full inline-flex mb-3">
              <span className="bg-white text-indigo-600 text-xs font-semibold px-3 py-1 rounded-full">New Feature</span>
            </div>
            <h3 className="text-2xl md:text-4xl font-bold mb-6">
              Start Using MediScanAI<br />
              <span className="text-indigo-200">and Save Today</span>
            </h3>
            <p className="text-indigo-100 mb-8 max-w-md mx-auto lg:mx-0 text-lg leading-relaxed">
              Our web application makes it easy to find affordable alternatives to your prescription medications - no download required. Start saving up to 80% on your prescriptions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <button className="group px-8 py-4 bg-white text-indigo-700 font-semibold rounded-xl shadow-lg hover:bg-gray-50 transition duration-300 transform hover:scale-[1.03] flex items-center justify-center space-x-2">
                <span>Get Started Free</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
              <button className="group px-8 py-4 bg-indigo-700/30 text-white font-semibold rounded-xl border border-white/30 hover:bg-indigo-700/50 transition duration-300 flex items-center justify-center space-x-2">
                <span>How It Works</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            </div>
            
            <div className="mt-10">
              <div className="flex items-center justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {userAvatars.map((avatar, i) => (
                    <div key={i} className={`w-10 h-10 rounded-full ring-2 ring-white ${avatar.color} flex items-center justify-center text-white text-xs font-medium transform transition-transform hover:scale-110 hover:z-10 cursor-pointer`}>
                      {avatar.initials}
                    </div>
                  ))}
                </div>
                <div className="ml-4">
                  <div className="font-bold text-white">25,000+ users</div>
                  <div className="text-sm text-indigo-200">already saving on medications</div>
                </div>
              </div>

              {/* Trust indicators */}
              <div className="mt-8 flex flex-wrap justify-center lg:justify-start gap-4">
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-sm font-medium text-white">100% Secure</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-medium text-white">Free 14-day Trial</span>
                </div>
                <div className="bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-indigo-200 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-sm font-medium text-white">Cancel Anytime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppPreviewSection; 