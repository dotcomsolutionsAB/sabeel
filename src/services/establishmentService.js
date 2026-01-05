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
