import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MyEvents.css';

const MyEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [customerUsername, setCustomerUsername] = useState(null);
  const [refreshInterval, setRefreshInterval] = useState(null);
  const [feedback, setFeedback] = useState({});
  const [ratings, setRatings] = useState({}); // Store ratings for events
  const [feedbackStatuses, setFeedbackStatuses] = useState({}); // Track feedback status per event
  const [cancelLoading, setCancelLoading] = useState({}); // Track cancel loading state

  useEffect(() => {
    const storedUsername = localStorage.getItem('customerUsername') ||
      localStorage.getItem('username') ||
      localStorage.getItem('user') ||
      sessionStorage.getItem('customerUsername') ||
      sessionStorage.getItem('username');

    console.log("Retrieved username from storage:", storedUsername);

    if (storedUsername) {
      setCustomerUsername(storedUsername);
    } else {
      const userObject = localStorage.getItem('user') || sessionStorage.getItem('user');
      if (userObject) {
        try {
          const parsedUser = JSON.parse(userObject);
          if (parsedUser && (parsedUser.username || parsedUser.customerUsername)) {
            const extractedUsername = parsedUser.username || parsedUser.customerUsername;
            console.log("Retrieved username from user object:", extractedUsername);
            setCustomerUsername(extractedUsername);
          }
        } catch (e) {
          console.error("Error parsing user object:", e);
        }
      }
    }
  }, []);

  useEffect(() => {
    if (!customerUsername) {
      setLoading(false);
      return;
    }

    fetchEvents();

    const interval = setInterval(() => {
      fetchEvents(false);
    }, 30000);

    setRefreshInterval(interval);

    return () => {
      if (refreshInterval) {
        clearInterval(refreshInterval);
      }
    };
  }, [customerUsername]);

  const fetchEvents = async (showLoading = true) => {
    if (!customerUsername) return;

    try {
      if (showLoading) {
        setLoading(true);
      }
      console.log("Fetching events for customer:", customerUsername);

      const response = await axios.get(`http://localhost:9000/api/events/username/${customerUsername}`);
      console.log("API Response:", response.data);
      setEvents(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching events:", err);
      if (err.response && err.response.status === 404) {
        setEvents([]);
      } else {
        setError(`Failed to load events: ${err.message}`);
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  const handleCancelEvent = async (eventId) => {
    // Confirm cancellation with user
    if (!window.confirm('Are you sure you want to cancel this event? This action cannot be undone.')) {
      return;
    }

    try {
      // Set loading state for this event
      setCancelLoading(prev => ({
        ...prev,
        [eventId]: true
      }));

      // Make API call to cancel the event
      await axios.delete(
        `http://localhost:9000/api/events/cancel/${eventId}?customerUsername=${customerUsername}`
      );

      // Remove the event from the UI immediately (optimistic update)
      setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
      
      // Show success notification
      alert('Event cancelled successfully');
    } catch (error) {
      console.error('Error cancelling event:', error);
      
      // Display error message
      const errorMessage = error.response?.data || error.message || 'Error cancelling event';
      alert(`Failed to cancel event: ${errorMessage}`);
    } finally {
      // Clear loading state
      setCancelLoading(prev => ({
        ...prev,
        [eventId]: false
      }));
    }
  };

  const filteredEvents = events.filter(event =>
    event.eventName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.venue.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return 'status-confirmed';
      case 'completed':
        return 'status-completed';
      case 'in progress':
        return 'status-inprogress';
      case 'pending':
        return 'status-pending';
      case 'cancelled':
        return 'status-cancelled';
      default:
        return '';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  const handleLoginRedirect = () => {
    window.location.href = '/login';
  };

  const handleFeedbackChange = (eventId, feedbackText) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [eventId]: feedbackText,
    }));
  };
  
  const handleFeedbackSubmit = async (eventId) => {
    const feedbackText = feedback[eventId];
    const rating = ratings[eventId];
  
    // Clear previous status for this event
    setFeedbackStatuses(prev => ({
      ...prev,
      [eventId]: ''
    }));
  
    if (!feedbackText || feedbackText.trim() === '') {
      setFeedbackStatuses(prev => ({
        ...prev,
        [eventId]: 'Feedback cannot be empty.'
      }));
      return;
    }
    if (!rating) {
      setFeedbackStatuses(prev => ({
        ...prev,
        [eventId]: 'Please provide a rating.'
      }));
      return;
    }
  
    try {
      console.log('Submitting feedback:', { eventId, feedbackText, rating });
      
      // Send the request
      const response = await axios.post('http://localhost:9000/api/feedback/submit', {
        eventId,
        feedbackText,
        rating,
      });
      
      console.log('Feedback submission response:', response.data);
      
      // Update status for this specific event
      setFeedbackStatuses(prev => ({
        ...prev,
        [eventId]: 'Feedback submitted successfully!'
      }));
      
      // Clear form fields
      setFeedback((prevFeedback) => ({
        ...prevFeedback,
        [eventId]: '',
      }));
      
      setRatings(prev => ({
        ...prev,
        [eventId]: 0  // Reset rating
      }));
  
      // Display a temporary alert
      alert('Thank you for your feedback!');
      
      // Refresh events to show any updates
      fetchEvents();
  
    } catch (error) {
      console.error('Error submitting feedback:', error);
      
      // Display the error message from the server if available
      const errorMessage = error.response?.data || error.message || 'Error submitting feedback';
      
      setFeedbackStatuses(prev => ({
        ...prev,
        [eventId]: `Error: ${errorMessage}`
      }));
    }
  };

  const handleStarClick = (eventId, rating) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [eventId]: rating,
    }));
  };

  const renderStars = (eventId, currentRating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          className={`star ${i <= currentRating ? 'filled' : ''}`}
          onClick={() => handleStarClick(eventId, i)}
        >
          ★
        </span>
      );
    }
    return stars;
  };

  // Determine if event is cancellable
  // Generally, let's allow cancellation of pending events only
  const isEventCancellable = (status) => {
    return status?.toLowerCase() === 'pending';
  };

  return (
    <div className="events-container">
      <h1 className="page-title">My Events</h1>

      {!customerUsername ? (
        <div className="login-prompt">
          <p className="login-prompt-message">Customer username not found. Please ensure you are logged in.</p>
          <button 
            onClick={handleLoginRedirect}
            className="login-button"
          >
            Go to Login
          </button>
        </div>
      ) : (
        <>
          <div>
            <input
              type="text"
              placeholder="Search events by name..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {loading ? (
            <div className="loading-container">
              <div className="spinner"></div>
              <p className="loading-text">Loading your events...</p>
            </div>
          ) : error ? (
            <div className="error-message">
              <p>{error}</p>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="no-events">
              <p className="no-events-title">No events found</p>
              <p className="no-events-subtitle">
                {searchTerm ? "Try a different search term" : "You haven't registered any events yet"}
              </p>
            </div>
          ) : (
            <div className="events-grid1">
              {filteredEvents.map((event) => (
                <div key={event.id} className="event-card1">
                  <div className="card-content1">
                    <div className="card-header1">
                      <h2 className="event-title1">{event.eventName}</h2>
                      <span className={`status-badge ${getStatusBadgeClass(event.status)}`}>
                        {event.status || 'Pending'}
                      </span>
                    </div>
                    
                    <div className="event-details1">
                      <div className="detail-item1">
                        <span className="detail-label1">Venue:</span> 
                        <span>{event.venue}</span>
                      </div>
                      <div className="detail-item1">
                        <span className="detail-label1">Date:</span> 
                        <span>{formatDate(event.date)}</span>
                      </div>
                      <div className="detail-item1">
                        <span className="detail-label1">Capacity:</span> 
                        <span>{event.capacity} people</span>
                      </div>
                      <div className="detail-item1">
                        <span className="detail-label1">Phone:</span> 
                        <span>{event.phone}</span>
                      </div>
                      
                      {event.cost && (
                        <div className="detail-item1">
                          <span className="detail-label1">Cost:</span> 
                          <span>₹{event.cost}</span>
                        </div>
                      )}
                      
                      {event.description && (
                        <div className="description-section1">
                          <p className="description-label1">Description:</p>
                          <p className="description-text1">{event.description}</p>
                        </div>
                      )}
                      
                      {/* Cancel button section - only show for Pending events */}
                      {isEventCancellable(event.status) && (
                        <div className="cancel-button-container">
                          <div 
  className={`cancel-event-div ${cancelLoading[event.id] ? 'disabled' : ''}`}
  onClick={() => !cancelLoading[event.id] && handleCancelEvent(event.id)}
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      !cancelLoading[event.id] && handleCancelEvent(event.id);
    }
  }}
>
  {cancelLoading[event.id] ? 'Cancelling...' : 'Cancel Event'}
</div>

                        </div>
                      )}
                    </div>

                    {/* Only show star rating for events that are 'completed' */}
                    {event.status.toLowerCase() === 'completed' && (
                      <div className="feedback-section">
                        <div className="star-rating">
                          <p>Rate this event:</p>
                          <div className="stars">
                            {renderStars(event.id, ratings[event.id] || 0)}
                          </div>
                        </div>
                        
                        <div className="feedback-form">
                          <textarea
                            placeholder="Write your feedback..."
                            value={feedback[event.id] || ''}
                            onChange={(e) => handleFeedbackChange(event.id, e.target.value)}
                          />
                          
                          {/* Always show the feedback status area, but only with content when there's a status */}
                          <div className={`feedback-status ${
                            feedbackStatuses[event.id] ? 
                              (feedbackStatuses[event.id].includes('successfully') ? 'success' : 'error') : 
                              'hidden'
                          }`}>
                            {feedbackStatuses[event.id] || ''}
                          </div>
                          
                          <button
                            onClick={() => handleFeedbackSubmit(event.id)}
                            className="submit-feedback-button"
                          >        Submit Feedback
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default MyEvents;