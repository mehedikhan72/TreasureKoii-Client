import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";

const Home: React.FC = () => {
	let constextData = useContext(AuthContext);
	if (!constextData) {
		return null;
	}
	const { user } = constextData;
	console.log(user);
	return (
		<>
			<div className="hero">
				<div className="hero__title">TreasureKoii</div>
			</div>
			<div className="description">
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Labore fuga praesentium consequatur ipsum laboriosam
				libero, rerum cupiditate sunt, architecto odio odit commodi unde illum, porro et eaque distinctio fugiat.
				Numquam?
			</div>
			<div className="cta">
				<Link to={{ pathname: `/create-hunt/` }}>Create A Hunt</Link>
				<Link to={{ pathname: `/join-team/` }}>Join A Hunt</Link>
			</div>
			<footer>info info</footer>
		</>
	);
};

export default Home;
