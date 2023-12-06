import React from "react";
import { Link } from "react-router-dom";

const HomeFooter: React.FC = () => {
  return (
    <div className="dark p-10 w-full bottom-0 mt-auto">
      <div className="flex justify-center items-center flex-wrap">
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">Home</Link>
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">About</Link>
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">Privacy Policy</Link>
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">FAQ</Link>
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">Points System</Link>
        <Link to={{ pathname: `/`}} className="text-2 link-1 flex-1">Contact Us</Link>
      </div>
      <p className="text-1">© 2023 TreasureKoii. All rights reserved.</p>
    </div>
  );
};

export default HomeFooter;
