import React from 'react';
import './CustomerHome.css';
import logo from '../../assets/logo.webp';
import Background from '../Background/Background';

const CustomerHome = ({ heroData, setHeroCount, heroCount, setPlayStatus, playStatus }) => {
  return (
    <div className='hero'>
  <Background playStatus={playStatus} heroCount={heroCount} />

  {/* Dots FIRST */}
  <ul className="hero-dots">
    <li onClick={() => setHeroCount(0)} className={heroCount === 0 ? "hero-dot orange" : "hero-dot"}></li>
    <li onClick={() => setHeroCount(1)} className={heroCount === 1 ? "hero-dot orange" : "hero-dot"}></li>
    <li onClick={() => setHeroCount(2)} className={heroCount === 2 ? "hero-dot orange" : "hero-dot"}></li>
  </ul>

  {/* Hero Text */}
  <div className="hero-text">
    <p>{heroData?.text1}</p>
    <p>{heroData?.text2}</p>
    <p>We plan, you party!</p>
  </div>

  {/* See the video LAST */}
  <div className="hero-play">
  <div className="play-wrapper">
    <p>See the video</p>
    <img
      onClick={() => setPlayStatus(!playStatus)}
      src={logo}
      alt="Play button"
      className='play-button'
    />
  </div>
</div>
</div>


   
  );
};

export default CustomerHome;
