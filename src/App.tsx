import React from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateHunt from "./pages/CreateHunt";
import CreatePuzzle from "./pages/CreatePuzzle";
import CurrentPuzzle from "./pages/CurrentPuzzle";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";

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
					<Route path="/:slug/create-team" element={<CreatePuzzle />} />
					<Route path="/:slug/current-puzzle" element={<CurrentPuzzle />} />
					<Route path="/create-team" element={<CreateTeam />} />
					<Route path="/join-team" element={<JoinTeam />} />
				</Routes>
			</AuthProvider>
		</div>
	);
};

export default App;
