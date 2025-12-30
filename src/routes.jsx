import { useRoutes, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import ComingSoon from "./pages/ComingSoon";
import Family from "./pages/Family";
import Establishments from "./pages/Establishments";
import Receipts from "./pages/Receipts";
import Users from "./pages/Users";

/** Optional: for public pages */
function PublicLayout() {
    return <Outlet />;
}

/** Wrap all protected pages once */
function ProtectedLayout() {
    return (
        <ProtectedRoute>
            <Outlet />
        </ProtectedRoute>
    );
}

export default function Router() {
    const element = useRoutes([
        // redirect root
        { path: "/", element: <Navigate to="/dashboard" replace /> },

        // public routes
        {
            element: <PublicLayout />,
            children: [
                { path: "login", element: <Login /> },
                { path: "forgot-password", element: <ForgotPassword /> },
            ],
        },

        // protected routes (everything inside is protected)
        {
            element: <ProtectedLayout />,
            children: [
                { path: "dashboard", element: <Dashboard /> },

                { path: "family", element: <Family /> }, // ✅ removed duplicate
                { path: "establishments", element: <Establishments /> },
                { path: "receipts", element: <Receipts /> },
                { path: "users", element: <Users /> },

                // /personal/*
                {
                    path: "personal",
                    element: <Outlet />,
                    children: [
                        { index: true, element: <ComingSoon /> },
                        { path: "*", element: <ComingSoon /> },
                    ],
                },

                // /establishment/*
                {
                    path: "establishment",
                    element: <Outlet />,
                    children: [
                        { index: true, element: <ComingSoon /> },
                        { path: "*", element: <ComingSoon /> },
                    ],
                },

                // fallback inside protected area
                { path: "*", element: <Navigate to="/dashboard" replace /> },
            ],
        },
    ]);

    return element;
}
