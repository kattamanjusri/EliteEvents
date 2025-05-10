import React, { useRef } from 'react'
import './Testimonials.css'
// import next_icon from '../../assets/next-icon.png'
// import back_icon from '../../assets/back-icon.png'
import ba from '../../assets/ba.png'
import f from '../../assets/ff.png'
import user_1 from '../../assets/user_1.png'
import user_2 from '../../assets/user_2.png'
import user_3 from '../../assets/user_3.png'
import user_4 from '../../assets/user_4.png'

const Testimonials = () => {

  const slider = useRef();
  let tx = 0;

  const slideForward = () => {
    if (tx > -50) {
      tx -= 25;
    }
    slider.current.style.transform = `translateX(${tx}%)`;
  }

  const slideBackward = () => {
    if (tx < 0) {
      tx += 25;
    }
    slider.current.style.transform = `translateX(${tx}%)`;
  }

  return (
     <div className='testimonials'>
       <img src={ba} alt="" className='next-btn' onClick={slideForward} />
       <img src={f} alt="" className='back-btn' onClick={slideBackward} /> 
      <div className="slider">
        <ul ref={slider}>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_1} alt="" />
                <div>
                  <h3>Priya & Arjun</h3>
                  <span>Hyderbad,TN</span>
                </div>
              </div>
              <p>
                "Our wedding was like a dream come true, all thanks to 
                the amazing event planners. They handled every detail perfectly,
                from decorations to coordination. We didn’t have to worry about a thing!"
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_2} alt="" />
                <div>
                  <h3>Neha R.</h3>
                  <span>Vijayawada,AP</span>
                </div>
              </div>
              <p>
                "A big thank you to the team for making my daughter’s birthday party so special! 
                The decorations, activities, and food were all top-notch.
                Everyone had a fantastic time!" 
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_3} alt="" />
                <div>
                  <h3>Rahul M., Student Coordinator</h3>
                  <span>Vijayawada,AP</span>
                </div>
              </div>
              <p>
                "The event management team did an outstanding job organizing our college cultural fest.
                From stage setup to scheduling events, everything was well-coordinated.
                The energy and enthusiasm they brought made the fest truly unforgettable!" 
              </p>
            </div>
          </li>
          <li>
            <div className="slide">
              <div className="user-info">
                <img src={user_4} alt="" />
                <div>
                  <h3>Mrs. Lakshmi V., Proud Mother</h3>
                  <span>Guntur,AP</span>
                </div>
              </div>
              <p>
                "The Half Saree event was beautifully organized! 
                The decorations, stage setup, and traditional ambiance made the celebration truly special.
                Our daughter felt like a princess, and the guests were amazed by the arrangements. 
                Thank you for making this day unforgettable!"
              </p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  )
}

export default Testimonials