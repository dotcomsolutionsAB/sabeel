import PropTypes from "prop-types";
import { Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import TopBar from "../components/TopBar";
import Loader from "../components/Loader";

export default function DashboardLayout({ children, title = "Dashboard" }) {
    const location = useLocation();

    // ✅ Show loader on first render
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // small delay so loader is visible + simulates auth check
        const t = setTimeout(() => setChecking(false), 350);
        return () => clearTimeout(t);
    }, []);

    if (checking) return <Loader />;

    const token = localStorage.getItem("token");
    if (!token) return <Navigate to="/login" replace state={{ from: location }} />;

    const userName = localStorage.getItem("name") || "User";

    return (
        <div className="app">
            <TopBar title={title} userName={userName} dateRange="AUG 2024 - AUG 2025" />
            <div className="content">{children}</div>
        </div>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
