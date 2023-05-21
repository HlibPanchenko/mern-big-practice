import React, { useState } from "react";
import "./Navbar.scss";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

const Navbar = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link className="navbar-logo" to="/">
          Logo
        </Link>
      </div>
      <div className="navbar-menu">
        <ul className="navbar-menu-list">
          {!isAuth && (
            <li className="navbar-menu-item">
              <Link to="/registration">Registration</Link>
            </li>
          )}
          {!isAuth && (
            <li className="navbar-menu-item">
              <Link to="/login">Log in</Link>
            </li>
          )}
          <li className="navbar-menu-item">
            <Link to="/registration">Log out</Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
