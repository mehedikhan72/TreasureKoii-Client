import { useContext, useEffect, useState } from "react";
import axiosInstance from "../axios/AxiosSetup";
import AuthContext from "../context/AuthContext";
import { AxiosInstance } from "axios";

const useAxios = () => {
	const contextData = useContext(AuthContext);

	const axios = axiosInstance as AxiosInstance;

	useEffect(() => {
		const authTokensLocal = localStorage.getItem("authTokens");
		const authTokens = authTokensLocal ? JSON.parse(authTokensLocal) : null;

		const requestIntercept = axios.interceptors.request.use(
			(config) => {
				if (!config.headers["Authorization"] && authTokens) {
					config.headers["Authorization"] = `Bearer ${authTokens}`;
				}
				return config;
			},
			(error) => Promise.reject(error)
		);

		const responseIntercept = axios.interceptors.response.use(
			(response) => response,
			async (error) => {
				const prevRequest = error?.config;
				console.log(prevRequest);
				if (error?.response?.status === 401 && !prevRequest.sent && prevRequest.url !== "token/") {
					prevRequest.sent = true;

					const newAccessToken = await contextData?.updateToken();

					if (!!newAccessToken) {
						prevRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
						return axios(prevRequest);
					}
				}

				return Promise.reject({ ...error });
			}
		);

		return () => {
			axios.interceptors.request.eject(requestIntercept);
			axios.interceptors.response.eject(responseIntercept);
		};
	}, [contextData]);

	return axios;
};

export default useAxios;
