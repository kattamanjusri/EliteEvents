import React, { useEffect, useState } from "react";
import './ManagerHome.css';

const ManagerHome = () => {
  const [events, setEvents] = useState([]);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchManagerData = () => {
      try {
        const managerData = JSON.parse(localStorage.getItem("manager"));
        if (!managerData || !managerData.name) {
          throw new Error('Manager data not found');
        }
        return managerData;
      } catch (err) {
        throw new Error('Invalid manager data');
      }
    };

    const fetchEvents = async (managerName) => {
      try {
        const response = await fetch(
          `http://localhost:9000/api/events/manager/${encodeURIComponent(managerName)}/events`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        if (!Array.isArray(data)) {
          throw new Error('Invalid data format received');
        }
        
        return data;
      } catch (err) {
        throw new Error(`Failed to fetch events: ${err.message}`);
      }
    };

    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const managerData = fetchManagerData();
        setManager(managerData);
        
        const eventsData = await fetchEvents(managerData.name);
        setEvents(eventsData);
      } catch (err) {
        console.error("Data loading error:", err);
        setError(err.message);
        setEvents([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Function to return FontAwesome icons based on the status
  const getStatusIcon = (status) => {
    const cleanedStatus = (status || "").toString().trim().toLowerCase();
    
    switch (cleanedStatus) {
      case "confirmed":
        return <i className="fas fa-thumbs-up status-icon confirmed"></i>;
      case "completed":
        return <i className="fas fa-check-circle status-icon completed"></i>;
      case "pending":
        return <i className="fas fa-clock status-icon pending"></i>;
      case "in progress":
        return <i className="fas fa-spinner status-icon in-progress"></i>;
      case "cancelled":
        return <i className="fas fa-times-circle status-icon cancelled"></i>;
      default:
        return <i className="fas fa-question-circle status-icon unknown"></i>;
    }
  };
  
  return (
    <div className="manager-home">
      <header className="manager-header">
        <h1>Welcome, {manager?.name || 'Manager'}</h1>
        {manager?.role && <p className="manager-role">{manager.role}</p>}
      </header>

      <section className="manager-content">
        <div className="events-section">
          <h2>Your Assigned Wedding Events</h2>
          
          {loading ? (
            <div className="loading-events">
              <div className="loading-spinner"></div>
              <p>Loading events...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>Error loading events: {error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="retry-button"
              >
                Retry
              </button>
            </div>
          ) : events.length === 0 ? (
            <div className="no-events">
              <i className="fas fa-calendar-times"></i>
              <p>No events assigned</p>
            </div>
          ) : (
            <div className="events-grid">
              {events.map((event) => (
                <div key={event.id} className="event-card">
                  <div className="event-header">
                    <h3>{event.eventName || 'Wedding Event'}</h3>
                    <div className="event-status">
                      {getStatusIcon(event.status)}
                      <span>{event.status || 'Unknown'}</span>
                    </div>
                  </div>
                  
                  <div className="event-details">
                    <p><strong>Customer:</strong> {event.customerName || 'N/A'}</p>
                    <p><strong>Venue:</strong> {event.venue || 'Not specified'}</p>
                    <p><strong>Date:</strong> {event.date || 'Not scheduled'}</p>
                    <p><strong>Capacity:</strong> {event.capacity || '0'}</p>
                    <p><strong>Description:</strong> {event.description || 'No description'}</p>
                  </div>
                  
                  <div className="event-contacts">
                    {event.phone && (
                      <p>
                        <i className="fas fa-phone"></i> {event.phone}
                      </p>
                    )}
                    {event.email && (
                      <p>
                        <i className="fas fa-envelope"></i> {event.email}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default ManagerHome;