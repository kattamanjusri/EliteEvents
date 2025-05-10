import './Background.css';
import React from 'react';
import decoration from '../../assets/decoration.mp4';
import image1 from '../../assets/image1.webp';
import image2 from '../../assets/image2.jpeg';
import partyyy from '../../assets/partyyy.jpg';

const Background = ({ playStatus, heroCount }) => {
  if (playStatus) {
    return (
      <video className="background" autoPlay loop muted playsInline>
        <source src={decoration} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  } else if (heroCount === 0) {
    return <img src={image1} className="background1" alt="Background 1" />;
  } else if (heroCount === 1) {
    return <img src={image2} className="background1" alt="Background 2" />;
  } else if (heroCount === 2) {
    return <img src={partyyy} className="background1" alt="Background 3" />;
  } else {
    return <img src={image1} className="background1" alt="Default Background" />;
  }
};

export default Background;
