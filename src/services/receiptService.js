import api from "./api";

export async function retrieveReceiptsApi(payload) {
    const res = await api.post("/receipt/retrieve", payload);
    return res?.pagination ? res : res.data;
}
