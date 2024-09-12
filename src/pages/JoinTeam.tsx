import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import { Hunt } from "../types";
import AuthContext from "../utils/context/AuthContext";
import useAxios from "../utils/hooks/useAxios";
import Loading from "../utils/Loading";

const JoinTeam: React.FC = () => {
	const axios = useAxios();
	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const { slug } = useParams();
	const [teamPassword, setTeamPassword] = useState<string>("");

	const [messageError, setMessageError] = useState<string | null>(null);
	const [messageSuccess, setMessageSuccess] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [hunt, setHunt] = useState<Hunt>();

	const navigate = useNavigate();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		setLoading(true);
		const formData = new FormData();
		formData.append("team_password", teamPassword);

		try {
			const response = await axios.post(`${slug}/join-team/`, formData);
			const data = response.data;

			if (response.status === 201) {
				setMessageError(null);
				setMessageSuccess(data.success);
				toast.success(data.success);
				hunt && navigate(`/${hunt?.slug}`);
			} else {
				setMessageSuccess(null);
				setMessageError(data.error);
				toast.error(data.error);
			}
			// console.log(response);
		} catch (error: unknown) {
			console.log(error);
			setMessageSuccess(null);
			if (error instanceof AxiosError) {
				setMessageError(error.response?.data.error);
				toast.error(error.response?.data.error);
			}
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
					setHunt(data);
					setLoading(false);
				}
				// console.log(response);
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
					{hunt && <p className="text-5 stroked-text-md">{hunt.name}</p>}
					<p className="text-2 font-extrabold stroked-text-sm">Join Team </p>
					<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2 w-1/2">
						{/* {messageError && (
              <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-red-500">
                {messageError}
              </p>
            )} */}
						{/* {messageSuccess && (
							<>
								<p className="text-lg font-bold text-green-600 text-center">{messageSuccess}</p>
								<Link
									to={{ pathname: `/${(hunt as Hunt).slug}` }}
									className="text-lg font-bold flex items-center gap-1"
								>
									<span className="stroked-text-sm">Go To</span>
									<span className="my-btn-sm w-fit px-2 pb-0.5 bg-blue-400 hover:bg-blue-500 mb-1.5">Hunt Page</span>
								</Link>
							</>
						)} */}

						<input
							type="text"
							name="team_passwprd"
							placeholder="Team Password"
							value={teamPassword}
							onChange={(e) => setTeamPassword(e.target.value)}
							className="my-input-field"
						/>
						<button type="submit" className="my-btn-1">
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
