import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./utils/ProtectedRoute";
import ComingSoon from "./pages/ComingSoon";
import Family from "./pages/Family";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/personal/*"
        element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        }
      />

      <Route
        path="/establishment/*"
        element={
          <ProtectedRoute>
            <ComingSoon />
          </ProtectedRoute>
        }
      />
      <Route
        path="/family"
        element={
          <ProtectedRoute>
            <Family />
          </ProtectedRoute>
        }
      />


      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
