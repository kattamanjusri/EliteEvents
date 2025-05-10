import React from 'react';
import './Home.css';
import dark_arrow from '../assets/dark-arrow.png';

const Home = () => {
  return (
    <div className='home-container'>
      <div className='home-text'>
        <h1>Discover & Experience Amazing Events with Elite Events!</h1>
        <p>
        Looking for the most unforgettable celebrations in town? 🎉 From stunning weddings and joyful engagements to lively Sangeet and fun-filled bachelor parties, Elite Events is your go-to destination for all things celebration!
        </p>
        <button className='home-btn'>Explore more <img src={dark_arrow} alt=""/></button>
      </div>
    </div>
  );
};

export default Home;