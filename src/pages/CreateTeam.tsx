import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { AxiosError } from "axios";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Loading from "../utils/Loading";

const CreateTeam: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;
	const { slug } = useParams();

	// TODO: add hunt name in create team and join team
	const [name, setName] = useState<string>("");
	const [teamPassword, setTeampassword] = useState<string>("");
	const [copied, setCopied] = useState<boolean>(false);

	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append("name", name);

		try {
			const response = await axios.post(`${slug}/create-team/`, formData);
			const data = response.data;

			console.log(data);

			if (response.status === 201) {
				console.log(data.success);
				let str = data.success;
				setTeampassword(str.match(/password: (.+?)\./)[1]);
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
		document.title = "Create Team | TreasureKoii";

		return () => {
			document.title = "TreasureKoii";
		};
	}, [slug]);

	return (
		<div className="flex flex-col min-h-screen">
			{loading && <Loading />}
			<TreasureKoiiImg />
			{!user && <YouNeedToBeLoggedIn message="You need to be logged in to create a team." />}

			{user && (
				<div className="flex flex-col my-28 items-center gap-10 flex-1">
					<div className="text-4">Create A Team</div>
					{message && <p>{message}</p>}
					<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2 w-1/2">
						<input
							type="text"
							name="name"
							placeholder="Team Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="my-input-field w-full"
						/>
						{Boolean(teamPassword) && (
							<>
								<p className="text-xl">Team Password:</p>
								<input
									type="text"
									name="name"
									value={`${teamPassword}${copied ? " (Copied)" : " (Click To Copy)"}`}
									readOnly
									onClick={() => {
										navigator.clipboard.writeText(teamPassword);
										setCopied(true);
									}}
									className="my-input-field w-full"
								/>
							</>
						)}

						<button type="submit" className="my-btn-1 w-full">
							Create Team
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default CreateTeam;
