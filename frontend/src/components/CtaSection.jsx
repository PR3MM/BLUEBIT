import React from 'react';

const CtaSection = () => {
  return (
    <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6">
          Start Saving on Your Medications Today
        </h2>
        <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
          Join thousands of users who are already saving up to 80% on their prescription costs
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="px-8 py-4 bg-white text-indigo-700 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition duration-300 transform hover:scale-105">
            Get Started Free
          </button>
          <button className="px-8 py-4 bg-transparent text-white font-semibold rounded-lg border-2 border-white hover:bg-white hover:text-indigo-700 transition duration-300">
            Learn More
          </button>
        </div>
        
        <div className="mt-12 border-t border-indigo-500 pt-12 max-w-3xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="font-bold text-3xl mb-2">25,000+</div>
              <p className="text-indigo-200">Active Users</p>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl mb-2">₹2.4 Cr+</div>
              <div className="text-indigo-200">Saved by our users</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-3xl mb-2">99.7%</div>
              <p className="text-indigo-200">Accuracy Rate</p>
            </div>
          </div>
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="text-xs text-indigo-200 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Your data is secure and encrypted
          </div>
        </div>
      </div>
    </section>
  );
};

export default CtaSection; 