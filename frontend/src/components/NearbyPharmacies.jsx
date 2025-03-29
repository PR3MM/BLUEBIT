import { useState } from "react";

const NearbyPharmacies = () => {
  const [pharmacies, setPharmacies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNearbyPharmacies = async () => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.");
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords;
      const API_KEY = "YOUR_GOOGLE_MAPS_API_KEY";
      const radius = 5000; // 5km radius
      const type = "pharmacy";

      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=${radius}&type=${type}&key=${API_KEY}`
        );
        const data = await response.json();

        if (data.status === "OK") {
          setPharmacies(data.results);
        } else {
          setError("No pharmacies found.");
        }
      } catch (err) {
        setError("Failed to fetch pharmacies.");
      }
      setLoading(false);
    });
  };

  return (
    <div className="p-4">
      <button
        onClick={fetchNearbyPharmacies}
        className="px-4 py-2 bg-blue-600 text-white rounded-md"
      >
        Find Nearby Pharmacies
      </button>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="mt-4 space-y-2">
        {pharmacies.map((pharmacy) => (
          <li key={pharmacy.place_id} className="p-2 border rounded-md">
            <h3 className="font-semibold">{pharmacy.name}</h3>
            <p className="text-sm text-gray-600">{pharmacy.vicinity}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NearbyPharmacies;
