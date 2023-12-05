import React from "react";
import { Link } from "react-router-dom";

const HuntNav: React.FC<{
  slug: string | undefined;
  huntName: string | undefined;
}> = ({ slug, huntName }) => {
  return (
    <div>
      <p className="text-4">{huntName}</p>
      <div className="flex justify-center items-center">
        <Link className="link-2" to={{ pathname: `/${slug}` }}>
          Home
        </Link>

        <Link className="link-2" to={{ pathname: `/${slug}/rules` }}>
          {" "}
          Rules{" "}
        </Link>
        <Link className="link-2" to={{ pathname: `/${slug}/announcements` }}>
          {" "}
          Announcements{" "}
        </Link>
        <Link className="link-2" to={{ pathname: `/${slug}/leaderboard` }}>
          Leader Board
        </Link>
      </div>
    </div>
  );
};

export default HuntNav;
