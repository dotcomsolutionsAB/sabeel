import { Link, useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();

    const onSubmit = (e) => {
        e.preventDefault();

        // TODO: replace with real API
        localStorage.setItem("token", "demo-token");
        navigate("/dashboard");
    };

    return (
        <div className="min-h-screen sabeel-page flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl sabeel-panel p-6">
                <h1 className="text-xl font-bold text-[#8c3e1b]">Sabeel Login</h1>
                <p className="text-sm text-gray-600 mt-1">Sign in to continue</p>

                <form className="mt-5 space-y-3" onSubmit={onSubmit}>
                    <input className="w-full rounded-xl border p-3" placeholder="Email" />
                    <input className="w-full rounded-xl border p-3" placeholder="Password" type="password" />

                    <button className="w-full rounded-xl p-3 bg-[#8c3e1b] text-white font-semibold">
                        Login
                    </button>

                    <div className="flex items-center justify-between text-sm">
                        <Link to="/forgot-password" className="text-[#8c3e1b] hover:underline">
                            Forgot password?
                        </Link>
                        <button
                            type="button"
                            className="text-gray-600 hover:underline"
                            onClick={() => {
                                localStorage.removeItem("token");
                            }}
                        >
                            Clear Token
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
