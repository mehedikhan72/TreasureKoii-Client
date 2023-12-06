import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";

const Leaderboard: React.FC = () => {
  const { slug } = useParams();

  const [leaderBoard, setLeaderBoard] = useState<[]>([]);
  const [hunt, setHunt] = useState<Hunt>();
  useEffect(() => {
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
    const getHuntDetails = async (): Promise<void> => {
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          setHunt(data);
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLeaderBoard();
    getHuntDetails();
  }, [slug]);
  return (
    <div className="overflow-x-hidden">
      <HuntNav slug={slug} huntName={hunt?.name} />
      <p className="text-3">Leaderboard</p>
      <div className="w-full px-4">
        <div className="flex flex-col">
          <div className="flex justify-between p-2">
            <p className="flex-1 text-2">Team Name</p>
            <p className="flex-1 text-2">Points</p>
          </div>
          {leaderBoard.map((team: any, index: number) => (
            <div
              key={team.id}
              className={`flex justify-between p-2 ${
                index === 0
                  ? "bg-green-600 hover:scale-105"
                  : index === 1
                  ? "bg-green-400 hover:scale-105"
                  : index === 2
                  ? "bg-yellow-300 hover:scale-105"
                  : index % 2 === 0
                  ? "bg-gray-100 hover:scale-105"
                  : "bg-gray-200 hover:scale-105"
              }`}
            >
              <p className="flex-1 text-1">{team.team_name}</p>
              <p className="flex-1 text-1">{team.points}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
