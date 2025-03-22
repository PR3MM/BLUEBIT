import React, { useState } from 'react';
import Tesseract from 'tesseract.js';

const AddReceipt = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [ocrResult, setOcrResult] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Handle file change
  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  // Handle OCR scanning
  const handleScan = async () => {
    if (!selectedFile) {
      alert('Please select an image first!');
      return;
    }

    setIsProcessing(true);

    try {
      const { data: { text } } = await Tesseract.recognize(
        selectedFile, // File to scan
        'eng', // Language
        {
          logger: (m) => console.log(m), // Log progress (optional)
        }
      );

      setOcrResult(text);
    } catch (error) {
      console.error('Error during OCR processing:', error);
      alert('Error during OCR processing. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-700 mb-6 text-center">Upload Prescription</h2>

        {/* File Input */}
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer mb-4 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />

        {/* Scan Button */}
        <button
          onClick={handleScan}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition"
          disabled={isProcessing}
        >
          {isProcessing ? 'Scanning...' : 'Scan Prescription'}
        </button>

        {/* Display OCR Result */}
        {ocrResult && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Prescribed Medicines</h3>
            <pre className="bg-gray-100 p-4 rounded-lg text-sm overflow-auto max-h-60">{ocrResult}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddReceipt;
