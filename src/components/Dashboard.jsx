import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleViewContacts = () => {
    navigate("/emergency-contacts"); 
  };

  const handleViewLocation = () => {
    navigate("/view-location"); 
  };

  const handleSendAlert = () => {
    navigate("/send-alert");
  };

  return (
    <div className="dashboard-page">
      <div className="dashboard-content">
        <h1 className="dashboard-title">User Dashboard</h1>
        <div className="button-group">
          <button className="dashboard-btn" onClick={handleViewLocation}>View Current Location</button>
          <button className="dashboard-btn" onClick={handleViewContacts}>View Emergency Contacts</button>
          <button className="dashboard-btn" onClick={handleSendAlert}>Send Emergency Alert</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
