import api from "./api";

// POST /establishment_sabeel/create/{establishmentId}
export function createEstablishmentSabeelApi(establishmentId, payload) {
    return api.post(`/establishment_sabeel/create/${establishmentId}`, payload);
}

// POST /family_sabeel/create/{familyId}
export function createFamilySabeelApi(familyId, payload) {
    return api.post(`/family_sabeel/create/${familyId}`, payload);
}