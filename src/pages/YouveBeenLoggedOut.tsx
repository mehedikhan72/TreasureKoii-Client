import React, { useContext } from "react";
import { Link, Navigate } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import AuthContext from "../utils/context/AuthContext";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const YouveBeenLoggedOut: React.FC = () => {
  console.log("You've been logged out.");
  const contextData = useContext(AuthContext);
  const user = contextData?.user;

  return (
    <div>
      {user && <Navigate to="/" />}
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="flex flex-col justify-center items-center flex-grow">
            <TreasureKoiiImg />
          <p className="text-1">Oops! You've been logged out. Please log in again.</p>
          <Link to={{ pathname: `/login` }}>
            <button className="my-btn-1">Login</button>
          </Link>
        </div>

        <HomeFooter />
      </div>
    </div>
  );
};

export default YouveBeenLoggedOut;
