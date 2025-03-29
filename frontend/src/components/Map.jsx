import React, { useState, useCallback, useEffect } from 'react';
import { useJsApiLoader, GoogleMap } from '@react-google-maps/api';
import { ClipLoader } from 'react-spinners';
import { useAddress } from '../components/context/AddressContext';

const libraries = ['marker'];

const Map = () => {
  const [map, setMap] = useState(null);
  const [infoWindow, setInfoWindow] = useState(null);
  const [geocoder, setGeocoder] = useState(null);
  const [isLocationModalVisible, setLocationModalVisible] = useState(true);
  const { updateAddress, updateCoordinates } = useAddress();
  const { address, coordinates } = useAddress();
  
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  useEffect(() => {
    const handleFormSubmit = async (event) => {
      if (!geocoder || !map || !infoWindow) return;

      const submittedAddress = event.detail.address;

      geocoder.geocode({ address: submittedAddress }, async (results, status) => {
        if (status === 'OK' && results[0]) {
          const position = results[0].geometry.location;
          const pos = { lat: position.lat(), lng: position.lng() };

          map.setCenter(pos);
          map.setZoom(15);

          const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
          new AdvancedMarkerElement({
            map,
            position: pos,
            title: submittedAddress,
            draggable: true,
          });

          infoWindow.setPosition(pos);
          infoWindow.setContent(`Address: ${submittedAddress}`);
          infoWindow.open(map);

          updateCoordinates(pos.lat, pos.lng);
        } else {
          infoWindow.setPosition(map.getCenter());
          infoWindow.setContent('Unable to find location for this address');
          infoWindow.open(map);
        }
      });
    };

    window.addEventListener('formAddressSubmitted', handleFormSubmit);
    return () => window.removeEventListener('formAddressSubmitted', handleFormSubmit);
  }, [geocoder, map, infoWindow, updateCoordinates]);

  const handleLocationClick = useCallback(() => {
    setLocationModalVisible(false);

    if (!map || !infoWindow) return;

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
          
          new AdvancedMarkerElement({
            map,
            position: pos,
            title: "Your Location",
          });

          map.setCenter(pos);
          map.setZoom(15);

          geocoder.geocode({ location: pos }, (results, status) => {
            if (status === 'OK' && results[0]) {
              const address = results[0].formatted_address;
              infoWindow.setPosition(pos);
              infoWindow.setContent(`Address: ${address}`);
              infoWindow.open(map);

              updateAddress(address);
              updateCoordinates(pos.lat, pos.lng);
            } else {
              infoWindow.setPosition(pos);
              infoWindow.setContent('Unable to retrieve address');
              infoWindow.open(map);
            }
          });
        },
        (error) => {
          infoWindow.setPosition(map.getCenter());
          infoWindow.setContent("Error: The Geolocation service failed. " + error.message);
          infoWindow.open(map);
          setLocationModalVisible(true);
        }
      );
    } else {
      infoWindow.setPosition(map.getCenter());
      infoWindow.setContent("Error: Your browser doesn't support geolocation.");
      infoWindow.open(map);
      setLocationModalVisible(true);
    }
  }, [map, infoWindow, geocoder, updateAddress, updateCoordinates]);

  const onMapLoad = useCallback(async (mapInstance) => {
    setMap(mapInstance);
    setInfoWindow(new google.maps.InfoWindow());
    setGeocoder(new google.maps.Geocoder());

    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
    new AdvancedMarkerElement({
      map: mapInstance,
      position: { lat: 19.0760, lng: 72.8777 },
      title: "Mumbai",
    });
  }, []);

  const enableLocation = () => {
    setLocationModalVisible(false);
    handleLocationClick();
  };

  const searchManually = () => {
    setLocationModalVisible(false);
    alert("Redirecting to manual address search.");
  };

  const renderLocationButton = useCallback(() => {
    if (!map) return null;

    return (
      <button
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 px-4 py-2 bg-white rounded-md shadow-md flex items-center"
        onClick={handleLocationClick}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/128/484/484149.png"
          alt="Locate me"
          className="w-6 h-6 mr-2"
        />
        Locate me
      </button>
    );
  }, [map, handleLocationClick]);

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-screen">
        <ClipLoader color="#3498db" loading={true} size={50} />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      {renderLocationButton()}
      <GoogleMap
        center={{ lat: 19.0760, lng: 72.8777 }}
        zoom={13}
        mapContainerStyle={{ height: '100%', width: '100%' }}
        onLoad={onMapLoad}
        options={{
          mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
          zoomControl: false,
          mapTypeControl: false,
          scaleControl: false,
          streetViewControl: false,
          rotateControl: false,
          fullscreenControl: false,
        }}
      />

      {isLocationModalVisible && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg z-20 w-11/12 sm:w-96">
          <h3 className="text-xl font-semibold mb-4">Location Permission</h3>
          <p className="mb-6">Your browser is not able to access your location. You can either enable it or search for an address manually.</p>
          <div className="flex justify-between">
            <button
              onClick={enableLocation}
              className="px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              Enable Location
            </button>
            <button
              onClick={searchManually}
              className="px-6 py-2 bg-yellow-500 text-white rounded-md"
            >
              Search Manually
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
