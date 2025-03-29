import React, { useState, useEffect } from 'react';
import { useAddress } from '../components/context/AddressContext';

const Form = () => {
    const { updateAddress, updateCoordinates } = useAddress();
    const { address, coordinates } = useAddress();
    const {localaddress} = useAddress();
    const {updateLocalAddress} = useAddress();
    const [formData, setFormData] = useState({
        flatNumber: '',
        landmark: '',
        area: '',
        addressType: 'home'
    });

    useEffect(() => {
        const savedAddress = localStorage.getItem('address');
        const savedAddressType = localStorage.getItem('addressType');

        updateLocalAddress(savedAddress);
        
        if (savedAddress && savedAddressType) {
            const [flatNumber, area, landmark] = savedAddress.split(', ');
            setFormData({
                flatNumber: '',
                area:  '',
                landmark: '',
                addressType: savedAddressType
            });
            updateAddress(savedAddress);
        }
    }, [updateAddress]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const fullAddress = `${formData.flatNumber} ${formData.area} ${formData.landmark}`.trim();
        updateAddress(fullAddress);

        const existingAddresses = JSON.parse(localStorage.getItem('addresses')) || [];

        const updatedAddresses = [...existingAddresses, { address: fullAddress, type: formData.addressType }];

        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));

        const event = new CustomEvent('formAddressSubmitted', { 
            detail: { 
                address: fullAddress 
            } 
        });
        window.dispatchEvent(event);
    };

    return (
        <div className="max-w-md mx-auto p-4 bg-white rounded-lg shadow-md">
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Selected Location</h2>
                <p className="text-gray-600">{address || 'No address selected'}</p>
                <p className="text-sm text-gray-500 mt-1">
                    {coordinates.lat && coordinates.lng
                        ? `Lat: ${coordinates.lat}, Lng: ${coordinates.lng}`
                        : 'No coordinates set'}
                </p>
            </div>

            <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Flat / House No / Floor / Building
                    </label>
                    <input
                        type="text"
                        value={formData.flatNumber}
                        onChange={(e) => setFormData({...formData, flatNumber: e.target.value})}
                        placeholder="e.g., Flat 403 or 4th Floor"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Area / Road / Locality
                    </label>
                    <input
                        type="text"
                        value={formData.area}
                        onChange={(e) => setFormData({...formData, area: e.target.value})}
                        placeholder="Enter area name"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Landmark
                    </label>
                    <input
                        type="text"
                        value={formData.landmark}
                        onChange={(e) => setFormData({...formData, landmark: e.target.value})}
                        placeholder="e.g., Near City Mall"
                        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Save As
                    </label>
                    <div className="flex space-x-4">
                        <button
                            type="button"
                            onClick={() => setFormData({...formData, addressType: 'home'})}
                            className={`flex flex-col items-center p-3 rounded-lg ${
                                formData.addressType === 'home' 
                                    ? 'bg-blue-50 border-2 border-blue-500' 
                                    : 'border border-gray-300'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                            </svg>
                            <span className="text-sm">Home</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({...formData, addressType: 'work'})}
                            className={`flex flex-col items-center p-3 rounded-lg ${
                                formData.addressType === 'work' 
                                    ? 'bg-blue-50 border-2 border-blue-500' 
                                    : 'border border-gray-300'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            <span className="text-sm">Work</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setFormData({...formData, addressType: 'other'})}
                            className={`flex flex-col items-center p-3 rounded-lg ${
                                formData.addressType === 'other' 
                                    ? 'bg-blue-50 border-2 border-blue-500' 
                                    : 'border border-gray-300'
                            }`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm">Other</span>
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                    Save Address
                </button>
            </form>
        </div>
    );
}

export default Form;
