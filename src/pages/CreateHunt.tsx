import React, { useContext, useEffect, useState } from "react";
import axios from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";

import { AxiosError } from "axios";
import { Link } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Loading from "../utils/Loading";

import DateTimePicker from "react-datetime-picker";
import "react-datetime-picker/dist/DateTimePicker.css";
import "react-calendar/dist/Calendar.css";
import "react-clock/dist/Clock.css";
import { toast } from "react-toastify";

const formatDate = (date: Date): string => {
	const dateString: string = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toJSON();
	const timezoneMinutes: number = -date.getTimezoneOffset();
	const timezoneString: string =
		(timezoneMinutes >= 0 ? "+" : "-") +
		String(timezoneMinutes / 60).padStart(2, "0") +
		":" +
		String(timezoneMinutes % 60).padStart(2, "0");

	return dateString.substring(0, dateString.length - 1) + timezoneString;
};

const validateDate = (startDate: Date | null, endDate: Date | null): boolean => {
	if (!startDate || !endDate || startDate.getTime() >= endDate.getTime()) {
		return false;
	}

	return true;
};

const CreateHunt: React.FC = () => {
	const [huntName, setHuntName] = useState<string>("");
	const [description, setDescription] = useState<string>("");
	const [startDate, setStartDate] = useState<Date | null>(null);
	const [endDate, setEndDate] = useState<Date | null>(null);
	const [imgFile, setImgFile] = useState<File | null>(null);
	const [imgPreview, setImgPreview] = useState<string | undefined>(undefined);
	// const [skips, setSkips] = useState<number>(0);

	const [huntSlug, setHuntSlug] = useState<string>("");

	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const sluggifyHuntName = () => {
		const slug = huntName
			.toLowerCase()
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");
		setHuntSlug(slug);
	};

	const validateForm = (): boolean => {
		setMessage(null);
		if (!huntName || !description || !startDate || !endDate || !imgFile) {
			toast.error("Please fill all the fields.");
			return false;
		}
		if (!validateDate(startDate, endDate)) {
			toast.error("Start date should be before End date.", { toastId: "start-date-error" });
			return false;
		}
		return true;
	};

	useEffect(() => {
		if (!imgFile) {
			setImgPreview(undefined);
			return;
		}

		const objectUrl = URL.createObjectURL(imgFile);
		setImgPreview(objectUrl);

		return () => {
			URL.revokeObjectURL(objectUrl);
		};
	}, [imgFile]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);

		if (!validateForm()) {
			setLoading(false);
			return;
		}

		const formData = new FormData();

		formData.append("name", huntName);
		formData.append("description", description);
		if (startDate) formData.append("start_date", formatDate(startDate));
		if (endDate) formData.append("end_date", formatDate(endDate));
		if (imgFile) formData.append("poster_img", imgFile as Blob);
		// formData.append("number_of_skips_for_each_team", skips.toString());

		try {
			const response = await axios.post("create-hunt/", formData);
			const data = response.data;

			if (response.status === 201) {
				// console.log("Hunt Created");

				setHuntName("");
				setDescription("");
				setStartDate(null);
				setEndDate(null);
				setImgFile(null);
				setImgPreview(undefined);
				// setSkips(0);
				setMessage(null);
				sluggifyHuntName();
				(document.getElementById("posterImg") as HTMLInputElement).value = "";
				toast.success("Hunt created successfully.");
			} else {
				toast.error(data.error);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) toast.error(error.response?.data.error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Create Hunt | TreasureKoii";

		return () => {
			document.title = "TreasureKoii";
		};
	}, []);

	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	return (
		<div className="flex flex-col min-h-screen">
			{loading && <Loading />}
			<TreasureKoiiImg />
			{!user && <YouNeedToBeLoggedIn message="Please log in to create hunts." />}

			{user && (
				<div className="flex flex-col self-center justify-center items-center gap-5 flex-1 my-10 mx-4">
					<div className="text-4xl font-extrabold text-center stroked-text-md">Organize A Hunt</div>
					<form id="createHuntForm" onSubmit={handleSubmit} className="flex flex-col items-center max-w-lg">
						{/* {message && <p className="text-1 bg-red-500 styled-div-1 w-full">{message}</p>} */}
						{huntSlug && (
							<div className="stroked-text-sm flex flex-col items-center justify-center w-full mb-4">
								<Link to={{ pathname: `/${huntSlug}` }} className="text-lg font-bold">
									Go to hunt <span className="underline">page</span>
								</Link>
							</div>
						)}
						<input
							type="text"
							name="name"
							placeholder="Hunt Name"
							value={huntName}
							onChange={(e) => setHuntName(e.target.value)}
							className="my-input-field w-full"
						/>

						<textarea
							name="description"
							placeholder="Description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="my-input-field w-full h-32 resize-none"
						/>

						<div className="w-full flex items-center gap-2">
							<span className="stroked-text-sm text-xl w-28">Hunt Start </span>
							<DateTimePicker
								onChange={(date) => {
									setMessage(null);
									setStartDate(date);
									if (!!endDate && validateDate(date, endDate)) {
										toast.error("Start date should be before End date.", { toastId: "start-date-error" });
									}
								}}
								className=" !m-0 !p-0 text-sm [&>div]:p-2 [&>div]:border-none my-input-field flex-1 w-fit"
								disableClock
								value={startDate}
							/>
						</div>

						<div className="w-full flex items-center gap-2 my-2">
							<span className="stroked-text-sm text-xl w-28">Hunt End</span>
							<DateTimePicker
								onChange={(date) => {
									setMessage(null);
									setEndDate(date);
									if (!!startDate && !validateDate(startDate, date)) {
										toast.error("Start date should be before End date.", { toastId: "start-date-error" });
									}
								}}
								className=" !m-0 !p-0 text-sm [&>div]:p-2 [&>div]:border-none my-input-field flex-1 w-fit"
								disableClock
								value={endDate}
							/>
						</div>

						<label className="w-full flex items-center gap-1">
							<span className="stroked-text-sm text-lg w-max">Poster Image</span>
							<input
								type="file"
								id="posterImg"
								name="poster_image"
								onChange={(e) => {
									setImgFile(e.target.files ? e.target.files.item(0) : null);
								}}
								className="m-2 mr-0 file:ml-0 file:mr-4 file:my-btn-sm file:w-fit text-black w-52 flex-1"
							/>
						</label>

						{imgPreview && <img className="m-2 max-h-60" src={imgPreview} alt="Poster" />}

						<button type="submit" className="my-btn-1 mt-4">
							Organize
						</button>
					</form>
				</div>
			)}

			<HomeFooter />
		</div>
	);
};

export default CreateHunt;
