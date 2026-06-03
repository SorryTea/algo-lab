import { Link } from "react-router";

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-6xl font-bold text-slate-300">404</h1>
      <p className="mt-4 text-slate-600">Nie znaleziono strony.</p>
      <Link to="/" className="mt-6 inline-block text-indigo-600 hover:underline">
        Wróć na stronę główną
      </Link>
    </div>
  );
}
