import React from "react";
import "./account.scss";
import { API_URL } from "../config.js";

import { useAppSelector } from "../redux/hooks";
import { useDispatch } from "react-redux";
import { logoutSlice, setUser } from "../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ProfileIcon from "../components/navbar/ProfileIcon";

const Account = () => {
  const userInfo = useAppSelector((state) => state.auth.user);

  const [isEdit, setIsEdit] = React.useState(false);
  // const [editName, setEditName] = React.useState(userInfo?.name);
  const [editName, setEditName] = React.useState<string>("");

  console.log(userInfo);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logOutHandler = () => {
    dispatch(logoutSlice());
    localStorage.removeItem("token");
    navigate("/login");
  };

  const avatar = userInfo?.avatar
    ? `${API_URL + userInfo?._id + "/" + userInfo.avatar}`
    : "/images/user.png";

  // функция отправки данных на сервер
  const editHandler = async (newName: string) => {
    try {
      const token = localStorage.getItem("token");

      // if (userInfo) {
      //   const updatedUser = { ...userInfo, name: newName };
      //   console.log(updatedUser);
      //   dispatch(setUser(updatedUser));
      // }

      if (userInfo) {
        const updatedUser = { ...userInfo, name: newName };
        console.log(updatedUser);

        const response = await axios.post(
          "http://localhost:4444/auth/updateuser",
          updatedUser,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response);
        const { email, password, name, _id, avatar, __v, likedposts, roles } = response.data;
        const user = { email, password, name, avatar, _id, __v, likedposts, roles };
        dispatch(setUser(user));

        setIsEdit(false);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  const handleChangings = (newName: string) => {
    console.log(newName);
    if (userInfo) {
      const updatedUser = { ...userInfo, name: newName };
      console.log(updatedUser);
      dispatch(setUser(updatedUser));
    }

    setIsEdit(false);
  };

  return (
    <div className="container__account">
      <div className="profile">
        <div className="avatar">
          {/* <img src={avatar} alt="User Avatar" /> */}
          <ProfileIcon size="large"/>
        </div>
        <div className="info">
          <div className="field">
            <label>Login:</label>
            <span>{userInfo?.email}</span>
            {/* {isEdit ? <input type="text" value={userInfo?.email}/> : <span>{userInfo?.email}</span> } */}
          </div>
          <div className="field">
            <label>Name:</label>
            {isEdit ? (
              <input
                type="text"
                value={editName}
                onChange={(e) => {
                  setEditName(e.target.value);
                }}
              />
            ) : (
              <span>{userInfo?.name}</span>
            )}

            {/* <span>{userInfo?.name}</span> */}
          </div>
        </div>

        <div className="actions">
          {isEdit ? (
            <button
              data-btn-numb="change"
              onClick={() => editHandler(editName || "No name")}
            >
              Save
            </button>
          ) : (
            <button data-btn-numb="change" onClick={() => setIsEdit(true)}>
              Edit Personal Data
            </button>
          )}

          <button data-btn-numb="logout" onClick={logOutHandler}>
            Log out
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
