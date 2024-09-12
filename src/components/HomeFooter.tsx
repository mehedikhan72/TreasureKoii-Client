import React, { useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../utils/context/AuthContext";

const HomeFooter: React.FC = () => {
	const contextData = useContext(AuthContext);
	const user = contextData?.user;
	const logoutUser = contextData?.logoutUser;
	return (
		<div className="mt-20 p-10 w-full bottom-0 bg-[#f0cead] bg-opacity-50">
			<div className="flex justify-center items-center flex-wrap">
				<Link to={{ pathname: `/` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					Home
				</Link>
				<Link to={{ pathname: `/` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					About
				</Link>
				<Link to={{ pathname: `/` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					Privacy Policy
				</Link>
				<Link to={{ pathname: `/` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					FAQ
				</Link>
				<Link to={{ pathname: `/points-system` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					Points System
				</Link>
				<Link to={{ pathname: `/` }} className="text-white text-stroke-[3px] text-2 link-1 flex-1">
					Contact Us
				</Link>
			</div>
			<div>
				{user && (
					<div className="flex justify-center items-center py-3">
						<p className="text-white text-stroke-[3px] text-1">
							Logged in as{" "}
							<span className="text-white text-stroke-[3px] text-3">
								{user.first_name} {user.last_name}.
							</span>
						</p>
						<button className="text-white text-stroke-[3px] text-2 hover:underline" onClick={logoutUser}>
							Logout
						</button>
					</div>
				)}
				{!user && (
					<div className=" py-3 flex gap-16 justify-center items-center">
						<Link
							to={{ pathname: `/register` }}
							className="text-white text-stroke-[3px] text-2 link-1 px-1 hover:underline"
						>
							Sign Up
						</Link>
						<Link
							to={{ pathname: `/login` }}
							className="text-white text-stroke-[3px] text-2 link-1 px-1 hover:underline"
						>
							Log In
						</Link>
					</div>
				)}
			</div>
			<p className="text-white text-stroke-[3px] text-1">© 2023 TreasureKoii. All rights reserved.</p>
		</div>
	);
};

export default HomeFooter;
