import React from "react";
import "./Comment.scss";
import { IComment, PostData } from "../page/Collection";
import { API_URL } from "../config.js";
import { formatDate } from "../../src/utils/date.util";
import SubComment from "./SubComment";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";

interface PostComment {
  comment: IComment;
  updateEachPost: (post: PostData | null) => void;
}

const MyComment: React.FC<PostComment> = ({ comment, updateEachPost }) => {
  const [isSubOpen, setIsSubOpen] = React.useState(false);
  const [subText, setSubText] = React.useState("");
  const { author, text, date, _id, subComments } = comment;
  const token = localStorage.getItem("token");
  const isCommentEmpty = subText.trim() === "";
  const user = useAppSelector((state) => state.auth.user);
 
  console.log('comment перерисовался');


  const avatar = author.avatar
    ? `${API_URL + author._id + "/" + author.avatar}`
    : "/images/user.png";

  const subCommentHandler = () => {
    setIsSubOpen(!isSubOpen);
  };

  const openStyleSubComment = isSubOpen
    ? "commentpost-subcomment commentpost-subcomment_open subcomment"
    : "commentpost-subcomment subcomment";

  const handleSubTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSubText(event.target.value);
  };

  async function handleAddSubComment() {
    try {
      const response = await axios.post(
        `http://localhost:4444/post/subcomment/${_id}`,
        { text: subText },
        {
          headers: {
            // "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // записываем в состояние родителя - eachpost, чтобы он перерисовался и отправил запрос на сервер на получение обновленного поста
      updateEachPost(response.data.populatedPost)
      setSubText("");
    } catch (error) {
      console.log("ошибка создания подкомментария", error);
      // navigate("/");
    }
  }

  const currentUserAvatar = user?.avatar
    ? `${API_URL + user?._id + "/" + user.avatar}`
    : "/images/user.png";

  return (
    <div className="commentpost">
      <div className="commentpost-container">
        <div className="commentpost-image">
          <img src={avatar} alt="User photo" />
        </div>
        <div className="commentpost-content">
          <div className="commentpost-content-top">
            <div className="commentpost-authorname">{author.name}</div>
            <div className="commentpost-date">{formatDate(date)}</div>
          </div>
          <div className="commentpost-text">{text}</div>
          <div
            onClick={subCommentHandler}
            className="commentpost-content-bottom"
          >
            <p>Reply({subComments.length})</p>
          </div>
        </div>
      </div>
      <div className={openStyleSubComment}>
        <div className="subcomment-container">
          <div className="subcomment-create">
            <div className="subcomment-author">
              <div className="subcomment-authorImg">
                <img
                  src={currentUserAvatar}
                  // src="/images/user.png"
                  alt=""
                />
              </div>
            </div>
            <div className="subcomment-input">
              <input
                placeholder="Add a reply"
                type="text"
                value={subText}
                onChange={handleSubTextChange}
              />
            </div>
            <button
              className="subcomment-btn"
              onClick={handleAddSubComment}
              disabled={isCommentEmpty} // Disable the button when the comment is empty
            >
              Add
            </button>
          </div>
          <div className="subcomment-list">
            <h4 className="subcomment-title">Replies</h4>
            {subComments.map((sub) => (
              <SubComment key={sub._id} sub={sub}/>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComment;
