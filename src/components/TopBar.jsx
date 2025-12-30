import { useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CalendarIcon,
    DashboardIcon,
    FamilyIcon,
    EstablishmentIcon,
    ReceiptsIcon,
    UsersIcon,
} from "./icons";

export default function TopBar({
    title = "Dashboard",
    userName = "Nematullah",
    dateRange = "AUG 2024 - AUG 2025",
}) {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    const navItems = useMemo(
        () => [
            { key: "dashboard", title: "Dashboard", path: "/dashboard", icon: DashboardIcon },
            { key: "family", title: "Family", path: "/family", icon: FamilyIcon },
            { key: "establishments", title: "Establishments", path: "/establishments", icon: EstablishmentIcon },
            { key: "receipts", title: "Receipts", path: "/receipts", icon: ReceiptsIcon },
            { key: "users", title: "Users", path: "/users", icon: UsersIcon },
        ],
        []
    );

    const activeKey = useMemo(() => {
        const hit = navItems.find((n) => pathname === n.path || pathname.startsWith(n.path + "/"));
        return hit?.key || "dashboard";
    }, [pathname, navItems]);

    return (
        <div className="topbar">
            <div className="topbar-row">
                <div className="title">{title}</div>

                <div className="right-info">
                    <div>
                        Hi, <strong>{userName}</strong>
                    </div>

                    <div className="avatar">{userName?.[0]?.toUpperCase() || "U"}</div>

                    <div className="date-pill" title="Date Range">
                        <span style={{ fontWeight: 600 }}>{dateRange}</span>
                        <CalendarIcon />
                    </div>
                </div>
            </div>

            {/* Center Nav Pill */}
            <div className="nav-pill" role="navigation" aria-label="Primary">
                <div className="icons">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeKey === item.key;

                        return (
                            <button
                                key={item.key}
                                type="button"
                                className={`nav-item ${isActive ? "active" : ""}`}
                                title={item.title}
                                onClick={() => navigate(item.path)}
                            >
                                <Icon />
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
