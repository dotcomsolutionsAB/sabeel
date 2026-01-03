// src/services/userService.js
import api from "./api";

export async function retrieveUsersApi(payload) {
    const res = await api.post("/users/retrieve", payload);
    return res.data; // {code,status,message,data,pagination}
}
