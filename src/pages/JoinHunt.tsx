import React, { useContext, useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import OrganizingHunts from "../components/OrganizingHunts";
import RegisteredHunts from "../components/RegisteredHunts";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import axios from "../utils/axios/AxiosSetup";
import AuthContext from "../utils/context/AuthContext";
import useDebouncedCallback from "../utils/hooks/useDebouncedCallback";
import Loading from "../utils/Loading";
import { toast } from "react-toastify";

const JoinHunt: React.FC = () => {
	const navigate = useNavigate();

	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const [huntName, setHuntName] = useState<string>("");
	const huntSlug = useMemo(() => {
		const slug = huntName
			.toLowerCase()
			.replace(/ /g, "-")
			.replace(/[^\w-]+/g, "");

		return slug;
	}, [huntName]);

	const [huntExists, setHuntExists] = useState<boolean>(false);
	const [message, setMessage] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);

	const checkHuntExists = useDebouncedCallback(async (huntSlug: string) => {
		if (huntSlug === "") {
			setMessage("");
			setHuntExists(false);
			return;
		}

		try {
			const response = await axios.get(`${huntSlug}/hunt-exists/`);
			if (response.status === 200 && response.data.hunt_exists !== true) {
				setHuntExists(false);
				// setMessage("Hunt does not exist. Please try again.");
				toast.error("Hunt does not exist. Please try again.");
			} else {
				setMessage("");
				setHuntExists(true);
			}
		} catch (error) {
			console.log(error);
		}
	});

	useEffect(() => {
		document.title = "Join Hunt | TreasureKoii";

		return () => {
			document.title = "TreasureKoii";
		};
	}, []);

	useEffect(() => {
		checkHuntExists(huntSlug);
	}, [huntSlug]);

	const createTeamClicked = async () => {
		if (huntSlug === "") {
			setMessage("Please enter a valid hunt name.");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.get(`${huntSlug}/hunt-exists/`);
			if (response.status === 200) {
				if (response.data.hunt_exists === true) {
					navigate(`/${huntSlug}/create-team`);
				} else {
					// setMessage("Hunt does not exist. Please try again.");
					toast.error("Hunt does not exist. Please try again.");
				}
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	const joinTeamClicked = async () => {
		if (huntSlug === "") {
			// setMessage("Please enter a valid hunt name.");
			toast.error("Please enter a valid hunt name.");
			return;
		}

		setLoading(true);
		try {
			const response = await axios.get(`${huntSlug}/hunt-exists/`);
			if (response.status === 200) {
				if (response.data.hunt_exists === true) {
					navigate(`/${huntSlug}/join-team`);
				} else {
					// setMessage("Hunt does not exist. Please try again.");
					toast.error("Hunt does not exist. Please try again.");
				}
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="flex flex-col min-h-screen">
			{loading && <Loading />}
			<TreasureKoiiImg />
			{!user && <YouNeedToBeLoggedIn message="Please log in to join hunts." />}
			{user && (
				<div className="flex flex-col mt-28 items-center gap-5 flex-1">
					<p className="text-5 stroked-text-md">Join A Hunt</p>
					<div className="flex justify-center items-center flex-col">
						<p className="text-2 w-5/6 max-sm:w-[200px] text-center stroked-text-sm">Ask your organizers for the hunt name</p>
						<input
							name="huntName"
							placeholder="Hunt Name"
							className="my-input-field"
							onChange={(e) => setHuntName(e.target.value)}
						/>
						{!message && !huntExists && (
							<p className="text-1 w-5/6 max-sm:w-[200px] text-center stroked-text-1">Enter a valid hunt name to continue.</p>
						)}
						{/* {message && <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-red-500">{message}</p>} */}

						{huntExists && (
							<div className="flex justify-center items-center">
								<button onClick={createTeamClicked} className="my-btn-1">
									Create a Team
								</button>

								<button onClick={joinTeamClicked} className="my-btn-1 ">
									Join a Team
								</button>
							</div>
						)}
						{!huntExists && (
							<div>
								<div className="flex justify-center items-center pointer-events-none opacity-50">
									<Link to={{ pathname: `/${huntSlug}/create-team` }}>
										<button className="my-btn-1">Create a Team</button>
									</Link>
									<Link to={{ pathname: `/${huntSlug}/join-team` }}>
										<button className="my-btn-1 ">Join a Team</button>
									</Link>
								</div>
							</div>
						)}
					</div>
				</div>
			)}

			<OrganizingHunts />
			{/* <RegisteredHunts /> */}

			<HomeFooter />
		</div>
	);
};

export default JoinHunt;
