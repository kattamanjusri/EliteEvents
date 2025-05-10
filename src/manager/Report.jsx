import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import PropTypes from 'prop-types';
import './Report.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const Report = () => {
  const [events, setEvents] = useState([]);
  const [manager, setManager] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Default colors for different statuses
  const statusColors = {
    'pending': '#FF6384',
    'confirmed': '#36A2EB',
    'in progress': '#FFCE56',
    'completed': '#4BC0C0',
    'cancelled': '#9966FF',
    'unknown': '#C9CBCF'
  };

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

  // Process events data safely
  const processEventsData = () => {
    const statusCounts = events.reduce((acc, event) => {
      const status = event?.status ? String(event.status).toLowerCase() : 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Sort by predefined status order
    const sortedStatuses = Object.keys(statusColors);
    const sortedCounts = {};
    
    sortedStatuses.forEach(status => {
      if (statusCounts[status]) {
        sortedCounts[status] = statusCounts[status];
      }
    });

    // Add any remaining statuses not in our predefined list
    Object.keys(statusCounts).forEach(status => {
      if (!sortedCounts[status]) {
        sortedCounts[status] = statusCounts[status];
      }
    });

    return sortedCounts;
  };

  const statusCounts = processEventsData();

  // Prepare chart data
  const chartData = {
    labels: Object.keys(statusCounts).map(status => status.charAt(0).toUpperCase() + status.slice(1)),
    datasets: [{
      data: Object.values(statusCounts),
      backgroundColor: Object.keys(statusCounts).map(
        status => statusColors[status] || '#C9CBCF'
      ),
      borderWidth: 1
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw || 0;
            const total = context.dataset.data.reduce((a, b) => a + b, 0);
            const percentage = Math.round((value / total) * 100);
            return `${label}: ${value} (${percentage}%)`;
          }
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="report-page">
        <h1>Event Status Report</h1>
        <div className="report-container loading">
          <div className="loading-spinner"></div>
          <p>Loading events data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="report-page">
        <h1>Event Status Report</h1>
        <div className="report-container error">
          <p className="error-message">Error: {error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (events.length === 0) {
    return (
      <div className="report-page">
        <h1>Event Status Report</h1>
        <div className="report-container empty">
          <i className="fas fa-chart-pie"></i>
          <p>No events data available</p>
        </div>
      </div>
    );
  }

  return (
    <div className="report-page">
      <h1>Event Status Report</h1>
      <div className="report-container">
        <div className="chart-wrapper">
          <Pie data={chartData} options={chartOptions} />
        </div>
        
        <div className="status-summary">
          <h2>Events by Status</h2>
          {Object.entries(statusCounts).map(([status, count]) => (
            <div key={status} className="status-item">
              <span 
                className="status-color" 
                style={{ backgroundColor: statusColors[status] || '#C9CBCF' }}
              ></span>
              <span className="status-label">{status.charAt(0).toUpperCase() + status.slice(1)}:</span>
              <span className="status-count">{count}</span>
            </div>
          ))}
          <div className="total-events">
            <strong>Total Events:</strong> {events.length}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Report;