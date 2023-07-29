import React from "react";
import "./Comment.scss";
import { ISubComment } from "../page/Collection";
import { API_URL } from "../config.js";
import { formatDate } from "../utils/date.util";

interface PostSubComment {
  sub: ISubComment;
}

const SubComment: React.FC<PostSubComment>= (sub) => {
  const { author, repliedOnComment, text, date } = sub.sub
  // console.log(sub);  
console.log(author);

  const avatar = author.avatar
    ? `${API_URL + author._id + "/" + author.avatar}`
    : "/images/user.png";

    return (
    <div className="subcomment-card cardSubComment">
    <div className="cardSubComment-container">
      <div className="cardSubComment-image">
        {/* <img src="/images/user.png" alt="User photo" /> */}
        <img src={avatar} alt="User photo" />
      </div>
      <div className="cardSubComment-content">
      <div className="cardSubComment-content-bottom">
          <p>Replied to <span>{repliedOnComment.author.name}</span></p>
        </div>
        <div className="cardSubComment-content-top">
          <div className="cardSubComment-authorname">
            {author.name}
            {/* User name */}
          </div>
          <div className="cardSubComment-date">
            {formatDate(date)}
          </div>
        </div>
        <div className="cardSubComment-text">
          {text}
          </div>
        
      </div>
    </div>
  </div>
  )
};

export default SubComment;
