import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const EmergencyContacts = () => {
  const navigate = useNavigate();
  const [contacts, setContacts] = useState([]);
  const [newContact, setNewContact] = useState({ name: "", phone: "", group: "Family" });
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("view");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/contacts");
      const data = await response.json();

      if (response.ok) {
        setContacts(data.contacts);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error fetching contacts:", error);
      setError("Failed to fetch contacts.");
    }
  };

  const handleInputChange = (e) => {
    setNewContact({ ...newContact, [e.target.name]: e.target.value });
    setError("");
  };

  const validateInputs = () => {
    const nameRegex = /^[A-Za-z\s]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (!newContact.name) return "Name is required.";
    if (!nameRegex.test(newContact.name)) return "Name should contain alphabets only.";
    if (!newContact.phone) return "Phone number is required.";
    if (!phoneRegex.test(newContact.phone)) return "Phone number should start with '+' followed by numbers (10-15 digits).";
    if (newContact.phone.length < 10 || newContact.phone.length > 15) return "Phone number should be between 10 and 15 digits long.";

    return "";
  };

  const handleAddContact = async () => {
    const validationError = validateInputs();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/contacts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newContact),
      });

      const data = await response.json();
      if (response.ok) {
        setContacts([...contacts, newContact]);
        setNewContact({ name: "", phone: "", group: "Family" });
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error adding contact:", error);
      setError("Failed to add contact.");
    }
  };

  const handleRemoveContact = async (index) => {
    try {
      const contactId = contacts[index]._id;

      const response = await fetch(`http://localhost:5000/api/contacts/${contactId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setContacts(contacts.filter((_, i) => i !== index));
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch (error) {
      console.error("Error removing contact:", error);
      setError("Failed to remove contact.");
    }
  };

  return (
    <div className="emergency-contacts-container">
      <div className="tabs-container">
        <button className="tab-button" onClick={() => setActiveTab("view")}>View Contacts</button>
        <button className="tab-button" onClick={() => setActiveTab("add")}>Add Contact</button>
        <button className="tab-button" onClick={() => setActiveTab("group")}>Group Contacts</button>
      </div>
      <div className="content-area">
        {activeTab === "view" && (
          <div className="view-contacts">
            <h1>Emergency Contacts</h1>
            {contacts.length > 0 ? (
              <ul className="contacts-list">
                {contacts.map((contact, index) => (
                  <li key={index} className="contact-item">
                    {contact.name} - {contact.phone} ({contact.group})
                    <button className="remove-button" onClick={() => handleRemoveContact(index)}>Remove</button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No emergency contacts added yet. Please add contacts!</p>
            )}
          </div>
        )}
        {activeTab === "add" && (
          <div className="add-contact-form">
            <h2>Add Contact</h2>
            {error && <p className="error-message">{error}</p>}
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={newContact.name}
              onChange={handleInputChange}
              className="input-field"
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={newContact.phone}
              onChange={handleInputChange}
              className="input-field"
            />
            <select
              name="group"
              value={newContact.group}
              onChange={handleInputChange}
              className="input-field"
            >
              <option value="Family">Family</option>
              <option value="Friends">Friends</option>
              <option value="Work">Work</option>
            </select>
            <button className="add-contact-button" onClick={handleAddContact}>Add Contact</button>
          </div>
        )}
        {activeTab === "group" && (
          <div className="group-contacts">
            <h2>Group Contacts</h2>
            <div className="contact-groups">
              {["Family", "Friends", "Work"].map((group) => (
                <div key={group} className="group-section">
                  <h3>{group}</h3>
                  <ul>
                    {contacts
                      .filter((contact) => contact.group === group)
                      .map((contact, index) => (
                        <li key={index}>{contact.name} - {contact.phone}</li>
                      ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmergencyContacts;
