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