import React from "react";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { useParams, Link } from "react-router-dom";

const UnpaidNotice = () => {
  const { slug } = useParams();
  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <TreasureKoiiImg />
      <div className="flex-grow">
        <p className="text-3 text-red-500 m-2">
          This hunt is not paid for... yet. Please notify your organizers.
        </p>
        <p className="text-2 m-2">
          If you're an organizer, visit this{" "}
          <Link
            className="underline hover:text-blue-500"
            to={{ pathname: `/${slug}/make-payment` }}
          >
            page.
          </Link>
        </p>
      </div>

      <HomeFooter />
    </div>
  );
};

export default UnpaidNotice;
