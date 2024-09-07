import React, { useState, useContext, useEffect } from "react";
import AuthContext from "../utils/context/AuthContext";
import { Link, useParams } from "react-router-dom";
import axios from "../utils/axios/AxiosSetup";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { AxiosError } from "axios";
import YouNeedToBeLoggedIn from "../components/YouNeedToBeLoggedIn";
import Loading from "../utils/Loading";
import { Hunt } from "../types";
import HomeFooter from "../components/HomeFooter";
import { toast } from "react-toastify";

const CreateTeam: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;
	const { slug } = useParams();

	const [name, setName] = useState<string>("");
	const [teamPassword, setTeampassword] = useState<string>("");
	const [copied, setCopied] = useState<boolean>(false);

	const [message, setMessage] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);

	const [hunt, setHunt] = useState<Hunt>();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		console.log("handle submit clicked.");
		e.preventDefault();
		setLoading(true);

		const formData = new FormData();
		formData.append("name", name);

		try {
			const response = await axios.post(`${slug}/create-team/`, formData);
			const data = response.data;

			if (response.status === 201) {
				// console.log(data.success);
				let str = data.success;
				setTeampassword(str.match(/password: (.+?)\./)[1]);
				toast.success("Team Successfully Created.");
			} else {
				// setMessage(data.error);
				toast.error(data.error);
			}
			// console.log(response);
		} catch (error: unknown) {
			console.log(error);
			if (error instanceof AxiosError) {
				// setMessage(error.response?.data.error);
				toast.error(error.response?.data.error);
			}
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		document.title = "Create Team | TreasureKoii";

		const getHuntDetails = async (): Promise<void> => {
			setLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					setHunt(data);
					setLoading(false);
				}
				// console.log(response);
			} catch (error) {
				console.log(error);
				setLoading(false);
			}
		};

		getHuntDetails();

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
				<div className="flex flex-col my-28 items-center gap-5 flex-1">
					{hunt && <div className="text-5 stroked-text-md">{hunt.name}</div>}
					<div className="text-2 stroked-text-sm">Create A Team</div>
					{/* {message && (
            <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-red-500">
              {message}
            </p>
          )} */}
					<form onSubmit={handleSubmit} className="flex flex-col justify-center items-center gap-2 w-1/2">
						<input
							type="text"
							name="name"
							placeholder="Team Name"
							value={name}
							onChange={(e) => setName(e.target.value)}
							className="my-input-field"
						/>

						<button type="submit" className="my-btn-1">
							Create Team
						</button>
					</form>
					{Boolean(teamPassword) && (
						<>
							{/* <p className="text-1 w-[172px] sm:w-[200px] md:w-[250px] lg:w-[300px] styled-div-1 bg-green-600">
                Team Successfully Created.
              </p> */}
							<Link to={{ pathname: `/${(hunt as Hunt).slug}` }} className="text-lg font-bold flex items-center gap-1">
								<span className="stroked-text-sm">Go To</span>
								<span className="my-btn-sm w-fit px-2 pb-0.5 bg-blue-400 hover:bg-blue-500 mb-1.5">Hunt Page</span>
							</Link>
							<div></div>

							<div className="styled-div-1 w-[350px] md:w-[500px] flex justify-between items-center">
								<p className="text-sm lg:text-lg">Team Password: {teamPassword}</p>
								<button
									onClick={() => {
										navigator.clipboard.writeText(teamPassword);
										setCopied(true);
									}}
								>
									<i className="bx bx-copy p-1"></i>
									<span>{copied ? "Copied" : "Copy"}</span>
								</button>
							</div>
						</>
					)}
				</div>
			)}

			<HomeFooter />
		</div>
	);
};

export default CreateTeam;
