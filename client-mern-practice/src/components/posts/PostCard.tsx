import React from "react";
import "./PostCard.scss";
import { API_URL } from "../../config.js";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
// import { BiCommentDots } from "react-icons/bi";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { formatDate } from "../../../src/utils/date.util";
import axios from "axios";
export interface Author {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  __v: number;
}

interface Post {
  _id: string;
  description: string;
  images: string[];
  title: string;
  views: number;
  comments: string[]; // Assuming each comment is a string for simplicity
  author: Author;
  createdAt: string;
  // likes: number;
  likes: string[];
}

// interface IQuantityOfUsers {
//   quantity: "one" | "all";
// }

interface PostCardProps {
  post: Post;
  // quantityUser: IQuantityOfUsers
  quantity: "one" | "all";
}

const PostCard: React.FC<PostCardProps> = ({ post, quantity }) => {
  const token = localStorage.getItem("token");
  const [likes, setLikes] = React.useState(post.likes.length);
  const [isLikedByUser, setIsLikedByUser] = React.useState(false);
  const { title, description, images, views, comments, author } = post;
  const userInfo = useAppSelector((state) => state.auth);
  console.log(post.author.avatar);

  //   const imagePost = ${API_URL + userInfo?.user?._id + "/" + path.basename(images[1])}`

  async function likePostHandler() {
    try {
      const response = await axios.post(
        `http://localhost:4444/post/likepost/${post._id}`,
        {},
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { isLiked, post: updatedPost } = response.data;
      setLikes(updatedPost.likes.length);
      setIsLikedByUser(isLiked);
      // setPostInfo(response.data.post);
    } catch (error) {
      console.log("ошибка получения данных одного поста", error);
      // navigate("/");
    }
  }

  // Function to extract the filename from the file path
  const getFileNameFromPath = (filePath: string): string => {
    const parts = filePath.split("\\"); // Split by backslash to handle Windows file paths
    return parts[parts.length - 1];
  };

  const convertToLocalURL = (filePath: string): string => {
    const fileName = getFileNameFromPath(filePath);
    const folder = quantity === "all" ? post.author._id : userInfo?.user?._id;

    return `${API_URL}/${folder}/${fileName}`;
  };

  const firstImage = images.length > 0 ? images[0] : null;

  const avatar = post.author.avatar
    ? `${API_URL + post.author._id + "/" + post.author.avatar}`
    : "/images/user.png";

  // const formatDate = (dateString: string): string => {
  //   const date = new Date(dateString);
  //   const day = date.getDate().toString().padStart(2, "0");
  //   const month = (date.getMonth() + 1).toString().padStart(2, "0"); // Months are zero-based
  //   const year = date.getFullYear();
  //   return `${day}.${month}.${year}`;
  // };

  return (
    <div className="post-card-box">
      <Link className="linkCard" key={post._id} to={`/myprofile/${post._id}`}>
        <div className="post-card-box-content">
          <div className="post-card-box-content-left">
            <h1 className="post-card-title">{title}</h1>
            <p className="post-card-description">{description}</p>
          </div>
          <div className="post-card-box-content-right">
            {/* {images.map((image) => (
        <img
          src={convertToLocalURL(image)}
          alt="Photo"
          className="post-card-image"
          key={image}
        />
      ))} */}
            {firstImage && (
              <img
                src={convertToLocalURL(firstImage)}
                alt="Photo"
                className="post-card-image"
                key={firstImage}
              />
            )}
          </div>
        </div>
      </Link>

      <div className="post-card-box-info infocard">
        {/* author: Maxim Kuchka.   Date: 25/02/2023. Likes: 0. Commets: 3. */}
        <div className="infocard-authorblock">
          <div className="infocard-image">
            <img src={avatar} alt="Profile Icon" />
          </div>
          <div className="infocard-author">{post.author.name}</div>
          <div className="infocard-createdAt">{formatDate(post.createdAt)}</div>
        </div>

        <div className="infocard-icons">
          <div className="infocard-icon">
            <p>{likes} </p>
            <AiOutlineHeart
              className="infocard-like"
              // color="black"
              fill={isLikedByUser ? "red" : "black"}
              color={isLikedByUser ? "red" : "black"}
              onClick={likePostHandler}
            />
          </div>
          <div className="infocard-icon">
            <p>{post.comments.length} </p>
            <FaRegComment className="infocard-comment" />
          </div>
          <div className="infocard-icon">
            <p>{post.views} </p>
            <GrView className="infocard-view" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
