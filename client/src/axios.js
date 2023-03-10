import axios from "axios";

export const makeRequest = axios.create({
    baseURL: "https://youtube-szuf.onrender.com/api/",
    withCredentials: true
})