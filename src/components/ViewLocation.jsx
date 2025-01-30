import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const ViewLocation = () => {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setLocation(userLocation);
          sendLocationToBackend(userLocation);
        },
        (error) => {
          console.error("Error fetching location:", error);
          setError("Unable to fetch your location.");
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  }, []);

  const sendLocationToBackend = async (location) => {
    try {
      const userId = localStorage.getItem("userId"); 
      if (!userId) {
        setError("User is not logged in.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, location }),
      });

      const data = await response.json();
      if (response.ok) {
        console.log("Location successfully sent to backend", data);
      } else {
        console.error("Error sending location:", data.message);
        setError(data.message || "Error sending location.");
      }
    } catch (error) {
      console.error("Network error:", error);
      setError("Network error while sending location.");
    }
  };

  return (
    <div className="view-location">
      <h1>Your Current Location</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {location ? (
        <MapContainer center={[location.lat, location.lng]} zoom={13} style={{ height: "80vh", width: "100%" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={[location.lat, location.lng]}>
            <Popup>You are here!</Popup>
          </Marker>
        </MapContainer>
      ) : (
        <p>Fetching your location...</p>
      )}
    </div>
  );
};

export default ViewLocation;
