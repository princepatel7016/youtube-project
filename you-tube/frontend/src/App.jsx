import React from 'react';
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home/Home.jsx";
import Login from "./pages/Login/Login.jsx";
import Register from "./pages/Register/Register.jsx";
import Profile from "./pages/Profile/Profile.jsx";
import Watch from "./pages/Watch/Watch.jsx";
import Subscriptions from "./pages/Subscriptions/Subscriptions.jsx";
import Playlists from "./pages/Playlists/Playlists.jsx";
import History from "./pages/History/History.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/playlists" element={<Playlists />} />
      <Route path="/history" element={<History />} />
      <Route path="/watch/:videoId" element={<Watch />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default App;
