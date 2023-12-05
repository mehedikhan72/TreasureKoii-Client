import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Navigate, useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

const CreatePuzzle: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const { slug } = useParams();

	const [name, setName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [answer, setAnswer] = useState<string>("");
	const [type, setType] = useState<string>("easy");
	const [points, setPoints] = useState<number>(0);

	const [imgFiles, setImgFiles] = useState<File[] | null>(null);

	const [message, setMessage] = useState<string | null>(null);

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
			const response = await axios.post(`${slug}/create-puzzle/`, formData);
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

	return (
		<div className="flex flex-col min-h-screen">
			<TreasureKoiiImg />

			{!user && <YouNeedToBeLoggedIn />}
			{/* todo: make sure user is admin */}

			{user && (
				<div className="flex flex-col my-28 items-center gap-10 flex-1">
					<div className="text-6xl font-extrabold">Create A Puzzle</div>
					{message && <p>{message}</p>}
					<form
						method="post"
						encType="multipart/form-data"
						onSubmit={handleSubmit}
						className="flex flex-col items-center"
					>
						<input
							type="text"
							name="puzzleName"
							placeholder="Puzzle Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="my-input-field w-full"
						/>

						<textarea
							name="description"
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="my-input-field w-full h-16 resize-none"
						/>

						<input
							type="text"
							name="puzzleAnswer"
							placeholder="Answer"
							value={answer}
							onChange={(e) => setAnswer(e.target.value.toLowerCase())}
							className="my-input-field w-full"
						/>

						<label className="w-full flex items-center">
							<span className="w-24">Difficulty : </span>
							<select
								value={type}
								name="type"
								onChange={(e) => {
									setType(e.target.value);
								}}
								className="my-input-field w-full flex-1 mr-0"
							>
								<option value="easy">Easy</option>
								<option value="medium">Medium</option>
								<option value="hard">Hard</option>
							</select>
						</label>

						<label className="w-full flex items-center">
							<span className="w-24">Puzzle Points : </span>
							<input
								type="number"
								name="points"
								value={points}
								onChange={onPointsChange}
								className="my-input-field w-full flex-1 mr-0"
							/>
						</label>

						<label className="w-full flex items-center">
							<span className="w-24">Puzzle Images :</span>
							<input
								type="file"
								name="images"
								multiple
								onChange={(e) => {
									setImgFiles(e.target.files ? Array.from(e.target.files) : null);
								}}
								className="m-2 mr-0 file:ml-0 file:mr-4 file:my-btn-sm file:border-0 text-slate-500 w-52"
							/>
						</label>

						<button type="submit" className="my-btn-1 mt-4">
							Create
						</button>
					</form>
				</div>
			)}
		</div>
	);
};

export default CreatePuzzle;
