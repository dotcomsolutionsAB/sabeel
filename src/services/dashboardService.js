// src/services/dashboardService.js
import api from "./api";

export async function retrieveDashboard() {
    // your API is POST: /dashboard/retrieve
    const res = await api.get("/dashboard/retrieve");

    // res is already the full JSON because api.js returns response.data
    // { code, status, message, data }

    if (res?.code !== 200) {
        throw new Error(res?.message || "Failed to fetch dashboard");
    }

    return res.data; // return only the "data" object (mumineen + establishment)
}


export async function retrieveSabeelDue(type) {
    // type must be: "sabeel" OR "establishment"
    const res = await api.post("/dashboard/retrieve_sabeel_due", { type });

    if (res?.code !== 200) throw new Error(res?.message || "Failed to fetch sabeel due");

    // res.data is array: [{year, due}, ...]
    return Array.isArray(res.data) ? res.data : [];
}