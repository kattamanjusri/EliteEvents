import React, { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './Notification.css';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [markingAllAsRead, setMarkingAllAsRead] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const customerUsername = localStorage.getItem('username');
  
  // Using useCallback to memoize the fetchNotifications function
  const fetchNotifications = useCallback(async () => {
    if (!customerUsername) {
      console.error('No username found in localStorage');
      setError('User authentication error. Please login again.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log(`Fetching notifications for user: ${customerUsername}`);
      
      const response = await axios.get(`http://localhost:9000/api/notifications/all`, {
        params: { username: customerUsername },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Notifications response:', response.data);
      
      const sortedNotifications = response.data.sort((a, b) => 
        new Date(b.createdAt) - new Date(a.createdAt)
      );
      
      setNotifications(sortedNotifications);
      updateUnreadCount(sortedNotifications);
      setError(null);
    } catch (err) {
      console.error('Error fetching notifications:', err);
      setError('Failed to load notifications. Please try again.');
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  }, [customerUsername]);

  // Fetch notifications on component mount and when location state changes
  useEffect(() => {
    fetchNotifications();
    
    // Check for new notification from location state
    if (location.state?.notification) {
      handleNewNotification(location.state.notification);
    }
  }, [location.state, fetchNotifications]);

  // Set up polling for real-time updates (every 30 seconds)
  useEffect(() => {
    const pollInterval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(pollInterval);
  }, [fetchNotifications]);

  const handleNewNotification = (notification) => {
    if (notification.customerUsername === customerUsername) {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      toast.info(`New notification: ${getStatusMessage(notification.status, notification.eventName)}`);
    }
  };

  const updateUnreadCount = (notifs) => {
    const count = notifs.filter(n => !n.isRead).length;
    setUnreadCount(count);
    // Update browser tab title with unread count
    document.title = count > 0 ? `(${count}) Notifications` : 'Notifications';
  };

  const markAsRead = async (notificationId) => {
    try {
      console.log(`Marking notification ${notificationId} as read`);
      
      await axios.patch(`http://localhost:9000/api/notifications/${notificationId}/read`, {}, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Notification marked as read successfully');
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      // Toast for confirmation
      toast.success('Notification marked as read');
    } catch (err) {
      console.error('Error marking notification as read:', err);
      toast.error('Failed to mark notification as read');
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) {
      toast.info('No unread notifications to mark as read');
      return;
    }
    
    try {
      setMarkingAllAsRead(true);
      console.log('Marking all notifications as read');
      
      // First approach - try the standard endpoint
      try {
        await axios.patch(`http://localhost:9000/api/notifications/mark-all-read`, 
          { username: customerUsername },
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );
      } catch (apiError) {
        console.warn('Primary endpoint failed, trying fallback method', apiError);
        
        // Fallback approach - mark each notification individually if the bulk endpoint fails
        const unreadNotifications = notifications.filter(n => !n.isRead);
        for (const notification of unreadNotifications) {
          await axios.patch(`http://localhost:9000/api/notifications/${notification.id}/read`, {}, {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          });
        }
      }
      
      console.log('All notifications marked as read successfully');
      
      // Update the UI state regardless of which method succeeded
      setNotifications(prev => 
        prev.map(n => ({ ...n, isRead: true }))
      );
      
      setUnreadCount(0);
      toast.success('All notifications marked as read');
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
      toast.error('Failed to mark all notifications as read');
    } finally {
      setMarkingAllAsRead(false);
    }
  };

  const clearAllNotifications = async () => {
    if (notifications.length === 0) return;
    
    try {
      console.log('Clearing all notifications');
      
      await axios.delete(`http://localhost:9000/api/notifications`, {
        params: { username: customerUsername },
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('All notifications cleared successfully');
      
      setNotifications([]);
      setUnreadCount(0);
      toast.success('All notifications cleared');
    } catch (err) {
      console.error('Error clearing notifications:', err);
      toast.error('Failed to clear notifications');
    }
  };

  const viewEventDetails = (eventId) => {
    navigate(`/event-details/${eventId}`);
  };

  const getStatusMessage = (status, eventName) => {
    switch(status?.toLowerCase()) {
      case 'in progress':
        return `Your event "${eventName}" is now in progress. Our team is working on it!`;
      case 'completed':
        return `Congratulations! Your event "${eventName}" has been successfully completed.`;
      case 'cancelled':
        return `We regret to inform you that your event "${eventName}" has been cancelled.`;
      case 'confirmed':
        return `Your event "${eventName}" has been confirmed! Get ready for an amazing experience.`;
      default:
        return `Status updated for your event "${eventName}".`;
    }
  };

  const getStatusIcon = (status) => {
    switch(status?.toLowerCase()) {
      case 'in progress':
        return '⏳';
      case 'completed':
        return '✅';
      case 'cancelled':
        return '❌';
      case 'confirmed':
        return '👍';
      default:
        return 'ℹ️';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading && notifications.length === 0) {
    return (
      <div className="notification-container">
        <div className="notification-header">
          <h2>Notifications</h2>
          <div className="loading-spinner"></div>
        </div>
        <div className="loading-notifications">
          <p>Loading your notifications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="notification-container">
      <div className="notification-header">
        <h2>Notifications {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</h2>
        <div className="notification-actions">
          {notifications.length > 0 && (
            <>
              <button 
                className={`mark-all-read-btn ${markingAllAsRead ? 'loading' : ''}`}
                onClick={markAllAsRead}
                disabled={unreadCount === 0 || markingAllAsRead}
              >
                {markingAllAsRead ? 'Marking...' : 'Mark All as Read'}
              </button>
              <button 
                className="clear-all-btn"
                onClick={clearAllNotifications}
              >
                Clear All
              </button>
            </>
          )}
          <button 
            className="refresh-btn"
            onClick={fetchNotifications}
            disabled={loading}
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>
      
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={fetchNotifications}>Retry</button>
        </div>
      )}

      {notifications.length === 0 ? (
        <div className="no-notifications">
          <div className="empty-state">
            <h3>No notifications yet</h3>
            <p>When you have notifications, they'll appear here</p>
          </div>
        </div>
      ) : (
        <>
          <div className="notification-summary">
            {unreadCount > 0 ? (
              <p>You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}</p>
            ) : (
              <p>All caught up!</p>
            )}
          </div>
          
          <ul className="notification-list">
            {notifications.map(notification => (
              <li 
                key={notification.id} 
                className={`notification-item ${notification.status?.toLowerCase()?.replace(' ', '-') || 'unknown'} ${notification.isRead ? 'read' : 'unread'}`}
              >
                <div className="notification-icon">
                  {getStatusIcon(notification.status)}
                </div>
                <div className="notification-content">
                  <h3>Event Status Update</h3>
                  <p>{getStatusMessage(notification.status, notification.eventName)}</p>
                  <p className="notification-time">
                    {formatDate(notification.createdAt)}
                  </p>
                </div>
                {!notification.isRead && (
                  <button 
                    className="done-button"
                    onClick={() => markAsRead(notification.id)}
                    aria-label="Mark as done"
                  >
                    Done
                  </button>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Notification;