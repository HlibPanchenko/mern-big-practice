import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios, { AxiosResponse } from "axios";
import $api from "../../http";

interface User {
  password: string;
  name: string;
  email: string;
  __v: number;
  _id: string;
  avatar: string;
  likedposts: string[];
  roles: string[];
}

interface userState {
  users: User[] | null;
}

//async action
// в generic передаем:
// 1) то, что ожидаем вернуть с этой функции - IcreateAsyncThunk
// 2) Первый параметр асинхронной функции - у нас undefined (потому что мы не передаем параметр)
// 3) AsyncThunkConfig

export const getAllUsers = createAsyncThunk<User[], string>(
  "auth/getAllUsers",
  async (token) => {
    // const token = localStorage.getItem("token");
    const response: AxiosResponse<User[]> = await $api.get(
      "/auth/getallusers"
    // const response: AxiosResponse<User[]> = await axios.get(
    //   "http://localhost:4444/auth/getallusers",
      // {
      //   headers: {
      //     Authorization: `Bearer ${token}`,
      //   },
      // }
    );

    return await response.data;
    // return await [response.data];
  }
);

const initialState: userState = {
  users: null,
};

const usersSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // в PayloadAction передаем тип для нашего action.payload.
    // у нас в action.payload попадает объект { email, password }
    // registerAction(state, action: PayloadAction<User>) {
    //   // console.log(action);
    //   state.users = action.payload;
    // },
    // loginAction(state, action: PayloadAction<User>) {
    //   state.users = action.payload;
    // },
    setUsers(state, action: PayloadAction<User[]>) {
      state.users = action.payload;
    },
    // updateUser(state, action: PayloadAction<User>) {
    //   state.users = action.payload;
    // },
    // logoutSlice(state) {
    //   state.users = null;
    // },
  },
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.users = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.users = action.payload;
    });
    builder.addCase(getAllUsers.rejected, (state) => {
      state.users = null;
    });
  },
});

export const { setUsers } = usersSlice.actions;
export default usersSlice.reducer;
