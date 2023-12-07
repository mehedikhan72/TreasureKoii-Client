import { AxiosError } from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Hunt } from "../types";
import axios from "../utils/axios/AxiosSetup";
import HomeFooter from "./HomeFooter";
import LeaderboardTable from "./LeaderboardTable";
import ShowImages from "./ShowImages";

const AfterHunt: React.FC<{ hunt: Hunt }> = ({ hunt }) => {
  const { slug } = useParams();

  const [leaderBoard, setLeaderBoard] = useState<[]>([]);

  const [message, setMessage] = useState<string | null>();

  const getLeaderBoard = async (): Promise<void> => {
    try {
      const response = await axios.get(`${slug}/leaderboard/`);
      const data = response.data;
      if (response.status === 200) {
        setLeaderBoard(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLeaderBoard();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {message && <p>{message}</p>}

      {hunt && (
        <>
          <div className="flex flex-col justify-center items-center mt-16 mx-10">
            <div className="text-2 text-center">
              Hunt has ended. Here's a summary!
            </div>
            <div className="text-5">{hunt.name}</div>
            <div className="text-1 my-2">{`${new Date(
              hunt.start_date
            ).toDateString()} - ${new Date(
              hunt.end_date
            ).toDateString()}`}</div>
            <img
              src={hunt.poster_img}
              alt="Hunt"
              className="w-4/5 max-h-72 object-contain my-5"
            />
            <div className="text-1">{hunt.description}</div>
          </div>
          <div className="text-3 text-center mt-16">
            Look back at the memories!{" "}
          </div>
          <ShowImages url={`${slug}/get-hunt-images/`} />
          <LeaderboardTable leaderBoard={leaderBoard} />
        </>
      )}

      <HomeFooter />
    </div>
  );
};

export default AfterHunt;
