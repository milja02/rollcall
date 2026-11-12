import { Navigate, Route, Routes } from "react-router-dom";
import { HOME_BY_ROLE, useAuth } from "./auth/AuthContext.jsx";
import ProtectedRoute from "./auth/ProtectedRoute.jsx";
import Layout from "./components/Layout.jsx";
import AdminPage from "./pages/AdminPage.jsx";
import CalendarPage from "./pages/CalendarPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProgramsPage from "./pages/ProgramsPage.jsx";

function Home() {
  const { user, loading } = useAuth();
  if (loading) return null;
  return <Navigate to={user ? HOME_BY_ROLE[user.role] : "/login"} replace />;
}

const only = (roles, element) => <ProtectedRoute roles={roles}>{element}</ProtectedRoute>;

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/admin" element={only(["ADMIN"], <AdminPage />)} />
        <Route path="/calendar" element={only(["LECTURER"], <CalendarPage />)} />
        <Route path="/programs" element={only(["COORDINATOR"], <ProgramsPage />)} />
      </Route>
      <Route path="*" element={<Home />} />
    </Routes>
  );
}
