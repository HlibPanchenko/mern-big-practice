import React from "react";
import "./homepage.scss";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";

interface PostData {
  _id: string;
  author: string;
  title: string;
  description: string;
  images: string[];
  likes: number;
  views: number;
  comments: string[];
  date: Date;
  createdAt: Date;
  updatedAt: Date;
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

        console.log(response);
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

  return (
    <div className="container-home ">
      <div className="cardOfwholePost">
        <h1 className="cardOfwholePost-title">{postInfo.title}</h1>
      </div>
    </div>
  );
};

export default EachPost;
