import React, { useState } from 'react';
import './Registration.css';
import weddingImage from '../../src/assets/wedddd.jpg';
import weddingBackground from '../../src/assets/we.jpg';

const WeddingRegister = () => {
  const [formData, setFormData] = useState({
    eventName: 'Wedding',
    customerName: '',
    customerUsername: '',
    phone: '',
    email: '',
    venue: '',
    date: '',
    capacity: '',
    description: '',
    managerName: 'Arnav Singh', // Hidden field with default manager
  });

  const [loading, setLoading] = useState(false); // State for showing a loading spinner

  const initialFormData = {
    eventName: 'Wedding',
    customerName: '',
    customerUsername: '',
    phone: '',
    email: '',
    venue: '',
    date: '',
    capacity: '',
    description: '',
    managerName: 'Arnav Singh',
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the loader

    const eventData = {
      ...formData, // Spread all fields, including managerName
    };

    try {
      const response = await fetch('http://localhost:9000/api/events/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        alert('Event registered and email sent successfully!');
        setFormData(initialFormData); // Reset form fields
      } else {
        alert('Failed to register event.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setLoading(false); // Hide the loader
    }
  };

  return (
    <div
      className="register-background"
      style={{ backgroundImage: `url(${weddingBackground})` }}
    >
      <div className="register-form">
        <h2>WEDDING EVENT REGISTRATION</h2>
        <div className="left-section">
        <img src={weddingImage} alt="Wedding Theme" className="event-image" />
        <div className="manager-info">
    <p><strong>Manager Name:</strong>Arnav Singh</p>
    <p><strong>Phone:</strong> +91-2345677888</p>
    <p><strong>Email:</strong> arnav123@gmail.com</p>
    <hr />
    <p>💍 The wedding ceremony is elegantly curated with seamless decor, vibrant rituals, and graceful guest arrangements.</p>
    <p>Our event manager ensures every detail, from vows to celebrations, is perfectly orchestrated.</p>
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
          {/* Hidden field for the manager name */}
          <input type="hidden" name="managerName" value={formData.managerName} />
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WeddingRegister;
