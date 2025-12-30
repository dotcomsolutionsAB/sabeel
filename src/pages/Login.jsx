import { Link, useNavigate } from "react-router-dom";
import bg from "../assets/Background.png";
import logo from "../assets/logo.png";

import PageShell from "../components/PageShell";
import GlassCard from "../components/GlassCard";

export default function Login() {
    const navigate = useNavigate();

    const fields = [
        { name: "username", label: "Username", type: "text", placeholder: "Enter year username" },
        { name: "password", label: "Password", type: "password", placeholder: "Enter year password" },
    ];

    const onSubmit = (e) => {
        e.preventDefault();
        localStorage.setItem("token", "demo-token");
        navigate("/dashboard");
    };

    return (
        <PageShell
            bg={bg}
            logoSrc={logo}
            title="Anjuman-E-Mohammedi - Kolkata"
        >
            <GlassCard className="max-w-[380px] border border-white/30 bg-white/20 shadow-2xl" blur={20}>
                <h1 className="text-center text-2xl font-bold text-black">
                    Welcome Back
                </h1>
                <p className="text-center text-xs text-black/80 mt-1">
                    Please enter your details.
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {fields.map((f) => (
                        <div key={f.name}>
                            <label className="block text-sm font-bold text-black mb-2">
                                {f.label}
                            </label>
                            <input
                                type={f.type}
                                placeholder={f.placeholder}
                                className="w-full bg-transparent text-white text-sm placeholder:text-white/90 outline-none pb-2 border-b border-white/80 focus:border-white"
                            />
                        </div>
                    ))}

                    <div className="-mt-3 text-right">
                        <Link
                            to="/forgot-password"
                            className="text-[11px] text-black font-semibold hover:underline"
                        >
                            Forgot Password ?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-[var(--authBtn)] text-white text-sm font-bold rounded-xl py-3 shadow-lg hover:brightness-110 active:scale-[0.99] transition"
                    >
                        Sign In
                    </button>
                </form>
            </GlassCard>
        </PageShell>
    );
}
