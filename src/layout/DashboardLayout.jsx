import PropTypes from "prop-types";
import TopBar from "../components/TopBar";
import ProtectedRoute from "../utils/ProtectedRoute";

export default function DashboardLayout({ children, title = "Dashboard" }) {
    return (
        <ProtectedRoute>
            <div className="app">
                <TopBar title={title} userName="Nematullah" dateRange="AUG 2024 - AUG 2025" />
                <div className="content">{children}</div>
            </div>
        </ProtectedRoute>
    );
}

DashboardLayout.propTypes = {
    children: PropTypes.node,
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
};
