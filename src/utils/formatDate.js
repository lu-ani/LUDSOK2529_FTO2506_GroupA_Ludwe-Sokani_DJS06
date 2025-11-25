// ============================================================
// --- utils/formatDate.js ---
// ============================================================
/**
 * Formats a date string into a human-readable relative time
 * e.g., "2 days ago" or "Last updated: March 10, 2025"
 * DIFFERENCE: uses JS Date logic inside React context (no change in core idea)
 */
export function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = Math.floor((now - date) / (1000 * 60 * 60 * 24)); // days difference

  if (diff === 0) return "Today";
  if (diff === 1) return "1 day ago";
  if (diff < 7) return `${diff} days ago`;

  const options = { day: "numeric", month: "long", year: "numeric" };
  const formatted = date.toLocaleDateString(undefined, options);
  return `Last updated: ${formatted}`;
}
