import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-white text-lg font-semibold mb-4">MediScanAI</h3>
            <p className="text-gray-400 mb-4">
              AI-powered prescription analysis to help you save on medication costs.
            </p>
            <div className="flex space-x-4">
              {['facebook', 'twitter', 'instagram', 'linkedin'].map((social) => (
                <a 
                  key={social} 
                  href="#" 
                  className="text-gray-400 hover:text-white transition"
                >
                  <span className="sr-only">{social}</span>
                  <div className="h-6 w-6 rounded-full bg-gray-700 flex items-center justify-center">
                    <span className="text-xs">{social.charAt(0).toUpperCase()}</span>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Product</h3>
            <ul className="space-y-2">
              {['Features', 'How it Works', 'Pricing', 'FAQ', 'Sign Up'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {['About Us', 'Blog', 'Careers', 'Press', 'Contact'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              {['Terms', 'Privacy', 'Cookies', 'Licenses', 'Settings'].map((item) => (
                <li key={item}>
                  <a href="#" className="text-gray-400 hover:text-white transition">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} MediScanAI. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <select className="bg-gray-700 text-gray-300 rounded-md text-sm py-1 px-2 border border-gray-600">
              <option value="en">English (US)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 