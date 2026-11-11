import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { errorMessage } from "../api/client.js";
import { HOME_BY_ROLE, useAuth } from "../auth/AuthContext.jsx";

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to={HOME_BY_ROLE[user.role]} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setBusy(true);
    try {
      const loggedIn = await login(email, password);
      navigate(HOME_BY_ROLE[loggedIn.role]);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="card w-full max-w-sm space-y-4">
        <h1 className="text-xl font-bold">RollCall</h1>
        <div>
          <label className="label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="label" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}
        <button className="btn btn-primary w-full" disabled={busy}>
          Log in
        </button>
      </form>
    </div>
  );
}
