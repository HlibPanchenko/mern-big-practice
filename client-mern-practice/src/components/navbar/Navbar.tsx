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
  const [isAdmin, setIsAdmin] = React.useState(false);
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

  // function isUserAdmin() {
  //   if (user?.roles.some((role) => role == "ADMIN")) {
  //     setIsAdmin(true);
  //   }
  // }
  // console.log(user);

  const isUserAdmin = user?.roles.some((role) => role == "ADMIN");

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <Link className="navbar-logo" to="/">
            <img src="/images/logoAI2.png" alt="" />
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
            {user?.isActivated && 
            <> 
            {isAuth && (
              <>
                <li className="navbar-menu-item">
                  <Link className="linkNav" to="/collection">
                    Collection
                  </Link>
                </li>
                <li className="navbar-menu-item">
                  <Link className="linkNav" to="/recognition">
                    RecognitionAi
                  </Link>
                </li>

                <li className="navbar-menu-item">
                  <Link className="linkNav" to="/createpost">
                    Create post
                  </Link>
                </li>
                {isUserAdmin && (
                  <li className="navbar-menu-item">
                    <Link className="linkNav" to="/administration">
                      Admin
                    </Link>
                  </li>
                )}
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
                  <div className={classNameModal}>
                    <div className="profile-modal-settings">
                      <Link className="navbar-logo" to="/myaccount">
                        <div className="profile-modal-settings-image">
                          <img src="\images\user (1).png" alt="user-photo" />
                        </div>
                        <div className="profile-modal-settings-text">
                          <p>Settings</p>
                        </div>
                      </Link>
                    </div>
                    <div className="profile-modal-myprofile">
                      <Link className="myprofile" to="/myprofile">
                        <div className="profile-modal-myprofile-image">
                          <img
                            src="\images\setting-lines.png"
                            alt="user-photo"
                          />
                        </div>
                        <p>Account</p>
                      </Link>
                    </div>
                  </div>
                </div>
                {/* </Link> */}
              </>
            )}
            </>
            }
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
