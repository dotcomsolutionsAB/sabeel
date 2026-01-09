import api from "./api";

export const retrieveSectorsApi = async () => {
    // POST /sector (no payload needed unless your backend expects)
    return api.get("/sector", {});
};
