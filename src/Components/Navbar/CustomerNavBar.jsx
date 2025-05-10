import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link as RouterLink } from 'react-router-dom';
import './CustomerNavbar.css';
import profile from '../../assets/profile.jpg.png';
import logo from '../../assets/logo1.png';
import { useAuth } from '../../contextapi/AuthContext';
import notificationIcon from '../../assets/notification.png';
export default function CustomerNavBar() {
  const { setIsCustomerLoggedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    setIsCustomerLoggedIn(false);
    navigate('/customerlogin');
  };

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const closeDropdown = () => {
    setDropdownOpen(false);
  };
 // Define the handleNotificationClick function
 const handleNotificationClick = () => {
  navigate('/notifications'); 
  // Add logic to handle notifications (e.g., open a dropdown or redirect)
};



  const navigateToSection = (section) => {
    if (location.pathname === '/customerhome') {
      const element = document.getElementById(section);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      navigate(`/customerhome#${section}`);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (location.pathname === '/customerhome') {
        const nav = document.querySelector('.customer-nav');
        if (window.scrollY > window.innerHeight - 100) {
          nav?.classList.add('customer-scrolled');
        } else {
          nav?.classList.remove('customer-scrolled');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);

    if (location.pathname === '/customerhome' && location.hash) {
      const id = location.hash.substring(1);
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [location]);

  return (
    <div className={`customer-nav ${location.pathname === '/customerhome' ? '' : 'customer-scrolled'}`}>
      <img src={logo} alt="Logo" className="main-logo" />
      <ul className="customer-nav-menu">
        <li>
          <span
            className="customer-nav-item customer-nav-home"
            style={{ cursor: 'pointer' }}
            onClick={() => {
              if (location.pathname === '/customerhome') {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              } else {
                navigate('/customerhome');
              }
            }}
          >
            Home
          </span>
        </li>

        {location.pathname === '/customerhome' && (
          <>
            <li><span onClick={() => navigateToSection('services')} className="customer-nav-item">Services</span></li>
            <li><span onClick={() => navigateToSection('about')} className="customer-nav-item">About</span></li>
            <li><span onClick={() => navigateToSection('gallery')} className="customer-nav-item">Gallery</span></li>
            <li><span onClick={() => navigateToSection('testimonials')} className="customer-nav-item">Testimonials</span></li>
            <li><span onClick={() => navigateToSection('contact')} className="customer-nav-item">Contact</span></li>
{/* Notification Icon */}
<img 
    src={notificationIcon} 
    alt="Notifications" 
    style={{ width: '30px', height: '30px', margin: '0 15px', cursor: 'pointer' }} 
    onClick={handleNotificationClick} 
  />
          </>
        )}

<div
  className="main-dropdown"
  onMouseEnter={() => setDropdownOpen(true)}
  onMouseLeave={() => setDropdownOpen(false)}
>
  

<img 
    src={profile} 
    alt="User Avatar" 
    style={{ width: '40px', height: '40px', borderRadius: '50%', cursor: 'pointer' }} 
  />

  {dropdownOpen && (
    <ul className="main-dropdown-menu1">
      <li><RouterLink to="/myprofile" onClick={closeDropdown}>My Profile</RouterLink></li>
      <li><RouterLink to="/myevents" onClick={closeDropdown}>My Events</RouterLink></li>
      
      <li><span onClick={handleLogout}>Logout</span></li>
    </ul>
  )}
</div>

      </ul>
    </div>
  );
}
