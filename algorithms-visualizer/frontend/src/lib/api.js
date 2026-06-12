const API_BASE = "/api";

export async function getAlgorithms() {
  const res = await fetch(`${API_BASE}/algorithms`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getAlgorithm(id) {
  const res = await fetch(`${API_BASE}/algorithms/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function executeAlgorithm(algorithmName, inputData, extra = {}) {
  const res = await fetch(`${API_BASE}/algorithms/execute`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ algorithmName, inputData, ...extra }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function compareAlgorithms(algorithmNames, inputData) {
  const res = await fetch(`${API_BASE}/algorithms/compare`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ algorithmNames, inputData }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function login(email, password) {
  const res = await fetch(`${API_BASE}/account/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    let message = "Nie udało się zalogować.";
    try { const e = await res.json(); if (e?.message) message = e.message; } catch { /* noop */ }
    throw new Error(message);
  }
  return res.json();
}

export async function register(nickname, email, password) {
  const res = await fetch(`${API_BASE}/account/register`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nickname, email, password }),
  });
  if (!res.ok) {
    let message = "Nie udało się zarejestrować.";
    try { const e = await res.json(); if (e?.message) message = e.message; } catch { /* noop */ }
    throw new Error(message);
  }
  return res.json();
}

export async function getForumCategories() {
  const res = await fetch(`${API_BASE}/forum/categories`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getForumPosts(categorySlug) {
  const url = categorySlug
    ? `${API_BASE}/forum/posts?categorySlug=${encodeURIComponent(categorySlug)}`
    : `${API_BASE}/forum/posts`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function getForumPost(id) {
  const res = await fetch(`${API_BASE}/forum/posts/${id}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createForumPost({ title, content, categoryId }) {
  const res = await fetch(`${API_BASE}/forum/posts`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title, content, categoryId }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function createForumComment(postId, content) {
  const res = await fetch(`${API_BASE}/forum/posts/${postId}/comments`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

export async function deleteForumPost(id) {
  const res = await fetch(`${API_BASE}/forum/posts/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return true;
}