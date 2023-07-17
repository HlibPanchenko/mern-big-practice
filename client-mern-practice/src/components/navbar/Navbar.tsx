import React, { useState } from "react";
import "./Navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSlice } from "../../redux/slices/authSlice";
import { useAppSelector } from "../../redux/hooks";
import ProfileIcon from "./ProfileIcon";
import Account from "../../page/Account";

const Navbar: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const user = useAppSelector((state) => state.auth.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(logoutSlice());
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link className="navbar-logo" to="/">
            <img src="/images/logo-main.png" alt="" />
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
              <>
                <li className="navbar-menu-item">
                  {/* <Link to="/registration" onClick={() => logOutHandler}> */}
                  <a className="linkNav">Collections</a>
                </li>
                <li className="navbar-menu-item">
                  {/* <Link to="/registration" onClick={() => logOutHandler}> */}
                  <a className="linkNav">Create post</a>
                </li>
                <Link className="navbar-logo" to="/myprofile">
                  <div className="navbar-menu-profile">
                    <div className="navbar-menu-profile-name">{user?.name}</div>
                    <ProfileIcon size="small" />
                  </div>
                </Link>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
