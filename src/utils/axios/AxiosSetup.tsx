import axios from 'axios'

const instance = axios.create({
    baseURL: 'https://api.treasurekoii.com/'
});

// Add a request interceptor to add the access token to the request headers
instance.interceptors.request.use(config => {
    const authTokens = localStorage.getItem('authTokens');
    
    if (authTokens) {
        const accessToken = JSON.parse(authTokens).access;
        config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
}); 

export default instance;