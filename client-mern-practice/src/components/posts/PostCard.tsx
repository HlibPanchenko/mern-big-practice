import React from "react";
import "../../page/createPost.scss";
import { API_URL } from "../../config.js";
import { useAppSelector } from "../../redux/hooks";

interface Post {
  _id: string;
  description: string;
  images: string[];
  title: string;
  views: number;
  comments: string[]; // Assuming each comment is a string for simplicity
  author: string;
}

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { title, description, images, views, comments, author } = post;
  const userInfo = useAppSelector((state) => state.auth);

  //   const imagePost = ${API_URL + userInfo?.user?._id + "/" + path.basename(images[1])}`

  // Function to extract the filename from the file path
  const getFileNameFromPath = (filePath: string): string => {
    const parts = filePath.split("\\"); // Split by backslash to handle Windows file paths
    return parts[parts.length - 1];
  };

  const convertToLocalURL = (filePath: string): string => {
    const fileName = getFileNameFromPath(filePath);
    const folder = userInfo?.user?._id;

    return `${API_URL}/${folder}/${fileName}`;
  };

  return (
    <div className="post-card-box">
      <div className="post-card-box-left">
        <h1 className="post-card-title">{title}</h1>
        <p>{description}</p>
      </div>
      <div className="post-card-box-right">

      {images.map((image) => (
        <img
          src={convertToLocalURL(image)}
          alt="Photo"
          className="post-card-image"
          key={image}
        />
      ))}
      </div>
    </div>
  );
};

export default PostCard;
