import React from "react";
import "./Comment.scss";

const MyComment: React.FC = () => {
  return (
    <div className="commentpost">
      <div className="commentpost-container">
        <div className="commentpost-author">
          <img src="/images/user.png" width="40px" height="40px" alt="" />
        </div>
        <div className="commentpost-text">
         Очень хорошая машина. Класс!!
        </div>
      </div>
    </div>
  );
};

export default MyComment;
