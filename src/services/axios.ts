import axios from "axios";

const authURL = import.meta.env.VITE_AUTH_PORT;

export const authServer = axios.create({
    baseURL: authURL,
    headers: {
        "Content-Type": "application/json",
    },
});

const log = () => console.log(authURL, "call")

log()