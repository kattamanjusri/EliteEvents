import React, { useState } from 'react';
import './Registration.css';
import bachelorImage from '../../src/assets/batc.jpg';
import bachelorBackground from '../../src/assets/baa.jpg';

const Bachelor = () => {
  const initialFormData = {
    eventName: 'Bachelor Party',
    customerName: '',
    customerUsername: '',
    phone: '',
    email: '',
    venue: '',
    date: '',
    capacity: '',
    description: '',
    managerName: 'Neil Prathap',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Frontend validation
    const isFormValid = Object.values(formData).every((val) => val.trim() !== '');
    if (!isFormValid) {
      alert('Please fill out all fields before submitting.');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:9000/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        alert(data.message || 'Event registered successfully!');
        setFormData(initialFormData);
      } else {
        const errorData = await response.text();
        console.error('Error:', errorData);
        alert('Failed to register event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="register-background"
      style={{ backgroundImage: `url(${bachelorBackground})` }}
    >
      <div className="register-form">
        <h2>BACHELOR PARTY REGISTRATION</h2>
        <div className="left-section">
        <img src={bachelorImage} alt="Bachelor Party Theme" className="event-image" />
        <div className="manager-info">
    <p><strong>Manager Name:</strong> Neil Prathap</p>
    <p><strong>Phone:</strong> +91-2345678984</p>
    <p><strong>Email:</strong> neil987@gmail.com</p>
    <hr />
    <p>🍻 The bachelor party is designed for non-stop fun, with thrilling activities, energetic music, and a relaxed vibe.</p>
    <p>Our event manager makes sure the night is packed with laughter and unforgettable memories.</p>
  </div>
</div>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="customerName"
            placeholder="Enter your name"
            value={formData.customerName}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="customerUsername"
            placeholder="Enter your username"
            value={formData.customerUsername}
            onChange={handleChange}
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={formData.phone}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="venue"
            placeholder="Enter venue"
            value={formData.venue}
            onChange={handleChange}
            required
          />
          <input
            type="date"
            name="date"
            min={new Date().toISOString().split('T')[0]} // Prevent past dates
            value={formData.date}
            onChange={handleChange}
            required
          />
          <input
            type="number"
            name="capacity"
            placeholder="Enter number of attendees"
            value={formData.capacity}
            onChange={handleChange}
            required
          />
          <textarea
            name="description"
            placeholder="Enter event details"
            value={formData.description}
            onChange={handleChange}
            required
          ></textarea>
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        
        </form>
      </div>
    </div>
  );
};

export default Bachelor;
