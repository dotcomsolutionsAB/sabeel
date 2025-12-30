import { Link } from "react-router-dom";
import bg from "../assets/Background.png";
import logo from "../assets/logo.png";

import PageShell from "../components/PageShell";
import GlassCard from "../components/GlassCard";

export default function ForgotPassword() {
    const onSubmit = (e) => {
        e.preventDefault();
        // TODO: call API
        alert("Request sent (demo)");
    };

    return (
        <PageShell
            bg={bg}
            logoSrc={logo}
            title="Anjuman-E-Mohammedi - Kolkata"
        >
            <GlassCard
                className="max-w-[380px] border border-white/30 bg-white/20 shadow-2xl"
                blur={20}
            >
                <h1 className="text-center text-2xl font-bold text-black">
                    Forgotten Password ?
                </h1>
                <p className="text-center text-xs text-black/80 mt-1">
                    Enter your email to reset your password
                </p>

                <form onSubmit={onSubmit} className="mt-6 space-y-6">
                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-black mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Enter year email"
                            className="w-full bg-transparent text-white text-sm placeholder:text-white/90 outline-none pb-2 border-b border-white/80 focus:border-white"
                        />
                    </div>

                    {/* Back to Sign In (Back to black, Sign In authBtn color) */}
                    <div className="text-center -mt-2">
                        <Link to="/login" className="text-[11px] font-semibold">
                            <span className="text-black">Back to </span>
                            <span className="text-[var(--authBtn)]">Sign In</span>
                        </Link>
                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        className="w-full bg-[var(--authBtn)] text-white text-sm font-bold rounded-xl py-3 shadow-lg hover:brightness-110 active:scale-[0.99] transition"
                    >
                        Request
                    </button>
                </form>
            </GlassCard>
        </PageShell>
    );
}
