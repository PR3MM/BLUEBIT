import React from 'react';

const HowItWorksSection = () => {
  const steps = [
    {
      number: "01",
      title: "Capture or upload prescription",
      description: "Take a photo of your prescription or upload an existing image.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    },
    {
      number: "02",
      title: "AI analyzes and identifies medications",
      description: "Our advanced AI reads and interprets your prescription details.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      )
    },
    {
      number: "03",
      title: "Review generic alternatives with price comparison",
      description: "See side-by-side comparisons of  and generic medications with price differences.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      number: "04",
      title: "Save or share your results",
      description: "Save your results to your account or share them with your doctor.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
      )
    }
  ];

  // Arrow component for desktop view
  const Arrow = () => (
    <div className="hidden lg:flex w-24 h-24 absolute -right-12 top-1/2 transform -translate-y-1/2 z-10">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 12h14" className="animate-pulse"></path>
        <path d="M12 5l7 7-7 7" className="animate-pulse"></path>
      </svg>
    </div>
  );

  // Down arrow for mobile view
  const DownArrow = () => (
    <div className="flex lg:hidden w-8 h-16 mx-auto my-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-indigo-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 5v14" className="animate-pulse"></path>
        <path d="M19 12l-7 7-7-7" className="animate-pulse"></path>
      </svg>
    </div>
  );

  return (
    <section className="py-24 bg-gradient-to-b from-white to-indigo-50" id="how-it-works">
      {/* Decorative elements */}
      <div className="absolute left-0 right-0 h-1/2">
        <div className="absolute top-0 left-10 w-32 h-32 bg-indigo-300 rounded-full mix-blend-multiply opacity-10 filter blur-3xl"></div>
        <div className="absolute bottom-0 right-10 w-32 h-32 bg-purple-300 rounded-full mix-blend-multiply opacity-10 filter blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <div className="inline-block px-3 py-1 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full mb-4">
            Simple Process
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mt-2">
            How It <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Works</span>
          </h2>
          <p className="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
            Our simple four-step process to help you find affordable medication
          </p>
        </div>

        {/* Desktop view: side-by-side steps with arrows */}
        <div className="hidden lg:grid grid-cols-1 lg:grid-cols-4 gap-8 relative">
          {steps.map((step, index) => (
            <div key={index} className="relative flex h-full">
              {index < steps.length - 1 && <Arrow />}
              <div className={`bg-white rounded-xl shadow-lg p-8 transform transition-all duration-500 hover:-translate-y-2 hover:shadow-xl relative overflow-hidden group ${index === 0 ? 'border-t-4 border-indigo-500' : index === 1 ? 'border-t-4 border-blue-500' : index === 2 ? 'border-t-4 border-purple-500' : 'border-t-4 border-pink-500'} flex flex-col h-full`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full"></div>
                
                <div className={`w-16 h-16 rounded-2xl ${index === 0 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'} flex items-center justify-center shadow-lg mb-6 mx-auto transform transition-all duration-300 group-hover:rotate-3 flex-shrink-0`}>
                  {step.icon}
                </div>
                
                <div className="text-center flex-grow flex flex-col">
                  <div className={`inline-block text-sm font-bold text-white ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-blue-600' : index === 2 ? 'bg-purple-600' : 'bg-pink-600'} rounded-full w-8 h-8 flex items-center justify-center mb-3 mx-auto`}>
                    {step.number}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">{step.title}</h3>
                  <p className="text-gray-600 flex-grow">{step.description}</p>
                </div>
                
                {/* Decorative corner circles */}
                <div className="absolute bottom-2 left-2 w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="absolute bottom-2 right-2 w-2 h-2 rounded-full bg-gray-200"></div>
                <div className="absolute top-12 right-2 w-2 h-2 rounded-full bg-gray-200"></div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile view: stacked steps with down arrows */}
        <div className="lg:hidden space-y-6">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <div className={`bg-white rounded-xl shadow-lg p-6 relative overflow-hidden border-l-4 ${index === 0 ? 'border-indigo-500' : index === 1 ? 'border-blue-500' : index === 2 ? 'border-purple-500' : 'border-pink-500'}`}>
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-gray-100 to-transparent rounded-bl-full"></div>
                
                <div className="flex flex-col sm:flex-row sm:items-start">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 mx-auto sm:mx-0 sm:mr-6">
                    <div className={`w-16 h-16 rounded-2xl ${index === 0 ? 'bg-gradient-to-r from-indigo-500 to-indigo-600' : index === 1 ? 'bg-gradient-to-r from-blue-500 to-blue-600' : index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' : 'bg-gradient-to-r from-pink-500 to-pink-600'} flex items-center justify-center shadow-lg`}>
                      {step.icon}
                    </div>
                  </div>
                  <div className="text-center sm:text-left">
                    <div className={`inline-block text-sm font-bold text-white ${index === 0 ? 'bg-indigo-600' : index === 1 ? 'bg-blue-600' : index === 2 ? 'bg-purple-600' : 'bg-pink-600'} rounded-full w-8 h-8 flex items-center justify-center mb-3`}>
                      {step.number}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              </div>
              {index < steps.length - 1 && <DownArrow />}
            </React.Fragment>
          ))}
        </div>
        
        {/* Final CTA button */}
        <div className="text-center mt-16">
          <a href="/signup" className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/30 transition duration-300 transform hover:-translate-y-1 inline-flex items-center">
            Get Started Now
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;