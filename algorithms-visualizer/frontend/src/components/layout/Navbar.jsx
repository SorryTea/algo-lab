import { NavLink, Link } from "react-router";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive
      ? "bg-violet-700 text-white"
      : "text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-obsidian-border bg-obsidian-surface">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-violet-400">
          Algo<span className="text-obsidian-text">Lab</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Strona główna
          </NavLink>
          <NavLink to="/algorithms" className={linkClass}>
            Algorytmy
          </NavLink>
          <NavLink to="/compare" className={linkClass}>
            Porównaj
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            O projekcie
          </NavLink>

          <span className="mx-2 h-5 w-px bg-obsidian-border" />

          <a
            href="/Identity/Account/Login"
            className="px-3 py-2 rounded-md text-sm font-medium text-obsidian-muted hover:bg-obsidian-elevated hover:text-obsidian-text transition-colors"
          >
            Zaloguj się
          </a>
          
          <a
            href="/Identity/Account/Register"
            className="px-3 py-2 rounded-md text-sm font-medium bg-violet-600 text-white hover:bg-violet-500 transition-colors"
          >
            Zarejestruj się
          </a>
        </div>
      </nav>
    </header>
  );
}