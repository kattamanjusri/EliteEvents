import React, { useState } from 'react';
import './Moregallery.css';
import b from '../../assets/b.jpg';
import c from '../../assets/c.jpg';
import d from '../../assets/d.jpg';
import g from '../../assets/g.jpg';
import h from '../../assets/h.jpg';
import image3 from '../../assets/image3.jpg';
import wed8 from '../../assets/wed8.jpg';
import wed9 from '../../assets/wed9.jpg';
import wed7 from '../../assets/wed7.jpg';
import a from '../../assets/a.jpg';
import e from '../../assets/e.jpg';
import eng from '../../assets/eng.jpg';
import aa from '../../assets/aa.jpg';
import s from '../../assets/s.jpg';
import u from '../../assets/u.jpg';
import m from '../../assets/m.jpg';
import v from '../../assets/v.jpg';
import k from '../../assets/k.jpg';

const Moregallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageClick = (image) => {
    setSelectedImage(image); 
  };

  const closeModal = () => {
    setSelectedImage(null); 
  };

  return (
    <div className="more-gallery">
      {[b, c, d, g, h, image3, wed8, wed9, wed7, a, e, eng, aa, s, u, m, v, k].map((image, index) => (
        <img
          key={index}
          src={image}
          alt={`Gallery ${index}`}
          onClick={() => handleImageClick(image)}
        />
      ))}

      {selectedImage && (
        <div className="modal" onClick={closeModal}>
          <img src={selectedImage} alt="Selected" />
        </div>
      )}
    </div>
  );
};

export default Moregallery;