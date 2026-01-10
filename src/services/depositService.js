import api from "./api";

export async function retrieveDepositsApi(payload) {
    // ✅ api.post already returns the JSON object:
    // { code, status, message, data, pagination }
    return api.post("/deposits/retrieve", payload);
}

export async function createDepositApi(payload) {
    const res = await api.post("/deposits/create", payload);
    return res?.data ?? res;
}

export const printDepositApi = (depositId) => {
    if (!depositId) throw new Error("Deposit ID is required");
    // ✅ GET: /deposits/print/{id}
    return api.get(`/deposits/print/${depositId}`);
};