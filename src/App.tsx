import React, { useEffect } from "react";
import { AuthProvider } from "./utils/context/AuthContext";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import CreateHunt from "./pages/CreateHunt";
import CreatePuzzle from "./pages/CreatePuzzle";
import HuntHome from "./pages/HuntHome";
import CreateTeam from "./pages/CreateTeam";
import JoinTeam from "./pages/JoinTeam";
import JoinHunt from "./pages/JoinHunt";
import Leaderboard from "./pages/Leaderboard";
import Rules from "./pages/Rules";
import Announcements from "./pages/Announcements";
import Custom404 from "./utils/Custom404";
import Dashboard from "./pages/OrganizerDashboard/Dashboard";
import YouveBeenLoggedOut from "./pages/YouveBeenLoggedOut";
import MakePayment from "./pages/MakePayment";
import UnpaidNotice from "./pages/UnpaidNotice";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ManageTeams from "./pages/OrganizerDashboard/ManageTeams";
import PointsSystem from "./pages/PointsSystem";

const App: React.FC = () => {
  const bgImage = "tk-bg.webp";

  const { pathname } = useLocation();

  useEffect(() => {
    toast.dismiss();
  }, [pathname]);

  return (
    <div
      className="App my-font overflow-x-hidden min-h-[100vh] h-[100vh] bg-cover bg-center bg-fixed opacity-100"
      // style={{ backgroundImage: `url(/${bgImage})` }}
    >
      <div className="relative min-h-screen w-full">
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/organize-hunt" element={<CreateHunt />} />
            <Route path="/:slug/create-puzzle" element={<CreatePuzzle />} />
            <Route path="/:slug" element={<HuntHome />} />
            <Route path="/:slug/create-team" element={<CreateTeam />} />
            <Route path="/:slug/join-team" element={<JoinTeam />} />
            <Route path="/join-hunt" element={<JoinHunt />} />

            <Route path="/:slug/leaderboard" element={<Leaderboard />} />
            <Route path="/:slug/rules" element={<Rules />} />
            <Route path="/:slug/announcements" element={<Announcements />} />
            <Route path="/:slug/organizer-dashboard" element={<Dashboard />} />
            <Route path="/:slug/manage-teams" element={<ManageTeams />} />
            <Route
              path="/youve-been-logged-out"
              element={<YouveBeenLoggedOut />}
            />
            <Route path="/:slug/make-payment" element={<MakePayment />} />
            <Route path="/:slug/unpaid-notice" element={<UnpaidNotice />} />
            <Route path="points-system" element={<PointsSystem />} />

            <Route path="*" element={<Custom404 />} />
          </Routes>
        </AuthProvider>
      </div>
      <ToastContainer position="top-right" theme="colored" />
    </div>
  );
};

export default App;
