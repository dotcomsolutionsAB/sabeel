import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";

const toTitle = (segment = "") => {
    const s = String(segment || "").trim();
    if (!s) return "Dashboard";

    const map = {
        dashboard: "Dashboard",
        family: "Family",
        establishments: "Establishments",
        receipts: "Receipts",
        users: "Users",
        profile: "Profile",
        deposits: "Deposits",
    };

    if (map[s]) return map[s];

    return s
        .split("-")
        .filter(Boolean)
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
};

export default function DashboardLayout({ children }) {
    const location = useLocation();

    const [checking, setChecking] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setChecking(false), 350);
        return () => clearTimeout(t);
    }, []);

    // ✅ read token BEFORE returns (not a hook, safe)
    const token = localStorage.getItem("token");

    // ✅ useMemo MUST be above early returns
    const topBarTitle = useMemo(() => {
        const path = location.pathname || "/";
        const first = path.split("/").filter(Boolean)[0] || "";
        if (!first) return "Dashboard"; // "/"
        return toTitle(first);
    }, [location.pathname]);

    // ✅ now you can safely return early
    if (checking) return <Loader />;

    if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

    const userName = localStorage.getItem("name") || "User";

    return (
        <div className="app">
            <TopBar title={topBarTitle} userName={userName} dateRange="AUG 2024 - AUG 2025" />
            <div className="content">{children}</div>
        </div>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
};
