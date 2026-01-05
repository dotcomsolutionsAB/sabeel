// src/services/partnerService.js
import api from "./api";

// DELETE: /partners/delete/{partnerId}
export async function deletePartnerApi(partnerId) {
    return api.delete(`/partners/delete/${partnerId}`);
}
