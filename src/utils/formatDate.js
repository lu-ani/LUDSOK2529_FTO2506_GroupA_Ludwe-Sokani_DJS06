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

//add date and time formatting ONLY to use in favorites page so far

/**
 * Formats an ISO date string to a human-readable date and time string.
 *
 * Example output: "Nov 30, 2025, 14:32"
 *
 * @param {string} isoString - The ISO string representing the date/time.
 * @returns {string} A formatted date and time string. Returns an empty string if input is falsy.
 */
export function formatDateAndTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
