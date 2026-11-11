import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext.jsx";

export default function ProtectedRoute({ roles, children }) {
    const { user, loading } = useAuth();
    if (loading) return <p className="p-6">Loading…</p>;
    if (!user) return <Navigate to="/login" replace />;
    if (roles && !roles.includes(user.role)) {
        return (
            <div className="p-6">
            <h1 className="text-xl font-semibold">Access denied</h1>
            <p>Your role does not have access to this page.</p>
            </div>
        );
        }
    return children;
}