import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { register } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [nickname, setNickname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(nickname, email, password);
      await refresh();
      navigate("/");
    } catch (err) {
      setError(err.message || "Błąd rejestracji.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-10">
      <div className="rounded-2xl border border-obsidian-border bg-obsidian-surface p-6 space-y-5">
        <h1 className="text-2xl font-bold">Zarejestruj się</h1>

        <form onSubmit={onSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm text-obsidian-muted">Nick</label>
            <input
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              required
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            />
          </div>

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
            <label className="text-sm text-obsidian-muted">Hasło (min. 6 znaków)</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
          >
            {loading ? "Rejestracja…" : "Zarejestruj się"}
          </button>
        </form>

        <p className="text-sm text-obsidian-muted">
          Masz już konto?{" "}
          <Link to="/login" className="text-violet-400 hover:underline">
            Zaloguj się
          </Link>
        </p>
      </div>
    </div>
  );
}