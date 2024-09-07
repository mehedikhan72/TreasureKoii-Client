import React from "react";
import { Link } from "react-router-dom";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import HomeFooter from "../components/HomeFooter";

const Custom404: React.FC = () => {
  return (
    <div className="flex flex-col justity-center items-center mt-10 min-h-screen">
      <div className="flex-grow flex items-center flex-col justify-center">
        <TreasureKoiiImg />
        <p className="text-2 stroked-text-sm">
          Trying too hard to find puzzles? Looks like you're lost.
        </p>
        <Link to={{ pathname: `/` }}>
          <button className="my-btn-sm p-4">Go Home</button>
        </Link>
      </div>

      <HomeFooter />
    </div>
  );
};

export default Custom404;
