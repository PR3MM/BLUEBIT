import React, { useState, useCallback, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useAddress } from '../components/context/AddressContext';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// MapUpdater component to handle map updates
function MapUpdater({ center }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

const Map = () => {
  const [position, setPosition] = useState({ lat: 19.0760, lng: 72.8777 });
  const [places, setPlaces] = useState([]);
  const [isLocationModalVisible, setLocationModalVisible] = useState(true);
  const { updateAddress, updateCoordinates } = useAddress();

  const fetchNearbyPlaces = useCallback(async (lat, lng) => {
    try {
      const queries = [
        'pharmacy',
        'chemist',
        'drugstore',
        'medical+store',
        'medicine+shop'
      ];
      
      const results = await Promise.all(queries.map(async (query) => {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${query}&format=json&limit=5&lat=${lat}&lon=${lng}&radius=5000&exclude_place_types=hospital,clinic`
        );
        return response.json();
      }));

      // Flatten results and remove duplicates using Object instead of Map
      const allPlaces = results.flat();
      const uniquePlacesObj = allPlaces.reduce((acc, place) => {
        acc[place.place_id] = place;
        return acc;
      }, {});
      const uniquePlaces = Object.values(uniquePlacesObj);
      
      // Filter out results containing "hospital" or "clinic"
      const filteredPlaces = uniquePlaces.filter(place => 
        !place.display_name.toLowerCase().includes('hospital') && 
        !place.display_name.toLowerCase().includes('clinic')
      );

      setPlaces(filteredPlaces.map(place => ({
        id: place.place_id,
        position: [place.lat, place.lon],
        name: place.display_name.split(',')[0],
        address: place.display_name
      })));
    } catch (error) {
      console.error('Error fetching places:', error);
      setPlaces([]);
    }
  }, []);

  const handleLocationClick = useCallback(() => {
    setLocationModalVisible(false);
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (location) => {
          const pos = {
            lat: location.coords.latitude,
            lng: location.coords.longitude
          };
          setPosition(pos);
          
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`
            );
            const data = await response.json();
            updateAddress(data.display_name);
            updateCoordinates(pos.lat, pos.lng);
            fetchNearbyPlaces(pos.lat, pos.lng);
          } catch (error) {
            console.error('Error fetching address:', error);
          }
        },
        (error) => {
          console.error('Geolocation error:', error);
          setLocationModalVisible(true);
        }
      );
    } else {
      setLocationModalVisible(true);
    }
  }, [updateAddress, updateCoordinates, fetchNearbyPlaces]);

  return (
    <div className="relative w-full h-full">
      <button
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-[1000] px-4 py-2 bg-white rounded-md shadow-md flex items-center"
        onClick={handleLocationClick}
      >
        <img
          src="https://cdn-icons-png.flaticon.com/128/484/484149.png"
          alt="Locate me"
          className="w-6 h-6 mr-2"
        />
        Locate me
      </button>

      <MapContainer
        center={[position.lat, position.lng]}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapUpdater center={[position.lat, position.lng]} />
        
        <Marker position={[position.lat, position.lng]}>
          <Popup>Your Location</Popup>
        </Marker>

        {places.map((place) => (
          <Marker
            key={place.id}
            position={place.position}
          >
            <Popup>
              <div className="max-w-xs">
                <h3 className="font-bold text-lg">{place.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{place.address}</p>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {isLocationModalVisible && (
        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 bg-white p-6 rounded-lg shadow-lg z-[1001] w-11/12 sm:w-96">
          <h3 className="text-xl font-semibold mb-4">Location Permission</h3>
          <p className="mb-6">Your browser is not able to access your location. You can either enable it or search for an address manually.</p>
          <div className="flex justify-between">
            <button
              onClick={() => {
                setLocationModalVisible(false);
                handleLocationClick();
              }}
              className="px-6 py-2 bg-blue-500 text-white rounded-md"
            >
              Enable Location
            </button>
            <button
              onClick={() => {
                setLocationModalVisible(false);
                alert("Redirecting to manual address search.");
              }}
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
