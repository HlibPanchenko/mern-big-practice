import { createSlice, createAsyncThunk, PayloadAction  } from "@reduxjs/toolkit";
import axios from "axios";

const token = localStorage.getItem("token");
console.log(token);
//async action
export const fetchAuthMe = createAsyncThunk("auth/fetchAuthMe", async () => {
  const { data } = await axios.get("http://localhost:4444/auth/getuser", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return data;
});

interface User {
  password: string;
  email: string;
}

interface AuthState {
  isAuth: boolean;
  user: User | null;
}

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
    registerAction(state, action:PayloadAction<User>) {
      // console.log(action);
      state.isAuth = true;
      state.user = action.payload;
    },
    loginAction(state, action:PayloadAction<User>) {
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

export const { registerAction, loginAction, logoutSlice } = authSlice.actions;
export default authSlice.reducer;
