import React, { useState, useEffect } from "react";
import axios from "axios";
import "./profile.css";
import { useNavigate } from "react-router-dom";

const MyProfile = () => {
  const [customerDetails, setCustomerDetails] = useState({
    name: "",
    gender: "",
    dob: "",
    email: "",
    username: "",
    mobileno: "",
    location: "",
    profileImage: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedDetails, setEditedDetails] = useState({});
  const [updateMessage, setUpdateMessage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [tempDetails, setTempDetails] = useState({});
  
  // Default profile image
  const defaultProfileImage = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNTYgMjU2Ij48cmVjdCB3aWR0aD0iMjU2IiBoZWlnaHQ9IjI1NiIgZmlsbD0iI2U2ZTZlNiIvPjxjaXJjbGUgY3g9IjEyOCIgY3k9IjEwMCIgcj0iNjAiIGZpbGw9IiNhMGE0YTgiLz48cGF0aCBkPSJNMjExLDIxMEgxOTUuNEMxOTUuNCwxNjguNiwxNjAuOSwxNDguMywxMjgsMTQ4LjNTNjAuNiwxNjguNiw2MC42LDIxMEg0NWMwLTUzLjMsNDEuNy03Mi43LDgzLTcyLjdzODMsMTkuNCw4Myw3Mi43WiIgZmlsbD0iI2EwYTRhOCIvPjwvc3ZnPg==";

  const navigate = useNavigate();

  useEffect(() => {
    const loggedInUsername = localStorage.getItem("username");

    if (!loggedInUsername) {
      setError("No username found. Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    const fetchCustomerDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:9000/api/customer/details/username/${loggedInUsername}`
        );
        
        // Ensure we have a profile image, if not use default
        const profileData = {
          ...response.data,
          profileImage: response.data.profileImage || defaultProfileImage
        };
        
        setCustomerDetails(profileData);
        setTempDetails(profileData);
        setIsLoading(false);
      } catch (err) {
        console.error("Error fetching customer details:", err);
        setError("Failed to fetch customer details.");
        setIsLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [navigate]);

  const handleEdit = () => {
    setIsEditing(true);
    setTempDetails({...customerDetails});
  };

  const handleCancel = () => {
    setIsEditing(false);
    setTempDetails({...customerDetails});
    setImageFile(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTempDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        console.log("Image loaded as base64:", reader.result);
        setTempDetails((prevDetails) => ({
          ...prevDetails,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const username = localStorage.getItem("username");
      
      // Create a copy of tempDetails to send to the server
      const dataToSend = {
        ...tempDetails
      };

      console.log("Sending updated profile data:", dataToSend);
      
      const response = await axios.put(
        `http://localhost:9000/api/customer/update/username/${username}`,
        dataToSend
      );

      setUpdateMessage("Profile updated successfully!");
      setCustomerDetails({...dataToSend});
      setIsEditing(false);
      setImageFile(null);

      setTimeout(() => {
        setUpdateMessage("");
      }, 3000);
    } catch (err) {
      console.error("Error updating profile:", err);
      setUpdateMessage("Failed to update profile. Please try again.");
    }
  };

  if (isLoading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="profile-container1">
      {updateMessage && (
        <div className={`update-message ${updateMessage.includes("Failed") ? "error" : "success"}`}>
          {updateMessage}
        </div>
      )}

      <div className="profile-image1-container">
        <img
          className="profile-image1"
          src={tempDetails.profileImage || defaultProfileImage}
          alt="Profile"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = defaultProfileImage;
          }}
        />
        {isEditing && (
          <div className="profile-image1-overlay">
            <label htmlFor="profile-image-input" className="add-image1-icon">
              +
            </label>
            <input
              id="profile-image-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </div>
        )}
      </div>

      <div className="profile-details-vertical">
        {Object.keys(customerDetails).map((key) => {
          if (key === "profileImage" || key === "password") {
            return null;
          }

          return (
            <div className="profile-details__item" key={key}>
              <label className="profile-details__label">
                {key.charAt(0).toUpperCase() + key.slice(1)}:
              </label>
              {isEditing && key !== "username" ? (
                <input
                  type={key === "dob" ? "date" : "text"}
                  name={key}
                  value={tempDetails[key] || ""}
                  onChange={handleChange}
                  className="profile-edit-input"
                />
              ) : (
                <span className="profile-details__value">{customerDetails[key]}</span>
              )}
            </div>
          );
        })}
      </div>

      <div className="profile-actions">
        {!isEditing ? (
          <button className="edit-button" onClick={handleEdit}>
            Edit Profile
          </button>
        ) : (
          <div className="edit-buttons">
            <button className="save-button" onClick={handleSave}>
              Save
            </button>
            <button className="cancel-button" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyProfile;