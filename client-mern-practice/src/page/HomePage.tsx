import React from "react";
import "./homepage.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";

const HomePage: React.FC = () => {
  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.auth.user);

  const getUserHandler = async (token: string | null) => {
    if (token) {
      try {
        const response = await axios.get("http://localhost:4444/auth/getuser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }
  };

  return (
    <div className="container-home ">
      <div>{`HomePage. Mail of user: ${user?.email}`}</div>
      <button onClick={() => getUserHandler(token)}>
        get information about current user
      </button>
    </div>
  );
};

export default HomePage;
