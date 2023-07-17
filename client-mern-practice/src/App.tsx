import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Navbar from "./components/navbar/Navbar";
import Account from "./page/Account";
import HomePage from "./page/HomePage";
import { useAppDispatch } from "./redux/hooks";
import { fetchAuthMe } from "./redux/slices/authSlice";

const App: React.FC = () => {
  const dispatch = useAppDispatch();

  // при первом рендере приложения проверяем авторизованы мы или нет
  React.useEffect(() => {
    const token = localStorage.getItem("token");
    console.log(token);

    if (token) {
      dispatch(fetchAuthMe(token));
    }
  }, [dispatch]);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myprofile" element={<Account />} />
      </Routes>
    </div>
  );
};

export default App;
