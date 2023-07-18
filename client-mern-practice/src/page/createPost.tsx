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
          {/* <div className="create-area-box">Create post</div> */}
          <PostForm/>
        </div>
        <div className="createpost-postlist postlist">
          <div className="postlist-title">all your posts</div>
          <div className="postlist-list post-card">
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <PostCard />
            <div className="post-card-box">
              <h1 className="post-card-title">
                Вы пока не создали ни одного поста
              </h1>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
