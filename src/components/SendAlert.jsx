import React, { useState, useEffect } from "react";

const SendAlert = () => {
  const [contacts, setContacts] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("Family");
  const [locationName, setLocationName] = useState("");
  const [isFetchingLocation, setIsFetchingLocation] = useState(false);

  
  useEffect(() => {
    const fetchContacts = async () => {
      const token = localStorage.getItem("token");  
      if (!token) {
        alert("Authorization token missing.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/contacts", {
        headers: { Authorization: token },
      });

      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts || []);
      } else {
        alert("Failed to fetch contacts.");
      }
    };

    fetchContacts();
  }, []);


  const fetchLocation = async () => {
    setIsFetchingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
          );
          const data = await response.json();
          setLocationName(data.display_name || "Unknown location");
        } catch {
          alert("Unable to fetch location.");
        } finally {
          setIsFetchingLocation(false);
        }
      },
      () => {
        alert("Unable to retrieve location.");
        setIsFetchingLocation(false);
      }
    );
  };

  const handleSendAlert = async () => {
    if (!locationName) {
      alert("Fetching location. Please wait...");
      await fetchLocation();
    }
  
    const groupContacts = contacts.filter((c) => c.group === selectedGroup);
    const alertText = `Emergency alert from ${selectedGroup}. Location: ${locationName}`;
  
    const token = localStorage.getItem("token");
    if (!token) {
      alert("No token found. Please log in.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/send-alert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,  
        },
        body: JSON.stringify({
          group: selectedGroup,  
          location: locationName, 
        }),
      });
  
      if (response.ok) {
        alert("Emergency alert sent successfully!");
      } else {
        const errorData = await response.json();
        console.error("Error sending alert:", errorData);  
        alert(`Failed to send emergency alert: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error("Error sending alert:", error);
      alert("Error sending alert.");
    }
  };
  

  return (
    <div className="alert-page-container">
      <div className="alert-container">
        <div className="group-selection-container">
          <h2>Select Group</h2>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="group-selection"
          >
            <option value="Family">Family</option>
            <option value="Friends">Friends</option>
            <option value="Work">Work</option>
          </select>
        </div>

        <div className="alert-action-container">
          <h1>Send Emergency Alert</h1>
          <button onClick={fetchLocation} disabled={isFetchingLocation} className="location-button">
            {isFetchingLocation ? "Fetching Location..." : "Fetch Location"}
          </button>
          <p>
            <strong>Current Location:</strong> {locationName || "Not fetched yet"}
          </p>
          <button onClick={handleSendAlert} className="send-alert-button">Send Alert</button>
        </div>
      </div>
    </div>
  );
};

export default SendAlert;
