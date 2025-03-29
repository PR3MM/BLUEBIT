import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { medicationApi } from '../services/api';

const MedicationDetailsPage = () => {
  const { medicationName } = useParams();
  const [medicationDetails, setMedicationDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMedicationDetails = async () => {
      try {
        setIsLoading(true);
        const data = await medicationApi.getMedicationDetails(medicationName);
        // Clean the response data
        const cleanedData = {
          ...data,
          // Handle potentially malformed data
          sideEffects: typeof data.sideEffects === 'object' ? data.sideEffects : { common: [], severe: [] },
          uses: Array.isArray(data.uses) ? data.uses : [],
          precautions: data.warnings || data.precautions || []
        };
        setMedicationDetails(cleanedData);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching medication details:', err);
        setError('Failed to load medication information');
        setIsLoading(false);
      }
    };

    if (medicationName) {
      fetchMedicationDetails();
    }
  }, [medicationName]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="animate-spin h-12 w-12 border-4 border-indigo-500 rounded-full border-t-transparent mx-auto mb-6"></div>
          <h2 className="text-2xl font-semibold text-gray-800">Loading medication information...</h2>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-full bg-red-100 p-3 mx-auto mb-6 w-16 h-16 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">{error}</h2>
          <Link to="/dashboard" className="text-indigo-600 hover:text-indigo-800">Return to Dashboard</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back button */}
        <div className="mb-8">
          <button onClick={() => window.history.back()} className="flex items-center text-indigo-600 hover:text-indigo-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back
          </button>
        </div>
        
        {/* Medication Header */}
        {/* Medication Header */}
