import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { getForumPost, createForumComment, deleteForumPost } from "../lib/api";
import { useAuth } from "../lib/auth.jsx";
import Markdown from "../components/Markdown";

function formatDate(value) {
  return new Date(value).toLocaleDateString("pl-PL", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function ForumPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [post, setPost] = useState(null);
  const [status, setStatus] = useState("loading");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  async function load() {
    setStatus("loading");
    try {
      const data = await getForumPost(id);
      setPost(data);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }

  useEffect(() => { load(); /* eslint-disable-next-line */ }, [id]);

  async function submitComment(e) {
    e.preventDefault();
    if (!comment.trim()) return;
    setSending(true);
    try {
      await createForumComment(id, comment.trim());
      setComment("");
      await load();
    } finally {
      setSending(false);
    }
  }

  async function onDelete() {
    if (!confirm("Usunąć ten post?")) return;
    try {
      await deleteForumPost(id);
      navigate("/forum");
    } catch {
      alert("Nie udało się usunąć posta.");
    }
  }

  if (status === "loading") return <p className="text-obsidian-muted">Ładowanie…</p>;
  if (status === "error" || !post) return <p className="text-red-400">Nie znaleziono posta.</p>;

  const canDelete = user && (user.isAdmin || user.nickname === post.authorNickname);

  return (
    <div className="max-w-3xl">
      <Link to="/forum" className="text-sm text-violet-400 hover:underline">
        ← Wróć do forum
      </Link>

      <article className="mt-4 rounded-2xl border border-obsidian-border bg-obsidian-surface p-6">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl font-bold">{post.title}</h1>
          <span className="shrink-0 px-2 py-0.5 rounded-full text-xs bg-violet-600/20 text-violet-300 border border-violet-500/30">
            {post.categoryName}
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-x-3 mt-2 text-xs text-obsidian-muted">
          <span>{post.authorNickname}</span>
          <span>·</span>
          <span>{formatDate(post.createdAt)}</span>
          {canDelete && (
            <button onClick={onDelete} className="ml-auto text-red-400 hover:underline">
              Usuń
            </button>
          )}
        </div>

        <div className="mt-4">
          <Markdown>{post.content}</Markdown>
        </div>
      </article>

      <section className="mt-8">
        <h2 className="text-lg font-semibold mb-3">
          Komentarze ({post.comments.length})
        </h2>

        <div className="space-y-3">
          {post.comments.map((c) => (
            <div key={c.id} className="rounded-xl border border-obsidian-border bg-obsidian-elevated p-4">
              <div className="flex items-center gap-2 text-xs text-obsidian-muted mb-1">
                <span className="font-medium text-obsidian-text">{c.authorNickname}</span>
                <span>·</span>
                <span>{formatDate(c.createdAt)}</span>
              </div>
              <p className="text-sm whitespace-pre-wrap">{c.content}</p>
            </div>
          ))}
          {post.comments.length === 0 && (
            <p className="text-obsidian-muted text-sm">Brak komentarzy. Bądź pierwszy!</p>
          )}
        </div>

        {user ? (
          <form onSubmit={submitComment} className="mt-5 space-y-3">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={3}
              placeholder="Napisz komentarz…"
              className="w-full px-3 py-2 rounded-lg border border-obsidian-border bg-obsidian-elevated text-sm"
            />
            <button
              type="submit"
              disabled={sending || !comment.trim()}
              className="px-4 py-2 rounded-lg bg-violet-600 text-white text-sm font-semibold hover:bg-violet-500 disabled:opacity-50"
            >
              {sending ? "Wysyłanie…" : "Dodaj komentarz"}
            </button>
          </form>
        ) : (
          <p className="mt-5 text-sm text-obsidian-muted">
            <Link to="/login" className="text-violet-400 hover:underline">Zaloguj się</Link>, aby komentować.
          </p>
        )}
      </section>
    </div>
  );
}