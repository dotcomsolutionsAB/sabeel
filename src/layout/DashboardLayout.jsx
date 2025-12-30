import { useState } from "react";
import TopBar from "../components/TopBar";

export default function DashboardLayout({ children }) {
    const [activeNav, setActiveNav] = useState("dashboard");

    return (
        <div className="app">
            <TopBar
                title="Dashboard"
                userName="Nematullah"
                dateRange="AUG 2024 - AUG 2025"
                activeNav={activeNav}
                onNavChange={setActiveNav}
            />

            <div className="content">{children}</div>
        </div>
    );
}
