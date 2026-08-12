/**
 * Fetch full podcast details including seasons and episodes.
 * @param {number|string} id
 * @returns {Promise<Object>}
 * @throws {Error}
 */
export default async function fetchEpisodes(showId) {
  const url = `https://podcast-api.netlify.app/id/${showId}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch show ${showId}: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching episodes:", error);
    throw error;
  }
}
