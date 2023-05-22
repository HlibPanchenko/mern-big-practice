import React from "react";
import styles from "./homepage.module.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

const HomePage = () => {
  const token = localStorage.getItem("token");
  const user = useSelector((state) => state.auth.user);

  const getUserHandler = async (token) => {
    const response = await axios.get("http://localhost:4444/auth/getuser", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log(response.data);
  };

  return (
    <div className={styles.container}>
      <div>{`HomePage. Mail of user: ${user?.email}`}</div>
      <button onClick={() => getUserHandler(token)}>
        get information about current user
      </button>
    </div>
  );
};

export default HomePage;
