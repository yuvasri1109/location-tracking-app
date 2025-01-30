import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login"; // Import Login component
import Dashboard from "./components/Dashboard"; // Import Dashboard component
import ViewLocation from "./components/ViewLocation";
import EmergencyContacts from "./components/EmergencyContacts";
import SendAlert from "./components/SendAlert";
import SOSButton from "./components/SOSButton"; // Import SOSButton
import "./index.css";

const App = () => {
  const handleSOSClick = () => {
    // Vibration feedback
    if ("vibrate" in navigator) {
      navigator.vibrate([200, 100, 200]);
    }

    // Play sound alert
    const alertSound = new Audio("/alert-sound.mp3");
    alertSound.play();

    // Additional logic for SOS functionality
    alert("SOS alert triggered! Take immediate action.");
  };

  // Check if user is logged in (can check for token or other stored data)
  const isLoggedIn = localStorage.getItem("token");

  return (
    <Router>
      <div className="app-container">
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} /> {/* Home page only shown at root */}
            <Route path="/login" element={<Login />} /> {/* Login page */}
            <Route
              path="/dashboard"
              element={isLoggedIn ? <Dashboard /> : <Login />} 
            /> {/* Dashboard page */}
            <Route path="/view-location" element={<ViewLocation />} />
            <Route path="/emergency-contacts" element={<EmergencyContacts />} />
            <Route path="/send-alert" element={<SendAlert />} />
          </Routes>
          <SOSButton onClick={handleSOSClick} />
        </div>
      </div>
    </Router>
  );
};

export default App;
