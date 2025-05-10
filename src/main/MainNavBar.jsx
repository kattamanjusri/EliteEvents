import React,{ useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo1.png';
import './MainNavbar.css';

export default function MainNavBar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="main-navbar">
      <img src={logo} alt="Logo" className='main-logo' />

      <div className={`hamburger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>

      <ul className={`main-nav-links ${menuOpen ? 'active' : ''}`}>
        <li><Link to="/home" onClick={closeMenu}>Home</Link></li>
        <li><Link to="/about" onClick={closeMenu}>About</Link></li>
        <li className="main-dropdown">
          <span>Login ▾</span>
          <ul className="main-dropdown-menu">
            <li><Link to="/customerlogin" onClick={closeMenu}>Customer</Link></li>
            <li><Link to="/managerlogin" onClick={closeMenu}>Manager</Link></li>
            <li><Link to="/adminlogin" onClick={closeMenu}>Admin</Link></li>
          </ul>
        </li>
        <li><Link to="/contact" onClick={closeMenu}>Contact</Link></li>
      </ul>
    </nav>
  );
}
