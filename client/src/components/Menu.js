import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './static/css/Menu.css';

const Menu = () => {
    const [menuOpen, setMenuOpen] = useState(false);
  
    return (
      <nav className="menuComponent">
        <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
          &#9776; 
        </div>
        <ul className={menuOpen ? 'active' : ''}>
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            <li><Link to="/apartments" onClick={() => setMenuOpen(false)}>Our apartments</Link></li>
            <li><Link to="/guides" onClick={() => setMenuOpen(false)}>Our guides</Link></li>
        </ul>
      </nav>
    );
}

export default Menu;
