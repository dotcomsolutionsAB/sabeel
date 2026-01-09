import api from "./api";

export async function retrieveReceiptsApi(payload) {
    const res = await api.post("/receipt/retrieve", payload);
    return res?.pagination ? res : res.data;
}

export async function createReceiptApi(payload) {
    // POST: /receipt/create
    return api.post("/receipt/create", payload);
}

export const printReceiptApi = async (receiptId) => {
    if (!receiptId) throw new Error("Receipt ID is required");
    // POST: /receipt/print/{id}
    return api.get(`/receipt/print/${receiptId}`, {});
};