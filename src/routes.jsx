import { useRoutes, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";

import Dashboard from "./pages/Dashboard";
import Family from "./pages/Family";
import Establishments from "./pages/Establishments";
import Receipts from "./pages/Receipts";
import Users from "./pages/Users";
import ComingSoon from "./pages/ComingSoon";
import FamilyDetails from "./pages/FamilyDetails";
import EstablishmentDetails from "./pages/EstablishmentDetails";
import Deposits from "./pages/Deposits";

export default function Router() {
    return useRoutes([
        { path: "/", element: <Navigate to="/login" replace /> },

        { path: "/login", element: <Login /> },
        { path: "/forgot-password", element: <ForgotPassword /> },

        { path: "/dashboard", element: <Dashboard /> },
        { path: "/family", element: <Family /> },
        { path: "/family/:id", element: <FamilyDetails /> },
        { path: "/family-details", element: <FamilyDetails /> },
        { path: "/establishments", element: <Establishments /> },
        { path: "/establishments/:id", element: <EstablishmentDetails /> },
        { path: "/receipts", element: <Receipts /> },
        { path: "/users", element: <Users /> },

        { path: "/profile", element: <ComingSoon /> },
        { path: "/deposits", element: <Deposits /> },

        { path: "*", element: <Navigate to="/login" replace /> },

    ]);
}
