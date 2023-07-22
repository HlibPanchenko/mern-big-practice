import React, { useState } from "react";
import "./Footer.scss";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutSlice } from "../../redux/slices/authSlice";
import { useAppSelector } from "../../redux/hooks";
import ProfileIcon from "../navbar/ProfileIcon";
import Account from "../../page/Account";

const Footer: React.FC = () => {
  const isAuth = useAppSelector((state) => state.auth.isAuth);
  const user = useAppSelector((state) => state.auth.user);

  const [isOpen, setIsOpen] = React.useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(logoutSlice());
    localStorage.removeItem("token");
    navigate("/login");
  };

  // open modal
  const classNameModal = isOpen
    ? "profile-modal profile-modal__open"
    : "profile-modal";

  return (
    <nav className="footer">
      <div className="footer-container">Foooooooter</div>
    </nav>
  );
};

export default Footer;
