import React, { useContext, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import axios from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";

import { AxiosError } from "axios";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Loading from "../utils/Loading";

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
	if (startDate && endDate && startDate.getTime() > endDate.getTime()) {
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
			setMessage("Please fill all the fields.");
			return false;
		}
		if (!validateDate(startDate, endDate)) {
			setMessage("Start date should be before End date.");
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
			} else {
				setMessage(data.error);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) setMessage(error.response?.data.error);
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
				<div className="flex flex-col self-center justify-center items-center gap-5 flex-1 my-10 mx-8">
					<div className="text-4xl font-extrabold text-center">Organize A Hunt</div>
					<form id="createHuntForm" onSubmit={handleSubmit} className="flex flex-col items-center max-w-lg">
						{message && <p className="text-1 text-red-500">{message}</p>}
						{huntSlug && (
							<>
								<p className="text-lg font-bold text-green-600">Hunt created successfully.</p>
								<Link to={{ pathname: `/${huntSlug}` }} className="text-lg font-bold mb-4">
									Go To <span className="text-blue-600 underline">Hunt Page</span>
								</Link>
							</>
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

						<div className="flex flex-col justify-between w-full max-[400px]:flex-wrap">
							<DatePicker
								placeholderText="Hunt Start"
								selected={startDate}
								onChange={(date) => {
									setMessage(null);
									if (validateDate(date, endDate)) {
										setStartDate(date);
									} else {
										setStartDate(null);
										setMessage("Start date should be before End date.");
									}
								}}
								startDate={startDate}
								wrapperClassName="flex-auto"
								className="my-input-field mb-1 mx-0 w-full text-base"
								showIcon
								showTimeSelect
								dateFormat="MM/dd/yyyy - h:mm aa"
								icon={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 48 48"
										className="my-2.5"
									>
										<mask id="ipSApplication0">
											<g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
												<path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
												<path
													fill="#fff"
													d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
												></path>
											</g>
										</mask>
										<path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path>
									</svg>
								}
							/>
							<DatePicker
								placeholderText="Hunt End"
								selected={endDate}
								onChange={(date) => {
									setMessage(null);
									if (validateDate(startDate, date)) {
										setEndDate(date);
									} else {
										setEndDate(null);
										setMessage("Start date should be before End date.");
									}
								}}
								startDate={endDate}
								wrapperClassName="flex-auto"
								className="my-input-field mt-1 mx-0 w-full text-base"
								showIcon
								showTimeSelect
								dateFormat="MM/dd/yyyy - h:mm aa"
								icon={
									<svg
										xmlns="http://www.w3.org/2000/svg"
										width="1em"
										height="1em"
										viewBox="0 0 48 48"
										className="my-2 mt-1.5"
									>
										<mask id="ipSApplication0">
											<g fill="none" stroke="#fff" strokeLinejoin="round" strokeWidth="4">
												<path strokeLinecap="round" d="M40.04 22v20h-32V22"></path>
												<path
													fill="#fff"
													d="M5.842 13.777C4.312 17.737 7.263 22 11.51 22c3.314 0 6.019-2.686 6.019-6a6 6 0 0 0 6 6h1.018a6 6 0 0 0 6-6c0 3.314 2.706 6 6.02 6c4.248 0 7.201-4.265 5.67-8.228L39.234 6H8.845l-3.003 7.777Z"
												></path>
											</g>
										</mask>
										<path fill="currentColor" d="M0 0h48v48H0z" mask="url(#ipSApplication0)"></path>
									</svg>
								}
							/>
						</div>

						<label className="w-full flex items-center">
							<span className="w-24">Poster Image</span>
							<input
								type="file"
								id="posterImg"
								name="poster_image"
								onChange={(e) => {
									setImgFile(e.target.files ? e.target.files.item(0) : null);
								}}
								className="m-2 mr-0 file:ml-0 file:mr-4 file:border-0 text-slate-500 w-full"
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
