import { useRoutes, Navigate, Outlet } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Family from "./pages/Family";
import FamilyDetails from "./pages/FamilyDetails";

import Establishments from "./pages/Establishments";
import EstablishmentDetails from "./pages/EstablishmentDetails";

import Receipts from "./pages/Receipts";
import Users from "./pages/Users";
import ComingSoon from "./pages/ComingSoon";
import Deposits from "./pages/Deposits";

import DashboardLayout from "./layout/DashboardLayout";

function AppShell() {
    return (
        <DashboardLayout>
            <Outlet />
        </DashboardLayout>
    );
}

export default function Router() {
    return useRoutes([
        { path: "/", element: <Navigate to="/login" replace /> },

        // Public
        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },

        // App (nested)
        {
            path: "/",
            element: <AppShell />,
            children: [
                { path: "dashboard", element: <Dashboard /> },

                // ✅ FAMILY: /family + children
                {
                    path: "family",
                    children: [
                        { index: true, element: <Family /> },          // /family
                        { path: ":id", element: <FamilyDetails /> },   // /family/:id
                        { path: "details", element: <FamilyDetails /> } // /family/details (optional)
                    ],
                },

                // Establishments (same style optional)
                {
                    path: "establishments",
                    children: [
                        { index: true, element: <Establishments /> },      // /establishments
                        { path: ":id", element: <EstablishmentDetails /> } // /establishments/:id
                    ],
                },

                { path: "receipts", element: <Receipts /> },
                { path: "users", element: <Users /> },

                { path: "profile", element: <ComingSoon /> },
                { path: "deposits", element: <Deposits /> },
            ],
        },

        // Fallback
        { path: "*", element: <Navigate to="/login" replace /> },
    ]);
}
