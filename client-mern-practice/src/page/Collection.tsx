import React, { useEffect, useState } from "react";
import "./Collection.scss";
import axios from "axios";
import { useAppSelector } from "../redux/hooks";
import PostCard, { Author } from "../components/posts/PostCard";
import { Link } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";

interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  comments: any[]; // You can provide a more specific type for comments if needed
  author: Author;
}




const Collection: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [postsAll, setpostsAll] = useState<PostData[]>([]);
  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.auth.user);

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  useEffect(() => {
    const fetchPostsOfAuthor = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4444/post/getallposts?page=${page}&limit=5",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setpostsAll(response.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    fetchPostsOfAuthor();
  }, [token]);

  return (
    <div className="collection">
      <div className="collection-container">
        <div className="collection-postlist allpostlist">
          <h2 className="allpostlist-title">all posts</h2>
          <div className="allpostlist-list post-card">
            {postsAll.map((post) => (
              // <PostCard key={post._id} post={post} />
              // <Link className="linkCard" key={post._id} to={`/myprofile/${post._id}`}>
                <PostCard post={post} quantity="all" />
              // </Link>
            ))}
            {postsAll.length === 0 && (
              <div className="post-card-box">
                <h1 className="post-card-title">
                  Вы пока не создали ни одного поста
                </h1>
              </div>
            )}
          </div>
          <div className="paginationBlock">
            <Stack spacing={2}>
              {/* <Typography>Page: {page}</Typography> */}
              <Pagination count={10} page={page} onChange={handleChange} />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
