
import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar fixed-bottom navbar-light bg-light">
      <div className="container-fluid justify-content-around">
        <NavLink to="/" className="nav-link">Events</NavLink>
        <NavLink to="/my-events" className="nav-link">My Events</NavLink>
        <NavLink to="/profile" className="nav-link">Profile</NavLink>
      </div>
    </nav>
  );
}

export default Navbar;
