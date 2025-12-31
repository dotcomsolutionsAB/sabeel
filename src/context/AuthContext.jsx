// src/context/AuthContext.jsx
import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";
import { loginApi, logoutApi } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [name, setName] = useState(() => localStorage.getItem("name") || "");
    const [role, setRole] = useState(() => localStorage.getItem("role") || "");

    const isAuthed = !!token;

    const login = async ({ username, password }) => {
        const res = await loginApi({ username, password });
        // res format (because api.js returns response.data):
        // { code, status, message, data:{ token, name, role, ... } }

        const tokenFromApi = res?.data?.token;
        const nameFromApi = res?.data?.name;
        const roleFromApi = res?.data?.role;

        if (!tokenFromApi) throw new Error("Token not found in API response.");

        localStorage.setItem("token", tokenFromApi);
        localStorage.setItem("name", nameFromApi || "");
        localStorage.setItem("role", roleFromApi || "");
        localStorage.setItem("username", res?.data?.username || "");
        localStorage.setItem("email", res?.data?.email || "");
        localStorage.setItem("user_id", String(res?.data?.user_id || ""));

        setToken(tokenFromApi);
        setName(nameFromApi || "");
        setRole(roleFromApi || "");

        return res;
    };

    const logout = async () => {
        try {
            await logoutApi();
        } catch {
            // ignore API failure
        } finally {
            localStorage.clear();
            setToken("");
            setName("");
            setRole("");
        }
    };

    const value = useMemo(
        () => ({ token, name, role, isAuthed, login, logout }),
        [token, name, role, isAuthed]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
