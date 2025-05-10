import React, { useState } from 'react';
import './Registration.css';
import haldiImage from '../../src/assets/g.jpg'; // Updated image for Haldi
import haldiBackground from '../../src/assets/image.png'; // Updated background for Haldi

const Haldi = () => {
  const [formData, setFormData] = useState({
    eventName: 'Haldi', // Default to Haldi
    customerName: '',
    customerUsername:'',
    phone: '',
    email: '',
    venue: '',
    date: '',
    capacity: '',
    description: '',
    managerName:'Avani Obrai',
   
  });

  const [loading, setLoading] = useState(false); // State for showing a loading spinner

  const initialFormData = {
    eventName: 'Haldi',
    customerName: '',
    customerUsername:'',
    phone: '',
    email: '',
    venue: '',
    date: '',
    capacity: '',
    description: '',
    managerName:'Avani Obrai',
   
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Show the loader

    const eventData = {
      eventName: formData.eventName,
      customerName: formData.customerName,
      customerUsername:formData.customerUsername,
      phone: formData.phone,
      email: formData.email,
      venue: formData.venue,
      date: formData.date,
      capacity: formData.capacity,
      description: formData.description,
      managerName: formData.managerName,
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
      style={{ backgroundImage: `url(${haldiBackground})` }}
    >
      <div className="register-form">
        <h2>HALDI EVENT REGISTRATION</h2>
        <div className="left-section">
        <img src={haldiImage} alt="Haldi Theme" className="event-image" />
        <div className="manager-info">
    <p><strong>Manager Name:</strong> Avani Obrai </p>
    <p><strong>Phone:</strong> +91-2233445562</p>
    <p><strong>Email:</strong> avani369@gmail.com</p>
    <hr />
    <p>🌼 The Haldi ceremony is filled with cheerful decor, traditional customs, and vibrant colors.</p>
    <p>Our event manager ensures the festivities flow smoothly, creating an atmosphere of joy and blessings.</p>
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
          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Haldi;
