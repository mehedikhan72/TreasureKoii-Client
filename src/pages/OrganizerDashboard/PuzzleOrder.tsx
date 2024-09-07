import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import HuntNav from "../../components/HuntNav";
import { Hunt, Puzzle, TeamData } from "../../types";
import useAxios from "../../utils/hooks/useAxios";
import Loading from "../../utils/Loading";

const PuzzleOrder = () => {
	const { slug } = useParams();
	const axios = useAxios();

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
				// console.log(data);
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
				toast.success("Puzzle order updated successfully");
				setTeamId("");
				setPuzzleOrder("");
			} else {
				toast.error(data.error);
			}
			// console.log(response);
		} catch (error) {
			console.log(error);
			toast.error("Invalid Puzzle Order. Please check the puzzle IDs and try again.");
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
							<div className=" mt-8">
								<p className="text-3 stroked-text-md">Here's the current puzzle order list</p>
								<p className="text-1 stroked-text-md md:text-lg">
									(The list have the IDs of the puzzles(in the database), not necessarily the serial you put them in.)
								</p>
								<div className="m-2 sm:my-4 rounded-md grid grid-cols-[auto_1fr_1fr_1fr] max-sm:grid-cols-[auto_1fr_1fr] styled-div-1 p-0 [&>*>*]:px-4">
									<div className="grid grid-cols-subgrid col-span-full text-center py-2 pt-4 rounded-t font-bold border-b border-b-black mb-2 bg-prim bg-opacity-70">
										<div>Team ID</div>
										<div>Team Name</div>
										<div>Team Leader</div>
										<div className="max-sm:hidden">Puzzle (IDs) Order</div>
									</div>
									{allTeamsData.map((teamData, index) => {
										return (
											<div
												className="grid grid-cols-subgrid col-span-full text-center py-2 odd:bg-prim odd:bg-opacity-50 last:rounded-b place-items-center gap-y-2 last:pb-2"
												key={teamData.team_id}
											>
												<div>{teamData.team_id}</div>
												<div>{teamData.team_name}</div>
												<div>{teamData.team_leader}</div>
												{teamData.team_puzzle_order.length > 0 ? (
													<div className="flex flex-wrap justify-center items-center max-sm:justify-start w-full max-sm:col-span-full max-sm:text-sm">
														<p className="sm:hidden mr-4 font-semibold">Puzzle (IDs) Order:</p>
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
													<div className="flex flex-wrap justify-center items-center max-sm:justify-start w-full max-sm:col-span-full max-sm:text-sm">
														<p className="sm:hidden mr-4 font-semibold">Puzzle (IDs) Order:</p>
														<div className="text-1 text-red-800 px-4 sm:flex sm:flex-wrap items-center justify-center">
															<span>Not Set</span>
															<span>(random order)</span>
														</div>
													</div>
												)}
											</div>
										);
									})}
								</div>
							</div>

							<div className="mt-16">
								<p className="text-2 stroked-text-md">Update Puzzle Order</p>
								<p className="text-1 stroked-text-md md:text-lg">
									(Puzzle order must be a list of puzzle IDs. Don't have any commas(,) in the list. Example Order:
									45,49,50,46,48,47. Check below to get the IDs of your puzzles.)
								</p>
								<form onSubmit={puzzleOrderUpdated} className="mt-2">
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

							<div className="mt-16 max-w-[40rem] mx-auto">
								<p className="text-4 stroked-text-md">Puzzles of this hunt</p>
								<div className="m-2 sm:m-4 rounded-md grid grid-cols-[auto_1fr_auto] styled-div-1 p-0 [&>*>*]:px-4 text-center">
									<div className="grid grid-cols-subgrid col-span-full text-center py-2 pt-4 rounded-t font-bold border-b border-b-black mb-2 bg-prim bg-opacity-70 ">
										<div className="!px-8">ID</div>
										<div>Name</div>
										<div className="!px-8">Points</div>
									</div>
									{puzzles.map((puzzle, index) => {
										return (
											<div
												className="grid grid-cols-subgrid col-span-full text-center py-1 odd:bg-prim odd:bg-opacity-50 last:rounded-b last:pb-2"
												key={puzzle.id}
											>
												<div>{puzzle.id}</div>
												<div>{puzzle.name}</div>
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
