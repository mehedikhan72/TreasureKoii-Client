import React from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateHunt from "./pages/CreateHunt";
import CreatePuzzle from "./pages/CreatePuzzle";
import HuntHome from "./pages/HuntHome";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import JoinHunt from "./pages/JoinHunt";

const App: React.FC = () => {
  return (
    <div className="App my-font overflow-x-hidden min-h-screen">
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/create-hunt" element={<CreateHunt />} />
          <Route path="/create-puzzle" element={<CreatePuzzle />} />
          <Route path="/:slug" element={<HuntHome />} />
          <Route path="/:slug/create-team" element={<CreateTeam />} />
          <Route path="/:slug/join-team" element={<JoinTeam />} />
          <Route path="/join-hunt" element={<JoinHunt />} />
        </Routes>
      </AuthProvider>
    </div>
  );
};

export default App;
