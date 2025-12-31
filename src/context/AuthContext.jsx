import PropTypes from "prop-types";
import { createContext, useContext, useMemo, useState } from "react";
import { loginApi } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [token, setToken] = useState(() => localStorage.getItem("token") || "");
    const [user, setUser] = useState(() => {
        const raw = localStorage.getItem("user");
        return raw ? JSON.parse(raw) : null;
    });

    const isAuthed = !!token;

    const login = async (payload) => {
        const res = await loginApi(payload);

        const newToken =
            res?.token ||
            res?.access_token ||
            res?.data?.token ||
            res?.data?.access_token;

        const newUser = res?.user || res?.data?.user || null;

        if (!newToken) throw new Error("Token not found in API response");

        localStorage.setItem("token", newToken);
        if (newUser) localStorage.setItem("user", JSON.stringify(newUser));

        setToken(newToken);
        setUser(newUser);

        return { token: newToken, user: newUser };
    };

    const logout = () => {
        localStorage.clear();
        setToken("");
        setUser(null);
    };

    const value = useMemo(
        () => ({ token, user, isAuthed, login, logout }),
        [token, user, isAuthed]
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

AuthProvider.propTypes = { children: PropTypes.node };

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
    return ctx;
}