<div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-8">
  <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-8">
    <div className="flex items-start justify-between">
      <div className="flex items-start">
        <div className="p-3 bg-indigo-100 rounded-lg mr-5">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        </div>
        <div>
          <h1 className="text-3xl font-semibold text-gray-900 mb-2">
            {medicationDetails?.name || medicationName}
          </h1>
          {medicationDetails?.category && (
            <div className="flex mb-3">
              <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                {medicationDetails.category}
              </span>
            </div>
          )}
          {medicationDetails?.factBox?.therapeutic_class || medicationDetails?.factBox?.["therapeutic class"] && (
            <div className="flex mb-3">
              <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium ml-2">
                {medicationDetails?.factBox?.therapeutic_class || medicationDetails?.factBox?.["therapeutic class"]}
              </span>
            </div>
          )}
        </div>
      </div>
      <a 
        href={`https://www.google.com/search?tbm=shop&q=${encodeURIComponent(medicationDetails?.name || medicationName)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="bg-indigo-600 text-white text-center w-32 px-5 py-2 rounded-lg shadow-md hover:bg-indigo-700 transition"
      >
        Buy Now
      </a>
    </div>
  </div>
</div>
  
        {/* Medication Details */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-8">
          <div className="p-8">
            {/* Overview */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                Overview
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {medicationDetails?.description || "No description available."}
              </p>
            </section>
            
            {/* How It Works */}
            {medicationDetails?.howItWorks && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                  </svg>
                  How It Works
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {medicationDetails.howItWorks}
                </p>
              </section>
            )}
            
            {/* Uses */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                </svg>
                Uses
              </h2>
              {medicationDetails?.uses?.length > 0 ? (
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {medicationDetails.uses.map((use, index) => (
                    <li key={index}>{use}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No use information available.</p>
              )}
            </section>
            
            {/* Benefits */}
            {medicationDetails?.benefits?.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Benefits
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {medicationDetails.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* How To Use */}
            {medicationDetails?.howToUse && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                  How To Use
                </h2>
                <p className="text-gray-700 leading-relaxed">
                  {medicationDetails.howToUse}
                </p>
              </section>
            )}
            
            {/* Side Effects */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Side Effects
              </h2>
              {medicationDetails?.sideEffects && (Object.keys(medicationDetails.sideEffects).length > 0) ? (
                <div>
                  {Array.isArray(medicationDetails.sideEffects.common) && medicationDetails.sideEffects.common.length > 0 && (
                    <>
                      <h3 className="font-medium mb-2 text-gray-800">Common Side Effects:</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700 mb-4">
                        {medicationDetails.sideEffects.common.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {Array.isArray(medicationDetails.sideEffects.severe) && medicationDetails.sideEffects.severe.length > 0 && (
                    <>
                      <h3 className="font-medium mb-2 text-gray-800">Severe Side Effects (Seek medical help):</h3>
                      <ul className="list-disc pl-5 space-y-1 text-gray-700">
                        {medicationDetails.sideEffects.severe.map((effect, index) => (
                          <li key={index}>{effect}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              ) : (
                <p className="text-gray-600">No side effect information available.</p>
              )}
            </section>
            
            {/* Dosage */}
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM14 11a1 1 0 011 1v1h1a1 1 0 110 2h-1v1a1 1 0 11-2 0v-1h-1a1 1 0 110-2h1v-1a1 1 0 011-1z" />
                </svg>
                Dosage Information
              </h2>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <p className="text-gray-700">
                  {medicationDetails?.dosage || medicationDetails?.dosageInstructions || "Always follow your doctor's prescribed dosage instructions. The information provided here is general guidance only."}
                </p>
              </div>
            </section>
            
            {/* Missed Dose */}
            {medicationDetails?.missedDose && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                  </svg>
                  Missed Dose
                </h2>
                <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                  <p className="text-gray-700">{medicationDetails.missedDose}</p>
                </div>
              </section>
            )}
            
            {/* Warnings */}
            {medicationDetails?.warnings && medicationDetails.warnings.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  Warnings
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {medicationDetails.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Drug Interactions */}
            {medicationDetails?.interactions && medicationDetails.interactions.length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                  </svg>
                  Drug Interactions
                </h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  {medicationDetails.interactions.map((interaction, index) => (
                    <li key={index}>{interaction}</li>
                  ))}
                </ul>
              </section>
            )}
            
            {/* Safety Advice */}
            {medicationDetails?.safetyAdvice && Object.keys(medicationDetails.safetyAdvice).length > 0 && (
              <section className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Safety Advice
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(medicationDetails.safetyAdvice).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h3 className="font-medium text-gray-800 mb-2 capitalize">{key}</h3>
                      <div className="flex items-center mb-2">
                        <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                          value.status === "SAFE" ? "bg-green-100 text-green-800" :
                          value.status === "CAUTION" ? "bg-yellow-100 text-yellow-800" :
                          "bg-blue-100 text-blue-800"
                        }`}>
                          {value.status}
                        </span>
                      </div>
                      <p className="text-gray-700">{value.details}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
        
        {/* Additional Info */}
        <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Additional Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {medicationDetails?.price && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Average Price</h3>
                  <p className="text-lg text-indigo-600 font-semibold">{medicationDetails.price}</p>
                </div>
              )}
              
              {medicationDetails?.manufacturer && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Manufacturer</h3>
                  <p className="text-gray-700">{medicationDetails.manufacturer}</p>
                </div>
              )}
              
              {medicationDetails?.storage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Storage</h3>
                  <p className="text-gray-700">{medicationDetails.storage}</p>
                </div>
              )}
              
              {medicationDetails?.storageInstructions && !medicationDetails?.storage && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Storage</h3>
                  <p className="text-gray-700">{medicationDetails.storageInstructions}</p>
                </div>
              )}
              
              {medicationDetails?.prescription !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Prescription Required</h3>
                  <p className="text-gray-700">{medicationDetails.prescription ? "Yes" : "No"}</p>
                </div>
              )}
              
              {medicationDetails?.pregnancyCategory && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Pregnancy Category</h3>
                  <p className="text-gray-700">{medicationDetails.pregnancyCategory}</p>
                </div>
              )}
              
              {medicationDetails?.brandNames && medicationDetails.brandNames.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Brand Names</h3>
                  <p className="text-gray-700">{medicationDetails.brandNames.join(", ")}</p>
                </div>
              )}
              
              {medicationDetails?.genericAvailability !== undefined && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Generic Available</h3>
                  <p className="text-gray-700">{medicationDetails.genericAvailability ? "Yes" : "No"}</p>
                </div>
              )}
              
              {medicationDetails?.factBox?.composition && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Composition</h3>
                  <p className="text-gray-700">{Array.isArray(medicationDetails.factBox.composition) ? 
                    medicationDetails.factBox.composition.join(", ") : 
                    medicationDetails.factBox.composition}</p>
                </div>
              )}
              
              {(medicationDetails?.factBox?.["habit forming"] !== undefined) && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-800 mb-2">Habit Forming</h3>
                  <p className="text-gray-700">{medicationDetails.factBox["habit forming"]}</p>
                </div>
              )}
            </div>
            
            {medicationDetails?.costSavingTips && medicationDetails.costSavingTips.length > 0 && (
              <div className="mt-6 bg-indigo-50 p-4 rounded-lg">
                <h3 className="font-medium text-gray-800 mb-2">Cost Saving Tips</h3>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  {medicationDetails.costSavingTips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            )}
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                This information is provided for educational purposes only and is not intended as medical advice.
                Always consult with a healthcare professional before taking any medication.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MedicationDetailsPage;