import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import HuntNav from "../../components/HuntNav";
import { Hunt, TeamData, Puzzle } from "../../types";
import axios from "../../utils/axios/AxiosSetup";
import AuthContext from "../../utils/context/AuthContext";
import Loading from "../../utils/Loading";

const PuzzleOrder = () => {
	const { slug } = useParams();
	const navigate = useNavigate();
	const contextData = useContext(AuthContext);
	const user = contextData?.user;

	const [hunt, setHunt] = useState<Hunt>();
	const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

	const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);
	const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false);

	const [allTeamsData, setAllTeamsData] = useState<TeamData[]>([]);

	const [teamId, setTeamId] = useState<string>("");
	const [puzzleOrder, setPuzzleOrder] = useState<string>("");
	const [updatePuzzleOrderMessage, setUpdatePuzzleOrderMessage] = useState<string>("");

	const [loading, setLoading] = useState<boolean>(false);
	const [organizerCheckLoading, setOrganizerCheckLoading] = useState<boolean>(false);
	const [teamsLoading, setTeamsLoading] = useState<boolean>(false);
	const [puzzlesLoading, setPuzzlesLoading] = useState<boolean>(false);

	useEffect(() => {
		const getHuntDetails = async (): Promise<void> => {
			setLoading(true);
			try {
				const response = await axios.get(`hunt/${slug}/`);
				const data = response.data;
				if (response.status === 200) {
					setHunt(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setLoading(false);
			}
		};

		const checkIfUserAnOrganizer = async (): Promise<void> => {
			setOrganizerCheckLoading(true);
			try {
				const response = await axios.get(`${slug}/is-user-an-organizer/`);
				const data = response.data;
				if (response.status === 200) {
					setUserAnOrganizer(data.is_organizer);
					setUserDataLoaded(true);
				}
			} catch (error) {
				console.log(error);
				setUserDataLoaded(true);
			} finally {
				setOrganizerCheckLoading(false);
			}
		};

		const getAllTeamsData = async (): Promise<void> => {
			setTeamsLoading(true);
			try {
				const response = await axios.get(`${slug}/get-all-teams-data/`);
				const data = response.data;
				if (response.status === 200) {
					setAllTeamsData(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setTeamsLoading(false);
			}
		};

		const getAllPuzzles = async (): Promise<void> => {
			setPuzzlesLoading(true);
			try {
				const response = await axios.get(`${slug}/get-all-puzzles/`);
				const data = response.data;
				if (response.status === 200) {
					setPuzzles(data);
				}
			} catch (error) {
				console.log(error);
			} finally {
				setPuzzlesLoading(false);
			}
		};

		getHuntDetails();
		checkIfUserAnOrganizer();
		getAllTeamsData();
		getAllPuzzles();
	}, [slug, updatePuzzleOrderMessage]);

	// update puzzle order

	const puzzleOrderUpdated = async (e: React.FormEvent<HTMLFormElement>) => {
		setLoading(true);
		e.preventDefault();
		const list = puzzleOrder.split(",").map((item) => parseInt(item));
		try {
			const response = await axios.post(`${slug}/${teamId}/create-puzzle-order/`, {
				list: list,
			});
			const data = response.data;
			if (response.status === 201) {
				setUpdatePuzzleOrderMessage("Puzzle order updated successfully.");
				setTeamId("");
				setPuzzleOrder("");
			} else {
				setUpdatePuzzleOrderMessage(data.error);
			}
		} catch (error) {
			console.log(error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<div>
			{(loading || organizerCheckLoading || teamsLoading || puzzlesLoading) && <Loading />}
			<HuntNav slug={slug} huntName={hunt?.name} />
			{!userAnOrganizer && userDataLoaded && (
				<div className="flex flex-col justify-center items-center">
					<p className="text-2">You are not an organizer of this hunt.</p>
					<Link to={{ pathname: `/${slug}` }}>
						<button className="btn btn-primary my-btn-1">Go to hunt home</button>
					</Link>
				</div>
			)}
			{userAnOrganizer && userDataLoaded && (
				<div>
					{allTeamsData.length === 0 && (
						<div>
							<p className="text-2">
								No teams registered for this hunt... yet. You can set puzzle order for teams once they register.
							</p>
						</div>
					)}
					{allTeamsData.length > 0 && (
						<div>
							<p className="text-3">Here's the current puzzle order list</p>
							<p className="text-1">
								(The list have the IDs of the puzzles(in the database), not necessarily the serial you put them in.)
							</p>
							<div className="m-2 sm:m-8 bg-slate-200 rounded-md">
								{allTeamsData.map((teamData, index) => {
									return (
										<div className="flex justify-left items-center border border-gray-500">
											<p className="text-2">
												Team : {teamData.team_name}, Team ID: {teamData.team_id}, Puzzle Order -
											</p>
											<p>
												{teamData.team_puzzle_order.length > 0 ? (
													<div className="flex justify-center items-center">
														{teamData.team_puzzle_order.map((puzzleId) => {
															return (
																<p className="text-2">
																	{puzzleId}
																	{","}
																</p>
															);
														})}
													</div>
												) : (
													<p className="text-2 text-red-500">Not Set(random order will be applied)</p>
												)}
											</p>
										</div>
									);
								})}
							</div>

							<div>
								<p className="text-2">Update Puzzle Order</p>
								<p className="text-1">
									(Puzzle order must be a list of puzzle IDs. Don't have any commas(,) in the list. Example Order:
									45,49,50,46,48,47. Check below to get the IDs of your puzzles.)
								</p>
								<form onSubmit={puzzleOrderUpdated}>
									<div className="flex flex-col justify-center items-center">
										<input
											type="text"
											placeholder="Team Id"
											value={teamId}
											onChange={(e) => setTeamId(e.target.value)}
											required
											className="my-input-field "
										/>
										<input
											type="text"
											placeholder="Puzzle Order"
											value={puzzleOrder}
											onChange={(e) => setPuzzleOrder(e.target.value)}
											required
											className="my-input-field"
										/>
										<button className="my-btn-1">Update Puzzle Order</button>
										<p className="text-2 text-green-500">{updatePuzzleOrderMessage}</p>
									</div>
								</form>
							</div>

							{/* Puzzle info(IDS) */}

							<div className="my-4">
								<p className="text-3">Puzzles of this hunt</p>
								<div className="m-2 sm:m-8 bg-slate-200 rounded-md">
									{puzzles.map((puzzle, index) => {
										return (
											<div className="flex justify-left items-center border border-gray-500">
												<p className="text-2">
													Puzzle Name : {puzzle.name}, Puzzle ID: {puzzle.id}
												</p>
											</div>
										);
									})}
								</div>
							</div>

							<div className="flex justify-center items-center mb-4 pb-4">
								<Link to={{ pathname: `/${slug}/create-puzzle` }}>
									<button className="my-btn-1">Create Another Puzzle</button>
								</Link>
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	);
};

export default PuzzleOrder;
