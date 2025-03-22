import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

const PrescriptionScanPage = () => {
  const { user, isLoaded, isSignedIn } = useUser();
  const navigate = useNavigate();
  const [captureMode, setCaptureMode] = useState(null); // 'camera', 'upload', or null
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [processingStatus, setProcessingStatus] = useState(null); // null, 'capturing', 'enhancing', 'extracting', 'identifying'
  const [processingProgress, setProcessingProgress] = useState(0);
  
  const fileInputRef = useRef(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  
  // Redirect if not signed in
  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      navigate('/signin');
    }
  }, [isLoaded, isSignedIn, navigate]);
  
  // Handle camera activation
  const activateCamera = async () => {
    try {
      setCaptureMode('camera');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Unable to access camera. Please check permissions and try again.");
      setCaptureMode(null);
    }
  };
  
  // Handle camera capture
  const capturePhoto = () => {
    if (!videoRef.current) return;
    
    // Start processing simulation
    simulateProcessing();
    
    // Close camera stream
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setCaptureMode(null);
  };
  
  // Handle file upload button click
  const handleUploadClick = () => {
    setCaptureMode('upload');
  };
  
  // Handle file selection
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // Create file preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setFilePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Handle file upload submission
  const handleFileUpload = () => {
    if (selectedFile) {
      // Start processing simulation
      simulateProcessing();
      setCaptureMode(null);
    }
  };
  
  // Simulate prescription processing
  const simulateProcessing = () => {
    const stages = ['capturing', 'enhancing', 'extracting', 'identifying'];
    let currentStage = 0;
    
    setProcessingStatus(stages[currentStage]);
    setProcessingProgress(0);
    
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          currentStage++;
          
          if (currentStage >= stages.length) {
            clearInterval(interval);
            // In a real app, you would navigate to results or dashboard here
            setTimeout(() => {
              setProcessingStatus(null);
              setProcessingProgress(0);
            }, 1000);
            return 100;
          }
          
          setProcessingStatus(stages[currentStage]);
          return 0;
        }
        return prev + 10;
      });
    }, 300);
  };
  
  // Cancel the current capture mode
  const cancelCapture = () => {
    if (captureMode === 'camera' && streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    setSelectedFile(null);
    setFilePreview(null);
    setCaptureMode(null);
  };
  
  // Render the processing state
  const renderProcessing = () => (
    <div className="w-full max-w-md mx-auto text-center py-8">
      <div className="mb-8">
        <div className="mx-auto w-24 h-24 relative">
          <svg className="animate-spin h-full w-full text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          
          {/* Processing icon in center */}
          <div className="absolute inset-0 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-100" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        </div>
      </div>
      
      <h3 className="text-2xl font-semibold text-gray-800 mb-3">
        {processingStatus === 'capturing' && 'Capturing Image'}
        {processingStatus === 'enhancing' && 'Enhancing Quality'}
        {processingStatus === 'extracting' && 'Extracting Text'}
        {processingStatus === 'identifying' && 'Identifying Medications'}
      </h3>
      
      <div className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-indigo-500 to-purple-600 h-3 rounded-full transition-all duration-300" 
          style={{ width: `${processingProgress}%` }}
        ></div>
      </div>
      
      <div className="flex justify-center space-x-2 mb-6">
        {['capturing', 'enhancing', 'extracting', 'identifying'].map((stage, index) => (
          <div 
            key={stage} 
            className={`w-2 h-2 rounded-full ${
              processingStatus === stage 
                ? 'bg-indigo-600 animate-pulse' 
                : index < ['capturing', 'enhancing', 'extracting', 'identifying'].indexOf(processingStatus)
                  ? 'bg-indigo-400' 
                  : 'bg-gray-300'
            }`}
          />
        ))}
      </div>
      
      <p className="text-gray-600 mb-4">
        Please wait while we process your prescription...
      </p>
      <p className="text-xs text-gray-500 max-w-xs mx-auto">
        Our AI is analyzing your prescription to find potential savings and alternatives.
      </p>
    </div>
  );
  
  // Render the camera interface
  const renderCamera = () => (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative rounded-xl overflow-hidden bg-black mb-6 shadow-lg border border-indigo-200" style={{ height: '450px' }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="absolute h-full w-full object-cover"
        />
        
        {/* Prescription overlay guide */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="border-2 border-dashed border-white opacity-70 rounded-lg w-4/5 h-3/5 flex items-center justify-center">
            <div className="text-white text-sm bg-black bg-opacity-50 px-4 py-2 rounded-lg">
              <p>Position prescription here</p>
              <div className="flex items-center mt-1 text-xs text-indigo-200">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Keep steady and well-lit
              </div>
            </div>
          </div>
        </div>
        
        {/* Camera guides at corners */}
        <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-white opacity-80 rounded-tl-lg"></div>
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-white opacity-80 rounded-tr-lg"></div>
        <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-white opacity-80 rounded-bl-lg"></div>
        <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-white opacity-80 rounded-br-lg"></div>
        
        {/* Flash toggle button */}
        <button className="absolute top-4 right-4 bg-black bg-opacity-60 text-white p-3 rounded-full hover:bg-opacity-80 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      </div>
      
      <div className="flex justify-between">
        <button
          onClick={cancelCapture}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Cancel
        </button>
        
        <button
          onClick={capturePhoto}
          className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
          </svg>
          Capture
        </button>
      </div>
    </div>
  );
  
  // Render the upload interface
  const renderUpload = () => (
    <div className="w-full max-w-xl mx-auto">
      {!filePreview ? (
        <div 
          className="border-2 border-dashed border-indigo-300 rounded-xl p-10 mb-6 text-center cursor-pointer hover:bg-indigo-50 transition-colors bg-gradient-to-b from-white to-indigo-50/30 flex flex-col items-center justify-center"
          onClick={() => fileInputRef.current?.click()}
          style={{ minHeight: '300px' }}
        >
          <div className="bg-indigo-100 p-4 rounded-full mb-5">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
          </div>
          <h4 className="text-xl font-semibold text-gray-900 mb-2">Upload Prescription</h4>
          <p className="mt-2 text-sm text-gray-600 mb-1">
            Drag & drop your file here, or <span className="text-indigo-600 font-medium">browse files</span>
          </p>
          <p className="text-xs text-gray-500 mb-6">
            Supported formats: JPG, PNG, PDF
          </p>
          
          <div className="flex items-center justify-center space-x-3 text-xs text-gray-500">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              High quality
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No shadows
            </div>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Readable text
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,application/pdf"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
      ) : (
        <div className="mb-6">
          <div className="relative rounded-xl overflow-hidden bg-gray-100 mb-3 shadow-md border border-indigo-100" style={{ height: '350px' }}>
            <img 
              src={filePreview} 
              alt="File preview" 
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2">
              <button 
                onClick={() => {
                  setSelectedFile(null);
                  setFilePreview(null);
                }}
                className="bg-white bg-opacity-80 p-2 rounded-full hover:bg-opacity-100 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-700" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between bg-indigo-50 px-4 py-3 rounded-lg">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-sm font-medium text-gray-700 truncate max-w-xs">
                {selectedFile?.name}
              </p>
            </div>
            <p className="text-xs text-gray-500">
              {(selectedFile?.size / 1024).toFixed(0)} KB
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between">
        <button
          onClick={cancelCapture}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors font-medium flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
          Cancel
        </button>
        
        <button
          onClick={handleFileUpload}
          disabled={!selectedFile}
          className={`px-10 py-3 rounded-lg transition-all shadow-md font-medium flex items-center ${
            selectedFile 
              ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
          Upload
        </button>
      </div>
    </div>
  );
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-indigo-50 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
            Scan Your Prescription
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Take a photo or upload an image of your prescription to find potential savings and alternatives.
          </p>
        </div>
        
        {/* Main content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-6 md:p-10 border border-gray-100">
          {processingStatus ? (
            renderProcessing()
          ) : captureMode === 'camera' ? (
            renderCamera()
          ) : captureMode === 'upload' ? (
            renderUpload()
          ) : (
            /* Capture options */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
              {/* Camera option */}
              <button
                onClick={activateCamera}
                className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-lg hover:scale-105 transition-all duration-300 group bg-gradient-to-b from-white to-indigo-50"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center mb-6 group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Take Photo</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Use your camera to capture a clear image of your prescription
                </p>
              </button>
              
              {/* Upload option */}
              <button
                onClick={handleUploadClick}
                className="flex flex-col items-center justify-center p-8 border border-gray-200 rounded-xl hover:border-indigo-400 hover:shadow-lg hover:scale-105 transition-all duration-300 group bg-gradient-to-b from-white to-indigo-50"
              >
                <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-100 to-purple-100 flex items-center justify-center mb-6 group-hover:shadow-md transition-all duration-300">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Upload Image</h3>
                <p className="text-gray-500 text-center max-w-xs">
                  Select a photo or PDF of your prescription from your device
                </p>
              </button>
            </div>
          )}
          
          {/* Tips section - only show when not processing or capturing */}
          {!processingStatus && !captureMode && (
            <div className="mt-10 border-t border-gray-200 pt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                Tips for Best Results
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-semibold text-blue-900">Good Lighting</h4>
                      <p className="mt-1 text-sm text-blue-800">
                        Ensure the prescription is well-lit with minimal shadows for clearer text recognition.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-semibold text-blue-900">Flat Surface</h4>
                      <p className="mt-1 text-sm text-blue-800">
                        Place prescription on a flat, non-reflective surface to avoid creasing, folding, or glare.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-semibold text-blue-900">Close-up Shot</h4>
                      <p className="mt-1 text-sm text-blue-800">
                        Ensure the prescription fills the frame but remains in focus for optimal text detection.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-5 rounded-xl shadow-sm">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 p-2 bg-blue-100 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="text-md font-semibold text-blue-900">Include All Details</h4>
                      <p className="mt-1 text-sm text-blue-800">
                        Make sure all medication names, dosages, and doctor information are visible in the frame.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Sample image */}
              <div className="mt-8 flex justify-center">
                <div className="relative w-full max-w-sm border border-indigo-100 rounded-xl overflow-hidden shadow-md">
                  <img 
                    src="https://placehold.co/600x400/e2e8f0/475569?text=Sample+Prescription+Image" 
                    alt="Sample prescription" 
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-indigo-900 via-indigo-900/60 to-transparent">
                    <div className="text-center px-4">
                      <p className="text-white text-lg font-medium">Sample Image</p>
                      <p className="text-indigo-100 text-sm mt-1">Position your prescription like this example</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Previous scans link - only show when not processing or capturing */}
        {!processingStatus && !captureMode && (
          <div className="mt-10 text-center">
            <Link 
              to="/dashboard" 
              className="inline-flex items-center px-6 py-3 border border-indigo-200 rounded-lg text-indigo-700 bg-white hover:bg-indigo-50 transition-all shadow-sm font-medium group"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Return to Dashboard
            </Link>
            <p className="mt-3 text-sm text-gray-500">
              View your previously scanned prescriptions and saved medications
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PrescriptionScanPage; 