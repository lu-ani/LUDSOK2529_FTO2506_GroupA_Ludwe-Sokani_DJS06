export default async function fetchGenres() {
  const url = "https://podcast-api.netlify.app/genre";

  console.log("Fetching genres from:", url);

  try {
    const response = await fetch(url);
    console.log("Genre response status:", response.status);

    if (!response.ok) {
      throw new Error(`Failed to fetch genres: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched genres:", data);
    return data;
  } catch (error) {
    console.error("Error fetching genres:", error);
    throw error;
  }
}
