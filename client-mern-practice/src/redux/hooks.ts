import { useDispatch, useSelector, TypedUseSelectorHook } from "react-redux";
import type { AppDispatch, RootState } from "./store";

// кастомные типизированые хуки useDispatch и useSelector
// теперь везде в прложении будем использовать нн просто useDispatch и useSelector,
// а useAppDispatch и useAppSelector
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
