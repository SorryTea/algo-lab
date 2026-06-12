import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { login } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password);
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err.message || "Błąd logowania.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="rounded-2xl border border-obsidian-border bg-obsidian-surface p-6 space-y-5">
        <h1 className="text-2xl font-bold">Zaloguj się</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-obsidian-muted">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm text-obsidian-muted">Hasło</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Logowanie…" : "Zaloguj się"}
          </button>
        </form>

        <p className="text-sm text-obsidian-muted">
          Nie masz konta?{" "}
          <Link to="/register" className="text-violet-400 hover:underline">
            Zarejestruj się
          </Link>
        </p>
      </div>
    </div>
  );
}