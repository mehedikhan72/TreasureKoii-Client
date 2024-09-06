import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import RegisteredHunts from "../components/RegisteredHunts";
import OrganizingHunts from "../components/OrganizingHunts";
import RecentlyHosted from "../components/RecentlyHosted";

const Home: React.FC = () => {
	useEffect(() => {
		document.title = "Home | TreasureKoii";

		return () => {
			document.title = "TreasureKoii";
		};
	}, []);

	let constextData = useContext(AuthContext);
	if (!constextData) {
		return null;
	}
	const { user } = constextData;
	const homeImg = "thunt-home.webp";
	return (
		<>
			<div>
				<TreasureKoiiImg />
				<p className="text-3 mx-2 stroked-text-sm">TreasureKoii: Your ultimate solution for all your treasure hunt adventures.</p>
			</div>

			{/* <div className="flex justify-center items-center mt-5">
				<img src={homeImg} className="w-5/6 md:w-1/2 rounded-xl" alt="treasure hunt" />
			</div> */}

			{/* <div className="flex justify-center items-center mt-2">
				<p className="text-2 mx-5 max-w-3xl">
					Empower your treasure hunt adventures with our platform – your all-in-one solution for creating captivating,
					interactive, and personalized treasure hunts. Unleash creativity, engage participants, and turn any location
					into an exciting journey of discovery. Start crafting unforgettable experiences today!
				</p>
			</div> */}

			<div className="flex justify-center items-center mt-5">
				<Link to={{ pathname: `/organize-hunt/` }}>
					<button className="my-btn-1">Organize A Hunt</button>
				</Link>
				<Link to={{ pathname: `/join-hunt/` }}>
					<button className="my-btn-1">Join A Hunt</button>
				</Link>
			</div>

			{/* <div className="flex justify-center items-center p-2 m-4">
				<p className="text-4 stroked-text-md">We help you create core life memories.</p>
				<div>
					<img src="/hero-img-1.jpg"
					className="w-[300px] object-cover h-auto">
					</img>
				</div>
			</div> */}
			<OrganizingHunts />
			<RecentlyHosted />
			<HomeFooter />
		</>
	);
};

export default Home;
