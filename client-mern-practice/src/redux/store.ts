import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import postFilterSlice from "./slices/postFilterSlice";
import postSlice from "./slices/postSlice";
import usersSlice from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    postFilter: postFilterSlice,
    postSlice,
    usersSlice
  },
});
// эти 2 типа будем использовать чтобы типиизировать useSelector и useDispatch
// Определите тип для состояния вашего приложения (store выше)
export type RootState = ReturnType<typeof store.getState>;

// Определите тип для диспетчера приложения
export type AppDispatch = typeof store.dispatch;
