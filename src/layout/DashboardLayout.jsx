import TopBar from "../components/TopBar";

export default function DashboardLayout({ children }) {
    return (
        <div className="min-h-screen sabeel-page p-3 sm:p-4">
            <div className="sabeel-shell w-full">
                <div className="p-4 sm:p-5">
                    <TopBar />
                    <div className="mt-5">{children}</div>

                    <footer className="mt-8 flex items-center justify-between text-xs text-gray-600">
                        <div>2025 © Dot Com Solutions</div>
                        <div className="flex gap-3">
                            <a className="hover:underline" href="#">About</a>
                            <a className="hover:underline" href="#">Contact</a>
                        </div>
                    </footer>
                </div>
            </div>
        </div>
    );
}
