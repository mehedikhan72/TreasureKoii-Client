import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import HuntNav from "../../components/HuntNav";
import { Hunt, TeamData, Puzzle } from "../../types";
import axios from "../../utils/axios/AxiosSetup";
import AuthContext from "../../utils/context/AuthContext";
import Loading from "../../utils/Loading";

const PuzzleOrder = () => {
	const { slug } = useParams();

	const [hunt, setHunt] = useState<Hunt>();
	const [puzzles, setPuzzles] = useState<Puzzle[]>([]);

	const [userAnOrganizer, setUserAnOrganizer] = useState<boolean>(false);
	const [userDataLoaded, setUserDataLoaded] = useState<boolean>(false);

	const [allTeamsData, setAllTeamsData] = useState<TeamData[]>([]);

	const [teamId, setTeamId] = useState<string>("");
	const [puzzleOrder, setPuzzleOrder] = useState<string>("");
	const [updatePuzzleOrderMessage, setUpdatePuzzleOrderMessage] = useState<string>("");
	const [message, setMessage] = useState<string | null>(null);

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
				// console.log(response);
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
				// console.log(response);
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
				// console.log(response);
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
				console.log(data);
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
		setMessage(null);
		setUpdatePuzzleOrderMessage("");
		e.preventDefault();
		const list = puzzleOrder.split(",").map((item) => parseInt(item));
		try {
			const response = await axios.post(`${slug}/${teamId}/create-puzzle-order/`, {
				list: list,
			});
			const data = response.data;
			if (response.status === 201) {
				setUpdatePuzzleOrderMessage("Puzzle order updated successfully");
				setTeamId("");
				setPuzzleOrder("");
				setMessage(null);
			} else {
				setUpdatePuzzleOrderMessage(data.error);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			setMessage("Invalid Puzzle Order. Please check the puzzle IDs and try again.");
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
				<div className="max-w-5xl flex mx-auto">
					{allTeamsData.length === 0 && (
						<div>
							<p className="text-2">
								No teams registered for this hunt... yet. You can set puzzle order for teams once they register.
							</p>
						</div>
					)}
					{allTeamsData.length > 0 && (
						<div>
							<p className="text-4 text-white text-stroke-[4px]">Here's the current puzzle order list</p>
							<p className="text-1 text-white text-stroke-1 md:text-lg">
								(The list have the IDs of the puzzles(in the database), not necessarily the serial you put them in.)
							</p>
							<div className="m-2 sm:m-8 rounded-md grid grid-cols-[auto_1fr_1fr_1fr] styled-div-1 px-4">
								<div className="grid grid-cols-subgrid col-span-full text-center [&>*]:py-3 font-bold">
									<div className="border-r border-r-black pr-4">Team ID</div>
									<div className="border-r border-r-black px-4">Team Name</div>
									<div className="border-r border-r-black px-4">Team Leader</div>
									<div>Puzzle (IDs) Order</div>
								</div>
								{allTeamsData.map((teamData, index) => {
									return (
										<div className="grid grid-cols-subgrid col-span-full text-center [&>*]:py-2" key={teamData.team_id}>
											<div className="border-r border-r-black pr-4">{teamData.team_id}</div>
											<div className="border-r border-r-black px-4">{teamData.team_name}</div>
											<div className="border-r border-r-black px-4">{teamData.team_leader}</div>
											{teamData.team_puzzle_order.length > 0 ? (
												<div className="flex flex-wrap items-left justify-center px-4">
													{teamData.team_puzzle_order.map((puzzleId, index) => {
														return (
															<p className="text-1" key={`${teamData.team_id}-${puzzleId}`}>
																{puzzleId}
																{index + 1 !== teamData.team_puzzle_order.length && ","}
															</p>
														);
													})}
												</div>
											) : (
												<p className="text-1 text-left text-red-800 px-4">Not Set(random order will be applied)</p>
											)}
										</div>
									);
								})}
							</div>

							<div>
								<p className="text-2">Update Puzzle Order</p>
								<p className="text-1 md:text-lg">
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
										<p className="text-2 styled-div-1 bg-green-500 text-base px-4 empty:hidden">
											{updatePuzzleOrderMessage}
										</p>
										<p className="text-2 bg-red-500 styled-div-1 text-base empty:hidden">{message}</p>
									</div>
								</form>
							</div>

							{/* Puzzle info(IDS) */}

							<div className="my-4 max-w-[40rem] mx-auto">
								<p className="text-4">Puzzles of this hunt</p>
								<div className="m-2 sm:m-8 rounded-md grid grid-cols-[auto_1fr_auto] styled-div-1 px-4">
									<div className="grid grid-cols-subgrid col-span-full justify-items-center [&>*]:py-3 font-bold">
										<div>ID</div>
										<div className="justify-self-stretch mx-4 px-4 border-x-black border-x">Name</div>
										<div>Points</div>
									</div>
									{puzzles.map((puzzle, index) => {
										return (
											<div className="grid grid-cols-subgrid col-span-full justify-items-center [&>*]:py-1">
												<div>{puzzle.id}</div>
												<div className="justify-self-stretch mx-4 px-4 border-x-black border-x">{puzzle.name}</div>
												<div>{puzzle.points}</div>
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
