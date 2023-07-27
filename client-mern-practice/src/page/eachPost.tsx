import React from "react";
import "./eachPost.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from "react-responsive-carousel";
import { API_URL } from "../config";
import { Author } from "../components/posts/PostCard";
import MyComment from "../components/Comment";

// interface PostData {
//   _id: string;
//   author: string;
//   title: string;
//   description: string;
//   images: string[];
//   likes: number;
//   views: number;
//   comments: string[];
//   date: Date;
//   createdAt: Date;
//   updatedAt: Date;
// }

interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  comments: any[]; // You can provide a more specific type for comments if needed
  author: Author;
  createdAt: string;
  // likes: number
  likes: string[];
}
const EachPost: React.FC = () => {
  // const [postInfo, setPostInfo] = React.useState({})
  const [postInfo, setPostInfo] = React.useState<PostData | null>(null);
  const token = localStorage.getItem("token");
  const { postId } = useParams();
  // const user = useSelector((state) => state.auth.user);
  const user = useAppSelector((state) => state.auth.user);
  console.log(postId);

  // у нас есть id поста, надо делать запрос на получения этого одного поста
  // так же изменить модель поста чтобы в нем был полность объект юзер, а не только его id
  // в этом компоненте добавить возможность оставлять комментарии и лайки

  React.useEffect(() => {
    async function getOnePost() {
      try {
        const response = await axios.get(
          "http://localhost:4444/post/getonepost/" + postId,

          {
            headers: {
              // "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.post);
        setPostInfo(response.data.post);
      } catch (error) {
        console.log("ошибка получения данных одного поста", error);
        // navigate("/");
      }
    }
    getOnePost();
  }, [postId, token]);

  if (!postInfo) {
    return <div>Loading...</div>;
  }

  const getFileNameFromPath = (filePath: string): string => {
    const parts = filePath.split("\\"); // Split by backslash to handle Windows file paths
    return parts[parts.length - 1];
  };

  const convertToLocalURL = (filePath: string): string => {
    const fileName = getFileNameFromPath(filePath);
    const folder = postInfo.author._id;

    return `${API_URL}/${folder}/${fileName}`;
  };
  return (
    <div className="eachpost-container ">
      <div className="eachpost">
        <div className="eachpost-content">
          <div className="eachpost-imgblock">
            <Carousel>
              {postInfo.images.map((img) => (
                <div>
                  <img src={convertToLocalURL(img)} />
                  {/* <p className="legend">Legend 1</p> */}
                </div>
              ))}
            </Carousel>
          </div>
          <h1 className="eachpost-title">{postInfo.title}</h1>
          <div className="eachpost-description">{postInfo.description}</div>
        </div>
        <div className="eachpost-comments commentblock">
          <p className="commentblock-title">Comments</p>
          <div className="commentblock-commentlist">
            <div className="createcomment">
              <div className="createcomment-container">
                <div className="createcomment-author">
                  <img
                    src="/images/user.png"
                    width="40px"
                    height="40px"
                    alt=""
                  />
                </div>
                <div className="createcomment-input">
                  <input placeholder="Add a comment" type="text" />
                </div>
              </div>
            </div>
            <MyComment/>

            <div className="commentblock-card">Комментарий 1</div>
            <div className="commentblock-card">Комментарий 2</div>
            <div className="commentblock-card">Комментарий 3</div>
            <div className="commentblock-card">Комментарий 4</div>
            <div className="commentblock-card">Комментарий 5</div>
            <div className="commentblock-card">Комментарий 6</div>
            <div className="commentblock-card">Комментарий 7</div>
            <div className="commentblock-card">Комментарий 8</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachPost;
