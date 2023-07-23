import React, { useEffect, useState } from "react";
import "./myProfile.scss";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import PostCard, { Author } from "../components/posts/PostCard";
import { Link } from "react-router-dom";

interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  comments: any[]; // You can provide a more specific type for comments if needed
  author: Author;
}

const MyProfile: React.FC = () => {
  const [postsOfAuthor, setpostsOfAuthor] = useState<PostData[]>([]);
  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchPostsOfAuthor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4444/post/getallauthorposts",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setpostsOfAuthor(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsOfAuthor();
  }, [token]);

  return (
    <div className="myprofile">
      <div className="myprofile-container">
        <div className="myprofile-postlist postlist">
          <h2 className="postlist-title">all your posts</h2>
          <div className="postlist-list post-card">
            {postsOfAuthor.map((post) => (
              // <PostCard key={post._id} post={post} />
              // <Link key={post._id} to={`/myprofile/${post._id}`}>
                <PostCard post={post} quantity="one" />
              // </Link>
            ))}
            {postsOfAuthor.length === 0 && (
              <div className="post-card-box">
                <h1 className="post-card-title">
                  Вы пока не создали ни одного поста
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
