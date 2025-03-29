// import { useEffect, useState } from "react";

// const MicrosoftTranslator = () => {
//   const [selectedLanguage, setSelectedLanguage] = useState("en");
//   const [loading, setLoading] = useState(false);
  
//   // Define supported languages
//   const languages = [
//     { language: "en", name: "English" },
//     { language: "hi", name: "Hindi" },
//     { language: "te", name: "Telugu" },
//     { language: "ta", name: "Tamil" },
//     { language: "kn", name: "Kannada" },
//     { language: "ml", name: "Malayalam" },
//     { language: "mr", name: "Marathi" },
//     { language: "gu", name: "Gujarati" }
//   ];

//   // Function to translate text using browser's built-in translation functionality
//   const translatePage = (languageCode) => {
//     if (languageCode === "en") {
//       // For English, just reload the page to get back to the original content
//       window.location.reload();
//       return;
//     }

//     // Use URL hash method to trigger translation
//     // This works in many browsers including Chrome, Firefox, and Edge
//     document.cookie = `googtrans=/en/${languageCode}`;
//     window.location.hash = `googtrans(en|${languageCode})`;
    
//     // Force a refresh of the translation
//     try {
//       // Attempt to use the GTranslate built-in method if available
//       if (window.google && window.google.translate) {
//         window.google.translate.TranslateElement({
//           pageLanguage: 'en',
//           includedLanguages: languageCode
//         });
//       }
//     } catch (e) {
//       console.log("Translation refresh failed:", e);
//     }
//   };

//   // Handle language change
//   const handleLanguageChange = async (e) => {
//     const newLang = e.target.value;
//     setSelectedLanguage(newLang);
//     setLoading(true);
    
//     // Add a simple version of Google Translate
//     addGoogleTranslateScript(newLang);
    
//     // Store language preference
//     localStorage.setItem("selectedLanguage", newLang);
//     setLoading(false);
//   };

//   // A simpler approach - just add a basic Google Translate script that doesn't use an API key
//   const addGoogleTranslateScript = (languageCode) => {
//     if (languageCode === "en") {
//       // Remove the script if going back to English
//       const existingScript = document.getElementById('google-translate-script');
//       if (existingScript) existingScript.remove();
      
//       // Remove any translation-related elements
//       const elements = document.querySelectorAll('.google-translate-container');
//       elements.forEach(el => el.remove());
      
//       // Reload page to original state
//       window.location.reload();
//       return;
//     }
    
//     // Create or update translate script
//     let script = document.getElementById('google-translate-script');
    
//     if (!script) {
//       script = document.createElement('script');
//       script.id = 'google-translate-script';
//       script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
//       document.head.appendChild(script);
      
//       // Create a hidden container for Google Translate
//       const container = document.createElement('div');
//       container.id = 'google_translate_element';
//       container.className = 'google-translate-container';
//       container.style.display = 'none';
//       document.body.appendChild(container);
      
//       // Add CSS to hide Google's interface
//       const style = document.createElement('style');
//       style.className = 'google-translate-container';
//       style.textContent = `
//         body {top: 0 !important;}
//         .skiptranslate, .goog-te-banner-frame {display: none !important;}
//         .goog-te-gadget {font-size: 0 !important;}
//         .goog-tooltip {display: none !important;}
//         .goog-text-highlight {background-color: transparent !important; box-shadow: none !important;}
//       `;
//       document.head.appendChild(style);
//     }
    
//     // Define the initialization function
//     window.googleTranslateElementInit = function() {
//       new window.google.translate.TranslateElement(
//         {
//           pageLanguage: 'en',
//           includedLanguages: languageCode,
//           autoDisplay: false,
//           layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
//         },
//         'google_translate_element'
//       );
      
//       // Use URL to force translation
//       document.cookie = `googtrans=/en/${languageCode}`;
//       window.location.hash = `googtrans(en|${languageCode})`;
//     };
//   };
  
//   // Load saved language preference
//   useEffect(() => {
//     const savedLanguage = localStorage.getItem("selectedLanguage");
//     if (savedLanguage && savedLanguage !== "en") {
//       setSelectedLanguage(savedLanguage);
//       addGoogleTranslateScript(savedLanguage);
//     }
//   }, []);

//   // Alternative approach using just the browser's URL hash method
//   const translateWithUrlHash = (languageCode) => {
//     if (languageCode === "en") {
//       window.location.hash = "";
//       window.location.reload();
//       return;
//     }
    
//     // Set cookie and URL hash to trigger Google Translate
//     document.cookie = `googtrans=/en/${languageCode}`;
//     window.location.hash = `googtrans(en|${languageCode})`;
//     window.location.reload(); // Force reload to apply translation
//   };

//   return (
//     <div className="translate-container ml-4">
//       {loading ? (
//         <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
//       ) : (
//         <div className="relative">
//           <select
//             value={selectedLanguage}
//             onChange={handleLanguageChange}
//             className="appearance-menulist pl-3 pr-8 py-2 bg-white border border-gray-300 rounded-md text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
//           >
//             {languages.map((lang) => (
//               <option key={lang.language} value={lang.language}>
//                 {lang.name}
//               </option>
//             ))}
//           </select>
//           <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
//             <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
//               <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
//             </svg>
//           </div>
//         </div>
//       )}
//       {/* Add a fallback button that uses the URL hash method directly */}
//       {selectedLanguage !== "en" && (
//         <button 
//           onClick={() => translateWithUrlHash(selectedLanguage)}
//           className="ml-2 text-xs text-blue-600 hover:text-blue-800"
//         >
//           Refresh Translation
//         </button>
//       )}
//     </div>
//   );
// };

// export default MicrosoftTranslator;