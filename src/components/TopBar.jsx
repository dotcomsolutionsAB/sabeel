import PropTypes from "prop-types";
import { useMemo, useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
    CalendarIcon,
    DashboardIcon,
    FamilyIcon,
    EstablishmentIcon,
    ReceiptsIcon,
    UsersIcon,
    ProfileIcon,
    LogoutIcon,
} from "./icons";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../services/routes";

export default function TopBar({
    title = "Dashboard",
    userName = "",
    dateRange = "", // Default initial range
    onDateRangeChange,
}) {
    const navigate = useNavigate();
    const { pathname } = useLocation();
    const { logout } = useAuth();

    // ===== NAV =====
    const navItems = useMemo(
        () => [
            { key: "dashboard", title: "Dashboard", path: ROUTES.dashboard, icon: DashboardIcon },
            { key: "family", title: "Family", path: ROUTES.family, icon: FamilyIcon },
            { key: "establishments", title: "Establishments", path: ROUTES.establishments, icon: EstablishmentIcon },
            { key: "receipts", title: "Receipts", path: ROUTES.receipts, icon: ReceiptsIcon },
            { key: "users", title: "Users", path: ROUTES.users, icon: UsersIcon },
        ],
        []
    );

    const activeKey = useMemo(() => {
        const hit = navItems.find((n) => pathname === n.path || pathname.startsWith(n.path + "/"));
        return hit?.key || "dashboard";
    }, [pathname, navItems]);

    // ===== DATE PICKER (native) =====
    const [fromDate, setFromDate] = useState(() => {
        // Initialize fromDate to current month and year
        const currentDate = new Date();
        return currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    });

    const [toDate, setToDate] = useState(() => {
        // Initialize toDate to one year in the future
        const currentDate = new Date();
        currentDate.setFullYear(currentDate.getFullYear() + 1);
        return currentDate.toISOString().split("T")[0]; // YYYY-MM-DD format
    });

    const fromRef = useRef(null);
    const toRef = useRef(null);

    const openDatePicker = (picker) => {
        if (picker === "from" && fromRef.current?.showPicker) fromRef.current.showPicker();
        if (picker === "to" && toRef.current?.showPicker) toRef.current.showPicker();
    };

    useEffect(() => {
        // Notify parent component whenever the dates change
        onDateRangeChange?.({ from: fromDate, to: toDate });
    }, [fromDate, toDate, onDateRangeChange]);

    // ===== AVATAR MENU =====
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);

    useEffect(() => {
        const onDown = (e) => {
            if (!menuRef.current) return;
            if (!menuRef.current.contains(e.target)) setMenuOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, []);

    const goMenu = (path) => {
        setMenuOpen(false);
        navigate(path);
    };

    const handleLogout = async () => {
        setMenuOpen(false);
        await logout(); // calls /logout and clears local storage in context
        navigate(ROUTES.login, { replace: true });
    };

    return (
        <div className="topbar">
            <div className="topbar-row">
                <div className="title">{title}</div>

                <div className="right-info">
                    {/* From Date */}
                    <div className="date-picker">
                        <button
                            type="button"
                            className="date-pill"
                            title="Pick From Date"
                            onClick={() => openDatePicker("from")}
                        >
                            <span style={{ fontWeight: 600 }}>
                                {fromDate ? new Date(fromDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short' }) : dateRange || "Select From Date"}
                            </span>
                            <CalendarIcon />
                        </button>
                        <input
                            ref={fromRef}
                            type="date"
                            value={fromDate}
                            onChange={(e) => setFromDate(e.target.value)}
                            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
                            aria-hidden="true"
                            tabIndex={-1}
                        />
                    </div>

                    {/* To Date */}
                    <div className="date-picker">
                        <button
                            type="button"
                            className="date-pill"
                            title="Pick To Date"
                            onClick={() => openDatePicker("to")}
                        >
                            <span style={{ fontWeight: 600 }}>
                                {toDate ? new Date(toDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short' }) : dateRange || "Select To Date"}
                            </span>
                            <CalendarIcon />
                        </button>
                        <input
                            ref={toRef}
                            type="date"
                            value={toDate}
                            onChange={(e) => setToDate(e.target.value)}
                            style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 1, height: 1 }}
                            aria-hidden="true"
                            tabIndex={-1}
                        />
                    </div>

                    <div>
                        Hi, <strong>{userName}</strong>
                    </div>

                    {/* Avatar menu */}
                    <div className="relative" ref={menuRef}>
                        <button
                            type="button"
                            className="avatar"
                            onClick={() => setMenuOpen((v) => !v)}
                            aria-haspopup="menu"
                            aria-expanded={menuOpen}
                            title="Account"
                        >
                            {userName?.[0]?.toUpperCase() || "U"}
                        </button>

                        {menuOpen && (
                            <div
                                className="absolute right-0 mt-2 z-50 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden min-w-[170px]"
                                role="menu"
                            >
                                <button
                                    type="button"
                                    onClick={() => goMenu(ROUTES.profile)}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-slate-50 inline-flex items-center gap-2"
                                    role="menuitem"
                                >
                                    <ProfileIcon className="w-4 h-4" />
                                    Profile
                                </button>

                                <button
                                    type="button"
                                    onClick={() => goMenu(ROUTES.family)}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-slate-50 inline-flex items-center gap-2"
                                    role="menuitem"
                                >
                                    <FamilyIcon className="w-4 h-4" />
                                    Family
                                </button>

                                <div className="h-px bg-slate-100" />

                                <button
                                    type="button"
                                    onClick={handleLogout}
                                    className="w-full px-4 py-2 text-sm text-left hover:bg-slate-50 inline-flex items-center gap-2 text-rose-600"
                                    role="menuitem"
                                >
                                    <LogoutIcon className="w-4 h-4" />
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Center Nav */}
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

TopBar.propTypes = {
    title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
    userName: PropTypes.string,
    dateRange: PropTypes.string,
    onDateRangeChange: PropTypes.func,
};
