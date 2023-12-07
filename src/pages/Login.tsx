import React, { useContext, useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import HomeFooter from "../components/HomeFooter";
import TreasureKoiiImg from "../components/TreasureKoiiImg";
import { AuthContextProps } from "../types";
import AuthContext from "../utils/context/AuthContext";

const Login: React.FC = () => {
	const contextData = useContext(AuthContext);

	useEffect(() => {
		document.title = "Login | TreasureKoii";

		return () => {
			document.title = "TreasureKoii";
		};
	}, []);

	if (!contextData) {
		return null;
	}
	const { loginUser, user, message }: AuthContextProps = contextData;

	return (
		<div className="flex flex-col min-h-screen">
			{user && <Navigate to="/" />}
			<div className="mt-8">
				<TreasureKoiiImg />
			</div>

			<div className="flex flex-col justify-center items-center gap-10 flex-1">
				<div className="text-6xl font-extrabold">Login</div>

				<form onSubmit={loginUser} className="flex flex-col justify-center items-center gap-2 w-4/6">
					{message && <p className="text-1 text-red-500">{message}</p>}
					<input type="email" name="email" placeholder="Email" className="my-input-field w-full" />
					<input type="password" name="password" placeholder="Password" className="my-input-field w-full" />
					<button type="submit" className="my-btn-1 w-full">
						Login
					</button>

					<div className="text-1 flex justify-center items-center">
						<p className="px-1">Don't have an account?</p>
						<Link to={{ pathname: `/register` }}>
							<div className="flex justify-center items-center">
								<p className="text-blue-500">Register</p>
								<p className="px-1"> here.</p>
							</div>
						</Link>
					</div>
				</form>
			</div>

			<HomeFooter />
		</div>
	);
};

export default Login;
