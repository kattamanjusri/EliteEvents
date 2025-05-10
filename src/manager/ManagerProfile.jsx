import React, { useEffect, useState } from "react";
import axios from "axios";
import "./manager.css";
import { TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

import manager1Img from "../assets/manager1.jpg";
import manager2Img from "../assets/manager2.jpg";
import manager3Img from "../assets/manager3.jpg";
import manager4Img from "../assets/manager4.jpg";
import manager5Img from "../assets/manager5.jpg";
import manager6Img from "../assets/manager6.jpg";

export default function ManagerProfile() {
  const [manager, setManager] = useState(null);
  const [editMode, setEditMode] = useState(false); // Toggle between view and edit mode
  const [editData, setEditData] = useState({});
  const [events, setEvents] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const getManagerImage = (managerId) => {
    const id = parseInt(managerId);
    const images = {
      1: manager4Img,
      2: manager5Img,
      3: manager6Img,
      5: manager1Img,
      6: manager2Img,
      8: manager3Img,
    };
    return images[id] || "https://via.placeholder.com/150";
  };

  const getManagerRole = (managerId) => {
    const id = parseInt(managerId);
    const roles = {
      1: "💍 Wedding Manager",
      2: "🎉 Bachelor Party Host",
      3: "🎂 Birthday Planner",
      5: "🎶 Sangeet Coordinator",
      6: "🌼 Haldi Organizer",
      8: "💑 Engagement Specialist",
    };
    return roles[id] || "🎯 General Event Manager";
  };

  useEffect(() => {
    const storedManager = JSON.parse(localStorage.getItem("manager"));

    if (!storedManager) {
      navigate("/managerlogin");
    } else {
      setManager(storedManager);
      setEditData({ ...storedManager }); // Clone the data for editing

      axios
        .get(`http://localhost:9000/api/manager/manager/${storedManager.managerId}`)
        .then((res) => setEvents(res.data))
        .catch((err) => console.error("Error fetching events", err));
    }
  }, [navigate]);

  const toggleEditMode = () => {
    setEditMode(!editMode);
  };

  const handleEditChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    try {
      const response = await axios.put(
        `http://localhost:9000/api/admin/updatemanager/${manager.managerId}`,
        editData
      );
      alert("Profile updated successfully!");
      setManager(response.data);
      setEditMode(false);
    } catch (err) {
      setError("Failed to update profile: " + err.message);
    }
  };

  if (!manager) return null;

  return (
    <div className="business-profile">
      <div className="profile-card">
        <div className="profile-header">
          <img
            className="manager-avatar"
            src={getManagerImage(manager.managerId)}
            alt="Manager"
          />
          <div className="manager-details">
            <h2 className="manager-name">{manager.name}</h2>
            <p className="manager-role">
              {getManagerRole(manager.managerId)}, <strong>{manager.company_name}</strong>
            </p>
            <p className="manager-location">Location : 📍 {manager.company_location}</p>
          </div>
        </div>

        {error && (
          <p style={{ color: "red", fontWeight: "bold", textAlign: "center" }}>
            {error}
          </p>
        )}

        {editMode ? (
          <div className="profile-edit-form">
            <TextField
              label="Name"
              name="name"
              value={editData.name}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Email"
              name="email"
              value={editData.email}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Username"
              name="username"
              value={editData.username}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Mobile No"
              name="mobileno"
              value={editData.mobileno}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Company Name"
              name="company_name"
              value={editData.company_name}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <TextField
              label="Company Location"
              name="company_location"
              value={editData.company_location}
              onChange={handleEditChange}
              fullWidth
              style={{ marginBottom: "15px" }}
            />
            <div className="profile-button-group">
              <button className="manager-action-button save-button" onClick={saveProfile}>
                <span className="button-icon">💾</span> Save
              </button>
              <button className="manager-action-button cancel-button" onClick={toggleEditMode}>
                <span className="button-icon">❌</span> Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="profile-info">
            <div className="profile-column">
              <p><strong>ID:</strong> {manager.managerId}</p>
              <p><strong>Username:</strong> {manager.username}</p>
              <p><strong>Email:</strong> {manager.email}</p>
            </div>
            <div className="profile-column">
              <p><strong>Mobile:</strong> {manager.mobileno}</p>
              <p><strong>Gender:</strong> {manager.gender}</p>
              <p><strong>DOB:</strong> {manager.dob}</p>
            </div>
            <div className="edit-profile-container">
              <button className="manager-edit-button" onClick={toggleEditMode}>
                <span className="button-icon">✏️</span> Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}