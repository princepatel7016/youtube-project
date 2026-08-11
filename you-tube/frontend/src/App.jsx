import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Watch from "./pages/Watch/Watch.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
