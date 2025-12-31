const BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(options.headers || {}),
        },
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
        throw new Error(data?.message || "Request failed");
    }

    return data;
}
