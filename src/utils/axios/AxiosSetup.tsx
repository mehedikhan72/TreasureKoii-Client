import axios from "axios";

import { JwtPayload } from "jwt-decode";
import { jwtDecode } from "jwt-decode";

import { useState, useContext } from "react";
import AuthContext from "../context/AuthContext";

// const instance = axios.create({
//     baseURL: 'https://api.treasurekoii.com/api/'
// });

const instance = axios.create({
  baseURL: "http://localhost:8000/api/",
});

// Add a request interceptor to add the access token to the request headers
instance.interceptors.request.use((config) => {
  const authTokens = localStorage.getItem("authTokens");

  if (authTokens) {
    const accessToken = JSON.parse(authTokens).access;
    // if (isTokenExpired(accessToken)) {
    //   const contextData = useContext(AuthContext);
    //   const updateToken = contextData?.updateToken;
    //   if (updateToken) {
    //     console.log("calling update token from axios setup");
    //     updateToken();
    //   }
    // }

    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

function isTokenExpired(token: string) {
  const decodedToken: JwtPayload = jwtDecode(token);
  const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
  if (!decodedToken.exp) {
    return false;
  }
  return decodedToken.exp < currentTime;
}

export default instance;

// for images
export const rootUrl = "http://127.0.0.1:8000";
// export const rootUrl = "https://api.treasurekoii.com";
