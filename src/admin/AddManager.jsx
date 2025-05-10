import React, { useState } from 'react';
import axios from 'axios';
import config from '../config';
import '../Components/customer.css'; // Updated to import from customer.css

export default function AddManager() {
  const [formData, setFormData] = useState({
    name: '',
    gender: '',
    dob: '',
    email: '',
    username: '',
    password: '',
    mobileno: '',
    role: '',
    company_name: '',
    company_location: ''
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    // Log form data to verify before submission
    console.log('Form Data:', formData);

    try {
      const response = await axios.post(`${config.url}/api/admin/addmanager`, formData);

      if (response.status === 200) {
        setMessage(response.data);
        setError('');
        setFormData({
          name: '',
          gender: '',
          dob: '',
          email: '',
          username: '',
          password: '',
          mobileno: '',
          role: '',
          company_name: '',
          company_location: ''
        });
      }
    } catch (error) {
      setMessage('');
      if (error.response) {
        setError(error.response.data);
      } else {
        setError('An unexpected error occurred.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="customer-registration-container">
      <h3 style={{ textAlign: "center", textDecoration: "underline" }}>Add Event Manager</h3>

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
            placeholder="Enter full name"
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
            placeholder="Enter email address"
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
          <label htmlFor="mobileno" className="customer-form-label">Mobile No</label>
          <input
            type="text"
            id="mobileno"
            value={formData.mobileno}
            onChange={handleChange}
            placeholder="Enter mobile number"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="role" className="customer-form-label">Manager Role</label>
          <input
            type="text"
            id="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="Enter manager role"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="company_name" className="customer-form-label">Company Name</label>
          <input
            type="text"
            id="company_name"
            value={formData.company_name}
            onChange={handleChange}
            placeholder="Enter company name"
            required
            className="customer-form-input"
          />
        </div>

        <div className="customer-form-group">
          <label htmlFor="company_location" className="customer-form-label">Location</label>
          <input
            type="text"
            id="company_location"
            value={formData.company_location}
            onChange={handleChange}
            placeholder="Enter company location"
            required
            className="customer-form-input"
          />
        </div>

        <button type="submit" className="customer-register-button" disabled={loading}>
          {loading ? "Adding..." : "Add"}
        </button>
      </form>
    </div>
  );
}