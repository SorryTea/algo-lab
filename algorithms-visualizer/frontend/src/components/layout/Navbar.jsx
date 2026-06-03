import { NavLink, Link } from "react-router";

const linkClass = ({ isActive }) =>
  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? "bg-indigo-600 text-white" : "text-slate-600 hover:bg-slate-200"
  }`;

export default function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="text-lg font-bold text-indigo-600">
          🧩 Algo<span className="text-slate-900">Lab</span>
        </Link>
        <div className="flex items-center gap-1">
          <NavLink to="/" end className={linkClass}>
            Strona główna
          </NavLink>
          <NavLink to="/algorithms" className={linkClass}>
            Algorytmy
          </NavLink>
          <NavLink to="/about" className={linkClass}>
            O projekcie
          </NavLink>
        </div>
      </nav>
    </header>
  );
}