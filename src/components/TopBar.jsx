import { useMemo } from "react";

export default function TopBar({
    title = "Dashboard",
    userName = "Nematullah",
    dateRange = "AUG 2024 - AUG 2025",
    activeNav = "dashboard",
    onNavChange = () => { },
}) {
    const navItems = useMemo(
        () => [
            { key: "dashboard", title: "Dashboard", icon: IconImage },
            { key: "reports", title: "Reports", icon: IconBars },
            { key: "establishments", title: "Establishments", icon: IconBuilding },
            { key: "documents", title: "Documents", icon: IconFile },
            { key: "users", title: "Users", icon: IconUsers },
        ],
        []
    );

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
                        const isActive = activeNav === item.key;

                        return (
                            <div
                                key={item.key}
                                className={`nav-item ${isActive ? "active" : ""}`}
                                title={item.title}
                                onClick={() => onNavChange(item.key)}
                                role="button"
                                tabIndex={0}
                            >
                                <Icon />
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

/* ===== Icons ===== */

function CalendarIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            stroke="#2c86c8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            <rect x="3" y="4" width="18" height="18" rx="2"></rect>
            <line x1="16" y1="2" x2="16" y2="6"></line>
            <line x1="8" y1="2" x2="8" y2="6"></line>
            <line x1="3" y1="10" x2="21" y2="10"></line>
        </svg>
    );
}

function IconImage() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="5" width="18" height="14" rx="2"></rect>
            <circle cx="8.5" cy="10" r="1.5"></circle>
            <path d="M21 16l-6-6-5 5-2-2-5 5"></path>
        </svg>
    );
}

function IconBars() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="20" x2="12" y2="10"></line>
            <line x1="18" y1="20" x2="18" y2="4"></line>
            <line x1="6" y1="20" x2="6" y2="14"></line>
        </svg>
    );
}

function IconBuilding() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 21h18"></path>
            <path d="M7 21V7a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v14"></path>
            <path d="M10 9h4"></path>
            <path d="M10 13h4"></path>
            <path d="M10 17h4"></path>
        </svg>
    );
}

function IconFile() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <path d="M14 2v6h6"></path>
        </svg>
    );
}

function IconUsers() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
        </svg>
    );
}
