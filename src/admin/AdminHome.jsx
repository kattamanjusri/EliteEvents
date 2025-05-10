import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './admin.css';

const AdminHome = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState({});
  const [sending, setSending] = useState({});
  const [processingAction, setProcessingAction] = useState({});
  const [feedbacks, setFeedbacks] = useState({}); // Store feedback by event ID
  const [filterStatus, setFilterStatus] = useState('');
  const location = useLocation();

  useEffect(() => {
    // Fetch events from the backend
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:9000/api/events/all');
      if (response.ok) {
        const data = await response.json();
        const eventsWithStatus = data.map((event) => ({
          ...event,
          status: event.status || 'Pending', // Default status if not provided
        }));
        setEvents(eventsWithStatus);
        
        // Initialize costs state object
        const initialCosts = {};
        eventsWithStatus.forEach(event => {
          initialCosts[event.id] = event.cost || '';
        });
        setCosts(initialCosts);

        // Fetch feedback for each event
        fetchFeedbacks(eventsWithStatus);
      } else {
        console.error('Failed to fetch events');
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchFeedbacks = async (events) => {
    try {
      const feedbackData = {};
      for (const event of events) {
        const feedbackResponse = await fetch(`http://localhost:9000/api/feedback/event/${event.id}`);
        if (feedbackResponse.ok) {
          const feedback = await feedbackResponse.json();
          feedbackData[event.id] = feedback;
        } else {
          console.error(`Failed to fetch feedback for event ${event.id}`);
        }
      }
      setFeedbacks(feedbackData);
    } catch (error) {
      console.error('Error fetching feedback:', error);
    }
  };

  // Handle new event addition from location state
  useEffect(() => {
    if (location.state?.newEvent) {
      setEvents((prevEvents) => [location.state.newEvent, ...prevEvents]);
      setCosts(prev => ({
        ...prev,
        [location.state.newEvent.id]: location.state.newEvent.cost || ''
      }));
      fetchFeedbacks([location.state.newEvent]); // Fetch feedback for the new event
    }
  }, [location.state]);

  // This function has been removed as we're only using the status dropdown to change status
  
  // Function to completely delete an event from the database
  const handlePermanentDelete = async (eventId) => {
    if (processingAction[eventId]) return;
    
    if (!window.confirm("Are you sure you want to PERMANENTLY delete this event? This action cannot be undone and will remove the event from all views.")) {
      return;
    }
    
    setProcessingAction({ ...processingAction, [eventId]: true });
    
    try {
      // Using the customer-delete endpoint which completely removes the event
      const response = await fetch(`http://localhost:9000/api/events/customer-delete/${eventId}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setEvents((prevEvents) => prevEvents.filter((event) => event.id !== eventId));
        // Remove cost entry for deleted event
        const newCosts = { ...costs };
        delete newCosts[eventId];
        setCosts(newCosts);
        alert("Event has been permanently deleted from the system.");
      } else {
        const errorData = await response.json();
        console.error('Failed to delete event:', errorData);
        alert(`Failed to delete event: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      alert('Error deleting event. Please try again.');
    } finally {
      setProcessingAction({ ...processingAction, [eventId]: false });
    }
  };

  // Function to handle manual status change
  const handleStatusChange = async (eventId, newStatus) => {
    if (processingAction[eventId]) return;
    
    setProcessingAction({ ...processingAction, [eventId]: true });
    
    try {
      const response = await fetch(`http://localhost:9000/api/events/${eventId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newStatus),
      });
      
      if (response.ok) {
        const updatedEvent = await response.json();
        setEvents((prevEvents) =>
          prevEvents.map((event) =>
            event.id === eventId ? { ...event, status: newStatus } : event
          )
        );
        alert(`Event status updated to ${newStatus}. Customer has been notified via email.`);
      } else {
        const errorData = await response.json();
        console.error('Failed to update event status:', errorData);
        alert(`Failed to update status: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error updating event status:', error);
      alert('Error updating status. Please try again.');
    } finally {
      setProcessingAction({ ...processingAction, [eventId]: false });
    }
  };

  // Handle cost input change
  const handleCostChange = (eventId, value) => {
    setCosts({
      ...costs,
      [eventId]: value
    });
  };

  // Send cost information to customer via email
  const sendCostEmail = async (event) => {
    if (!costs[event.id]) {
      alert('Please enter a cost amount before sending.');
      return;
    }

    setSending({ ...sending, [event.id]: true });
    
    try {
      const response = await fetch('http://localhost:9000/api/events/send-cost', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventId: event.id,
          email: event.email,
          customerName: event.customerName,
          eventName: event.eventName,
          cost: costs[event.id]
        }),
      });

      if (response.ok) {
        // Update the event in state to show cost has been sent
        setEvents(prevEvents =>
          prevEvents.map(e => 
            e.id === event.id ? { ...e, costSent: true, cost: costs[event.id] } : e
          )
        );
        alert('Cost information sent successfully!');
      } else {
        const errorData = await response.json();
        alert(`Failed to send cost information: ${errorData.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error sending cost email:', error);
      alert('Failed to send cost information due to a network error.');
    } finally {
      setSending({ ...sending, [event.id]: false });
    }
  };

  
  if (loading) {
    return <div className="loading-container">Loading events...</div>;
  }

  return (
    <div className="event">
      <u><h2>Registered Events</h2></u>
      <button onClick={fetchEvents} className="refresh-btn">Refresh Events</button>
      <div className="filter-container">
      <label htmlFor="status-filter">Filter by Status:</label>
      <select
        id="status-filter"
        value={filterStatus}
        onChange={(e) => setFilterStatus(e.target.value)}
      >
        <option value="">All</option>
        <option value="pending">Pending</option>
        <option value="inprogress">In Progress</option>
        <option value="confirmed">Confirmed</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
    </div>
      {events.length === 0 ? (
        <p>No events registered yet.</p>
      ) : (
        
        <ul className="events-list">
      {events
    .filter((event) => {
      // Debugging: Log the event status and filterStatus
      console.log('Event Status:', event.status, 'Filter Status:', filterStatus);
      return filterStatus ? event.status.toLowerCase() === filterStatus.toLowerCase() : true;
    })
      .map((event) => (
            <li key={event.id} className="event-card">
              <h3>{event.eventName}</h3>
              <div className="event-details">
                <p><strong>Customer Name:</strong> {event.customerName}</p>
                <p><strong>Email:</strong> {event.email}</p>
                <p><strong>Phone:</strong> {event.phone}</p>
                <p><strong>Venue:</strong> {event.venue}</p>
                <p><strong>Date:</strong> {event.date}</p>
                <p><strong>Capacity:</strong> {event.capacity}</p>
                <p><strong>Description:</strong> {event.description}</p>
              </div>
              
              <div className="feedback-section">
                <h4>Customer Feedback:</h4>
                {feedbacks[event.id] ? (
                  <ul>
                    {feedbacks[event.id].map((feedback) => (
                      <li key={feedback.id}>
                        <p><strong>Rating:</strong> {feedback.rating}</p>
                        <p><strong>Feedback:</strong> {feedback.feedbackText}</p>
                        <p><strong>Date:</strong> {feedback.feedbackDate}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No feedback yet.</p>
                )}
              </div>

              <div className="cost-section">
                <label htmlFor={`cost-${event.id}`}>
                  <strong>Event Cost (₹):</strong>
                </label>
                <input
                  type="number"
                  id={`cost-${event.id}`}
                  value={costs[event.id] || ''}
                  onChange={(e) => handleCostChange(event.id, e.target.value)}
                  min="0"
                  placeholder="Enter amount"
                  className="cost-input"
                />
                <button
                  className="send-cost-btn"
                  onClick={() => sendCostEmail(event)}
                  disabled={sending[event.id] || !costs[event.id]}
                >
                  {sending[event.id] ? 'Sending...' : event.costSent ? 'Resend Cost' : 'Send Cost to Customer'}
                </button>
                {event.costSent && <span className="cost-sent-badge">Cost sent</span>}
              </div>
              
              <div className="event-actions">
                <select
                  value={event.status}
                  className={`status-badge ${event.status.toLowerCase()}`}
                  onChange={(e) => handleStatusChange(event.id, e.target.value)}
                  disabled={processingAction[event.id]}
                >
                  <option value="Pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                
                {/* Show delete button only for cancelled events */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AdminHome;