import React from "react";
import "./PostCard.scss";
import { API_URL } from "../../config.js";
import { useAppSelector } from "../../redux/hooks";
import { Link } from "react-router-dom";

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
  const { title, description, images, views, comments, author } = post;
  const userInfo = useAppSelector((state) => state.auth);
  console.log(post.author.avatar);

  //   const imagePost = ${API_URL + userInfo?.user?._id + "/" + path.basename(images[1])}`

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
        <div className="post-card-box-info infocard">
          {/* author: Maxim Kuchka.   Date: 25/02/2023. Likes: 0. Commets: 3. */}
          <div className="infocard-image">
            <img src={avatar} alt="Profile Icon" />
          </div>
          <div className="infocard-author">
            {post.author.name}
          </div>
        </div>
      </Link>
    </div>
  );
};

export default PostCard;
