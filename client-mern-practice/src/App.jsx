import React from "react";
import { Routes, Route } from "react-router-dom";
import "./App.scss";
import Login from "./components/auth/Login";
import Registration from "./components/auth/Registration";
import Navbar from "./components/navbar/Navbar";
import HomePage from "./page/HomePage";

function App() {
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
