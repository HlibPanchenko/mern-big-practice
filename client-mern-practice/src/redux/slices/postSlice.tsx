import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import { PostData } from "../../page/Collection";

interface PostState {
  // isAuth: boolean;
  post: PostData[];
}

type FetchPostsArgs = {
  currentPage: string;
  token: string;
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
    const { token, currentPage } = props;
    const { data } = await axios.get<responsePosts>(
      `http://localhost:4444/post/getallposts?page=${currentPage}&limit=5`,
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
  post: [],
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    // // в PayloadAction передаем тип для нашего action.payload.
    // // у нас в action.payload попадает объект { email, password }
    // registerAction(state, action: PayloadAction<PostData>) {
    //   // console.log(action);
    //   // state.isAuth = true;
    //   state.post = action.payload;
    // },
    // loginAction(state, action: PayloadAction<PostData>) {
    //   // state.isAuth = true;
    //   state.post = action.payload;
    // },
    // setUser(state, action: PayloadAction<PostData>) {
    //   // state.isAuth = true;
    //   state.post = action.payload;
    // },
    // updateUser(state, action: PayloadAction<PostData>) {
    //   // state.isAuth = true;
    //   state.post = action.payload;
    // },
    // logoutSlice(state) {
    //   // state.isAuth = false;
    //   state.post = null;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchGetPosts.pending, (state) => {
      // state.isAuth = false;
      state.post = [];
    });
    builder.addCase(fetchGetPosts.fulfilled, (state, action) => {
      // state.isAuth = true;
      state.post = action.payload.posts;
    });
    builder.addCase(fetchGetPosts.rejected, (state) => {
      // state.isAuth = false;
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

// export const { registerAction, loginAction, logoutSlice, setUser, updateUser } =
//   authSlice.actions;
export default postSlice.reducer;
