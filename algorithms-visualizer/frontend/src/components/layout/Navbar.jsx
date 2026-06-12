import { NavLink, Link } from "react-router";
import ThemeToggle from "../ThemeToggle";
import { useAuth } from "../../lib/auth.jsx";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-violet-700 text-white"
      : "text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text"
  }`;

function UserMenu() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return <span className="px-3 py-2 text-sm text-obsidian-muted">…</span>;
  }

  if (!user) {
    return (
      <>
        <Link
          to="/login"
          className="px-3 py-2 rounded-md text-sm font-medium text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text transition-colors"
        >
          Zaloguj się
        </Link>
        <Link
          to="/register"
          className="px-3 py-2 rounded-md text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors"
        >
          Zarejestruj się
        </Link>
      </>
    );
  }

  const initial = (user.nickname || user.email || "?").charAt(0).toUpperCase();

  return (
    <div className="flex items-center gap-2">
      {user.isAdmin && (
        <a
          href="/Admin"
          className="px-3 py-2 rounded-md text-sm font-medium text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text transition-colors"
        >
          Admin
        </a>
      )}

      <a
        href={user.manageUrl || "/Identity/Account/Manage"}
        title="Moje konto"
        className="flex items-center gap-2 px-2 py-1 rounded-md hover:bg-obsidian-elevated transition-colors"
      >
        {user.avatarPath ? (
          <img src={user.avatarPath} alt="Avatar" className="w-7 h-7 rounded-full object-cover" />
        ) : (
          <span className="w-7 h-7 rounded-full bg-violet-600 text-white text-xs font-semibold flex items-center justify-center">
            {initial}
          </span>
        )}
        <span className="text-sm font-medium text-obsidian-text max-w-[120px] truncate">
          {user.nickname || user.email}
        </span>
      </a>

      <button
        onClick={logout}
        className="px-3 py-2 rounded-md text-sm font-medium text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text transition-colors"
      >
        Wyloguj
      </button>
    </div>
  );
}

export default function Navbar() {
  return (
    <header className="border-b border-obsidian-border bg-obsidian-surface">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-violet-400">
          Algo<span className="text-obsidian-text">Lab</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>Strona główna</NavLink>
          <NavLink to="/algorithms" className={linkClass}>Algorytmy</NavLink>
          <NavLink to="/compare" className={linkClass}>Porównaj</NavLink>
          <NavLink to="/forum" className={linkClass}>Forum</NavLink>
          <NavLink to="/faq" className={linkClass}>FAQ</NavLink>

          <ThemeToggle />
          <span className="mx-2 h-5 w-px bg-obsidian-border" />
          <UserMenu />
        </div>
      </nav>
    </header>
  );
}