import { Routes, Route, Link } from 'react-router-dom';
import './admin.css';
import React from 'react'; 
import AdminHome from './AdminHome';
import AddManager from './AddManager';
import ViewManagers from './ViewManagers';
import ViewCustomers from './ViewCustomers';
import AdminLogin from './AdminLogin';
import logo from '../assets/logo1.png'
import { useAuth } from '../contextapi/AuthContext';

export default function AdminNavBar() 
{
  const { setIsAdminLoggedIn } = useAuth(); 

  const handleLogout = () => 
  {
    setIsAdminLoggedIn(false); 
  };

  return (
    <div>
      <nav className="navbar3">
      <div className="logo-title-container">
        <img src={logo} alt="Logo" className='logo' />
        <div className="title-admin">Welcome Admin!</div>
        </div>
        <ul className="nav-links">
          <li><Link to="/adminhome">Events</Link></li>
          <li><Link to="/viewmanagers">Event Managers</Link></li>
          <li><Link to="/viewallcustomers">Customers</Link></li>
          <li><Link to="/adminlogin" onClick={handleLogout}>Logout</Link></li>
        </ul>
      </nav>

    </div>
  );
}