import React, { useEffect, useState } from "react";
import "./Collection.scss";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import PostCard, { Author } from "../components/posts/PostCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { setCurrentPage } from "../redux/slices/postFilterSlice";
import { fetchGetPosts } from "../redux/slices/postSlice";

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

export interface PostData {
  _id: string;
  title: string;
  description: string;
  images: string[];
  views: number;
  comments: IComment[];
  author: Author;
  createdAt: string;
  likes: string[];
}

const Collection: React.FC = () => {
  const [page, setPage] = React.useState(1);
  const [quantityOfPages, setQuantityOfPages] = React.useState(1);
  const [postsAll, setpostsAll] = useState<PostData[]>([]);
  const token = localStorage.getItem("token");
  // const user = useSelector((state) => state.auth.user);
  // const user = useAppSelector((state) => state.auth.user);
  const dispatch = useAppDispatch();

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
    dispatch(setCurrentPage(value));
  };

  const currentPage = useAppSelector((state) => state.postFilter.currentPage);
  const posts = useAppSelector((state) => state.postSlice.post);
  console.log(posts);

  // const quantityOfPages = Math.ceil(postsAll.length / 5);
  console.log(currentPage);

  useEffect(() => {
    try {
      // const res = await axios.get(
      //   `https://64143c5f600d6c8387442d10.mockapi.io/items?page=${currentPage}&limit=4&${category}&sortBy=${sortBy}&order=${order}${search}`
      // );
      // dispatch(setItems(res.data));
      // выще мы говорили: "дай данные и отправь их в редакс"
      // теперь мы сразу получаем данные и сохраняем ихimage.png
      if (token) {
        dispatch(
          fetchGetPosts({
            token,
            currentPage: String(currentPage),
          })
        );
      }
    } catch (error) {
      console.log(
        "не смогли получить посты с бекенда с помощью редакса",
        error
      );
    }
  }, [currentPage]);

  // useEffect(() => {
  //   const fetchPostsOfAuthor = async () => {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:4444/post/getallposts?page=${page}&limit=5`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${token}`,
  //           },
  //         }
  //       );
  //       setpostsAll(response.data.posts);
  //       setQuantityOfPages(Math.ceil(response.data.quantity / 5));
  //     } catch (error) {
  //       console.error("Error fetching posts:", error);
  //     }
  //   };

  //   fetchPostsOfAuthor();
  // }, [token, page]);

  // const onChangePage = (number: number) => {
  //   dispatch(setCurrentPage(number));
  // };

  return (
    <div className="collection">
      <div className="collection-container">
        <div className="collection-postlist allpostlist">
          <h2 className="allpostlist-title">all posts</h2>
          <div className="allpostlist-sort">Блок сортировки</div>
          <div className="allpostlist-list post-card">
            {/* {postsAll.map((post) => (
              // <PostCard key={post._id} post={post} />
              // <Link className="linkCard" key={post._id} to={`/myprofile/${post._id}`}>
              <PostCard key={post._id} post={post} quantity="all" />
              // </Link>
            ))} */}
            {posts.map((post) => (<PostCard key={post._id} post={post} quantity="all" />
            ))}
            {postsAll.length === 0 && (
              <div className="post-card-box">
                <h1 className="post-card-title">
                  Вы пока не создали ни одного поста
                </h1>
              </div>
            )}
          </div>
          <div className="paginationBlock">
            <Stack spacing={2}>
              {/* <Typography>Page: {page}</Typography> */}
              <Pagination
                // count={10}
                count={quantityOfPages}
                page={page}
                // page={currentPage}
                onChange={handleChange}
                // onChange={() => onChangePage(currentPage)}
              />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
