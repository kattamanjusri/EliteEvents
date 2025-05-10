import { useState } from 'react';
import React from 'react'; 
import '../Components/customer.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setIsAdminLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    
    try {
      const apiUrl = `${config.url}/api/admin/checkadminlogin`;
      console.log("Sending login request to:", apiUrl);

      // Sending the formData as JSON payload
      const response = await axios.post(apiUrl, formData);

      console.log("Response received:", response);
      
      if (response.status === 200) {
        console.log("Admin Data:", response.data); // Log admin data to see if it's returned
        localStorage.setItem('adminData', JSON.stringify(response.data));  // Store admin data
        
        setMessage("Login successful!");
        setIsAdminLoggedIn(true);  // Set the login state in context
        
        setTimeout(() => {
          navigate("/adminhome");  // Redirect to the admin home page
        }, 1000);
      } else {
        setError("Login failed");
      }
    } catch (error) {
      console.error("Login Error:", error);
      
      if (error.response) {
        setError(error.response.data || "Login failed. Please check credentials.");
      } else if (error.request) {
        setError("No response from server. Check your network connection.");
      } else {
        setError("Unexpected error: " + error.message);
      }
    }
  };

  return (
    <div className="customer-registration-container">
    <h3 style={{ textAlign: "center", textDecoration: "underline" }}>Admin Login</h3>
    {message && <p className="customer-message">{message}</p>}
    {error && <p className="customer-error">{error}</p>}

    <form onSubmit={handleSubmit} className="customer-form">
      <div className="customer-form-group">
        <label htmlFor="username" className="customer-form-label">Username</label>
        <input 
          type="text" 
          id="username" 
          value={formData.username} 
          onChange={handleChange} 
          required 
          className="customer-form-input"
          placeholder="Enter your username"
        />
      </div>
      
      <div className="customer-form-group">
        <label htmlFor="password" className="customer-form-label">Password</label>
        <input 
          type="password" 
          id="password" 
          value={formData.password} 
          onChange={handleChange} 
          required 
          className="customer-form-input"
          placeholder="Enter your password"
        />
      </div>
      
      <button type="submit" className="customer-register-button">Login</button>
    
      
    </form>
    </div>
  );
}