import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./page/HomePage";
import { useAppDispatch } from "./redux/hooks";
import { fetchAuthMe } from "./redux/slices/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // при первом рендере приложения проверяем авторизованы мы или нет
  React.useEffect(() => {
    dispatch(fetchAuthMe());
  }, []);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
