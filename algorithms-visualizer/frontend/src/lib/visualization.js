export const MIN_ELEMENTS = 5;
export const MAX_VISUALIZE = 100;   
export const MAX_COMPARE = 1000;    


export function parseNumbers(text) {
  return text
    .split(/[\s,;]+/)
    .map((t) => parseInt(t, 10))
    .filter((n) => Number.isInteger(n));
}

export function randomArray(n, max = 99) {
  const size = Math.max(MIN_ELEMENTS, Math.min(MAX_COMPARE, n));
  return Array.from({ length: size }, () => Math.floor(Math.random() * max) + 1);
}

export function formatDuration(us) {
  if (us == null) return "—";
  if (us < 1000) return `${us} µs`;
  if (us < 1_000_000) return `${(us / 1000).toFixed(2)} ms`;
  return `${(us / 1_000_000).toFixed(2)} s`;
}