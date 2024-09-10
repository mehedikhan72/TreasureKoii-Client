// recently hosted hunts

import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Hunt } from "../types";
import Loading from "../utils/Loading";
import { rootUrl } from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";
import useAxios from "../utils/hooks/useAxios";

const RecentlyHosted: React.FC = () => {
	const axios = useAxios();
	const [hunts, setHunts] = useState<(Hunt & { winner: any })[]>();
	const [loading, setLoading] = useState<boolean>(false);
	const contextData = useContext(AuthContext);

	useEffect(() => {
		const getRecentHunts = async () => {
			setLoading(true);
			try {
				const response = await axios.get("get-recent-hunts/");
				const data = response.data;

				const promAll = await Promise.all(
					data.map(async (hunt: Hunt) => {
						try {
							const response = await axios.get(`${hunt.slug}/leaderboard/`);
							const data: any[] = response.data;

							if (response.status === 200) {
								return data.reduce((prevTeam, team) => {
									if (!prevTeam) return team;
									if (prevTeam.score < team.score) return team;
									return prevTeam;
								}, data[0]);
							}
							// console.log(response);
						} catch (error) {
							console.error(error);
						}
					})
				);

				setHunts(data.map((hunt: Hunt, ind: number) => ({ ...hunt, winner: promAll[ind] })));
				setLoading(false);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};
		getRecentHunts();
	}, [contextData]);
	return (
		<div>
			{loading && <Loading />}
			{hunts?.length !== 0 && (
				<div className="my-10 w-full px-4">
					<p className="text-5 m-2 stroked-text-md">Recently hosted treasure hunts</p>
					{hunts?.map((hunt, ind) => (
						<Link
							to={{ pathname: `/${hunt.slug}` }}
							className="grid grid-cols-[1fr_40%] justify-between items-center styled-div-1 bg-opacity-80 my-4 gap-y-2 max-w-[60rem] mx-auto hover:-translate-y-0.5 active:translate-y-0 transition-all max-sm:grid-cols-[1fr] max-sm:max-w-80"
							key={`recent-hosted-${hunt.slug}`}
						>
							<div
								className="text-4 px-2 sm:px-10 md:px-20 max-md:text-3"
								style={{
									gridRow: !hunt.winner ? "1 / span 2" : undefined,
									alignSelf: hunt.winner ? "end" : undefined,
								}}
							>
								{hunt.name}
							</div>
							<img
								src={`${rootUrl}${hunt.poster_img}`}
								alt="hunt"
								className="aspect-[3/2] object-cover object-center overflow-hidden rounded sm:row-span-2 max-sm:row-start-3"
							/>
							{hunt.winner && (
								<div className="grid grid-cols-[repeat(3,max-content)] gap-x-2 place-items-center mx-auto self-start max-md:text-sm">
									<span className="font-bold">Winner Team</span>
									<span>:</span>
									<span>{hunt.winner?.team_name}</span>
									<span className="font-bold">Leader</span>
									<span>:</span> <span>{hunt.winner?.team_leader}</span>
									<span className="font-bold">Points</span>
									<span>:</span> <span>{hunt.winner?.points} </span>
								</div>
							)}
						</Link>
					))}
				</div>
			)}
		</div>
	);
};

export default RecentlyHosted;
