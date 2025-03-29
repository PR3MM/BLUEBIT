import React from 'react';
import { useAddress } from '../components/context/AddressContext';

const SubmittedAddresses = () => {
    const { localaddress } = useAddress();

    const addresses = JSON.parse(localStorage.getItem('addresses')) || [];

    return (
        <>
            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                <h2 className="text-lg font-semibold mb-2">Saved Addresses</h2>
                {addresses.length > 0 ? (
                    addresses.map((addr, index) => (
                        <p key={index} className="text-gray-600">{addr.address} ({addr.type})</p>
                    ))
                ) : (
                    <p className="text-gray-600">No saved addresses available</p>
                )}
            </div>

            <button
                onClick={() => {
                    localStorage.removeItem('addresses');
                    window.location.reload();
                }}
                className="text-sm font-semibold text-red-500"
            >
                Clear saved addresses
            </button>
        </>
    );
};

export default SubmittedAddresses;
