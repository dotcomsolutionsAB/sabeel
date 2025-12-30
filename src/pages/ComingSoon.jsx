import { useLocation, Link } from "react-router-dom";
import bg from "../assets/Background.png";
import logo from "../assets/logo.png";

import PageShell from "../components/PageShell";
import GlassCard from "../components/GlassCard";

export default function Login() {

    return (
        <PageShell
            bg={bg}
            logoSrc={logo}
            title="Anjuman-E-Mohammedi - Kolkata"
        >
            <GlassCard className="max-w-[380px] border border-white/30 bg-white/20 shadow-2xl" blur={20}>
                <div style={{ padding: 20 }}>
                    <h2 className="text-center text-2xl font-bold text-black">Coming Soon</h2>
                    <p className="text-center text-xs text-black/80 mt-1 mb-5">Route: <strong>{location.pathname}</strong></p>
                    <Link className="text-center" to="/dashboard">← Back to Dashboard</Link>
                </div>
            </GlassCard>
        </PageShell>
    );
}
