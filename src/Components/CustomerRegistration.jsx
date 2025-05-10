import { useState } from "react";
import axios from "axios";
import config from "../config";
import React from "react";
import "./customer.css";

export default function CustomerRegistration() {
  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    dob: "",
    email: "",
    username: "",
    password: "",
    mobileno: "",
    location: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const response = await axios.post(`${config.url}/api/customer/registration`, formData);

      if (response.status === 200) {
        setMessage("Registration successful! You can now log in.");
        setError("");
        setFormData({
          name: "",
          gender: "",
          dob: "",
          email: "",
          username: "",
          password: "",
          mobileno: "",
          location: "",
        });
      }
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed. Please check your input.");
      } else {
        setError("Unexpected error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-registration-container">
      <h3 style={{ textAlign: "center", textDecoration: "underline" }}>Customer Registration</h3>

      {message && <p className="customer-message">{message}</p>}
      {error && <p className="customer-error">{error}</p>}

      <form onSubmit={handleSubmit} className="customer-form">
        <div className="customer-form-group">
          <label htmlFor="name" className="customer-form-label">Full Name</label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="username" className="customer-form-label">Username</label>
          <input
            type="text"
            id="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Choose a username"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="password" className="customer-form-label">Password</label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="gender" className="customer-form-label">Gender</label>
          <select 
            id="gender" 
            value={formData.gender} 
            onChange={handleChange} 
            required
            className="customer-form-select"
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="customer-form-group">
          <label htmlFor="dob" className="customer-form-label">Date of Birth</label>
          <input
            type="date"
            id="dob"
            value={formData.dob}
            onChange={handleChange}
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="email" className="customer-form-label">Email</label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email address"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="mobileno" className="customer-form-label">Mobile Number</label>
          <input
            type="text"
            id="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            placeholder="Enter your mobile number"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="location" className="customer-form-label">Location</label>
          <input
            type="text"
            id="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter your location"
            required
            className="customer-form-input"
          />
        </div>

        <button type="submit" className="customer-register-button" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}