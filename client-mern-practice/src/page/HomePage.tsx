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
    <div className="container-home welcomepage">
      {/* <div>{`HomePage. Mail of user: ${user?.email}`}</div>
      <button onClick={() => getUserHandler(token)}>
        get information about current user
      </button> */}
      <div className="welcomepage-box">
        <h1 className="welcomepage-title">Welcome to <span> theCarFromStreet</span> :</h1>
        <h2 className="welcomepage-subtitle">
          Your Ultimate Car Enthusiast Community!
        </h2>
        <div className="welcomepage-content">
          <div className="welcomepage-text"> At theCarFromStreet, we celebrate the art of automotive discovery.
            Our platform is your gateway to a vibrant world of automotive
            passion, where enthusiasts like you capture the beauty and
            excitement of cars encountered on the streets. Whether it's a sleek
            sports car, a vintage gem, or an eye-catching luxury ride, every
            vehicle has a story to tell. <br /> <br /> 📸 Capture: Snap photos of the
            captivating cars you spot during your daily adventures.<br /> <br /> 🚗
            Create: Turn your snapshots into captivating posts, sharing your
            passion and insights with the global community.<br /> <br /> ❤️ Engage:
            Connect with fellow car aficionados by liking, commenting, and
            sharing your thoughts on their posts. <br /> <br /> 🌟 Discover: Immerse
            yourself in an ever-growing collection of car stories, each one a
            window into the diverse and dynamic automotive world. Join us in
            celebrating the cars that turn heads, spark conversations, and
            ignite a shared love for all things automotive. Whether you're a
            casual admirer or a dedicated gearhead, CarSpotter is your place to
            explore, connect, and fuel your passion for cars. Start your journey
            today and let the roads lead you to endless automotive inspiration!"</div>
          <div className="welcomepage-imgblock">
          <img src="/images/welcomeImg.png" alt="welcome-image" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
