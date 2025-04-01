import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { medicationApi } from '../services/api';
import { prescriptionApi } from '../services/api';

const medicines = [
  "Dolopar", "Dolo 650", "Dolostat", "Dolotram", "Dolokind",
  "Paracetamol", "Ibuprofen", "Aspirin", "Metformin", "Atorvastatin",
  "Crocin", "Tylenol", "Calpol", "Brufen", "Disprin",
  "Naproxen", "Aceclofenac", "Diclofenac", "Tramadol", "Meloxicam",
  "Celecoxib", "Etodolac", "Indomethacin", "Ketorolac", "Mefenamic Acid",
  "Amoxicillin", "Azithromycin", "Ciprofloxacin", "Levofloxacin", "Doxycycline",
  "Cephalexin", "Cefuroxime", "Cefixime", "Erythromycin", "Metronidazole",
  "Clarithromycin", "Penicillin", "Rifampicin", "Isoniazid", "Streptomycin",
  "Hydroxyzine", "Fexofenadine", "Loratadine", "Levocetirizine", "Cetirizine",
  "Montelukast", "Chlorpheniramine", "Promethazine", "Diphenhydramine", "Desloratadine",
  "Amlodipine", "Losartan", "Telmisartan", "Ramipril", "Enalapril",
  "Atenolol", "Metoprolol", "Propranolol", "Diltiazem", "Clonidine",
  "Glimepiride", "Sitagliptin", "Vildagliptin", "Pioglitazone", "Empagliflozin",
  "Insulin Glargine", "Insulin Aspart", "Liraglutide", "Metformin SR", "Gliclazide",
  "Pantoprazole", "Omeprazole", "Esomeprazole", "Ranitidine", "Famotidine",
  "Domperidone", "Ondansetron", "Rabeprazole", "Sucralfate", "Lactulose",
  "Salbutamol", "Budesonide", "Formoterol", "Tiotropium", "Ipratropium",
  "Diazepam", "Alprazolam", "Clonazepam", "Fluoxetine", "Sertraline",
  "Escitalopram", "Risperidone", "Olanzapine", "Haloperidol", "Gabapentin",
  "Vitamin C", "Vitamin D3", "Vitamin B12", "Folic Acid", "Zinc Sulphate",
  "Iron Fumarate", "Calcium Carbonate", "Magnesium Oxide", "Fish Oil", "Glucosamine",
  "Thyroxine", "Tamsulosin", "Finasteride", "Warfarin", "Clopidogrel",
  "Rivaroxaban", "Apixaban", "Digoxin", "Erythropoietin", "Filgrastim",
  "Tadalafil", "Sildenafil", "Vardenafil", "Dapoxetine", "Levitra",
  "Brimonidine", "Dorzolamide", "Latanoprost", "Timolol", "Carboxymethylcellulose",
  "Syrup Paracetamol", "Cough Syrup", "ORS Sachets", "Colic Aid Drops", "Zinc Syrup",
  "Epinephrine", "Dexamethasone", "Prednisolone", "Methylprednisolone", "Triamcinolone",
  "Hydrochlorothiazide", "Chlorthalidone", "Spironolactone", "Furosemide", "Mannitol",
  "Morphine", "Fentanyl", "Oxycodone", "Methadone", "Buprenorphine",
  "Baclofen", "Tizanidine", "Cyclobenzaprine", "Methocarbamol", "Carisoprodol",
  "Levothyroxine", "Liothyronine", "Propylthiouracil", "Methimazole", "Iodine",
  "Insulin Lispro", "Insulin Detemir", "Insulin Degludec", "Glargine", "Aspart",
  "Coenzyme Q10", "Melatonin", "Probiotics", "Omega-3", "Amino Acids",
  "Duloxetine", "Venlafaxine", "Mirtazapine", "Trazodone", "Amitriptyline",
  "Aripiprazole", "Quetiapine", "Ziprasidone", "Paliperidone", "Lurasidone",
  "Zolpidem", "Eszopiclone", "Ramelteon", "Suvorexant", "Doxepin",
  "Benzocaine", "Lidocaine", "Bupivacaine", "Ropivacaine", "Mepivacaine",
  "Hydroxyurea", "Lenalidomide", "Bortezomib", "Thalidomide", "Temozolomide",
  "Rituximab", "Trastuzumab", "Bevacizumab", "Cetuximab", "Pembrolizumab",
  "Methotrexate", "Azathioprine", "Cyclosporine", "Tacrolimus", "Mycophenolate",
  "Sulfasalazine", "Leflunomide", "Hydroxychloroquine", "Tofacitinib", "Baricitinib",
  "Testosterone", "Estrogen", "Progesterone", "Tamoxifen", "Raloxifene",
  "Isotretinoin", "Tretinoin", "Benzoyl Peroxide", "Clindamycin Gel", "Adapalene",
  "Metformin XR", "Glyburide", "Repaglinide", "Nateglinide", "Acarbose",
  "Naloxone", "Flumazenil", "Naltrexone", "Disulfiram", "Acamprosate",
  "Psyllium", "Lactulose", "Polyethylene Glycol", "Docusate", "Bisacodyl",
  "Pyridoxine", "Biotin", "Niacin", "Pantothenic Acid", "Choline",
  "Terbinafine", "Fluconazole", "Itraconazole", "Voriconazole", "Amphotericin B",
  "Albendazole", "Mebendazole", "Ivermectin", "Pyrantel Pamoate", "Praziquantel",
  "Hydroxyzine", "Dimenhydrinate", "Meclizine", "Scopolamine", "Promethazine",
  "Chlorzoxazone", "Dantrolene", "Orphenadrine", "Metaxalone", "Methocarbamol",
  "Cinnarizine", "Betahistine", "Flunarizine", "Prochlorperazine", "Domperidone",
  "Risperidone", "Clozapine", "Lithium Carbonate", "Valproic Acid", "Lamotrigine",
  "Allopurinol", "Febuxostat", "Colchicine", "Probenecid", "Pegloticase",
  "Tobramycin", "Gentamicin", "Neomycin", "Amikacin", "Streptomycin",
  "Latanoprost", "Brimonidine", "Pilocarpine", "Acetazolamide", "Mannitol"
];



