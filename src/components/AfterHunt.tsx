import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { Hunt } from "../types";
import AuthContext from "../utils/context/AuthContext";
import useAxios from "../utils/hooks/useAxios";
import Loading from "../utils/Loading";
import HomeFooter from "./HomeFooter";
import LeaderboardTable from "./LeaderboardTable";
import ShowImages from "./ShowImages";

const AfterHunt: React.FC<{ hunt: Hunt; getHuntDetails: () => Promise<void> }> = ({ hunt, getHuntDetails }) => {
	const { slug } = useParams();

	const axios = useAxios();

	const [leaderBoard, setLeaderBoard] = useState<[]>([]);

	const [message, setMessage] = useState<string | null>();
	const [imgUploadSuccess, setImgUploadSuccess] = useState<boolean | null>(null);

	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const [loading, setLoading] = useState<boolean>(false);

	const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);
	const [imgFiles, setImgFiles] = useState<File[] | null>(null);
	const getLeaderBoard = async (): Promise<void> => {
		try {
			const response = await axios.get(`${slug}/leaderboard/`);
			const data = response.data;
			if (response.status === 200) {
				setLeaderBoard(data);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
		}
	};
	const uploadImages = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		const formData = new FormData();
		imgFiles?.forEach((file) => formData.append("images", file));
		try {
			const response = await axios.post(`${slug}/post-hunt-images/`, formData);
			if (response.status === 201) {
				// console.log("Images Uploaded");
				setMessage("Images Uploaded");
				setImgFiles(null);
				setImgUploadSuccess(true);
				setLoading(false);
				toast.success("Images uploaded successfully.");
				getHuntDetails();
			} else {
				setMessage("Error uploading images");
				toast.error("Error uploading images.");
				setImgUploadSuccess(false);
				setLoading(false);
			}
		} catch (error) {
			console.log(error);
			const axiosError = error as AxiosError;
			setMessage((axiosError.response?.data as { error: string })?.error);
			toast.error((axiosError.response?.data as { error: string })?.error);
			setImgUploadSuccess(false);
			setLoading(false);
		}
	};
	const checkIfUserAnOrganizer = async (): Promise<void> => {
		try {
			const response = await axios.get(`${slug}/is-user-an-organizer/`);
			const data = response.data;
			if (response.status === 200) {
				setUserAnOrganizer(data.is_organizer);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getLeaderBoard();
		if (user) {
			checkIfUserAnOrganizer();
		}
	}, []);

	const [uploadImageDivDisabled, setUploadImageDivDisabled] = useState<boolean>(false);

	return (
		<div className="flex flex-col min-h-screen">
			{loading && <Loading />}
			{hunt && (
				<>
					<div className="flex flex-col justify-center items-center mt-16 mx-10">
						{userAnOrganizer && !uploadImageDivDisabled && (
							<div className="styled-div-1 rounded-md p-2 mb-4">
								<div className="flex justify-between items-center">
									<p className="text-1">You were an organizer of this hunt. Upload some images as memories.</p>
									<button
										onClick={() => setUploadImageDivDisabled(true)}
										className="rounded-md bg-red-500 text-white font-bold px-2 pt-1"
									>
										X
									</button>
								</div>

								<form onSubmit={uploadImages} className="flex flex-col justify-center items-center">
									<input
										required
										type="file"
										name="images"
										id="huntImages"
										multiple
										onChange={(e) => {
											Array.from(e.target.files!).forEach((file) => {
												if (file.type.split("/")[0] !== "image") {
													toast.error("Please select only image files.", { toastId: "image-type-error" });
													e.target.value = "";
													return;
												}
											});

											setImgFiles(e.target.files ? Array.from(e.target.files) : null);
										}}
										className="file:my-btn-sm file:border-0 flex flex-col"
									/>
									<button type="submit" className="my-btn-sm">
										Upload
									</button>
								</form>
							</div>
						)}

						<p className="text-2 text-center stroked-text-sm">Hunt has ended. Here's a summary!</p>
						<p className="text-5 stroked-text-sm">{hunt.name}</p>
						<p className="text-1 my-2 stroked-text-sm">{`${new Date(hunt.start_date).toDateString()} - ${new Date(
							hunt.end_date
						).toDateString()}`}</p>
						<img src={hunt.poster_img} alt="Hunt" className="w-full max-h-96 object-contain my-5" />
						<p className="text-1 stroked-text-sm">{hunt.description}</p>
					</div>
					<div className="mt-16">
						<p className="text-3 py-8 stroked-text-sm">Look back at the memories! </p>
						<ShowImages url={`${slug}/get-hunt-images/`} imageInterval={2000} />
					</div>

					<LeaderboardTable leaderBoard={leaderBoard} />
				</>
			)}

			<HomeFooter />
		</div>
	);
};

export default AfterHunt;
