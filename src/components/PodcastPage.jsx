import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchEpisodes from "../api/fetchEpisodes.js";
import { getGenreTitles } from "../utils/getGenreTitles.js";
import { formatDate } from "../utils/formatDate.js";
import { useLocation } from "react-router-dom";

//favorites import
import { getfavorites, togglefavorite } from "../utils/favorites.js";

//audio player import
import { useAudioPlayer } from "./player/AudioPlayerProvider.jsx";

/**
 * Formats seconds to MM:SS
 * @param {number} seconds - Duration in seconds
 * @returns {string} formatted duration as "MM:SS"
 */
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * PodcastPage component displays detailed information about a single podcast,
 * including seasons and episodes with audio playback, favorites, and accurate durations.
 *
 * @param {{podcasts: Array, genres: Array}} props
 * @returns {JSX.Element}
 */
export default function PodcastPage({ podcasts, genres }) {
  const { id } = useParams();
  const navigate = useNavigate();

  /** Full podcast details from API */
  const [details, setDetails] = useState(null);
  /** Loading state while fetching podcast details */
  const [loading, setLoading] = useState(true);

  // Season logic
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  /** Initial season from URL query or default to 1 */
  const initialSeason = Number(params.get("season")) || 1;
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);

  /** Track durations for each episode by index */
  const [episodeDurations, setEpisodeDurations] = useState({});

  /** Favorite episodes */
  const [favorites, setFavorites] = useState([]);

  /** Audio player hooks */
  const { playEpisode, currentEpisode, registerEpisodes } = useAudioPlayer();

  /** alternite route to determine if still loading */
  const isLoadingState = loading || !details;

  /**
   * Load favorite episodes from localStorage on component mount
   * This ensures the favorite buttons reflect current state
   */
  useEffect(() => {
    //forcing new reference so state updates
    setFavorites([...getfavorites()]);
  }, []);

  /**
   * Fetch full podcast details for the selected podcast
   * Updates `details` and `loading` state
   */
  useEffect(() => {
    async function load() {
      try {
        const full = await fetchEpisodes(id);
        setDetails(full);
      } catch (err) {
        console.error("Failed to fetch podcast details:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  // Overview info from basic podcasts prop or fallback to full details
  const overview = podcasts?.find((p) => p.id === id);

  const title = overview?.title || details?.title || "Untitled Podcast";
  const image = overview?.image || details?.image || "No Image";
  const description =
    overview?.description ||
    details?.description ||
    "No description available.";
  const updated = overview?.updated ? formatDate(overview.updated) : "Unknown";
  const genreTitles = getGenreTitles(overview?.genres || [], genres);

  // had to optional chain for all the ar
  const seasons = details?.seasons || [];
  const totalSeasons = seasons?.length || "unknown";

  /** Currently selected season object */
  const currentSeason = seasons.find(
    (s) => Number(s.season) === Number(selectedSeason)
  );

  const episodes = currentSeason?.episodes || [];
  const seasonImage = currentSeason?.image || image;

  /**
   * Loads and stores the duration for each episode in the selected season.
   *
   * This effect reads metadata for episode audio files (duration),
   * without playing them or interfering with the global audio player.
   */
  useEffect(() => {
    if (!episodes || episodes.length === 0) return;

    const loaders = episodes.map((ep, index) => {
      if (!ep.file) return null;

      const audio = new Audio(ep.file);

      const handleLoadedMetadata = () => {
        setEpisodeDurations((prev) => ({
          ...prev,
          [index]: formatDuration(audio.duration),
        }));
      };

      audio.addEventListener("loadedmetadata", handleLoadedMetadata);

      return { audio, handleLoadedMetadata };
    });

    return () => {
      loaders.forEach((entry) => {
        if (!entry) return;
        entry.audio.removeEventListener(
          "loadedmetadata",
          entry.handleLoadedMetadata
        );
      });
    };
  }, [episodes]);

  // Making sure the next and previous buttons work by mapping them into an object array
  useEffect(() => {
    if (!details) return; // make sure details are loaded
    if (episodes.length === 0) return; // no episodes to register

    // Format episodes for the global player
    const formattedEpisodes = episodes.map((ep, i) => ({
      showId: details.id,
      season: selectedSeason,

      // ensure episodeNumber exists
      episodeNumber: ep.episode || i + 1,
      title: ep.title || `Episode ${ep.episode || i + 1}`,
      audioUrl: ep.file,
      image: seasonImage,
      showTitle: title,
    }));

    registerEpisodes(details.id, selectedSeason, formattedEpisodes);
  }, [details, selectedSeason, episodes]);

  return (
    <div className="bg-gray-100 min-h-screen">
      {isLoadingState ? (
        <div className="min-h-screen flex items-center justify-center p-6">
          <div className="text-gray-600">Loading podcast...</div>
        </div>
      ) : (
        <>
          {/* HEADER */}
          <header className="fixed w-full flex items-center justify-between bg-white px-8 py-4 shadow-sm z-[999]">
            <div className="flex items-center gap-3">
              <button
                /** Navigate back to previous page */
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
              <h1 className="text-xl font-semibold text-gray-900">
                PodcastApp
              </h1>
            </div>
          </header>

          {/* MAIN CONTENT */}
          <div className="mx-auto p-6 pt-[20%] md:pt-[10%] sm:pt-[5%]">
            {/* INFO CARD */}
            <div className="bg-white rounded-xl shadow-sm p-8 mb-10">
              <div className="flex flex-col md:flex-row gap-8">
                <img
                  src={image}
                  alt={title}
                  className="w-full md:w-80 h-80 object-cover rounded-lg bg-gray-200"
                />
                <div className="flex-1">
                  <h2 className="text-3xl font-semibold text-gray-900">
                    {title}
                  </h2>
                  <p className="text-gray-700 mt-3 leading-relaxed text-[14px]">
                    {description}
                  </p>
                  <div className="mt-4">
                    <div className="grid grid-cols-2 sm:grid-cols-2 gap-6 mt-8">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900 mb-2">
                          GENRES
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {genreTitles.length > 0 ? (
                            genreTitles.map((g) => (
                              <span
                                key={g}
                                className="bg-gray-200 text-gray-800 text-xs px-3 py-1 rounded-full"
                              >
                                {g}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-gray-500">
                              No genres
                            </span>
                          )}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">LAST UPDATED</p>
                        <p className="font-medium text-gray-900">{updated}</p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">TOTAL SEASONS</p>
                        <p className="font-medium text-gray-900">
                          {totalSeasons}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">TOTAL EPISODES</p>
                        <p className="font-medium text-gray-900">
                          {seasons.reduce(
                            (sum, s) => sum + (s.episodes?.length || 0),
                            0
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* SEASON SELECT */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                Current Season
              </h3>
            </div>

            {/* SEASON OVERVIEW */}
            <div className="bg-white shadow-sm rounded-xl p-6 mb-6 gap-4 items-start">
              <div className="bg-white p-6 flex gap-4">
                <img
                  src={seasonImage}
                  alt={currentSeason?.title || `Season ${selectedSeason}`}
                  className="w-20 h-20 object-cover rounded-lg bg-gray-200"
                />

                <div className="flex-1">
                  <div className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <span>Season :</span>
                    {/** Season select dropdown */}
                    <select
                      value={selectedSeason}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        setSelectedSeason(value);
                        navigate(`?season=${value}`, { replace: true });
                      }}
                      className=" bg-white rounded text-lg cursor-pointer"
                    >
                      {seasons.map((s) => (
                        <option key={s.season} value={s.season}>
                          {s.season} - {s.title || `Season ${s.season}`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-sm text-gray-600 mt-1">
                    {currentSeason?.description ||
                      "No season description available."}
                  </p>

                  <div className="flex gap-6 mt-3 text-sm text-gray-700">
                    <p>
                      <span className="font-medium">{episodes.length}</span>{" "}
                      Episodes
                    </p>
                    {/* API doesn't have years seasons were released 
                <p>
                  Released{" "}
                  <span className="font-medium">
                    {currentSeason?.year || "Unknown"}
                  </span>
                </p>
                */}
                  </div>
                </div>
              </div>

              {/* EPISODE LIST */}
              <div className="bg-white shadow-sm rounded-xl p-6 space-y-4 relative z-0">
                {episodes.length === 0 && (
                  <p className="text-gray-500 text-sm italic">
                    No episodes available.
                  </p>
                )}

                {episodes.map((ep, i) => (
                  <div
                    key={i}
                    className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:shadow-md hover:scale-[1.02] flex gap-4"
                  >
                    {/* Episode thumbnail */}
                    <img
                      src={seasonImage}
                      alt={ep.title || `Episode ${ep.episode || i + 1}`}
                      className="w-24 h-24 object-cover rounded-lg bg-gray-200"
                    />

                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h5 className="font-semibold text-gray-900">
                          Episode {ep.episode || i + 1}:{" "}
                          {ep.title || "Untitled Episode"}
                        </h5>

                        {/* Button to add episode to favorites */}
                        <button
                          className="text-xl"
                          onClick={() => {
                            const idKey = `${id}-S${selectedSeason}-E${
                              ep.episode || i + 1
                            }`;

                            togglefavorite({
                              episodeId: idKey,
                              episode: ep,
                              showTitle: title,
                              seasonNumber: selectedSeason,
                              showImage: seasonImage,
                              addedAt: new Date().toString(),
                            });

                            // update locally
                            setFavorites(getfavorites());
                            //console.log("changed");
                          }}
                        >
                          {/* Check to see if favorited or not for correct heart emoji. red if true, white if false */}
                          {favorites.some(
                            (f) =>
                              f.episodeId ===
                              `${id}-S${selectedSeason}-E${ep.episode || i + 1}`
                          )
                            ? "❤️"
                            : "🤍"}
                        </button>
                      </div>

                      {/* Play button */}
                      <button
                        className="text-2xl mr-3"
                        onClick={() =>
                          playEpisode({
                            showId: id,
                            season: selectedSeason,
                            episodeNumber: ep.episode || i + 1,
                            audioUrl: ep.file,
                            title: ep.title,
                            image: seasonImage,
                            showTitle: title,
                          })
                        }
                      >
                        ▶
                      </button>

                      {/* NOW PLAYING 🎵 indicator */}
                      {currentEpisode &&
                      currentEpisode.showId === id &&
                      currentEpisode.season === selectedSeason &&
                      currentEpisode.episodeNumber === (ep.episode || i + 1) ? (
                        <span className="text-l bg-black text-white rounded p-1">
                          Now playing
                        </span>
                      ) : null}

                      <p className="text-sm text-gray-700 mt-1">
                        {ep.description || "No episode description available."}
                      </p>

                      {/* Extra metadata */}
                      <div className="flex gap-6 text-xs text-gray-600 mt-2">
                        <p>{episodeDurations[i] || "Loading..."}</p>

                        {/* API doesn't tell us when episode was aired 
                    <p>{ep.date ? formatDate(ep.date) : "Unknown date"}</p>
                    */}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
