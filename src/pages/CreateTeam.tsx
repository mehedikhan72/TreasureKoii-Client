import React, { useState, useContext } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate, useParams, Link } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { AxiosError } from "axios";

const CreateTeam: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;
	const { slug } = useParams();

	const [name, setName] = useState<string>("");

	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", name);

		try {
			const response = await axios.post(`${slug}/create-team/`, formData);
			const data = response.data;

			if (response.status === 201) {
				setMessage(data.success);
			} else {
				setMessage(data.error);
			}
		} catch (error: unknown) {
			console.log(error);
			if (error instanceof AxiosError) setMessage(error.response?.data.error);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			<TreasureKoiiImg />
			{!user && (
				<div>
					<p className="warning-text">You need to log in create a team.</p>
					<Link to={{ pathname: `/login` }}>
						<button className="my-btn-1">Login</button>
					</Link>
				</div>
			)}

			{user && (
				<div className="flex flex-col justify-center items-center gap-10 flex-1 my-10">
					<div className="text-4xl font-extrabold">Create A Team</div>
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
