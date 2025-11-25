/**
 * Fetch podcast data from the external API.
 * @returns {Promise<Array>} Array of podcast objects.
 * @throws {Error} If the request fails.
 */
export default async function fetchPodcasts() {
  const url = "https://podcast-api.netlify.app/";

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch podcasts: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching podcasts:", error);
    throw error;
  }
}
