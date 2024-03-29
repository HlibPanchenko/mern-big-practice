import React from "react";
import "./PostCard.scss";
import { API_URL } from "../../config.js";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { Link } from "react-router-dom";
import { FcLike } from "react-icons/fc";
import { FaRegComment } from "react-icons/fa";
import { AiOutlineHeart } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { formatDate, isLessThanTwoDaysOld } from "../../../src/utils/date.util";
import axios from "axios";
import { updateUser } from "../../redux/slices/authSlice";
import { AiOutlineDelete } from "react-icons/ai";
import postService from "../../services/post.service";
import { deleteArchievedPost } from "../../redux/slices/postSlice";

export interface Author {
  _id: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  __v: number;
  likedposts: string[];
}

export interface ISubComment {
  _id: string;
  author: Author;
  repliedOnComment: IComment;
  text: string;
  date: string;
}

export interface IComment {
  _id: string;
  author: Author;
  post: string;
  text: string;
  date: string;
  subComments: ISubComment[];
}

interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  comments: IComment[];
  author: Author;
  createdAt: string;
  // likes: number
  likes: string[];
}

interface PostCardProps {
  post: PostData;
  quantity: "one" | "all";
}

const PostCard: React.FC<PostCardProps> = ({ post, quantity }) => {
  // console.log(post);

  const token = localStorage.getItem("token");
  const [likes, setLikes] = React.useState(post.likes.length);
  // const [isLikedByUser, setIsLikedByUser] = React.useState(false);
  // const [isViewed, setIsViewed] = React.useState(false);
  const { title, description, images, views, comments, author, _id } = post;
  const userInfo = useAppSelector((state) => state.auth);
  const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  //   const imagePost = ${API_URL + userInfo?.user?._id + "/" + path.basename(images[1])}`

  // React.useEffect(() => {
  //   // Send a request to update post views when the component mounts
  //   const viewPost = async () => {
  //     try {
  //       await axios.post(
  //         `http://localhost:4444/post/viewpost/${post._id}`,
  //         {},
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );

  //       setIsViewed(true);
  //     } catch (error) {
  //       console.log("ошибка просмотра поста", error);
  //     }
  //   };

  //   if (quantity === "one" && !isViewed && token) {
  //     // View the post only for individual posts and when the user is logged in
  //     viewPost();
  //   }
  // }, [post._id, token, quantity, isViewed]);

  const isFreshPost = isLessThanTwoDaysOld(post.createdAt);

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

      const { post: updatedPost } = response.data;
      setLikes(updatedPost.likes.length);
      // setIsLikedByUser(isLiked);
      // setPostInfo(response.data.post);
      dispatch(updateUser(response.data.user));
    } catch (error) {
      console.log("ошибка получения данных одного поста", error);
      // navigate("/");
    }
  }

  const archieveHandler = async (postId: string) => {
    try {
      const response = await postService.archivePostHandler(postId);
      console.log(response.data);

      dispatch(deleteArchievedPost(postId));
    } catch (error: any) {
      console.log(error);
    }
  };

  // Function to extract the filename from the file path
  const getFileNameFromPath = (filePath: string): string => {
    const parts = filePath.split("\\"); // Split by backslash to handle Windows file paths
    return parts[parts.length - 1];
  };

  const convertToLocalURL = (filePath: string): string => {
    // const fileName = getFileNameFromPath(filePath);
    // const folder = quantity === "all" ? post.author._id : userInfo?.user?._id;

    // return `${API_URL}/${folder}/${fileName}`;
    return `${API_URL}/${filePath}`;
  };

  const firstImage = images.length > 0 ? images[0] : null;

  const avatar = post.author.avatar
    ? `${API_URL + post.author._id + "/" + post.author.avatar}`
    : "/images/user.png";

  // Проверка, содержит ли массив likedposts строку post._id
  const isLiked = user?.likedposts.includes(post._id);

  const isUserAdmin = user?.roles.some((role) => role == "ADMIN");

  return (
    <div className="post-card-box">
      <Link className="linkCard" key={post._id} to={`/myprofile/${post._id}`}>
        <div className="post-card-box-content">
          <div className="post-card-box-content-left">
            <h1 className="post-card-title">{title}</h1>
            <p className="post-card-description">{description}</p>
          </div>
          <div className="post-card-box-content-right">
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
        <div className="infocard-authorblock">
          <div className="infocard-image">
            <img src={avatar} alt="Profile Icon" />
          </div>
          <div className="infocard-author">{post.author.name}</div>
          <div
            className="infocard-createdAt"
            style={{ color: isFreshPost ? "green" : "black" }}
          >
            {formatDate(post.createdAt)}
          </div>
        </div>

        <div className="infocard-icons">
          <div className="infocard-icon">
            <p>{likes} </p>
            {isLiked ? (
              <FcLike className="infocard-like" onClick={likePostHandler} />
            ) : (
              <AiOutlineHeart
                className="infocard-like"
                fill={isLiked ? "red" : "black"}
                onClick={likePostHandler}
              />
            )}
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
      {isUserAdmin && (
        <div
          className="post-card-delete"
          onClick={() => archieveHandler(post._id)}
        >
          <AiOutlineDelete post-card-delete_btn />
        </div>
      )}
    </div>
  );
};

export default PostCard;
