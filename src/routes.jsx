import { useRoutes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Family from "./pages/Family";
import Establishments from "./pages/Establishments";
import Receipts from "./pages/Receipts";
import Users from "./pages/Users";
import ComingSoon from "./pages/ComingSoon";

export default function Router() {
    return useRoutes([
        // ✅ default open login
        { path: "/", element: <Navigate to="/login" replace /> },

        // public
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },

        // protected (they use DashboardLayout inside pages)
        { path: "/dashboard", element: <Dashboard /> },
        { path: "/family", element: <Family /> },
        { path: "/establishments", element: <Establishments /> },
        { path: "/receipts", element: <Receipts /> },
        { path: "/users", element: <Users /> },

        // if you want profile later
        { path: "/profile", element: <ComingSoon /> },

        // fallback
        { path: "*", element: <Navigate to="/login" replace /> },
    ]);
}
