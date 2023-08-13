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
import { PostData } from "./Collection";

const EachPost: React.FC = () => {
  const [postInfo, setPostInfo] = React.useState<PostData | null>(null);
  const [comment, setComment] = React.useState(""); // controlled input
  const isCommentEmpty = comment.trim() === "";
  const token = localStorage.getItem("token");
  const { postId } = useParams();
  const user = useAppSelector((state) => state.auth.user);

  console.log(postInfo);

  console.log("eachpost перерисовался");

  // Чтобы когда добавляем ответ на комментарий, перерисовывался eachpost и отправлял запрос на получение обновленного комментария
  const updateEachPost = (post: PostData | null) => {
    setPostInfo(post);
  };

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

  async function handleAddComment() {
    try {
      const response = await axios.post(
        `http://localhost:4444/post/comment/${postId}`,
        { text: comment },
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response.data.post);
      setComment("");
      setPostInfo(response.data.post);
    } catch (error) {
      console.log("ошибка создания комментария", error);
      // navigate("/");
    }
  }

  const getFileNameFromPath = (filePath: string): string => {
    const parts = filePath.split("\\"); // Split by backslash to handle Windows file paths
    return parts[parts.length - 1];
  };

  const convertToLocalURL = (filePath: string): string => {
    // const fileName = getFileNameFromPath(filePath);
    // const folder = postInfo.author._id;

    return `${API_URL}/${filePath}`;
    // return `${API_URL}/${folder}/${fileName}`;
  };

  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value);
  };

  const currentUserAvatar = user?.avatar
    ? `${API_URL + user?._id + "/" + user.avatar}`
    : "/images/user.png";

  return (
    <div className="eachpost-container ">
      <div className="eachpost">
        <div className="eachpost-content">
          <div className="eachpost-imgblock">
            <Carousel>
              {postInfo.images.map((img) => (
                <div>
                  <img src={convertToLocalURL(img)} />
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
                  <div className="createcomment-authorImg">
                    <img
                      src={currentUserAvatar}
                      // src="/images/user.png"
                      alt="user photo"
                    />
                  </div>
                </div>
                <div className="createcomment-input">
                  <input
                    placeholder="Add a comment"
                    type="text"
                    value={comment}
                    onChange={handleCommentChange}
                  />
                </div>
                <button
                  onClick={handleAddComment}
                  disabled={isCommentEmpty} // Disable the button when the comment is empty
                >
                  Add
                </button>
              </div>
            </div>
            {postInfo.comments
              .slice() // Create a copy of the comments array
              .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
              .map((comment) => (
                <MyComment
                  key={comment._id}
                  comment={comment}
                  updateEachPost={updateEachPost}
                />
              ))}
            {/* {postInfo.comments.map((comment) => <MyComment key={comment._id} comment={comment.text} />)} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EachPost;
