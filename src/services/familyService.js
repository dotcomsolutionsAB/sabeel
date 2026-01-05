// src/services/familyService.js
import api from "./api";

export async function retrieveFamilyApi({
    search = "",
    sector = "",
    filter = "",
    limit = 10,
    offset = 0,
}) {
    // POST /family/retrieve
    // api.js returns response.data directly
    return api.post("/family/retrieve", { search, sector, filter, limit, offset });
}


export async function retrieveFamilyDetailsApi(familyId) {
    return api.get(`/family_details/${familyId}/retrieve`);
}