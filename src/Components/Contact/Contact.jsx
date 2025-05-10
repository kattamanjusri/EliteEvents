import React from 'react'
import './Contact.css'
import msg_icon from '../../assets/msg-icon.png'
import mail_icon from '../../assets/mail-icon.png'
import phone_icon from '../../assets/phone-icon.png'
import location_icon from '../../assets/location-icon.png'
import white_arrow from '../../assets/white-arrow.png'

const Contact = () => {
  const [result, setResult] = React.useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    setResult("Sending....");
    const formData = new FormData(event.target);

    formData.append("access_key", "4486f3a1-0c6b-410c-8e4a-2acf888191e5");

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    });

    const data = await response.json();

    if (data.success) {
      setResult("Form Submitted Successfully");
      event.target.reset();
    } else {
      console.log("Error", data);
      setResult(data.message);
    }
  };

  return (
    <div className='contact'>
      <div className="contact-col">
        <h3>Send us a message <img src={msg_icon} alt=""/></h3>
        <p className =" free">
          Feel free to reach out through the contact form or find our contact information
          below. Your feedback, questions, and suggestions are important to us as we strive 
          to provide exceptional services to our Elite Events.
        </p>
        <ul>
          <li><img src={mail_icon} alt=""/>Contact@EliteEvents</li>
          <li><img src={phone_icon} alt=""/>+91 900-043-5689</li>
          <li><img src={location_icon} alt=""/>77 Vaddeswaram, Guntur<br/>
          Andhra Pradesh</li>
        </ul>
      </div>
      <div className="contact-col">
        <form onSubmit={onSubmit}>
          <label>Your Name</label>
          <input type="text" name='name' placeholder='Enter your name' required/>
          <label>Phone Number</label>
          <input type="text" name='phone' placeholder='Enter your mobile number' required/>
          <label>Write your messages here</label>
          <textarea name="message" rows="6" placeholder='Enter Your message' required></textarea>
          <button type='submit' className='btn dark-btn'>Submit now </button>
        </form>
        <span>{result}</span>
      </div>
    </div>
  )
}

export default Contact