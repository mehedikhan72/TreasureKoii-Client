import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";

const Leaderboard: React.FC = () => {
  const { slug } = useParams();

  const [leaderBoard, setLeaderBoard] = useState<[]>([]);
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
    getLeaderBoard();
  }, [slug]);
  return (
    <div>
      <p>Leaderboard page</p>
      {leaderBoard.map((team: any) => (
        <div key={team.id}>
          <p>
            {team.team_name} - {team.points}
          </p>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;
