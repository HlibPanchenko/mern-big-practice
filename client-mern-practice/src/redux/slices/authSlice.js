import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
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
    logout(state, action) {
      state.isAuth = false;
      state.user = {};
    },
  },
});

export const { registerAction, loginAction, logout } = authSlice.actions;
export default authSlice.reducer;
