import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [isRegister, setIsRegister] = useState(null);
  const [formData, setFormData] = useState({ email: "", name: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        alert("Registration successful!");
        navigate("/dashboard");
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (error) {
      setError("Error connecting to the server.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed.");
      }
    } catch (error) {
      setError("Error connecting to the server.");
    }
  };

  return (
    <div className="home-container">
      <div className="title-container">
        <h1 className="main-title">Welcome to the Location Tracking App</h1>
        <div className="auth-buttons">
          <button
            className={isRegister === false ? "active" : ""}
            onClick={() => setIsRegister(false)}
          >
            Login
          </button>
          <button
            className={isRegister === true ? "active" : ""}
            onClick={() => setIsRegister(true)}
          >
            Register
          </button>
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      {isRegister !== null && (
        <div className="form-container">
          {isRegister ? (
            <>
              <h2 className="form-title">Register</h2>
              <form onSubmit={handleRegister} className="form">
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <button type="submit" className="form-button">Register</button>
              </form>
            </>
          ) : (
            <>
              <h2 className="form-title">Login</h2>
              <form onSubmit={handleLogin} className="form">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  className="form-input"
                />
                <button type="submit" className="form-button">Login</button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;
