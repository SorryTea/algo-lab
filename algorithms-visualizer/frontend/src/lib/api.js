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