import api from "./api";

export async function fetchSectorsApi() {
    try {
        const res = await api.get("/sector");
        console.log("API Response in fetchSectorsApi:", res);
        return res?.data ?? res;
    } catch (error) {
        console.error("Error fetching sectors:", error);
    }
}
