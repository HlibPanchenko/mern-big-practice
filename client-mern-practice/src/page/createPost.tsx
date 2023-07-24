import React from "react";
import "./createPost.scss";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import PostCard from "../components/posts/PostCard";
import PostForm from "../components/posts/PostForm";

const CreatePost: React.FC = () => {
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
    <div className="createpost">
      <div className="createpost-container">
        <div className="createpost-create create-area">
          <PostForm />
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
