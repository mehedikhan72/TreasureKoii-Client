import React from "react";

const LeaderboardTable: React.FC<{ leaderBoard: [] }> = ({ leaderBoard }) => {
	return (
		<div className="my-10 flex flex-col items-center justify-center m-2">
			<p className="text-4 stroked-text-md">Leaderboard</p>
			<div className="w-full max-w-[60rem] styled-div-1 p-0 grid grid-cols-2 [&>*>*]:px-4">
				<div
					className="grid grid-cols-subgrid col-span-full py-2 pt-4 bg-prim bg-opacity-70 rounded-t
border-b border-b-black text-center font-bold"
				>
					<p>Team Name</p>
					<p>Points</p>
				</div>
				{leaderBoard.map((team: any, index: number) => (
					<div
						key={team.id}
						className={`grid grid-cols-subgrid col-span-full py-2 odd:bg-prim odd:bg-opacity-50 last:rounded-b`}
					>
						<div
							className={
								index < 3
									? "text-1 font-bold flex items-center justify-center"
									: "text-1 flex items-center justify-center"
							}
						>
							{team.team_name}
							{index < 3 && (
								<div
									className="ml-4 drop-shadow-lg"
									style={{
										height: `${1 + (3 - index * .5) / 4}rem`,
										width: `${1 + (3 - index * .5) / 4}rem`,
									}}
								>
									{badges[index]}
								</div>
							)}
						</div>
						<p className="text-1">{team.points}</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default LeaderboardTable;

const badges = [
	<svg
		xmlns="http://www.w3.org/2000/svg"
		shape-rendering="geometricPrecision"
		text-rendering="geometricPrecision"
		image-rendering="optimizeQuality"
		fill-rule="evenodd"
		clip-rule="evenodd"
		viewBox="0 0 360 511.48"
	>
		<path
			fill="#F5C800"
			d="M183.21.03c9.35-.4 16.72 2.86 24.15 7.59 9.44 5.98 20.06 17.8 33.17 25.3 18.45 10.54 52.61-4 70.11 21.99 10.21 15.16 10.69 27.04 11.45 38.78.82 12.67 3.04 24.32 16 41.47 21.47 28.38 25.94 47.27 14.88 66.96-7.54 13.42-23.41 20.88-27.09 29.38-7.81 18.09.83 31.72-9.87 52.81-7.43 14.62-18.89 24.26-34.16 29.18-12.88 4.14-25.8-1.85-36.1 2.48-18.12 7.61-31.48 25.3-45.89 29.77-5.57 1.73-11.11 2.58-16.65 2.54-5.53.04-11.08-.81-16.64-2.54-14.42-4.47-27.78-22.16-45.9-29.77-10.3-4.33-23.22 1.66-36.1-2.48-15.26-4.92-26.73-14.56-34.16-29.18-10.7-21.09-2.06-34.72-9.87-52.81-3.68-8.5-19.55-15.96-27.09-29.38-11.06-19.69-6.58-38.58 14.88-66.96 12.96-17.15 15.18-28.8 16-41.47.76-11.74 1.24-23.62 11.45-38.78 17.5-25.99 51.66-11.45 70.11-21.99 13.12-7.5 23.73-19.32 33.17-25.3 7.44-4.73 14.81-7.99 24.15-7.59z"
		/>
		<path
			fill="#FFDD61"
			d="M183.21.04c9.35-.41 16.71 2.86 24.15 7.58 9.44 5.98 20.06 17.8 33.17 25.3 14.67 8.38 39.28.91 57.54 10.56L91.95 314.9c-2.45-.2-4.92-.62-7.38-1.41-15.27-4.92-26.73-14.55-34.16-29.18-10.7-21.09-2.06-34.72-9.87-52.81-3.68-8.5-19.55-15.96-27.09-29.38-11.06-19.69-6.58-38.58 14.87-66.96 12.97-17.14 15.19-28.8 16.01-41.47.76-11.74 1.24-23.62 11.44-38.78 17.51-26 51.68-11.45 70.12-21.99 13.12-7.5 23.74-19.32 33.17-25.3C166.5 2.9 173.87-.37 183.21.04z"
		/>
		<path
			fill="#E37E00"
			d="M182.71 46.79c71.81 0 130.03 58.22 130.03 130.04 0 71.81-58.22 130.03-130.03 130.03-71.82 0-130.04-58.22-130.04-130.03 0-71.82 58.22-130.04 130.04-130.04z"
		/>
		<path
			fill="#fff"
			d="M182.71 72.88c57.41 0 103.94 46.54 103.94 103.95 0 57.41-46.53 103.94-103.94 103.94S78.76 234.24 78.76 176.83 125.3 72.88 182.71 72.88z"
		/>
		<path
			fill="#EDEDED"
			d="M182.71 72.88c27.48 0 52.49 10.67 71.07 28.09l-127.44 163.2c-4.62-2.98-8.99-6.33-13.07-9.99-21.18-19.02-34.51-46.63-34.51-77.35 0-57.41 46.54-103.95 103.95-103.95z"
		/>
		<path
			fill-rule="nonzero"
			d="M221.66 228.94h-77.9v-26.98h25.09v-44.68l-25.09 2.02v-26.98l33.85-8.76h26.65v78.4h17.4z"
		/>
	</svg>,
	<svg
		xmlns="http://www.w3.org/2000/svg"
		shape-rendering="geometricPrecision"
		text-rendering="geometricPrecision"
		image-rendering="optimizeQuality"
		fill-rule="evenodd"
		clip-rule="evenodd"
		viewBox="0 0 360 511.48"
	>
		<path
			fill="#C0C0C0"
			d="M183.21.03c9.35-.4 16.72 2.86 24.15 7.59 9.44 5.98 20.06 17.8 33.17 25.3 18.45 10.54 52.61-4 70.11 21.99 10.21 15.16 10.69 27.04 11.45 38.78.82 12.67 3.04 24.32 16 41.47 21.47 28.38 25.94 47.27 14.88 66.96-7.54 13.42-23.41 20.88-27.09 29.38-7.81 18.09.83 31.72-9.87 52.81-7.43 14.62-18.89 24.26-34.16 29.18-12.88 4.14-25.8-1.85-36.1 2.48-18.12 7.61-31.48 25.3-45.89 29.77-5.57 1.73-11.11 2.58-16.65 2.54-5.53.04-11.08-.81-16.64-2.54-14.42-4.47-27.78-22.16-45.9-29.77-10.3-4.33-23.22 1.66-36.1-2.48-15.26-4.92-26.73-14.56-34.16-29.18-10.7-21.09-2.06-34.72-9.87-52.81-3.68-8.5-19.55-15.96-27.09-29.38-11.06-19.69-6.58-38.58 14.88-66.96 12.96-17.15 15.18-28.8 16-41.47.76-11.74 1.24-23.62 11.45-38.78 17.5-25.99 51.66-11.45 70.11-21.99 13.12-7.5 23.73-19.32 33.17-25.3 7.44-4.73 14.81-7.99 24.15-7.59z"
		/>
		<path
			fill="#F0F0F0"
			d="M183.21.04c9.35-.41 16.71 2.86 24.15 7.58 9.44 5.98 20.06 17.8 33.17 25.3 14.67 8.38 39.28.91 57.54 10.56L91.95 314.9c-2.45-.2-4.92-.62-7.38-1.41-15.27-4.92-26.73-14.55-34.16-29.18-10.7-21.09-2.06-34.72-9.87-52.81-3.68-8.5-19.55-15.96-27.09-29.38-11.06-19.69-6.58-38.58 14.87-66.96 12.97-17.14 15.19-28.8 16.01-41.47.76-11.74 1.24-23.62 11.44-38.78 17.51-26 51.68-11.45 70.12-21.99 13.12-7.5 23.74-19.32 33.17-25.3C166.5 2.9 173.87-.37 183.21.04z"
		/>
		<circle fill="#80B0CC" cx="182.71" cy="176.83" r="130.04" />
		<circle fill="#fff" cx="182.71" cy="176.83" r="103.95" />
		<path
			fill="#EDEDED"
			d="M182.71 72.88c27.48 0 52.49 10.67 71.07 28.09l-127.44 163.2c-4.62-2.98-8.99-6.33-13.07-9.99-21.18-19.02-34.51-46.63-34.51-77.35 0-57.41 46.54-103.95 103.95-103.95z"
		/>
		<path
			fill-rule="nonzero"
			d="m145.36 154.4-4.38-25.11c14.16-4.28 28.27-6.41 42.32-6.41 5.62 0 10.31.17 14.08.5 3.76.34 7.67 1.18 11.72 2.53 4.04 1.35 7.24 3.21 9.6 5.57 5.4 5.39 8.09 13.65 8.09 24.78s-3.14 19.33-9.43 24.62c-6.3 5.28-19.56 11.35-39.8 18.2v4.73h47.55v26.97h-86.49v-21.07c0-6.3 1.18-12.31 3.54-18.05 1.46-3.25 5-7.19 10.62-11.79 3.03-2.59 7.11-5.06 12.22-7.42 5.11-2.37 9.95-4.59 14.5-6.67 4.56-2.08 8.23-3.79 11.05-5.14v-9.1c-5.06-.56-9.72-.84-14-.84-10.34 0-20.74 1.23-31.19 3.7z"
		/>
	</svg>,
	<svg
		xmlns="http://www.w3.org/2000/svg"
		shape-rendering="geometricPrecision"
		text-rendering="geometricPrecision"
		image-rendering="optimizeQuality"
		fill-rule="evenodd"
		clip-rule="evenodd"
		viewBox="0 0 360 511.48"
	>
		<path
			fill="#CD7F32"
			d="M183.21.03c9.35-.4 16.72 2.86 24.15 7.59 9.44 5.98 20.06 17.8 33.17 25.3 18.45 10.54 52.62-4 70.12 21.99 10.2 15.16 10.68 27.04 11.44 38.78.82 12.67 3.04 24.32 16.01 41.47 21.46 28.38 25.93 47.27 14.87 66.96-7.54 13.42-23.41 20.88-27.09 29.38-7.81 18.09.83 31.72-9.87 52.81-7.43 14.62-18.89 24.26-34.16 29.18-12.87 4.14-25.79-1.85-36.1 2.48-18.12 7.61-31.48 25.3-45.89 29.77-5.57 1.73-11.11 2.58-16.65 2.54-5.53.04-11.08-.81-16.64-2.54-14.42-4.47-27.78-22.16-45.89-29.77-10.31-4.33-23.23 1.66-36.11-2.48-15.26-4.92-26.73-14.56-34.16-29.18-10.7-21.09-2.05-34.72-9.87-52.81-3.67-8.5-19.55-15.96-27.09-29.38-11.05-19.69-6.58-38.58 14.88-66.96 12.96-17.15 15.18-28.8 16-41.47.76-11.74 1.24-23.62 11.45-38.78 17.5-25.99 51.66-11.45 70.11-21.99 13.12-7.5 23.73-19.32 33.17-25.3 7.44-4.73 14.81-7.99 24.15-7.59z"
		/>
		<path
			fill="#d28c46"
			d="M183.21.04c9.35-.41 16.71 2.86 24.15 7.58 9.44 5.98 20.06 17.8 33.17 25.3 14.67 8.38 39.28.91 57.55 10.56L91.95 314.9c-2.45-.2-4.92-.62-7.38-1.41-15.27-4.92-26.73-14.55-34.16-29.18-10.7-21.09-2.05-34.72-9.87-52.81-3.67-8.5-19.55-15.96-27.09-29.38-11.06-19.69-6.58-38.58 14.88-66.96 12.96-17.14 15.18-28.8 16-41.47.76-11.74 1.24-23.62 11.44-38.78 17.51-26 51.68-11.45 70.12-21.99 13.12-7.5 23.74-19.32 33.17-25.3C166.5 2.9 173.87-.37 183.21.04z"
		/>
		<circle fill="#905923" cx="182.71" cy="176.83" r="130.04" />
		<circle fill="#fff" cx="182.71" cy="176.83" r="103.95" />
		<path
			fill="#EDEDED"
			d="M182.71 72.88c27.48 0 52.49 10.67 71.07 28.09l-127.44 163.2c-4.62-2.98-8.99-6.33-13.07-9.99-21.18-19.02-34.51-46.63-34.51-77.35 0-57.41 46.54-103.95 103.95-103.95z"
		/>
		<path
			fill-rule="nonzero"
			d="M190.04 161.24v-10.96c-3.37-.56-8.83-.84-16.36-.84-7.53 0-16.91 1.18-28.15 3.54l-4.39-24.95c13.72-4.28 26.98-6.41 39.79-6.41 11.02 0 19 .67 23.94 2.02 4.95 1.35 8.61 2.98 10.96 4.89 5.18 4.38 7.76 11.01 7.76 19.89 0 11.24-4.67 19.34-13.99 24.28v.85c11.13 4.6 16.69 12.98 16.69 25.12 0 5.95-.93 11.04-2.78 15.25-1.86 4.22-4.19 7.48-7 9.79-2.81 2.3-6.52 4.13-11.13 5.48-6.86 1.91-16.49 2.86-28.91 2.86-12.42 0-24.87-1.46-37.35-4.38l4.72-27.82c10.68 2.58 19.73 3.87 27.15 3.87 7.42 0 13.77-.33 19.05-1.01v-10.78l-29-2.87v-24.45l29-3.37z"
		/>
	</svg>,
];
