import React, { useEffect, useState } from "react";
import "./Collection.scss";
import axios from "axios";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import PostCard, { Author } from "../components/posts/PostCard";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import {
  setCurrentPage,
  setSort,
  Sort,
  setSearch,
} from "../redux/slices/postFilterSlice";
import { fetchGetPosts } from "../redux/slices/postSlice";
import PostSkeleton from "../components/posts/PostSkeleton";
import { useDebouncedCallback } from "use-debounce";

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
  createdAt: string;
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
  const [isLoading, setIsLoading] = React.useState(true);
  const [postsAll, setpostsAll] = useState<PostData[]>([]);
  const [searchInputState, setSearchInputState] = useState("");
  const token = localStorage.getItem("token");
  const dispatch = useAppDispatch();
  const [activeSort, setActiveSort] = useState<Sort | null>(null);
  // console.log('Collection rerendered');

  const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
    // setPage(value);
    dispatch(setCurrentPage(value));
  };

  const sortBy = useAppSelector((state) => state.postFilter.sort);
  const currentPage = useAppSelector((state) => state.postFilter.currentPage);
  const searchInput = useAppSelector((state) => state.postFilter.searchInput);
  const posts = useAppSelector((state) => state.postSlice.post);
  const quantityOfPosts = useAppSelector((state) => state.postSlice.quantity);

  const quantityOfPages = Math.ceil(quantityOfPosts / 5);

  const debounced = useDebouncedCallback(
    // function
    (value) => {
      dispatch(setSearch(value));
    },
    // delay in ms
    1000
  );

  useEffect(() => {
    if (posts.length > 0) {
      setIsLoading(false);
    }
  }, [posts]);

  useEffect(() => {
    try {
      setIsLoading(true);

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
            sortBy,
            searchInput,
          })
        );
      }
    } catch (error) {
      console.log(
        "не смогли получить посты с бекенда с помощью редакса",
        error
      );
    }
  }, [currentPage, sortBy, searchInput]);

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

  const handleSort = (filter: Sort) => {
    dispatch(setCurrentPage(1));
    dispatch(setSort(filter));
    setActiveSort(filter);
  };

  const skeletonArr = [...Array(5)];

  return (
    <div className="collection">
      <div className="collection-container">
        <div className="collection-postlist allpostlist">
          {/* <h2 className="allpostlist-title">all posts</h2> */}
          <div className="allpostlist-sort ">
            <div className="allpostlist-sort-container">
              <div className="allpostlist-sort-buttons">
                <button
                  onClick={() => handleSort("date")}
                  className={activeSort === "date" ? "active-sortButton" : ""}
                >
                  Date ⇈
                </button>
                <button
                  onClick={() => handleSort("-date")}
                  className={activeSort === "-date" ? "active-sortButton" : ""}
                >
                  Date ⇊
                </button>
                <button
                  onClick={() => handleSort("popularity")}
                  className={
                    activeSort === "popularity" ? "active-sortButton" : ""
                  }
                >
                  Popularity ⇈
                </button>
                <button
                  onClick={() => handleSort("-popularity")}
                  className={
                    activeSort === "-popularity" ? "active-sortButton" : ""
                  }
                >
                  Popularity ⇊
                </button>
                <button
                  onClick={() => handleSort("comments")}
                  className={
                    activeSort === "comments" ? "active-sortButton" : ""
                  }
                >
                  Comments ⇈
                </button>
                <button
                  onClick={() => handleSort("-comments")}
                  className={
                    activeSort === "-comments" ? "active-sortButton" : ""
                  }
                >
                  Comments ⇊
                </button>
                <button
                  onClick={() => handleSort("visits")}
                  className={activeSort === "visits" ? "active-sortButton" : ""}
                >
                  Views ⇈
                </button>
                <button
                  onClick={() => handleSort("-visits")}
                  className={
                    activeSort === "-visits" ? "active-sortButton" : ""
                  }
                >
                  Views ⇊
                </button>
              </div>
              <div className="allpostlist-sort-search">
                <input
                  type="text"
                  placeholder="search a car"
                  value={searchInputState}
                  // value={searchInput}
                  onChange={(event) => {
                    debounced(event.target.value);
                    setSearchInputState(event.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="allpostlist-list post-card">
            {isLoading
              ? skeletonArr.map((_, index) => <PostSkeleton key={index} />)
              : posts.map((post) => (
                  <PostCard key={post._id} post={post} quantity="all" />
                ))}
          </div>
          <div className="paginationBlock">
            <Stack spacing={2}>
              <Pagination
                count={quantityOfPages}
                page={currentPage}
                onChange={handleChange}
              />
            </Stack>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
