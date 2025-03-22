import React from 'react';

const TrustSection = () => {
  // Dummy partner data with realistic looking logos
  const partners = [
    {
      name: "MediTrust",
      logo: (
        <svg className="w-full h-full" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="60" rx="4" fill="white" />
          <path d="M40 15H50L58 45H48L40 15Z" fill="#4F46E5" />
          <path d="M60 15H70L78 45H68L60 15Z" fill="#4F46E5" />
          <path d="M80 30H140V35H80V30Z" fill="#4F46E5" />
          <path d="M85 20H135V25H85V20Z" fill="#4F46E5" />
          <path d="M90 40H130V45H90V40Z" fill="#4F46E5" />
        </svg>
      )
    },
    {
      name: "PharmaCloud",
      logo: (
        <svg className="w-full h-full" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="60" rx="4" fill="white" />
          <circle cx="60" cy="30" r="20" fill="#8B5CF6" />
          <circle cx="60" cy="30" r="15" fill="white" />
          <circle cx="60" cy="30" r="10" fill="#8B5CF6" />
          <rect x="90" y="15" width="50" height="10" rx="5" fill="#8B5CF6" />
          <rect x="90" y="30" width="40" height="5" rx="2.5" fill="#8B5CF6" />
          <rect x="90" y="40" width="30" height="5" rx="2.5" fill="#8B5CF6" />
        </svg>
      )
    },
    {
      name: "HealthMatrix",
      logo: (
        <svg className="w-full h-full" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="60" rx="4" fill="white" />
          <rect x="30" y="20" width="40" height="20" fill="#EC4899" />
          <path d="M90 20H110L130 40H110L90 20Z" fill="#EC4899" />
          <path d="M130 20H110L90 40H110L130 20Z" fill="#EC4899" />
          <circle cx="50" cy="30" r="5" fill="white" />
        </svg>
      )
    },
    {
      name: "GlobalRx",
      logo: (
        <svg className="w-full h-full" viewBox="0 0 180 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect width="180" height="60" rx="4" fill="white" />
          <circle cx="60" cy="30" r="20" stroke="#2563EB" strokeWidth="4" />
          <path d="M55 20L65 40" stroke="#2563EB" strokeWidth="4" />
          <path d="M65 20L55 40" stroke="#2563EB" strokeWidth="4" />
          <rect x="90" y="20" width="50" height="5" rx="2.5" fill="#2563EB" />
          <rect x="90" y="30" width="40" height="5" rx="2.5" fill="#2563EB" />
          <rect x="90" y="40" width="30" height="5" rx="2.5" fill="#2563EB" />
        </svg>
      )
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800">Trusted Technology</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Our app is built with security and accuracy as top priorities
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Security Badge */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Security</h3>
            <p className="text-gray-600">
              HIPAA compliant with end-to-end encryption to keep your medical information secure
            </p>
          </div>

          {/* Accuracy Stats */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">99.7% Accuracy</h3>
            <p className="text-gray-600">
              Our AI prescription analysis has been validated with over 98,000 prescriptions
            </p>
          </div>

          {/* Partnerships */}
          <div className="bg-white p-8 rounded-xl shadow-md border border-gray-100 text-center transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-3">Trusted Partners</h3>
            <p className="text-gray-600">
              Data verified by leading pharmacy databases and healthcare providers
            </p>
          </div>
        </div>

        {/* Partner Logos */}
        <div className="mt-16">
          <p className="text-center text-sm uppercase tracking-wider font-semibold text-gray-500 mb-10">Trusted by leading healthcare organizations</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
            {partners.map((partner, index) => (
              <div key={index} className="h-20 w-full max-w-[180px] flex flex-col items-center justify-center group transition-all duration-300 hover:scale-105">
                <div className="h-16 w-full shadow-sm rounded-md p-2 bg-white border border-gray-100 flex items-center justify-center">
                  {partner.logo}
                </div>
                <span className="mt-2 text-sm font-medium text-gray-500 group-hover:text-indigo-600 transition-colors">
                  {partner.name}
                </span>
              </div>
            ))}
          </div>
        </div>
        
        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-6">
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm font-medium">HIPAA Compliant</span>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium">256-bit Encryption</span>
          </div>
          
          <div className="flex items-center bg-white px-4 py-2 rounded-full shadow-sm border border-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-medium">FDA Registered</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 