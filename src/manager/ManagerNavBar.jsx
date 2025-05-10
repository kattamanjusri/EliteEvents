import { Routes, Route, Link } from 'react-router-dom';
import './manager.css';
import React from 'react'; 
import logo from '../assets/logo1.png'
import ManagerHome from './ManagerHome';
import ManagerProfile from './ManagerProfile';
import ManagerLogin from './ManagerLogin';
import { useAuth } from '../contextapi/AuthContext';

export default function ManagerNavBar() 
{
  const { setIsManagerLoggedIn } = useAuth(); 

  const handleLogout = () => 
 {
  setIsManagerLoggedIn(false);
  };

  return (
    <div>
      <nav className="navbar2">
       <div className="logo-title-container">
               <img src={logo} alt="Logo" className='logo' />
               <div className="title-admin">Welcome Manager!</div>
               </div>
        <ul className="nav-links">
          <li><Link to="/manager/managerhome">Events</Link></li>
          <li><Link to="/managerprofile">Profile</Link></li>
          <li><Link to="/report">Report</Link></li>
          <li><Link to="/managerlogin" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </nav>

      
    </div>
  );
}