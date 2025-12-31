import { apiFetch } from "./api";

export function loginApi(payload) {
    return apiFetch("/login", {
        method: "POST",
        body: JSON.stringify(payload),
    });
}
