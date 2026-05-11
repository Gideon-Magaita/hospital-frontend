import axios from "axios";
import { getToken } from "./AuthService";

const API = axios.create({
    // baseURL: "http://192.168.1.183:8080/api"
    baseURL:"http://192.168.11.48:8080/api"
});

// REQUEST INTERCEPTOR
API.interceptors.request.use(
    (config) => {

        const token = getToken();

        if (token) {
            config.headers.Authorization = token;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);

export default API;