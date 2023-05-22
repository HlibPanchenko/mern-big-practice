import { createSlice } from "@reduxjs/toolkit";


const initialState = {
  isAuth: localStorage.getItem("token") ? true : false,
  user: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    //  register(state, action) {
    registerAction(state, action) {
      // console.log(action);
      state.isAuth = true;
      state.user = action.payload;
    },
    loginAction(state, action) {
      state.isAuth = true;
      state.user = action.payload;
    },
    logoutSlice(state) {
      state.isAuth = false;
      state.user = {};
    },
  },
});

export const { registerAction, loginAction, logoutSlice } = authSlice.actions;
export default authSlice.reducer;
