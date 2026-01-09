import api from "./api";

export async function retrieveDepositsApi(payload) {
    const res = await api.post("/deposits/retrieve", payload);
    return res?.data ?? res;
}

export async function createDepositApi(payload) {
    const res = await api.post("/deposits/create", payload);
    return res?.data ?? res;
}
