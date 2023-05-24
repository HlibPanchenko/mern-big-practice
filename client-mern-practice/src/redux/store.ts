import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
// эти 2 типа будем использовать чтобы типиизировать useSelector и useDispatch
// Определите тип для состояния вашего приложения (store выше)
export type RootState = ReturnType<typeof store.getState>;

// Определите тип для диспетчера приложения
export type AppDispatch = typeof store.dispatch;
