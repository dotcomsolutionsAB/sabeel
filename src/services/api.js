// src/services/api.js
import axios from "axios";

const api = axios.create({
    baseURL: "https://api.kolkatajamaat.com/api",
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

// ✅ Attach token to every request
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) config.headers.Authorization = `Bearer ${token}`;
        return config;
    },
    (error) => Promise.reject(error)
);

// ✅ Normalize errors (so UI can show message easily)
api.interceptors.response.use(
    (response) => response.data,
    (error) => {
        const msg =
            error?.response?.data?.message ||
            error?.response?.data?.error ||
            error?.message ||
            "Request failed";
        return Promise.reject(new Error(msg));
    }
);

export default api;