export default function SearchBar() {
  const [query, setQuery] = useState(""); // State for input value
  const [suggestions, setSuggestions] = useState([]); // State for search suggestions
  const [finalQuery, setFinalQuery] = useState(""); // State for final selected query
  const navigate = useNavigate(); // Hook for navigation
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
  // useEffect(() => {
  //   if (isLoaded && !isSignedIn) {
  //     navigate('/signin');
  //   }
  // }, [isLoaded, isSignedIn, navigate]);

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
  4. Exactly two cost-effective alternatives with PRECISE savings percentage (as a number) and EXACT price.
  
  IMPORTANT: 
  - Always provide exact medication names for alternatives, not general classes
  - Always provide exact numerical savings percentages (e.g., 45, 70)
  - Always provide exact prices with ₹ symbol (e.g., ₹10.99, ₹15.99)
  - Never use terms like "variable", "potentially", or "depending on"
  - If you don't know the exact information, use reasonable estimates based on market data
  
  Format your response as a JSON array following this structure:
  [
    {
      "name": "Medication Name",
      "matchedDosage": "Dosage",
      "description": "Brief description of medication purpose",
      "alternatives": [
        { 
          "name": "Digoxin (Generic)", 
          "savingsPercent": 70, 
          "price": "₹12.50" 
        },
        { 
          "name": "Lanoxin (Different Brand)", 
          "savingsPercent": 45, 
          "price": "₹18.75" 
        }
      ]
    }
  ]
`;
      
      // Make API call to Gemini
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-exp-03-25:generateContent?key=${apiKey}`, {
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

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);

    if (value.length > 0) {
      const filteredSuggestions = medicines.filter((medicine) =>
        medicine.toLowerCase().startsWith(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (medicine) => {
    setQuery(medicine);
    setFinalQuery(medicine); // Set the final query
    setSuggestions([]); // Clear suggestions
    console.log("Final Query:", medicine); // Log final query
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setFinalQuery(query);
      console.log("Final Query:", query); // Log final query on Enter
    }
  };

  // Redirect only when finalQuery is set
  if (finalQuery) {
    navigate(`/medicine/${encodeURIComponent(finalQuery)}`);
  }

  return (
    <div className="relative w-full max-w-md mx-8">
      <div className="relative">
        {/* Search Icon */}
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg className="h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
        </div>

        {/* Search Input */}
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-indigo-500 bg-opacity-25 text-white placeholder-indigo-200 focus:outline-none focus:bg-white focus:border-white focus:ring-white focus:text-gray-900 sm:text-sm"
          placeholder="Search medications..."
        />
      </div>

      {/* Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded-md shadow-lg">
          {suggestions.map((medicine, index) => (
            <li
              key={index}
              className="px-4 py-2 cursor-pointer hover:bg-gray-200"
              onClick={() => handleSuggestionClick(medicine)}
            >
              {medicine}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
