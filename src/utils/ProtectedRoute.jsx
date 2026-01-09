// // src/utils/ProtectedRoute.jsx
// import { Navigate, useLocation } from "react-router-dom";

// export default function ProtectedRoute({ children }) {
//     const location = useLocation();

//     // use your real token key here
//     const token = localStorage.getItem("token");

//     if (!token) {
//         return <Navigate to="/login" replace state={{ from: location }} />;
//     }

//     return children;
// }
