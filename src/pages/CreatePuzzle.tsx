import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";

import { Axios, AxiosError } from "axios";
import { AuthContextProps } from "../types";

// TODO
// dynamic hunt slug

const CreatePuzzle: React.FC = () => {
	const [huntSlug, setHuntSlug] = useState<string>("test");

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [answer, setAnswer] = useState<string>("");
	const [type, setType] = useState<string>("easy");
	const [points, setPoints] = useState<number>(0);

	const [imgFiles, setImgFiles] = useState<File[] | null>(null);
	const [imgPreviews, setImgPreviews] = useState<string[] | undefined>(undefined);

	const [message, setMessage] = useState<string | null>(null);

	useEffect(() => {
		if (!imgFiles) {
			setImgPreviews(undefined);
			return;
		}

		const objectUrls = imgFiles.map((imgFile) => URL.createObjectURL(imgFile));
		setImgPreviews(objectUrls);

		return () => {
			objectUrls.forEach((objectUrl) => URL.revokeObjectURL(objectUrl));
		};
	}, [imgFiles]);

	const onPointsChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
		const val: string = e.target.value;
		if (/^\d+$/.test(val)) setPoints(parseInt(val));
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const formData = new FormData();
		formData.append("name", name);
		formData.append("description", description);
		formData.append("type", type);
		formData.append("answer", answer);
		formData.append("points", points.toString());
		imgFiles?.forEach((file) => formData.append("images", file));

		try {
			const response = await axios.post(`${huntSlug}/create_puzzle/`, formData);
			const data = response.data;

			if (response.status === 201) {
				console.log("Hunt Created");
			} else {
				setMessage(data.error);
			}
		} catch (error) {
			console.log(error);
			setMessage("An error occured during hunt creation. Please try again.");
		}
	};

	let contextData = useContext(AuthContext);
	if (!contextData) {
		return null;
	}

	const { user }: AuthContextProps = contextData;

	return (
		<div>
			{!user && <Navigate to="/" />}
			<p>Create A Puzzle</p>
			{message && <p>{message}</p>}
			<form method="post" encType="multipart/form-data" onSubmit={handleSubmit}>
				<label>
					<input
						type="text"
						name="puzzleName"
						placeholder="Puzzle Name"
						value={name}
						onChange={(e) => setName(e.target.value)}
					/>
				</label>

				<textarea
					name="description"
					placeholder="Description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>

				<input
					type="text"
					name="puzzleAnswer"
					placeholder="Answer"
					value={answer}
					onChange={(e) => setAnswer(e.target.value.toLowerCase())}
				/>

				<label htmlFor="type">Difficulty</label>
				<select
					value={type}
					name="type"
					onChange={(e) => {
						setType(e.target.value);
					}}
				>
					<option value="easy">Easy</option>
					<option value="medium">Medium</option>
					<option value="hard">Hard</option>
				</select>

				<label htmlFor="points">Puzzle Points</label>
				<input type="number" name="points" value={points} onChange={onPointsChange} />

				<label htmlFor="puzzleImage">Puzzle Image</label>
				<input
					type="file"
					name="images"
					multiple
					onChange={(e) => {
						setImgFiles(e.target.files ? Array.from(e.target.files) : null);
					}}
				/>
				{imgPreviews && imgPreviews.map((url, ind) => <img src={url} key={ind} />)}

				<button type="submit">Create</button>
			</form>
		</div>
	);
};

export default CreatePuzzle;
