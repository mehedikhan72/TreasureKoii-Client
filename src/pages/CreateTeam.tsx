import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";

import { Axios, AxiosError } from "axios";
import { AuthContextProps } from "../types";

// TODO
// dynamic hunt slug

const CreateTeam: React.FC = () => {
	const [huntSlug, setHuntSlug] = useState<string>("test");

	const [name, setName] = useState<string>("");

	const [message, setMessage] = useState<string | null>(null);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", name);

		try {
			const response = await axios.post(`test/create_team/`, formData);
			const data = response.data;

			if (response.status === 201) {
				setMessage(data.success);
			} else {
				setMessage(data.error);
			}
		} catch (error: unknown) {
			console.log(error);
			setMessage("An error occured during Team creation. Please try again.");
		}
	};

	let contextData = useContext(AuthContext);
	if (!contextData) {
		return null;
	}

	const { user }: AuthContextProps = contextData;
	console.log(user);

	return (
		<div>
			{!user && <Navigate to="/" />}
			<p>Create A Team</p>
			{message && <p>{message}</p>}
			<form onSubmit={handleSubmit}>
				<input type="text" name="name" placeholder="Team Name" value={name} onChange={(e) => setName(e.target.value)} />

				<button type="submit">Create Team</button>
			</form>
		</div>
	);
};

export default CreateTeam;
