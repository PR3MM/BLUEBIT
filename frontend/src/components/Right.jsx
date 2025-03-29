import React, { useState } from 'react';
import { useAddress } from '../components/context/AddressContext';
import Form from './Form';
import SubmittedAddresses from './SubmittedAddresses';

const Right = () => {
  const [currentView, setCurrentView] = useState('form');

  const toggleView = (view) => {
    setCurrentView(view);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-lg shadow-xl sm:w-full md:w-2/3 lg:w-full">
      <div className="mb-6 flex justify-center gap-8">
        <button
          onClick={() => toggleView('form')}
          className={`text-sm font-semibold ${currentView === 'form' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        >
          Form
        </button>
        <button
          onClick={() => toggleView('submittedAddresses')}
          className={`text-sm font-semibold ${currentView === 'submittedAddresses' ? 'text-indigo-600 border-b-2 border-indigo-600' : 'text-gray-600 hover:text-indigo-600'}`}
        >
          Submitted Addresses
        </button>
      </div>

      {currentView === 'form' ? (
        <Form />
      ) : (
        <SubmittedAddresses />
      )}
    </div>
  );
};

export default Right;
