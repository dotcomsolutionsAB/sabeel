import TopBar from "../components/TopBar";

export default function DashboardLayout({ children, title = "Dashboard" }) {
    return (
        <div className="app">
            <TopBar
                title={title}
                userName="Nematullah"
                dateRange="AUG 2024 - AUG 2025"
            />
            <div className="content">{children}</div>
        </div>
    );
}
