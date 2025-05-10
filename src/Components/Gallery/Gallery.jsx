import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import './Gallery.css';
import wed6 from '../../assets/wed6.jpg';
import wed10 from '../../assets/wed10.jpg';
import e from '../../assets/e.jpg';
import f from '../../assets/f.jpg';
import r from '../../assets/r-removebg-preview.png';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate(); // Initialize navigate

  const handleImageClick = (image) => {
    setSelectedImage(image);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const handleSeeMoreClick = () => {
    navigate('/more-gallery'); // Navigate to the MoreGallery page
  };

  return (
    <div className="event">
      <div className="gallery">
        {[wed6, wed10, e, f].map((image, index) => (
          <img
            key={index}
            src={image}
            alt={`Gallery ${index}`}
            onClick={() => handleImageClick(image)}
          />
        ))}
      </div>

      <button className="btn" onClick={handleSeeMoreClick}>
        See more here <img src={r} alt="" />
      </button>

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content">
            <img src={selectedImage} alt="Selected" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;