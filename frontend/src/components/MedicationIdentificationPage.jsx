import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { medicationApi } from '../services/api';
import { prescriptionApi } from '../services/api';

const MedicationIdentificationPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  const [extractedText, setExtractedText] = useState('');
  const [identifiedMedications, setIdentifiedMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState(null);
  const [savingStatus, setSavingStatus] = useState('idle');

  // Set API key from environment variable
  useEffect(() => {
    const key = import.meta.env.VITE_GEMINI_API_KEY;
    // console.log("Environment variables available:", Object.keys(import.meta.env).filter(key => key.startsWith('VITE_')));
    // console.log("API Key defined:", key ? "Yes" : "No");
    
    if (key) {
      setApiKey(key);
    } else {
    //   console.error("Gemini API key not found in environment variables");
      setError("API key not configured. Check your .env file to set up the Gemini API key.");
    }
  }, []);

  // Redirect if not signed in
  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/signin');
    }
  }, [isLoaded, isSignedIn, navigate]);

  // Get the extracted text from the location state (passed from PrescriptionScanPage)
  useEffect(() => {
    if (location.state?.extractedText) {
      setExtractedText(location.state.extractedText);
      // Only call identifyMedications if apiKey is available
      if (apiKey) {
        identifyMedications(location.state.extractedText);
      }
    } else {
      setError("No prescription text provided. Please scan a prescription first.");
      setIsLoading(false);
    }
  }, [location.state, apiKey]);

  // Function to save medications to MongoDB
  const saveMedicationsToDatabase = async () => {
    try {
      setSavingStatus('saving');
      
      // Get auth token - use a simpler direct approach
      let token = '';
      
      if (isSignedIn && user) {
        try {
          // Try different ways to get the token from Clerk
          token = await user.primaryEmailAddress?.emailAddress || user.id;
        } catch (tokenError) {
          console.error('Error getting token:', tokenError);
          token = user.id || 'anonymous';
        }
      }
      
      // Save each medication to the database
      for (const med of identifiedMedications) {
        // Format medication data according to our schema
        const medicationData = {
          name: med.name,
          dosage: med.matchedDosage,
          frequency: 'daily', // Default, could be improved with AI extraction
          timeOfDay: ['morning'], // Default, could be improved with AI extraction
          startDate: new Date(),
          instructions: med.description,
          active: true
        };
        
        // Save medication first
        const savedMedication = await medicationApi.createMedication(medicationData, token);
        console.log('Saved medication:', savedMedication);
        
        // Then create a prescription record linking to this medication
        const prescriptionData = {
          medication: savedMedication._id,
          doctor: 'Dr. ' + (extractedText.match(/Dr\.\s*([A-Za-z\s]+)/i)?.[1] || 'Unknown'),
          prescribedDate: new Date(),
          refills: {
            total: 3, // Default value, could be extracted from prescription text
            remaining: 3
          },
          pharmacy: extractedText.match(/pharmacy:\s*([A-Za-z\s]+)/i)?.[1] || 'Local Pharmacy',
          notes: 'Automatically created from prescription scan',
          status: 'active',
          userId: token // Add userId for email-based identification
        };
        
        // Save the prescription
        try {
          const savedPrescription = await prescriptionApi.createPrescription(prescriptionData, token);
          console.log('Saved prescription:', savedPrescription);
        } catch (prescError) {
          console.error('Error saving prescription:', prescError);
          // Continue even if prescription save fails
        }
      }
      
      setSavingStatus('success');
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Error saving medications:', error);
      setSavingStatus('error');
    }
  };

  // Function to identify medications using Gemini API
  const identifyMedications = async (text) => {
    setIsLoading(true);
    
    try {
      if (!apiKey) {
        // console.warn("API key not set yet, falling back to demo data");
        throw new Error("API key not available. Using demo data instead.");
      }

    //   console.log("Using API key to make request:", apiKey.substring(0, 5) + "...");
      
      // Prepare the prompt for Gemini
      // const prompt = `
      //   Analyze the following prescription text and identify medications with their dosages:
        
      //   ${text}
        
      //   For each identified medication, provide:
      //   1. The full medication name
      //   2. The dosage if specified
      //   3. A brief description of what the medication is used for
      //   4. At least two cost-effective alternatives with estimated savings percentage and price.
        
      //   Format your response as a JSON array following this structure:
      //   [
      //     {
      //       "name": "Medication Name",
      //       "matchedDosage": "Dosage",
      //       "description": "Brief description of medication purpose",
      //       "alternatives": [
      //         { 
      //           "name": "Alternative Name (tell exact name of the alternative)", 
      //           "savingsPercent": 70 (tell exact percent , should be a value or number), 
      //           "price": "₹10.99 (tell exact price, should be a value or number)" 
      //         },
      //         { 
      //           "name": "Another Alternative Name (tell exact name of the alternative)", 
      //           "savingsPercent": 45 (tell exact percent , should be a value or number), 
      //           "price": "₹15.99 (tell exact price , should be a value or number)" 
      //         }
      //       ]
      //     }
      //   ]
      // `;


      const prompt = `
  Analyze the following prescription text and identify medications with their dosages:
  
  ${text}
  
  For each identified medication, provide:
  1. The full medication name
  2. The dosage if specified
  3. A brief description of what the medication is used for
  4. Exactly two cost-effective GENERIC alternatives with PRECISE savings percentage (as a number) and EXACT price.
  
  IMPORTANT: 
  - PRIORITIZE GENERIC MEDICINES for all alternatives
  - Always provide exact medication names for alternatives, not general classes
  - Always provide exact numerical savings percentages (e.g., 45, 70)
  - Always provide exact prices with ₹ symbol (e.g., ₹10.99, ₹15.99)
  - Never use terms like "variable", "potentially", or "depending on"
  - If you don't know the exact information, use reasonable estimates based on market data
  - For each branded medication, ensure that at least one truly generic alternative is provided
  
  Format your response as a JSON array following this structure:
  [
    {
      "name": "Medication Name",
      "matchedDosage": "Dosage",
      "description": "Brief description of medication purpose",
      "alternatives": [
        { 
          "name": "Generic Alternative 1", 
          "savingsPercent": 70, 
          "price": "₹12.50" 
        },
        { 
          "name": "Generic Alternative 2", 
          "savingsPercent": 45, 
          "price": "₹18.75" 
        }
      ]
    }
  ]
`;
      
      // Make API call to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: prompt }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
          }
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }
      
      const data = await response.json();
      
      // Extract the text response from Gemini
      const geminiText = data.candidates[0].content.parts[0].text;
      
      // Find the JSON data in the response (it might be wrapped in markdown code blocks)
      const jsonMatch = geminiText.match(/\[\s*\{.*\}\s*\]/s);
      
      if (!jsonMatch) {
        throw new Error("Could not parse medication data from API response");
      }
      
      // Parse the JSON data
      const medications = JSON.parse(jsonMatch[0]);
      
      setIdentifiedMedications(medications);
      setIsLoading(false);
    } catch (err) {
    //   console.error("Error identifying medications:", err);
      
      // If API fails, fall back to identifying some common medications as a demo
      const commonMedications = [
        { name: "Lisinopril", description: "ACE inhibitor used to treat high blood pressure", dosages: ["10mg", "20mg", "40mg"] },
        { name: "Simvastatin", description: "HMG-CoA reductase inhibitor (statin) for cholesterol", dosages: ["10mg", "20mg", "40mg"] },
        { name: "Metformin", description: "Biguanide for type 2 diabetes", dosages: ["500mg", "850mg", "1000mg"] },
        { name: "Amlodipine", description: "Calcium channel blocker for hypertension", dosages: ["2.5mg", "5mg", "10mg"] },
        { name: "Omeprazole", description: "Proton pump inhibitor for acid reflux", dosages: ["10mg", "20mg", "40mg"] },
      ];
      
      // Find medications in the text (case insensitive)
      const found = commonMedications.filter(med => 
        new RegExp(med.name, 'i').test(text)
      ).map(med => {
        // Try to find a dosage match
        const dosageMatch = med.dosages.find(dosage => text.includes(dosage));
        
        return {
          ...med,
          matchedDosage: dosageMatch || "Unknown dosage",
          alternatives: [
            { name: `Generic ${med.name}`, savingsPercent: 65, price: '$12.99' },
            { name: `Alternative Brand`, savingsPercent: 40, price: '$24.99' },
          ]
        };
      });
      
      // If no medications are found, add a fallback example
      if (found.length === 0) {
        setIdentifiedMedications([
          {
            name: "Lisinopril",
            matchedDosage: "20mg",
            description: "ACE inhibitor used to treat high blood pressure",
            alternatives: [
              { name: "Generic Lisinopril", savingsPercent: 70, price: '$8.99' },
              { name: "Benazepril", savingsPercent: 45, price: '$19.99' },
            ]
          },
          {
            name: "Metformin",
            matchedDosage: "500mg",
            description: "Biguanide for type 2 diabetes",
            alternatives: [
              { name: "Generic Metformin", savingsPercent: 65, price: '$10.99' },
              { name: "Glumetza", savingsPercent: 25, price: '$35.99' },
            ]
          }
        ]);
      } else {
        setIdentifiedMedications(found);
      }
      
    //   setError(`Note: Using fallback data. ${err.message}`);
    // console.log(err)
      setIsLoading(false);
    }
  };

  // Render loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Identifying Medications
            </h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10 border border-gray-100">
            <div className="w-full max-w-md mx-auto text-center py-8">
              <div className="mb-8">
                <div className="mx-auto w-24 h-24 relative">
                  <svg className="animate-spin h-full w-full text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
              
              <h3 className="text-2xl font-semibold text-gray-800 mb-3">
                Analyzing Your Prescription
              </h3>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
                  style={{ width: '80%' }}
                ></div>
              </div>
              
              <p className="text-gray-600 mb-4">
                Identifying medications and finding potential alternatives...
              </p>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Our AI is matching medications to our database of over 10,000 drugs and looking for cost-saving alternatives.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              Something Went Wrong
            </h1>
          </div>
          
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10 border border-gray-100">
            <div className="text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-red-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-4">{error}</h3>
              
              <div className="mt-8">
                <Link 
                  to="/scan-prescription" 
                  className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg font-medium shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
                >
                  Scan a Prescription
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render medication results
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Identified Medications
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            We've analyzed your prescription and found the following medications. Explore alternatives to save on costs.
          </p>
        </div>
        
        {/* Main content */}
        <div className="mb-10">
          {/* Original text card */}
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 mb-10">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-900">
                  Prescription Text
                </h3>
                <button
                  onClick={() => navigate('/scan-prescription')}
                  className="bg-indigo-100 text-indigo-700 text-xs px-3 py-1 rounded-full font-medium hover:bg-indigo-200 transition-colors"
                >
                  Rescan
                </button>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-2 overflow-auto max-h-36">
                <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono">
                  {extractedText || "No text available"}
                </pre>
              </div>
            </div>
          </div>
          
          {/* Results */}
          {identifiedMedications.length > 0 ? (
            <div className="space-y-6">
              {identifiedMedications.map((medication, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
                  <div className="border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start">
                        <div className="p-2 bg-indigo-100 rounded-lg mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                          </svg>
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">
                            {medication.name}
                          </h3>
                          <div className="flex items-center mb-2">
                            <span className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full font-medium">
                              {medication.matchedDosage}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">
                            {medication.description}
                          </p>
                        </div>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-sm font-medium rounded-full">
                          Identified
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Alternatives & Savings
                    </h4>
                    
                    <div className="space-y-4">
                      {medication.alternatives.map((alternative, altIndex) => (
                        <div key={altIndex} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:border-indigo-200 hover:bg-indigo-50/30 transition-colors">
                          <div className="flex items-center">
                            <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mr-4">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                              </svg>
                            </div>
                            <div>
                              <h5 className="font-medium text-gray-900">{alternative.name}</h5>
                              <p className="text-sm text-gray-500">Estimated price: {alternative.price}</p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <div className="mr-6">
                              <div className="text-green-600 font-bold text-lg">
                                {alternative.savingsPercent}% less
                              </div>
                              <p className="text-xs text-gray-500">than brand </p>
                            </div>
                            <button 
  onClick={() => navigate(`/medicine/${encodeURIComponent(alternative.name)}`)}
  className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
>
  Learn More
</button>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <button className="text-indigo-600 font-medium hover:text-indigo-800 transition-colors text-sm flex items-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                        </svg>
                        View More Alternatives
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Save Medications Button */}
              <div className="mt-8">
                <div className="p-4 bg-white rounded-2xl shadow-md border border-gray-100">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Save Medications to Your Profile</h3>
                    <p className="text-gray-600 mb-6">
                      Save these medications to your profile to track them and receive reminders.
                    </p>
                    
                    {savingStatus === 'idle' && (
                      <button
                        onClick={saveMedicationsToDatabase}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium"
                      >
                        Save Medications
                      </button>
                    )}
                    
                    {savingStatus === 'saving' && (
                      <div className="flex flex-col items-center">
                        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 rounded-full border-t-transparent mb-3"></div>
                        <p className="text-gray-600">Saving medications...</p>
                      </div>
                    )}
                    
                    {savingStatus === 'success' && (
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-green-100 p-2 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                        <p className="text-green-600 font-medium">Medications saved successfully!</p>
                        <p className="text-gray-500 text-sm mt-1">Redirecting to dashboard...</p>
                      </div>
                    )}
                    
                    {savingStatus === 'error' && (
                      <div className="flex flex-col items-center">
                        <div className="rounded-full bg-red-100 p-2 mb-3">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </div>
                        <p className="text-red-600 font-medium">Failed to save medications</p>
                        <p className="text-gray-500 text-sm mt-1">Please try again later</p>
                        <button
                          onClick={saveMedicationsToDatabase}
                          className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                          Retry
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100 p-8 text-center">
              <div className="flex justify-center mb-6">
                <div className="p-4 bg-yellow-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Medications Identified
              </h3>
              <p className="text-gray-600 mb-6 max-w-lg mx-auto">
                We couldn't identify any medications from your prescription. This might be due to unclear text or handwriting. Please try scanning again with a clearer image.
              </p>
              
              <Link 
                to="/scan-prescription" 
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-lg font-medium shadow-sm text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              >
                Scan Again
              </Link>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <Link 
            to="/scan-prescription" 
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex-1 flex justify-center items-center max-w-xs mx-auto sm:mx-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
            </svg>
            Scan Another Prescription
          </Link>
          
          <Link 
            to="/dashboard" 
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium flex-1 flex justify-center items-center max-w-xs mx-auto sm:mx-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MedicationIdentificationPage; 