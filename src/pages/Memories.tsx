import React from "react";

type Props = {};

const Memories = (props: Props) => {
	return (
		<div className="flex flex-col justify-center items-center p-2 m-4 mt-8">
			<p className="text-4 stroked-text-md mb-4">We help you create core life memories.</p>
			<div className="relative w-full max-w-[30rem] aspect-square mb-8">
				<div className="absolute top-0 left-[4%] p-[2%] pb-[7%] bg-prim-text rounded-sm w-[52%] drop-shadow-lg shadow-md shadow-zinc-800 -rotate-2">
					<img src="/polaroid-2.webp" className="w-full aspect-square object-cover object-center rounded-sm" />
				</div>
				<div className="absolute top-[5%] right-0 p-[2%] pb-[7%] bg-prim-text rounded-sm w-[52%] drop-shadow-lg shadow-md shadow-zinc-800 rotate-3">
					<img src="/polaroid-1.webp" className="w-full aspect-square object-cover object-center rounded-sm" />
				</div>
				<div className="absolute top-[50%] right-[3%] p-[2%] pb-[7%] bg-prim-text rounded-sm w-[52%] drop-shadow-lg shadow-md shadow-zinc-800 rotate-1">
					<img src="/polaroid-4.webp" className="w-full aspect-square object-cover object-center rounded-sm" />
				</div>
				<div className="absolute top-[45%] left-0 p-[2%] pb-[7%] bg-prim-text rounded-sm w-[52%] drop-shadow-lg shadow-md shadow-zinc-800 -rotate-3">
					<img src="/polaroid-3.webp" className="w-full aspect-square object-cover object-center rounded-sm" />
				</div>
			</div>
		</div>
	);
};

export default Memories;
