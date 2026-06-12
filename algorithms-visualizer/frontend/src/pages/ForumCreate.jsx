import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router";
import { getForumCategories, createForumPost } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import Markdown from "../components/Markdown";

export default function ForumCreate() {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [content, setContent] = useState("");
  const [tab, setTab] = useState("write");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    getForumCategories().then((cats) => {
      setCategories(cats);
      if (cats.length > 0) setCategoryId(String(cats[0].id));
    }).catch(() => setCategories([]));
  }, []);

  if (!loading && !user) {
    return (
      <p className="text-obsidian-muted">
        <Link to="/login" className="text-violet-400 hover:underline">Zaloguj się</Link>, aby tworzyć posty.
      </p>
    );
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    if (!title.trim() || !content.trim() || !categoryId) {
      setError("Uzupełnij tytuł, kategorię i treść.");
      return;
    }
    setSaving(true);
    try {
      const { id } = await createForumPost({
        title: title.trim(),
        content,
        categoryId: Number(categoryId),
      });
      navigate(`/forum/${id}`);
    } catch {
      setError("Nie udało się zapisać posta.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl">
      <Link to="/forum" className="text-sm text-violet-400 hover:underline">
        ← Wróć do forum
      </Link>
      <h1 className="text-2xl font-bold mt-4 mb-6">Nowy post</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="space-y-1">
          <label className="text-sm text-obsidian-muted">Tytuł</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={200}
            className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
          />
        </div>

        <div className="space-y-1">
          <label className="text-sm text-obsidian-muted">Kategoria</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <label className="text-sm text-obsidian-muted mr-auto">Treść (Markdown)</label>
            <button
              type="button"
              onClick={() => setTab("write")}
              className={`px-3 py-1 rounded-md text-xs ${tab === "write" ? "bg-violet-600 text-white" : "text-obsidian-muted hover:text-obsidian-text"}`}
            >Pisz</button>
            <button
              type="button"
              onClick={() => setTab("preview")}
              className={`px-3 py-1 rounded-md text-xs ${tab === "preview" ? "bg-violet-600 text-white" : "text-obsidian-muted hover:text-obsidian-text"}`}
            >Podgląd</button>
          </div>

          {tab === "write" ? (
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              maxLength={5000}
              placeholder="Wsparcie dla Markdown: **pogrubienie**, # nagłówki, - listy, `kod`…"
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm font-mono"
            />
          ) : (
            <div className="min-h-[16rem] px-4 py-3 rounded-lg border border-obsidian-border bg-obsidian-elevated">
              {content.trim()
                ? <Markdown>{content}</Markdown>
                : <p className="text-obsidian-muted text-sm">Nic do podglądu.</p>}
            </div>
          )}
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
        >
          {saving ? "Zapisywanie…" : "Opublikuj"}
        </button>
      </form>
    </div>
  );
}
