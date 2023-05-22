import React, { useState } from "react";
import "./Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSlice } from "../../redux/slices/authSlice";

const Navbar = () => {
  const isAuth = useSelector((state) => state.auth.isAuth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(logoutSlice());
    localStorage.removeItem("token");
    navigate("/registration");
  };

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
              <Link className="linkNav" to="/registration">
                Registration
              </Link>
            </li>
          )}
          {!isAuth && (
            <li className="navbar-menu-item">
              <Link className="linkNav" to="/login">
                Log in
              </Link>
            </li>
          )}
          {isAuth && (
            <li className="navbar-menu-item">
              {/* <Link to="/registration" onClick={() => logOutHandler}> */}
              <a className="linkNav" onClick={logOutHandler}>
                Log out
              </a>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
