import { useState } from 'react';
import './customer.css';
import React from 'react'; 
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import config from '../config';
import { useAuth } from '../contextapi/AuthContext';

export default function CustomerLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setIsCustomerLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${config.url}/api/customer/checkcustomerlogin`, formData);

      if (response.status === 200) {
        localStorage.setItem("username", formData.username); // Save username in localStorage
        setMessage("Login successful!");
        setError('');
        setIsCustomerLoggedIn(true);
        setTimeout(() => navigate("/customerhome"), 1000); // short delay to show message
      }
    } catch (error) {
      setMessage('');
      if (error.response && error.response.data) {
        setError(error.response.data);
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="customer-registration-container">
      <h3 style={{ textAlign: "center", textDecoration: "underline" }}>Customer Login</h3>
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
      
        <div className="customer-form-group" style={{ marginTop: "20px", textAlign: "center" }}>
          <p>Don't have an account? <Link to="/customerregistration" style={{ color: "#5b1676", fontWeight: "bold" }}>Create an Account</Link></p>
        </div>
      </form>
    </div>
  );
}