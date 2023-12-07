import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import axios from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";
import Loading from "../utils/Loading";
import { Hunt } from "../types";
import HomeFooter from "../components/HomeFooter";

const JoinTeam: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const { slug } = useParams();
	const [teamPassword, setTeamPassword] = useState<string>("");

	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [hunt, setHunt] = useState<Hunt>();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData();
		formData.append("team_password", teamPassword);

		try {
			const response = await axios.post(`${slug}/join-team/`, formData);
			const data = response.data;

			if (response.status === 201) {
				setMessage(data.success);
			} else {
				setMessage(data.error);
			}
		} catch (error: unknown) {
			console.log(error);
			if (error instanceof AxiosError) setMessage(error.response?.data.error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Join Team | TreasureKoii";

		const getHuntDetails = async (): Promise<void> => {
			setLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					console.log(data);
					setHunt(data);
					setLoading(false);
				}
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		getHuntDetails();

		return () => {
			document.title = "TreasureKoii";
		};
	}, [slug]);

	//   TQYSG0FS

	return (
		<div className="flex flex-col min-h-screen">
			{loading && <Loading />}
			<TreasureKoiiImg />
			{!user && <YouNeedToBeLoggedIn message="You need to be logged in to join a team." />}
			{user && (
				<div className="flex flex-col my-28 items-center gap-5 flex-1">
					<div className="text-4xl font-extrabold">Join A Team</div>
					{hunt && <div className="text-3xl">{hunt.name}</div>}
					{message && <p>{message}</p>}
					<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2 w-1/2">
						<input
							type="text"
							name="team_passwprd"
							placeholder="Enter Team Password"
							value={teamPassword}
							onChange={(e) => setTeamPassword(e.target.value)}
							className="my-input-field w-full"
						/>
						<button type="submit" className="my-btn-1 w-full">
							Join Team
						</button>
					</form>
				</div>
			)}

			<HomeFooter />
		</div>
	);
};

export default JoinTeam;
