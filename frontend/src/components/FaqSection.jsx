import React, { useState } from 'react';

const FaqSection = () => {
  const faqItems = [
    {
      question: "Are generic medications as safe as brand-name drugs?",
      answer: "Yes, generic medications are required by the FDA to have the same active ingredients, strength, dosage form, and route of administration as the brand-name drug. They undergo rigorous testing to ensure they are just as safe and effective."
    },
    {
      question: "How much can I save by switching to generic medications?",
      answer: "Patients typically save 30-80% on prescription costs when switching to generic alternatives. The exact savings depend on the specific medication and your insurance coverage."
    },
    {
      question: "Is my prescription data secure when I use the app?",
      answer: "Yes, we take data privacy seriously. All prescription data is encrypted end-to-end and stored securely following HIPAA guidelines. We never share your personal health information with third parties without your explicit consent."
    },
    {
      question: "How accurate is the AI prescription scanning?",
      answer: "Our AI technology has a 99.7% accuracy rate, verified across over 98,000 prescriptions. The app also allows you to manually verify and edit any information before searching for alternatives."
    },
    {
      question: "Can I share the alternative options with my doctor?",
      answer: "Yes, the app allows you to generate a shareable report that you can email or print for your healthcare provider. We always recommend discussing any medication changes with your doctor."
    },
    {
      question: "Do you cover medications for all conditions?",
      answer: "Our database includes FDA-approved generic alternatives for most common prescription medications. We continuously update our database to expand coverage for specialized medications."
    }
  ];

  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section className="py-20 bg-white" id="faq">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Frequently Asked Questions</h2>
          <p className="mt-4 text-xl text-gray-600">
            Everything you need to know about our generic medication finder
          </p>
        </div>

        <div className="divide-y divide-gray-200">
          {faqItems.map((faq, index) => (
            <div key={index} className="py-6">
              <button
                onClick={() => toggleFaq(index)}
                className="flex justify-between items-center w-full text-left font-semibold text-lg text-gray-800 focus:outline-none"
              >
                <span>{faq.question}</span>
                <span className="ml-6 flex-shrink-0">
                  {openIndex === index ? (
                    <svg className="h-6 w-6 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                    </svg>
                  ) : (
                    <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  )}
                </span>
              </button>
              {openIndex === index && (
                <div className="mt-3 text-gray-600 pr-12">
                  <p>{faq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Didn't find what you're looking for?
          </p>
          <button className="mt-2 text-indigo-600 font-medium hover:text-indigo-700">
            Contact our support team
          </button>
        </div>
      </div>
    </section>
  );
};

export default FaqSection; 