import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Services.css";
import wed4 from "../../assets/wed4.jpg";
import bir1 from "../../assets/bir1.jpg";
import bachelor from "../../assets/bachelor.jpg";
import sangeet from "../../assets/sangeet.jpg";
import haldi from "../../assets/haldi.jpg";
import wed3 from "../../assets/wed3.jpg";

const Services = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const handleNavigation = (path) => {
    navigate(path); // Navigate to the specified path
  };

  // Define all events with their data
  const events = [
    {
      name: "Sangeet Night",
      category: "sangeet",
      path: "/sangeet",
      img: sangeet,
      alt: "Sangeet Night"
    },
    {
      name: "Birthday Party",
      category: "birthday",
      path: "/birthday",
      img: bir1,
      alt: "Birthday Party"
    },
    {
      name: "Bachelor Party",
      category: "bachelor",
      path: "/bachelor",
      img: bachelor,
      alt: "Bachelor Party"
    },
    {
      name: "Wedding Event",
      category: "wedding",
      path: "/wedding",
      img: wed4,
      alt: "Wedding Event"
    },
    {
      name: "Haldi",
      category: "haldi",
      path: "/haldi",
      img: haldi,
      alt: "Haldi Event"
    },
    {
      name: "Engagement Event",
      category: "engagement",
      path: "/engagement",
      img: wed3,
      alt: "Engagement Event"
    }
  ];

  const categories = [
    { value: "", label: "All Events" },
    { value: "sangeet", label: "Sangeet Night" },
    { value: "wedding", label: "Wedding Event" },
    { value: "bachelor", label: "Bachelor Party" },
    { value: "birthday", label: "Birthday Party" },
    { value: "engagement", label: "Engagement Event" },
    { value: "haldi", label: "Haldi" }
  ];

  // Filter events based on search term and category
  const filteredEvents = events.filter(event => {
    const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "" || event.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="services-container">
      <div className="search-container">
        <div className="search-controls">
          <select 
            className="category-dropdown"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map((category, index) => (
              <option key={index} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="services">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event, index) => (
            <div 
              className="service" 
              onClick={() => handleNavigation(event.path)}
              key={index}
            >
              <img src={event.img} alt={event.alt} />
              <div className="caption">
                <p>{event.name}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="no-results">No events found matching your criteria</div>
        )}
      </div>
    </div>
  );
};

export default Services;