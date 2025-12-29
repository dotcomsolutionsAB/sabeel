import { Link } from "react-router-dom";

export default function ForgotPassword() {
    const onSubmit = (e) => {
        e.preventDefault();
        alert("Password reset link sent (demo). Replace with API call.");
    };

    return (
        <div className="min-h-screen sabeel-page flex items-center justify-center p-6">
            <div className="w-full max-w-md rounded-2xl sabeel-panel p-6">
                <h1 className="text-xl font-bold text-[#8c3e1b]">Forgot Password</h1>
                <p className="text-sm text-gray-600 mt-1">Enter email to reset</p>

                <form className="mt-5 space-y-3" onSubmit={onSubmit}>
                    <input className="w-full rounded-xl border p-3" placeholder="Email" />
                    <button className="w-full rounded-xl p-3 bg-[#8c3e1b] text-white font-semibold">
                        Send Reset Link
                    </button>

                    <Link to="/login" className="block text-sm text-[#8c3e1b] hover:underline">
                        Back to login
                    </Link>
                </form>
            </div>
        </div>
    );
}
