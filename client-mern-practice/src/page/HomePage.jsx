import React from "react";
import styles from "./homepage.module.scss";
import axios from "axios";

const HomePage = () => {
  const token = localStorage.getItem("token");

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
      <div>HomePage</div>
      <button onClick={() => getUserHandler(token)}>
        get information about current user
      </button>
    </div>
  );
};

export default HomePage;
