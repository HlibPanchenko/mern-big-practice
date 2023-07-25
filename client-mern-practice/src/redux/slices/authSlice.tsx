import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";

interface User {
  password: string;
  name: string;
  email: string;
  __v: number;
  _id: string;
  avatar: string;
  likedposts:string[];
}

interface AuthState {
  isAuth: boolean;
  user: User | null;
}

//async action
// в generic передаем:
// 1) то, что ожидаем вернуть с этой функции - IcreateAsyncThunk
// 2) Первый параметр асинхронной функции - у нас undefined (потому что мы не передаем параметр)
// 3) AsyncThunkConfig
export const fetchAuthMe = createAsyncThunk<User, string>(
  "auth/fetchAuthMe",
  async (token) => {
    // const token = localStorage.getItem("token");
    const response: AxiosResponse<User> = await axios.get(
      "http://localhost:4444/auth/getuser",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return await response.data;
  }
);

const initialState: AuthState = {
  isAuth: false,
  user: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // в PayloadAction передаем тип для нашего action.payload.
    // у нас в action.payload попадает объект { email, password }
    registerAction(state, action: PayloadAction<User>) {
      // console.log(action);
      state.isAuth = true;
      state.user = action.payload;
    },
    loginAction(state, action: PayloadAction<User>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    setUser(state, action: PayloadAction<User>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    updateUser(state, action: PayloadAction<User>) {
      state.isAuth = true;
      state.user = action.payload;
    },
    logoutSlice(state) {
      state.isAuth = false;
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAuthMe.pending, (state) => {
      state.isAuth = false;
      state.user = null;
    });
    builder.addCase(fetchAuthMe.fulfilled, (state, action) => {
      state.isAuth = true;
      state.user = action.payload;
    });
    builder.addCase(fetchAuthMe.rejected, (state) => {
      state.isAuth = false;
      state.user = null;
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

export const { registerAction, loginAction, logoutSlice, setUser, updateUser } =
  authSlice.actions;
export default authSlice.reducer;
