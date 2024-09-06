import React from "react";

const LeaderboardTable: React.FC<{ leaderBoard: [] }> = ({ leaderBoard }) => {
	return (
		<div className="my-10">
			<p className="text-4 stroked-text-md">Leaderboard</p>
			<div className="w-full mx-auto max-w-[60rem] styled-div-1 p-0 grid grid-cols-2 [&>*>*]:px-4">
				<div
					className="grid grid-cols-subgrid col-span-full py-2 pt-4 bg-prim bg-opacity-70 rounded-t
border-b border-b-black"
				>
					<p className="flex-1 text-2">Team Name</p>
					<p className="flex-1 text-2">Points</p>
				</div>
				{leaderBoard.map((team: any, index: number) => (
					<div
						key={team.id}
						className={`grid grid-cols-subgrid col-span-full py-2 bg-opacity-70 ${
							index === 0
								? "bg-green-500"
								: index === 1
								? "bg-green-400"
								: index === 2
								? "bg-green-300"
								: index % 2 === 0
								? "bg-none"
								: "bg-prim !bg-opacity-40"
						}`}
					>
						<p className="flex-1 text-1">{team.team_name}</p>
						<p className="flex-1 text-1">{team.points}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default LeaderboardTable;
