// src/services/establishmentService.js
import api from "./api";

export const retrieveEstablishmentsApi = async ({
    search = "",
    filter = "",
    limit = 10,
    offset = 0,
} = {}) => {
    // api.js returns response.data already
    return api.post("/establishment/retrieve", {
        search,
        filter,
        limit,
        offset,
    });
};

export async function retrieveEstablishmentOverviewApi(establishmentId) {
    return api.get(`/establishment_details/overview/${establishmentId}/retrieve`);
}


// ✅ NEW: update establishment (only name + address)
export async function updateEstablishmentApi(establishmentId, payload) {
    // payload: { name, address }
    const res = await api.post(`/establishment/update/${establishmentId}`, payload);
    return res?.data ?? res;
}

// Example for `createEstablishmentApi` function
export async function createEstablishmentApi(payload) {
    try {
        const response = await api.post("/establishment/create", payload);
        return response?.data; // Ensure that we return response.data
    } catch (error) {
        console.error("API Error:", error); // Log the error if the API call fails
        throw error; // Rethrow the error to be caught in the calling function
    }
}
