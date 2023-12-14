// src/AuthContext.tsx
import React, { createContext, useState, useEffect, FC } from "react";
import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { AuthContextProps, AuthProviderProps, AuthTokens } from "../../types";
import axios from "../axios/AxiosSetup";
import { AxiosError } from "axios";

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export default AuthContext;

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
	const [authTokens, setAuthTokens] = useState<AuthTokens | null>(null);
	const [user, setUser] = useState<JwtPayload | null>(null);

	const [tokenInitLoad, setTokenInitLoad] = useState<boolean>(false);

	useEffect(() => {
		const storedTokens = localStorage.getItem("authTokens");

		if (storedTokens) {
			setAuthTokens(JSON.parse(storedTokens));
			setUser(jwtDecode(storedTokens));
		}

		setTokenInitLoad(true);
	}, []);

	const [message, setMessage] = useState<string | null>(null);
	const navigate = useNavigate();

	const loginUser = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();

		const formElem: HTMLFormElement = e.target as HTMLFormElement;

		if (!formElem || !formElem.email) {
			console.error("Invalid form event. Unable to retrieve email.");
			return;
		}

		const formData = {
			email: formElem.email.value,
			password: formElem.password.value,
		};

		console.log(formData);

		try {
			let response = await axios.post(`token/`, formData);
			let data = response.data;
			if (response.status === 200) {
				setAuthTokens(data);
				setUser(jwtDecode(data.access));
				localStorage.setItem("authTokens", JSON.stringify(data));
				navigate("/");
			} else {
				setMessage(data.detail);
			}
			console.log(response);
		} catch (error) {
			console.log(error);
			if (error instanceof AxiosError) setMessage(error.response?.data.detail);
		}
	};

	const logoutUser = (): void => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem("authTokens");
		navigate(0);
	};

	const updateToken = async (): Promise<void> => {
		const formData = {
			refresh: authTokens ? authTokens.refresh : "",
		};

		console.log(formData);

		try {
			let response = await axios.post(`token/refresh/`, formData);
			let data = response.data;

			console.log(response);

			if (response.status === 200) {
				setAuthTokens(data);
				setUser(jwtDecode(data.access));
				localStorage.setItem("authTokens", JSON.stringify(data));
			} else {
				logoutUser();
			}
		} catch (error) {
			console.log(error);
			logoutUser();
		}
	};

	useEffect(() => {
		if (!tokenInitLoad || !user) {
			return;
		}

		updateToken();
	}, [tokenInitLoad]);

	useEffect(() => {
		if (!tokenInitLoad || !authTokens) {
			return;
		}

		let interval: number | undefined;
		let refreshTime = 1000 * 60 * 55;

		interval = window.setInterval(() => {
			updateToken();
			console.log("Token refreshed");
		}, refreshTime);

		return () => {
			interval && clearInterval(interval);
		};
	}, [authTokens]);

	return (
		<AuthContext.Provider
			value={{
				message,
				user,
				loginUser,
				logoutUser,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};
