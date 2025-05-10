import React from "react";
import { useLocation } from "react-router-dom";

const Successpage = () => {
  const location = useLocation();
  const { event, manager, customer } = location.state || {};

  if (!event || !manager || !customer) {
    return <h3>No event registration data found. Please try again.</h3>;
  }

  return (
    <div className="success-container">
      <h2>🎉 Registration Successful!</h2>

      <div>
        <h3>Event Details</h3>
        <p><strong>Name:</strong> {event.eventName}</p>
        <p><strong>Venue:</strong> {event.venue}</p>
        <p><strong>Date:</strong> {event.date}</p>
        <p><strong>Capacity:</strong> {event.capacity}</p>
        <p><strong>Description:</strong> {event.description}</p>
      </div>

      <div>
        <h3>Assigned Manager</h3>
        <p><strong>Name:</strong> {manager.name}</p>
        <p><strong>Email:</strong> {manager.email}</p>
        <p><strong>Phone:</strong> {manager.phone}</p>
      </div>

      <div>
        <h3>Customer Info</h3>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
      </div>
    </div>
  );
};

export default Successpage;
