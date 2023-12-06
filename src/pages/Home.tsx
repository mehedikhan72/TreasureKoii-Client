import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";

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
	console.log(user);
	return (
		<div>
			<div className="">
				<TreasureKoiiImg />
				<p className="text-3">TreasureKoii: Your ultimate solution for all your treasure hunt adventures.</p>
			</div>

			<div className="flex justify-center items-center p-5">
				<img
					src="https://escapetrails.co/wp-content/uploads/2020/03/Treasure-hunt.jpg"
					className="w-5/6 md:w-1/2 rounded-xl"
					alt="treasure hunt"
				/>
			</div>

			<div className="flex justify-center items-center">
				<p className="text-2">
					Empower your treasure hunt adventures with our platform – your all-in-one solution for creating captivating,
					interactive, and personalized treasure hunts. Unleash creativity, engage participants, and turn any location
					into an exciting journey of discovery. Start crafting unforgettable experiences today!
				</p>
			</div>

			<div className="flex justify-center items-center m-5">
				<Link to={{ pathname: `/create-hunt/` }}>
					<button className="my-btn-1">Create A Hunt</button>
				</Link>
				<Link to={{ pathname: `/join-hunt/` }}>
					<button className="my-btn-1">Join A Hunt</button>
				</Link>
			</div>
			<HomeFooter />
		</div>
	);
};

export default Home;
