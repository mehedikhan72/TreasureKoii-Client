import axios from "axios";

import { jwtDecode, JwtPayload } from "jwt-decode";

const instance = axios.create({
    baseURL: 'https://api.treasurekoii.com/api/'
});

// const instance = axios.create({
// 	baseURL: "http://localhost:8000/api/",
// });

// Add a request interceptor to add the access token to the request headers

export default instance;

// for images
// export const rootUrl = "http://127.0.0.1:8000";
export const rootUrl = "https://api.treasurekoii.com";
