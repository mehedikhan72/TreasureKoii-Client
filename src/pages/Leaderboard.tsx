import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";
import LeaderboardTable from "../components/LeaderboardTable";

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
			<LeaderboardTable leaderBoard={leaderBoard} />
		</div>
	);
};

export default Leaderboard;
