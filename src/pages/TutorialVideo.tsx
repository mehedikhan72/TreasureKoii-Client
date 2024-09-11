import React from "react";

const TutorialVideo = () => {
	return (
		<div className="mx-auto flex flex-col justify-center items-center max-w-[60rem] px-8 mt-8">
			<p className="text-5 stroked-text-md">Watch the tutorial video below to learn how to use TreasureKoii.</p>
			<video
				preload="none"
				src={"Treasurekoii.mp4"}
				poster="thunt-home.webp"
				className="h-[40rem] p-0 max-sm:px-4 mt-4 m-0 sm:self-stretch styled-div-1 rounded"
				controls
			/>
		</div>
	);
};

export default TutorialVideo;
