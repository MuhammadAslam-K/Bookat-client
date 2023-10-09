import axios from "axios";

const authURL = import.meta.env.VITE_AUTH_PORT;

export const driverAxios = axios.create({
    baseURL: authURL,
    headers: {
        "Content-Type": "application/json",
    },
});

driverAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem('driverToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});