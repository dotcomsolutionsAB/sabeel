// src/pages/Login.jsx
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import bg from "../assets/images/Background.png";
import logo from "../assets/images/logo.png";

import PageShell from "../components/PageShell";
import GlassCard from "../components/GlassCard";
import ErrorToast from "../components/ErrorToast";
import { useAuth } from "../context/AuthContext";
import { ROUTES } from "../services/routes";

export default function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [form, setForm] = useState({ username: "", password: "" });
    const [loading, setLoading] = useState(false);

    const [toast, setToast] = useState({ show: false, message: "" });
    const [showPassword, setShowPassword] = useState(false);

    const onChange = (name, value) => setForm((p) => ({ ...p, [name]: value }));

    const onSubmit = async (e) => {
        e.preventDefault();

        const username = form.username.trim();
        const password = form.password;

        if (!username || !password) {
            setToast({ show: true, message: "Username and password are required." });
            return;
        }

        try {
            setLoading(true);
            await login({ username, password });
            navigate(ROUTES.dashboard, { replace: true });
        } catch (err) {
            setToast({ show: true, message: err?.message || "Login failed" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <PageShell bg={bg} logoSrc={logo} title="Anjuman-E-Mohammedi - Kolkata">
            <ErrorToast
                show={toast.show}
                message={toast.message}
                onClose={() => setToast({ show: false, message: "" })}
            />

            <GlassCard className="max-w-[380px] border border-white/30 bg-white/20 shadow-2xl" blur={20}>
                <h1 className="text-center text-2xl font-bold text-black">Welcome Back</h1>
                <p className="text-center text-xs text-black/80 mt-1">Please enter your details.</p>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {/* Username */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Username</label>
                        <input
                            type="text"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={(e) => onChange("username", e.target.value)}
                            className="w-full bg-transparent text-white text-sm placeholder:text-white/90 outline-none pb-2 border-b border-white/80 focus:border-white"
                            autoComplete="username"
                        />
                    </div>

                    {/* Password + show/hide */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">Password</label>

                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                value={form.password}
                                onChange={(e) => onChange("password", e.target.value)}
                                className="w-full bg-transparent text-white text-sm placeholder:text-white/90 outline-none pb-2 border-b border-white/80 focus:border-white pr-10"
                                autoComplete="current-password"
                            />

                            <button
                                type="button"
                                onClick={() => setShowPassword((v) => !v)}
                                className="absolute right-1 top-1/2 -translate-y-1/2 text-white/80 hover:text-white"
                                aria-label={showPassword ? "Hide password" : "Show password"}
                                title={showPassword ? "Hide password" : "Show password"}
                            >
                                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="-mt-3 text-right">
                        <Link to={ROUTES.forgotPassword} className="text-[11px] text-black font-semibold hover:underline">
                            Forgot Password ?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-[var(--authBtn)] text-white text-sm font-bold rounded-xl py-3 shadow-lg hover:brightness-110 active:scale-[0.99] transition disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>
            </GlassCard>
        </PageShell>
    );
}
