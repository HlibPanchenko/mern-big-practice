import React, { useState } from "react";
import "./Navbar.scss";

const Navbar = () => {
  //   const [isOpen, setIsOpen] = useState(false);

  //   const toggleMenu = () => {
  //     setIsOpen(!isOpen);
  //   };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <a className="navbar-logo" href="/">
          Logo
        </a>
      </div>
      <div className="navbar-menu">
        <ul className="navbar-menu-list">
          <li className="navbar-menu-item">
            <a href="/">Registration</a>
          </li>
          <li className="navbar-menu-item">
            <a href="/">Log in</a>
          </li>
          <li className="navbar-menu-item">
            <a href="/">Log out</a>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
