import React from "react";
import { useDispatch } from "react-redux";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/navbar/Navbar";
import Account from "./page/Account";
import AdminPage from "./page/AdminPage";
import Collection from "./page/Collection";
import CreatePost from "./page/createPost";
import EachPost from "./page/eachPost";
import HomePage from "./page/HomePage";
import MyProfile from "./page/myProfile";
import RecognitionPage from "./page/recognitionPage";
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
      <Routes >
        <Route path="/" element={<HomePage />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/login" element={<Login />} />
        <Route path="/myaccount" element={<Account />} />
        <Route path="/myprofile" element={<MyProfile />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/createpost" element={<CreatePost />} />
        <Route path="/myprofile/:postId" element={<EachPost />} />
        <Route path="/recognition" element={<RecognitionPage />} />
        <Route path="/administration" element={<AdminPage />} />
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
