import React, { useState, useEffect } from "react";

const LeaderboardTable: React.FC<{ leaderBoard: [] }> = ({ leaderBoard }) => {
	return (
		<div className="my-10">
			<p className="text-4">Leaderboard</p>
			<div className="w-full px-4">
				<div className="flex flex-col">
					<div className="flex justify-between p-2">
						<p className="flex-1 text-2">Team Name</p>
						<p className="flex-1 text-2">Points</p>
					</div>
					{leaderBoard.map((team: any, index: number) => (
						<div
							key={team.id}
							className={`flex justify-between p-2 ${
								index === 0
									? "bg-green-600 hover:scale-105"
									: index === 1
									? "bg-green-400 hover:scale-105"
									: index === 2
									? "bg-yellow-300 hover:scale-105"
									: index % 2 === 0
									? "bg-gray-100 hover:scale-105"
									: "bg-gray-200 hover:scale-105"
							}`}
						>
							<p className="flex-1 text-1">{team.team_name}</p>
							<p className="flex-1 text-1">{team.points}</p>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default LeaderboardTable;
