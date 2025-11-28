import { getfavorites, togglefavorite } from "../utils/favorites.js";
import { formatDateAndTime } from "../utils/formatDate.js";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

//for PLay button
import { useAudioPlayer } from "../components/player/AudioPlayerProvider.jsx";

// !!!! trying to carry over definitions from favorites.js .. not working will try again later
/**
 * @typedef {import("../utils/favorites.js").Favorite} Favorite
 */

/**
 * FavoritesPage component displays all episodes that have been added to favorites,
 * allowing sorting and grouping by show, as well as toggling favorites.
 *
 * @returns {JSX.Element} The rendered FavoritesPage component.
 */
export default function FavoritesPage() {
  /** @type {[string, function]} */
  const [sort, setSort] = useState("newest");

  /** @type {[Favorite[], function]} */
  const [favorites, setFavorites] = useState(getfavorites());

  // Working on navigation
  const navigate = useNavigate();

  // Working on adding play button here.
  const { playEpisode, currentEpisode, registerEpisodes } = useAudioPlayer();

  /** Group favorite episodes by show title */
  const grouped = favorites.reduce((acc, fav) => {
    if (!acc[fav.showTitle]) acc[fav.showTitle] = [];
    acc[fav.showTitle].push(fav);
    return acc;
  }, {});

  /**
   * Sorts a list of favorite episodes based on the currently selected sort option.
   * @param {Favorite[]} favList - Array of favorite episodes to sort.
   * @returns {Favorite[]} Sorted array of favorite episodes.
   */
  function sortFavorites(favList) {
    const sorted = [...favList];
    // Converting addedAt to number cause I needed it in readable format while testing
    // .getTime properly converts it to a time, was getting NaN before.
    if (sort === "newest")
      sorted.sort(
        (a, b) => new Date(b.addedAt).getTime() - new Date(a.addedAt).getTime()
      );

    if (sort === "oldest")
      sorted.sort(
        (a, b) => new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime()
      );

    return sorted;
  }

  /** Sort show titles alphabetically based on sort selection */
  const sortedShows = Object.keys(grouped).sort((a, b) => {
    if (sort === "az") return a.localeCompare(b);
    if (sort === "za") return b.localeCompare(a);
    return a.localeCompare(b); // default
  });

  /** Register episodes for audio player whenever sort or favorites change */
  useEffect(() => {
    // Re-register episodes whenever sort changes or favorites change
    Object.keys(grouped).forEach((showTitle) => {
      const showFavs = sortFavorites(grouped[showTitle]); // sorted according to current sort

      const formatted = showFavs.map((fav, i) => ({
        showId: fav.showTitle,
        season: fav.seasonNumber,
        episodeNumber: i + 1,
        title: fav.episode.title,
        audioUrl: fav.episode.file,
        image: fav.showImage,
        showTitle: fav.showTitle,
        favId: fav.episodeId,
      }));

      // Register episodes exactly as currently displayed
      registerEpisodes(showTitle, showFavs[0]?.season || 1, formatted);
    });
  }, [sort, favorites]);

  /**
   * Handles toggling a favorite episode.
   * Updates local storage and refreshes the local state.
   *
   * @param {Favorite} fav - The favorite episode to toggle.
   */
  function handleToggle(fav) {
    togglefavorite(fav); // update local storage
    setFavorites(getfavorites()); // refresh UI
  }

  return (
    <div className="bg-gray-100 dark:bg-slate-950 min-h-screen pb-[8%]">
      {/* HEADER */}
      <header className="fixed dark:bg-slate-900 w-full flex items-center justify-between bg-white px-8 py-4 shadow-sm z-[999]">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-[50%] text-white bg-black hover:bg-white hover:text-black"
          >
            ←
          </button>
          <img
            src="https://www.kindpng.com/picc/m/220-2202531_icon-apple-podcast-logo-hd-png-download.png"
            className="h-8 w-8 rounded-full"
            alt="App logo"
          />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
            PodcastApp
          </h1>
        </div>
        {/* SORTING */}
        <select
          className="border p-2 rounded mb-6 dark:bg-slate-950 dark:border-none dark:text-gray-500"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        >
          <option value="newest">Date Added - newest</option>
          <option value="oldest">Date Added - oldest</option>
          <option value="az">A–Z</option>
          <option value="za">Z–A</option>
        </select>
      </header>

      <div className="pt-[9%]">
        <h1 className="ml-8 text-2xl dark:text-gray-500">Favorites:</h1>
        {/* Have message pop up when there're no favorites to keep in line with rest of site */}
        {favorites.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            You don't have any favorites yet, start listening and keep all your
            favorites here.
          </div>
        ) : (
          <>
            {/* GROUPS */}
            {sortedShows.map((show) => {
              const showFavs = sortFavorites(grouped[show]); // compute once per show

              return (
                <div key={show} className="m-8">
                  <h2 className="text-lg font-semibold mb-4 dark:text-gray-400">
                    {show}
                  </h2>

                  <div className="bg-white dark:bg-slate-900 shadow-sm rounded-xl p-6 space-y-4 relative z-0">
                    {showFavs.map((fav, i) => {
                      const isFavorite = favorites.some(
                        (f) => f.episodeId === fav.episodeId
                      );

                      return (
                        <div
                          key={fav.episodeId}
                          className="p-4 border border-gray-200 dark:bg-slate-800 dark:border-none rounded-lg hover:bg-gray-50 dark:hover:bg-slate-950 hover:shadow-md hover:scale-[1.02] flex gap-4"
                        >
                          {/* Episode thumbnail */}
                          <img
                            src={fav.showImage}
                            alt={fav.episode.title || `Episode ${i + 1}`}
                            className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                          />

                          <div className="flex-1">
                            <div className="flex justify-between items-start">
                              <h5 className="font-semibold text-gray-900 dark:text-gray-400">
                                Episode {fav.episode.episode || i + 1}:{" "}
                                {fav.episode.title || "Untitled Episode"}
                              </h5>

                              <button
                                className="text-xl"
                                onClick={() => handleToggle(fav)}
                              >
                                {isFavorite ? "❤️" : "🤍"}
                              </button>
                            </div>
                            {/* Play button */}
                            <button
                              className="text-2xl mr-3"
                              onClick={() =>
                                playEpisode({
                                  showId: fav.showTitle,
                                  season: fav.seasonNumber,
                                  episodeNumber: i + 1, // index in current visual order
                                  audioUrl: fav.episode.file,
                                  title: fav.episode.title,
                                  image: fav.showImage,
                                  showTitle: fav.showTitle,
                                })
                              }
                            >
                              ▶
                            </button>

                            {/* NOW PLAYING indicator */}
                            {currentEpisode &&
                              currentEpisode.showId === fav.showTitle &&
                              currentEpisode.episodeNumber === i + 1 && (
                                <span className="text-l bg-black dark:bg-slate-300 dark:text-black text-white rounded p-1">
                                  Now playing
                                </span>
                              )}

                            <p className="text-sm text-gray-700 dark:text-gray-400 mt-1">
                              {fav.episode.description ||
                                "No episode description available."}
                            </p>

                            <div className="flex gap-6 text-xs text-gray-600 dark:text-gray-400 mt-2">
                              <p>Season {fav.seasonNumber}</p>
                              <p>Added {formatDateAndTime(fav.addedAt)}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
