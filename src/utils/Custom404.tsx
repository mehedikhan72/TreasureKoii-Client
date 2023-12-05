import React from "react";
import { Link } from "react-router-dom";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const Custom404: React.FC = () => {
  return (
    <div className="flex flex-col justity-center items-center p-4">
      <TreasureKoiiImg />
      <p className="text-3xl font-bold p-4">
        Trying too hard to find puzzles? Looks like you're lost.
      </p>
      <Link to={{ pathname: `/` }}>
        <button className="my-btn-1 p-4">Go Home</button>
      </Link>
    </div>
  );
};

export default Custom404;
