import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";
import LeaderboardTable from "../components/LeaderboardTable";
import Loading from "../utils/Loading";
import HomeFooter from "../components/HomeFooter";

const Leaderboard: React.FC = () => {
  const { slug } = useParams();

  const [hunt, setHunt] = useState<Hunt>();
  const [leaderBoard, setLeaderBoard] = useState<[]>([]);

  const [huntLoading, setHuntLoading] = useState<boolean>(false);
  const [leaderboardLoading, setLeaderboardLoading] = useState<boolean>(false);

  useEffect(() => {
    document.title = `Leaderboard | ${
      hunt ? `${hunt.name} | ` : ""
    }TreasureKoii`;

    const getLeaderBoard = async (): Promise<void> => {
      setLeaderboardLoading(true);
      try {
        const response = await axios.get(`${slug}/leaderboard/`);
        const data = response.data;
        if (response.status === 200) {
          setLeaderBoard(data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setLeaderboardLoading(false);
      }
    };
    const getHuntDetails = async (): Promise<void> => {
      setHuntLoading(true);
      try {
        const response = await axios.get(`hunt/${slug}/`);
        const data = response.data;
        if (response.status === 200) {
          setHunt(data);
        }
        // console.log(response);
      } catch (error) {
        console.log(error);
      } finally {
        setHuntLoading(false);
      }
    };
    getLeaderBoard();
    getHuntDetails();

    return () => {
      document.title = "TreasureKoii";
    };
  }, [slug]);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow overflow-x-hidden">
        {(huntLoading || leaderboardLoading) && <Loading />}
        <HuntNav slug={slug} huntName={hunt?.name} />
        <LeaderboardTable leaderBoard={leaderBoard} />
      </div>
      <HomeFooter />
    </div>
  );
};

export default Leaderboard;
