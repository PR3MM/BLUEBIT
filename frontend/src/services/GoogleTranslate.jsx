import { useEffect, useState } from "react";
import { Globe, RefreshCw } from "lucide-react";

const GoogleTranslator = () => {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [loading, setLoading] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  
  // Define supported languages
  const languages = [
    { language: "en", name: "English" },
    { language: "hi", name: "Hindi" },
    { language: "te", name: "Telugu" },
    { language: "ta", name: "Tamil" },
    { language: "kn", name: "Kannada" },
    { language: "ml", name: "Malayalam" },
    { language: "mr", name: "Marathi" },
    { language: "gu", name: "Gujarati" },
    { language: "es", name: "Spanish" },
    { language: "fr", name: "French" },
    { language: "de", name: "German" },
    { language: "zh-CN", name: "Chinese" },
    { language: "ja", name: "Japanese" },
    { language: "ru", name: "Russian" }
  ];

  // Handle language change
  const handleLanguageChange = (e) => {
    const newLang = e.target.value;
    setSelectedLanguage(newLang);
    setLoading(true);
    
    if (newLang === "en") {
      resetTranslation();
    } else {
      translatePage(newLang);
    }
    
    // Store language preference
    localStorage.setItem("selectedLanguage", newLang);
    
    // Show success tooltip
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
      setLoading(false);
    }, 2000);
  };
  
  // Function to translate page using Google Translate
  const translatePage = (languageCode) => {
    // Set cookie for Google Translate
    document.cookie = `googtrans=/en/${languageCode}`;
    
    // Add Google Translate script if not already present
    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.id = 'google-translate-script';
      document.head.appendChild(script);
      
      // Create hidden container for Google Translate widget
      const translateDiv = document.createElement('div');
      translateDiv.id = 'google_translate_element';
      translateDiv.className = 'google-translate-container';
      translateDiv.style.display = 'none';
      document.body.appendChild(translateDiv);
      
      // Add CSS to hide Google's UI elements
      const style = document.createElement('style');
      style.textContent = `
        body {top: 0 !important;}
        .skiptranslate, .goog-te-banner-frame {display: none !important;}
        .goog-te-gadget {font-size: 0 !important;}
        .goog-tooltip {display: none !important;}
        .goog-text-highlight {background-color: transparent !important; box-shadow: none !important;}
      `;
      document.head.appendChild(style);
    }
    
    // Initialize Google Translate
    window.googleTranslateElementInit = function() {
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: languageCode,
          autoDisplay: false,
          layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
        },
        'google_translate_element'
      );
    };
    
    // Force translation using URL hash
    window.location.hash = `googtrans(en|${languageCode})`;
  };
  
  // Reset to original language
  const resetTranslation = () => {
    // Remove translation script and elements
    const script = document.getElementById('google-translate-script');
    if (script) script.remove();
    
    const elements = document.querySelectorAll('.google-translate-container');
    elements.forEach(el => el.remove());
    
    // Clear cookies and hash
    document.cookie = "googtrans=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.hash = '';
    
    // Reload page to get original content
    window.location.reload();
  };
  
  // Refresh translation
  const refreshTranslation = () => {
    if (selectedLanguage === "en") return;
    
    setLoading(true);
    // Re-apply translation
    document.cookie = `googtrans=/en/${selectedLanguage}`;
    window.location.hash = `googtrans(en|${selectedLanguage})`;
    
    // Show success tooltip
    setShowTooltip(true);
    setTimeout(() => {
      setShowTooltip(false);
      setLoading(false);
    }, 1500);
    
    window.location.reload();
  };
  
  // Load saved language preference on component mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("selectedLanguage");
    if (savedLanguage && savedLanguage !== "en") {
      setSelectedLanguage(savedLanguage);
      translatePage(savedLanguage);
    }
  }, []);

  return (
    <div className=" ml-4 flex items-center relative">
      <div className="bg-white rounded-full shadow-sm border border-gray-100 py-1.5 px-3 flex items-center gap-3">
        <Globe size={16} className="text-gray-400" />
        
        <div className="relative">
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-24 h-7 bg-gray-100 rounded-full animate-pulse"></div>
              <RefreshCw size={14} className="text-gray-300 animate-spin" />
            </div>
          ) : (
            <select
              value={selectedLanguage}
              onChange={handleLanguageChange}
              className="appearance-none pl-2 pr-6 py-1 bg-white text-sm text-gray-600 font-medium focus:outline-none min-w-24 transition-all duration-200"
              aria-label="Select language"
            >
              {languages.map((lang) => (
                <option key={lang.language} value={lang.language}>
                  {lang.name}
                </option>
              ))}
            </select>
          )}
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1 text-gray-400">
            <svg className="fill-current h-3 w-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
              <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
            </svg>
          </div>
        </div>
        
        {selectedLanguage !== "en" && !loading && (
          <button 
            onClick={refreshTranslation}
            className="flex items-center justify-center p-1.5 text-xs bg-gray-50 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 transition-colors"
            aria-label="Refresh translation"
            title="Refresh translation"
          >
            <RefreshCw size={12} />
          </button>
        )}
      </div>
      
      {showTooltip && (
        <div className="absolute -bottom-8 left-0 bg-white text-gray-700 text-xs py-1 px-3 rounded-full shadow-sm border border-gray-100 transition-opacity duration-300">
          {selectedLanguage === "en" ? "Reverted to English" : "Translation applied"}
        </div>
      )}
    </div>
  );
};

export default GoogleTranslator;