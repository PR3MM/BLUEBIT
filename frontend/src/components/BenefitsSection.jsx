import React from 'react';

const BenefitsSection = () => {
  const benefits = [
    {
      title: "Cost Savings",
      description: "Save up to 80% on prescription costs by switching to FDA-approved generic alternatives."
    },
    {
      title: "Same Effectiveness",
      description: "Generic medications contain the same active ingredients and work the same way as brand-name drugs."
    },
    {
      title: "Verified Information",
      description: "All alternatives are verified against medical databases for accuracy and safety."
    }
  ];

  return (
    <section className="py-20 bg-white" id="benefits">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left: Benefits list */}
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
              Why Choose Our App?
            </h2>

            <div className="space-y-8">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex">
                  <div className="flex-shrink-0 mt-1">
                    <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-800">{benefit.title}</h3>
                    <p className="mt-2 text-gray-600">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Testimonial */}
            <div className="mt-12 bg-indigo-50 rounded-lg p-6 border border-indigo-100">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-8 w-8 text-indigo-400" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
                    <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36c0 5.088 3.072 8.064 6.624 8.064 3.36 0 5.856-2.688 5.856-5.856 0-3.168-2.208-5.472-5.088-5.472-.576 0-1.344.096-1.536.192.48-3.264 3.552-7.104 6.624-9.024L9.352 4zm16.512 0c-4.8 3.456-8.256 9.12-8.256 15.36 0 5.088 3.072 8.064 6.624 8.064 3.264 0 5.856-2.688 5.856-5.856 0-3.168-2.304-5.472-5.184-5.472-.576 0-1.248.096-1.44.192.48-3.264 3.456-7.104 6.528-9.024L25.864 4z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <p className="text-gray-600 mb-4">
                    "I saved over ₹15,000 on my monthly prescription costs by using this app to find generic alternatives. It's incredibly easy to use and the information is trustworthy."
                  </p>
                  <div className="mt-3">
                    <p className="text-indigo-600 font-medium">Rohit D.</p>
                    <p className="text-gray-500 text-sm">App User</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Data visualization */}
          <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-800 mb-6 text-center">Average Savings by Medication Type</h3>
            
            {/* Simple bar chart */}
            <div className="space-y-5">
              {[
                { name: "Pain Relief", percentage: 75 },
                { name: "Blood Pressure", percentage: 82 },
                { name: "Cholesterol", percentage: 79 },
                { name: "Diabetes", percentage: 68 },
                { name: "Antibiotics", percentage: 72 }
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-1">
                    <span className="text-gray-700">{item.name}</span>
                    <span className="text-indigo-600 font-medium">{item.percentage}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-indigo-600 h-2.5 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="mt-8 text-center text-gray-600 text-sm">
              Data based on average user savings reports in 2023
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection; 