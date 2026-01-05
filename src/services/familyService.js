// src/services/familyService.js
import api from "./api";

// POST: family fetch
export async function retrieveFamilyApi({ search = "", sector = "", filter = "", limit = 10, offset = 0 }) {
    return api.post("/family/retrieve", { search, sector, filter, limit, offset });
}

// GET: family Details fetch
export async function retrieveFamilyDetailsApi(familyId) {
    return api.get(`/family_details/${familyId}/retrieve`);
}

// POST: family create
export async function createFamilyApi(payload) {
    return api.post("/family/create", payload);
}