import React from 'react'
import './About.css'
import image5 from '../../assets/image5.jpg'
import image7 from '../../assets/image7.jpg'
import logo from '../../assets/logo.webp'

const About = () => {
  return (
    <div className='about'>
      <div className="about-left">
        <img src={image5} alt="" className='about-img'/>
        <img src={logo} alt="" className='play-icon'/> 
      </div>
      <div className="about-right">
        <h3>ABOUT ELITE EVENTS</h3>
        <h1>Welcome to Elite Events🎉, your all-in-one event management solution.</h1>
        <article>
          <p>
            At Elite Events, we specialize in creating unforgettable experiences tailored to your unique needs. Whether it’s a grand wedding, corporate seminar, or private celebration, we deliver impeccable planning, personalized designs, and flawless execution.
          </p>
          <p>
            With a focus on creativity, professionalism, and customer satisfaction, we handle everything—from venue selection and decor to catering and entertainment. Let us transform your special moments into lasting memories.
          </p>
          <footer>
            <strong>Elite Events: Where Your Vision Meets Perfection👌.</strong>
          </footer>
        </article>
      </div>
    </div>
  )
}

export default About