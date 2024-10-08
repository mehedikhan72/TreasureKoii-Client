// this is the home view for a hunt, before hunt, info will show, during hunt, current puzzle
// will show, after hunt, results and other info

import { AxiosError } from "axios";
import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AfterHunt from "../components/AfterHunt";
import BeforeHunt from "../components/BeforeHunt";
import ShowImages from "../components/ShowImages";
import { Hunt, Puzzle } from "../types";
import AuthContext from "../utils/context/AuthContext";

import Confetti from "react-confetti";
import { toast } from "react-toastify";
import useWindowSize from "react-use/lib/useWindowSize";
import HomeFooter from "../components/HomeFooter";
import HuntNav from "../components/HuntNav";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Custom404 from "../utils/Custom404";
import useAxios from "../utils/hooks/useAxios";
import Loading from "../utils/Loading";
import MakePayment from "./MakePayment";
import Dashboard from "./OrganizerDashboard/Dashboard";
import UnpaidNotice from "./UnpaidNotice";

const HuntHome: React.FC = () => {
	const axios = useAxios();
	const { slug } = useParams();
	const [puzzle, setPuzzle] = useState<Puzzle>();
	const [hunt, setHunt] = useState<Hunt>();

	const [beforeHunt, setBeforeHunt] = useState<boolean>(false);
	const [duringHunt, setDuringHunt] = useState<boolean>(false);
	const [afterHunt, setAfterHunt] = useState<boolean>(false);

	const [correctAnswerGiven, setCorrectAnswerGiven] = useState<boolean>(false);
	const [wrongAnswerGiven, setWrongAnswerGiven] = useState<boolean>(false);
	const [message, setMessage] = useState<string | null>(null);

	const [didNotGetPuzzle, setDidNotGetPuzzle] = useState<boolean>(false);

	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const [imageUrl, setImageUrl] = useState<string | null>(null);

	const { width, height } = useWindowSize();

	// for custom404
	const [huntLoaded, setHuntLoaded] = useState<boolean>(false);
	const [puzzleLoaded, setPuzzleLoaded] = useState<boolean>(false);

	const [userAnOrganizer, setUserAnOrganizer] = useState<boolean | undefined>(undefined);

	// manual payment checking.
	const [huntPaidFor, setHuntPaidFor] = useState<boolean>(true);
	useEffect(() => {
		const checkIfHuntPaidFor = async (): Promise<void> => {
			try {
				const response = await axios.get(`${slug}/is-hunt-paid-for/`);
				const data = response.data;
				if (response.status === 200) {
					setHuntPaidFor(data.paid);
				}
				// console.log(response);
			} catch (error) {
				console.log(error);
			}
		};
		checkIfHuntPaidFor();
	}, [slug, contextData, userAnOrganizer]);

	const getHuntDetails = async (): Promise<void> => {
		try {
			const response = await axios.get(`hunt/${slug}/`);
			const data = response.data;
			if (response.status === 200) {
				// console.log(data);
				setHunt(data);
				setHuntLoaded(true);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			setHuntLoaded(true);
		}
	};

	// TODO: Skip puzzle.
	useEffect(() => {
		document.title = `${puzzle ? `${puzzle.name} | ` : ""}${hunt ? `${hunt.name} | ` : ""}TreasureKoii`;

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

		const getPuzzle = async (): Promise<void> => {
			try {
				const response = await axios.get(`${slug}/get-current-puzzle-view/`);
				const data = response.data;
				if (response.status === 200) {
					setPuzzle(data);
					setImageUrl(data.id + "/get-puzzle-images/");
				}
				setPuzzleLoaded(true);
			} catch (error) {
				console.log(error);
				setDidNotGetPuzzle(true);
				setPuzzleLoaded(true);
				if (!userAnOrganizer) {
					toast.info("No more puzzles left. Looks like you solved 'em all.");
				}
			}
		};

		getHuntDetails();
		checkIfUserAnOrganizer();
		if (user && duringHunt) {
			getPuzzle();
		}
	}, [slug, user, duringHunt, contextData]);

	useEffect(() => {
		setImageUrl(puzzle?.id + "/get-puzzle-images/");
	}, [puzzle]);

	// TODO: Fix getting new puzzle

	useEffect(() => {
		document.title = `${puzzle ? `${puzzle.name} | ` : ""}${hunt ? `${hunt.name} | ` : ""}TreasureKoii`;

		const currentTime = new Date();

		if (hunt) {
			const huntStart = new Date(hunt.start_date);
			const huntEnd = new Date(hunt.end_date);

			if (currentTime < huntStart) {
				setBeforeHunt(true);
				setDuringHunt(false);
				setAfterHunt(false);
			} else if (currentTime >= huntStart && currentTime <= huntEnd) {
				setBeforeHunt(false);
				setDuringHunt(true);
				setAfterHunt(false);
			} else {
				setBeforeHunt(false);
				setDuringHunt(false);
				setAfterHunt(true);
			}
		}

		return () => {
			document.title = "TreasureKoii";
		};
	}, [hunt, slug]);

	const [answer, setAnswer] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		setLoading(true);
		try {
			const response = await axios.post(`${puzzle?.id}/submit-answer/`, {
				answer: answer,
			});
			const data = response.data;
			if (response.status === 200) {
				if (data.success) {
					setCorrectAnswerGiven(true);
					setMessage(data.success);
					toast.success(data.success);
				} else {
					setWrongAnswerGiven(true);
					setMessage(data.error);
					toast.error(data.error);
				}
			}
			setLoading(false);
			// console.log(response);
		} catch (error) {
			const axiosError = error as AxiosError;
			setMessage((axiosError.response?.data as { error: string })?.error);
			toast.error((axiosError.response?.data as { error: string })?.error);
			setWrongAnswerGiven(true);
			setLoading(false);
			console.log(error);
		}
	};

	const fetchNewPuzzle = async (): Promise<void> => {
		setLoading(true);
		const type_param = "next";
		try {
			const response = await axios.get(`${slug}/puzzle/${type_param}/`);
			const data = response.data;
			if (response.status === 200) {
				setPuzzle(data);
				setAnswer("");
				setCorrectAnswerGiven(false);
				setWrongAnswerGiven(false);
				console.log(data);
			}
			setLoading(false);
			console.log(data);
		} catch (error) {
			setDidNotGetPuzzle(true);
			setLoading(false);
			const axiosError = error as AxiosError;
			const errorMsg = (axiosError.response?.data as { error: string })?.error;
			setMessage((axiosError.response?.data as { error: string })?.error);
			if (errorMsg === "No more puzzles left to skip.") {
				toast.info("No more puzzles left. Looks like you solved 'em all.");
			} else {
				toast.error((axiosError.response?.data as { error: string })?.error);
			}

			console.log(error);
		}
	};

	return (
		// todo: add other links n confetti
		<>
			{!huntPaidFor && userAnOrganizer !== undefined && (userAnOrganizer ? <MakePayment /> : <UnpaidNotice />)}
			{loading && <Loading />}
			{!huntLoaded && !puzzleLoaded && <Loading />}
			{huntLoaded && !hunt && <Custom404 />}
			{huntPaidFor && huntLoaded && hunt && (
				<div>
					{userAnOrganizer && (
						<div>
							{afterHunt && <AfterHunt hunt={hunt} getHuntDetails={getHuntDetails} />}
							{!afterHunt && (
								// <div className="flex flex-col min-h-screen">
								//   <div className="flex-grow">
								//     <HuntNav slug={slug} huntName={hunt?.name} />
								//     <div className="flex justify-center items-center flex-col">
								//       <p className="text-3">
								//         You are an organizer of this hunt.
								//       </p>
								//       <Link to={{ pathname: `/${slug}/organizer-dashboard` }}>
								//         <button className="my-btn-1">
								//           Organizer Dashboard
								//         </button>
								//       </Link>
								//     </div>
								//   </div>

								//   <HomeFooter />
								// </div>

								<div>
									<Dashboard />
									<HomeFooter />
								</div>
							)}
						</div>
					)}
					{!userAnOrganizer && (
						<div>
							{beforeHunt && <BeforeHunt hunt={hunt} />}
							{afterHunt && <AfterHunt hunt={hunt} getHuntDetails={getHuntDetails} />}

							{duringHunt && <HuntNav slug={slug} huntName={hunt?.name} />}
							{duringHunt && !user && (
								<div>
									<YouNeedToBeLoggedIn message="Please Log in if you are registered in this hunt." />
								</div>
							)}

							{duringHunt && !beforeHunt && !afterHunt && user && (
								<div className="min-h-screen flex flex-col">
									{didNotGetPuzzle && (
										<div className="flex flex-col justify-center items-center p-4 flex-grow">
											<p className="text-2 stroked-text-sm">
												No more puzzles left. Looks like you solved 'em all.
												{/* {toast.info("No more puzzles left. Looks like you solved 'em all.")} */}
											</p>
											<p className="text-1 stroked-text-sm">Refresh this page to verify again.</p>
										</div>
									)}

									{!didNotGetPuzzle && !correctAnswerGiven && (
										<div className="p-4">
											<p className="text-1 stroked-text-sm">Your Current Puzzle</p>
											<p className="text-2 stroked-text-sm">{puzzle?.name}</p>
											<p className="text-1 stroked-text-sm mb-4">{puzzle?.description}</p>
											<ShowImages key={imageUrl} url={imageUrl} imageInterval={5000} />
										</div>
									)}
									{!correctAnswerGiven && !didNotGetPuzzle && (
										<div className="p-4 m-2 flex-grow">
											<p className="text-3 stroked-text-sm">Submit Answer</p>
											<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
												<input
													type="text"
													name="answer"
													placeholder="Answer"
													className="my-input-field"
													value={answer}
													onChange={(e) => setAnswer(e.target.value.toLowerCase())}
												/>
												{/* {wrongAnswerGiven && (
                          <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-red-500">
                            {message}
                          </p>
                        )} */}
												<button className="my-btn-1" type="submit">
													Submit
												</button>
											</form>
										</div>
									)}

									{correctAnswerGiven && !didNotGetPuzzle && (
										<div className="flex flex-col justify-center items-center p-4 flex-grow">
											<div className="">
												<p className="text-4 mb-2 stroked-text-sm">{message}</p>
											</div>

											<button className="my-btn-1 mt-2" onClick={() => fetchNewPuzzle()}>
												Next Puzzle
											</button>
											<Confetti width={width} height={height} />
										</div>
									)}

									<HomeFooter />
								</div>
							)}
						</div>
					)}
				</div>
			)}
		</>
	);
};

export default HuntHome;
