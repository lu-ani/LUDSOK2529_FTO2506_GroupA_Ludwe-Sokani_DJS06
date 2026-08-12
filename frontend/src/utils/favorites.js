/**
 * Key used for storing favorite episodes in localStorage
 * @constant {string}
 */
const FAV_KEY = "favoriteEpisodes";

/**
 * @typedef {Object} Favorite
 * @property {string} episodeId - Unique ID of the episode (e.g., "5276-S1-E1").
 * @property {Object} episode - Episode details object containing title, description, file, etc.
 * @property {string} showTitle - Title of the show the episode belongs to.
 * @property {number} seasonNumber - The season number of the episode.
 * @property {string} [addedAt] - ISO string of when the episode was added to favorites.
 */

/**
 * Retrieves the list of favorite episodes from localStorage.
 * @returns {Favorite[]} Array of favorite episode objects.
 */
export function getfavorites() {
  const saved = localStorage.getItem(FAV_KEY);
  return saved ? JSON.parse(saved) : [];
}

/**
 * Saves the given list of favorite episodes to localStorage.
 * @param {Favorite[]} list - Array of favorite episode objects to save.
 */
export function savefavorites(list) {
  localStorage.setItem(FAV_KEY, JSON.stringify(list));
}

/**
 * Checks if a specific episode is currently favorited.
 * @param {string} episodeId - The unique ID of the episode.
 * @returns {boolean} True if the episode is favorited, false otherwise.
 */
export function isfavorited(episodeId) {
  return getfavorites().some((f) => f.episodeId === episodeId);
}

/**
 * Adds a new episode to the favorites list if it is not already present.
 * @param {Favorite} fav - Episode object to add to favorites.
 */
export function addfavorite(fav) {
  const favs = getfavorites();
  //let addedAt = null;
  if (!isfavorited(fav.episodeId)) {
    // adding time when I toggle, don't need it here?
    //addedAt = new Date().toISOString();
    favs.push({ ...fav });
    savefavorites(favs);
    console.log(favs);
  }
}

/**
 * Removes an episode from the favorites list by its ID.
 * @param {string} episodeId - The unique ID of the episode to remove.
 */
export function removefavorite(episodeId) {
  const filtered = getfavorites().filter((f) => f.episodeId !== episodeId);
  savefavorites(filtered);
}

/**
 * Toggles the favorite status of an episode.
 * If the episode is already favorited, it will be removed.
 * If not, it will be added to favorites.
 * @param {Favorite} fav - Episode object to toggle in favorites.
 */
export function togglefavorite(fav) {
  if (isfavorited(fav.episodeId)) {
    removefavorite(fav.episodeId);
  } else {
    addfavorite(fav);
  }
}
