import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { PostData, IComment } from "../../page/Collection";

interface PostState {
  // isAuth: boolean;
  post: PostData[];
  quantity: number;
}
// Добавить в PostState quantity?????
//  builder.addCase(fetchGetPosts.fulfilled, (state, action) => {
// state.quantity = action.payload.quantity;
//   state.post = action.payload.posts;
// });

type FetchPostsArgs = {
  currentPage: string;
  token: string;
  sortBy: string;
};

type responsePosts = {
  posts: PostData[];
  quantity: number;
};

//async action
// в generic передаем:
// 1) то, что ожидаем вернуть с этой функции - IcreateAsyncThunk
// 2) Первый параметр асинхронной функции - у нас undefined (потому что мы не передаем параметр)
// 3) AsyncThunkConfig
// export const fetchGetPosts = createAsyncThunk<PostData, string>(
export const fetchGetPosts = createAsyncThunk(
  "post/fetchGetPosts",
  async (props: FetchPostsArgs) => {
    // const token = localStorage.getItem("token");
    const { token, currentPage, sortBy } = props;
    const { data } = await axios.get<responsePosts>(
      `http://localhost:4444/post/getallposts?page=${currentPage}&limit=5&sortBy=${sortBy}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await data;
  }
);

const initialState: PostState = {
  // isAuth: false,
  quantity: 0,
  post: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // // в PayloadAction передаем тип для нашего action.payload.
    // // у нас в action.payload попадает объект { email, password }
    // updateComment(state, action: PayloadAction<PostData[]>) {
    //   state.post = action.payload;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetPosts.pending, (state) => {
      state.quantity = 0;
      state.post = [];
    });
    builder.addCase(fetchGetPosts.fulfilled, (state, action) => {
      state.quantity = action.payload.quantity;
      state.post = action.payload.posts;
    });
    builder.addCase(fetchGetPosts.rejected, (state) => {
      state.quantity = 0;
      state.post = [];
    });
  },

  // [fetchAuthMe.pending]: (state) => {
  //   state.isAuth = false;
  //   state.user = null;
  // },
  // [fetchAuthMe.fulfilled]: (state, action) => {
  //   state.isAuth = true;
  //   state.user = action.payload;
  // },
  // [fetchAuthMe.rejected]: (state) => {
  //   state.isAuth = false;
  //   state.user = null;
  // },
});

// export const { updateComment } = postSlice.actions;
export default postSlice.reducer;
