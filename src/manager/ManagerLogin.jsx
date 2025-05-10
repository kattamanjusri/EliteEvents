import React, { useState } from 'react';
import '../Components/customer.css'; // Your custom styling
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import config from '../config'; // config.url should be your base backend URL
import { useAuth } from '../contextapi/AuthContext'; // for login state

export default function ManagerLogin() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { setIsManagerLoggedIn } = useAuth();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post(`${config.url}/api/manager/checkmanagerlogin`, formData);
  
      console.log("Success response:", response); // 🔍 Add this
  
      if (response.status === 200) {
        localStorage.setItem("manager", JSON.stringify(response.data));  // ✅ Store the logged-in manager
        setMessage("Login successful!");
        setIsManagerLoggedIn(true);
        navigate("/manager/managerhome"); // or "/managerhome" if you redirect from there
      }
      
    } catch (error) {
      console.error("Login error:", error); // 🔍 Add this
  
      if (error.response) {
        setError(error.response.data); // show server-side error
      } else {
        setError("An unexpected error occurred.");
      }
    }
  };
  

  return (
    <div className="customer-registration-container">
      <h3 style={{ textAlign: "center", textDecoration: "underline" }}>Manager Login</h3>
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
