import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext.jsx";

const LINKS = {
  LECTURER: [["/calendar", "Calendar"]],
  COORDINATOR: [
    ["/programs", "Programs"],
    ["/reports", "Pending reports"],
  ],
  ADMIN: [["/admin", "Administration"]],
};

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <header className="flex items-center gap-6 border-b border-gray-300 bg-white px-6 py-3">
        <span className="text-lg font-bold">RollCall</span>
        <nav className="flex gap-4 text-sm">
          {LINKS[user.role].map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? "font-semibold underline" : "hover:underline")}
            >
              {label}
            </NavLink>
          ))}
        </nav>
        <span className="ml-auto text-sm">{user.full_name}</span>
        <button className="btn" onClick={handleLogout}>
          Log out
        </button>
      </header>
      <main className="mx-auto max-w-5xl p-6">
        <Outlet />
      </main>
    </div>
  );
}
