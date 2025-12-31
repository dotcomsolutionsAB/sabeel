// src/services/authService.js
import api from "./api";

export async function loginApi({ username, password }) {
    // returns: {code,status,message,data:{...}}
    return api.post("/login", { username, password });
}

export async function logoutApi() {
    // returns: {code,status,message,data:[]}
    return api.post("/logout");
}
