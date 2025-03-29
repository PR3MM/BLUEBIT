import React, { useContext, createContext, useState } from 'react';

const AddressContext = createContext();

const AddressProvider = ({ children }) => {
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: null, lng: null });
    const [localaddress, setLocalAddress] = useState('');

    const updateAddress = (newAddress) => {
        setAddress(newAddress);
    };

    const updateCoordinates = (lat, lng) => {
        setCoordinates({ lat, lng });
    };

    const updateLocalAddress = (newLocalAddress) => {
        setLocalAddress(newLocalAddress);
    }


    return (
        <AddressContext.Provider
            value={{
                address,
                coordinates,
                localaddress,
                updateAddress,
                updateCoordinates,
                updateLocalAddress
            }}
        >
            {children}
        </AddressContext.Provider>
    );
};

export const useAddress = () => {
    return useContext(AddressContext);
};

export default AddressProvider;
