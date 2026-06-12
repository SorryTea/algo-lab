import { useEffect, useState } from "react";
import { Link } from "react-router";
import { getForumCategories, getForumPosts } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";

function formatDate(value) {
  return new Date(value).toLocaleDateString("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function Forum() {
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);
  const [activeSlug, setActiveSlug] = useState(null);
  const [posts, setPosts] = useState([]);
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    getForumCategories().then(setCategories).catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setStatus("loading");
    getForumPosts(activeSlug)
      .then((data) => { if (!cancelled) { setPosts(data); setStatus("ready"); } })
      .catch(() => { if (!cancelled) setStatus("error"); });
    return () => { cancelled = true; };
  }, [activeSlug]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">Forum</h1>
        {user && (
          <Link
            to="/forum/new"
            className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500"
          >
            + Nowy post
          </Link>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <button
          onClick={() => setActiveSlug(null)}
          className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
            activeSlug === null
              ? "bg-violet-600 text-white border-violet-600"
              : "border-obsidian-border text-obsidian-muted hover:border-violet-500"
          }`}
        >
          Wszystkie
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveSlug(c.slug)}
            className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
              activeSlug === c.slug
                ? "bg-violet-600 text-white border-violet-600"
                : "border-obsidian-border text-obsidian-muted hover:border-violet-500"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {status === "loading" && <p className="text-obsidian-muted">Ładowanie…</p>}
      {status === "error" && <p className="text-red-400">Nie udało się wczytać postów.</p>}
      {status === "ready" && posts.length === 0 && (
        <p className="text-obsidian-muted">Brak postów w tej kategorii.</p>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <Link
            key={post.id}
            to={`/forum/${post.id}`}
            className="block rounded-xl border border-obsidian-border bg-obsidian-surface p-4 hover:border-violet-500 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold">{post.title}</h2>
              <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-violet-600/20 text-violet-300 border border-violet-500/30">
                {post.categoryName}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-obsidian-muted">
              <span>{post.authorNickname}</span>
              <span>·</span>
              <span>{formatDate(post.createdAt)}</span>
              <span>·</span>
              <span>{post.commentsCount} komentarzy</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}