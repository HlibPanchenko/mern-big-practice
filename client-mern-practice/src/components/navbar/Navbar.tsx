import React, { useEffect, useRef, useState } from "react";
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

  const [isOpen, setIsOpen] = React.useState(false);
  // Create a ref for the modal container
  const modalRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  Attach click event listener to the window
  useEffect(() => {
    const handleClickOutsideModal = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    window.addEventListener("click", handleClickOutsideModal);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener("click", handleClickOutsideModal);
    };
  }, []);

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
                  <Link className="linkNav" to="/collection">
                    Collection
                  </Link>
                </li>

                <li className="navbar-menu-item">
                  {/* <Link to="/registration" onClick={() => logOutHandler}> */}
                  <Link className="linkNav" to="/createpost">
                    <div className="linkNav">Create post</div>
                  </Link>
                </li>
                {/* <Link className="navbar-logo" to="/myprofile"> */}
                <div
                  // className={classNameModal}
                  ref={modalRef}
                  className="navbar-menu-profile"
                  onClick={() => {
                    setIsOpen(!isOpen);
                  }}
                >
                  <div className="navbar-menu-profile-name">{user?.name}</div>
                  <ProfileIcon size="small" />
                  <div
                    // className="navbar-menu-profile"
                    className={classNameModal}
                    // onClick={() => {
                    //   setIsOpen(!isOpen);
                    // }}
                  >
                    {/* <div className="profile-modal"> */}
                    <Link className="navbar-logo" to="/myaccount">
                      <div className="profile-modal-settings">
                        <div className="profile-modal-settings-image">
                          <img src="\images\user (1).png" alt="user-photo" />
                        </div>
                        <div className="profile-modal-settings-text">
                          settings
                        </div>
                      </div>
                    </Link>
                    <Link className="myprofile" to="/myprofile">
                      <div className="profile-modal-myprofile">
                        <div className="profile-modal-myprofile-image">
                          <img
                            src="\images\setting-lines.png"
                            alt="user-photo"
                          />
                        </div>
                        my profile
                      </div>
                    </Link>
                  </div>
                </div>
                {/* </Link> */}
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
