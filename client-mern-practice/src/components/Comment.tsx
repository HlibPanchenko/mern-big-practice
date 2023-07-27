import React from "react";
import "./Comment.scss";
import { IComment } from "../page/eachPost";
import { API_URL } from "../config.js";
import { formatDate } from "../../src/utils/date.util";

interface PostComment {
  comment: IComment;
}

const MyComment: React.FC<PostComment> = (comment) => {
  // console.log(comment);
  const { author, text, date } = comment.comment;

  const avatar = author.avatar
    ? `${API_URL + author._id + "/" + author.avatar}`
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
          <div onClick={()=>console.log('reply(0)')} className="commentpost-content-bottom">
           <p>Reply(0)</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyComment;
