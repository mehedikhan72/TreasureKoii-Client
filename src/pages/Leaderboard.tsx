import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import { Hunt } from "../types";
import HuntNav from "../components/HuntNav";
import LeaderboardTable from "../components/LeaderboardTable";
import Loading from "../utils/Loading";

const Leaderboard: React.FC = () => {
	const { slug } = useParams();

	const [leaderBoard, setLeaderBoard] = useState<[]>([]);
	const [hunt, setHunt] = useState<Hunt>();
	const [loading, setLoading] = useState<boolean>(false);

	useEffect(() => {
		document.title = `Leaderboard | ${hunt ? hunt?.name : "TreasureKoii"}`;

		const getLeaderBoard = async (): Promise<void> => {
			setLoading(true);
			try {
				const response = await axios.get(`${slug}/leaderboard/`);
				const data = response.data;
				if (response.status === 200) {
					setLeaderBoard(data);
				}
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		};
		const getHuntDetails = async (): Promise<void> => {
			setLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					setHunt(data);
				}
			} catch (error) {
				console.log(error);
			}
			setLoading(false);
		};
		getLeaderBoard();
		getHuntDetails();

		return () => {
			document.title = "TreasureKoii";
		};
	}, [slug]);

	return (
		<div className="overflow-x-hidden">
			{loading && <Loading />}
			<HuntNav slug={slug} huntName={hunt?.name} />
			<LeaderboardTable leaderBoard={leaderBoard} />
		</div>
	);
};

export default Leaderboard;
