import { genreMap } from "./genreMap.js";

// ============================================================
// --- utils/getGenreTitles.js ---
// ============================================================
/**
 * Resolve genre IDs to their titles.
 * @param {number[]} genreIds
 * @param {Array} genres - list of genre objects
 */

/**
 * Convert an array of genre IDs → array of titles
 */
export function getGenreTitles(genreIds) {
  return genreIds.map((id) => genreMap[id]).filter(Boolean);
}
