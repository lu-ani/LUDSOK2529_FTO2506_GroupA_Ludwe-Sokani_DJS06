import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchEpisodes from "../api/fetchEpisodes.js";
import { getGenreTitles } from "../utils/getGenreTitles.js";
import { formatDate } from "../utils/formatDate.js";
import { useLocation } from "react-router-dom";

/**
 * Formats seconds to MM:SS
 * @param {number} seconds
 * @returns {string} formatted duration
 */
function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

/**
 * PodcastPage component displays detailed information about a single podcast,
 * including seasons and episodes with audio playback and accurate durations.
 *
 * @param {{podcasts: Array, genres: Array}} props
 * @returns {JSX.Element}
 */
export default function PodcastPage({ podcasts, genres }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  //season logic
  const location = useLocation();
  const params = new URLSearchParams(location.search);

  const initialSeason = Number(params.get("season")) || 1;
  const [selectedSeason, setSelectedSeason] = useState(initialSeason);

  // Track durations for each episode by index
  const [episodeDurations, setEpisodeDurations] = useState({});

  // Load full podcast details
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

  if (loading || !details) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-600">Loading podcast...</div>
      </div>
    );
  }

  const overview = podcasts?.find((p) => p.id === id);

  const title = overview?.title || details.title;
  const image =
    overview?.image || details.image || "https://placehold.net/default.png"; // ⭐ fallback
  const description =
    overview?.description || details.description || "No description available."; // ⭐ fallback
  const updated = overview?.updated ? formatDate(overview.updated) : "Unknown";
  const genreTitles = getGenreTitles(overview?.genres || [], genres);

  const seasons = details.seasons || [];
  const totalSeasons = seasons.length;

  const currentSeason = seasons.find(
    (s) => Number(s.season) === Number(selectedSeason)
  );

  const episodes = currentSeason?.episodes || [];
  const seasonImage = currentSeason?.image || image;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* HEADER */}
      <header className="fixed w-full flex items-center justify-between bg-white px-8 py-4 shadow-sm z-[999]">
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
          <h1 className="text-xl font-semibold text-gray-900">PodcastApp</h1>
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
              <h2 className="text-3xl font-semibold text-gray-900">{title}</h2>
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
                        <span className="text-xs text-gray-500">No genres</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">LAST UPDATED</p>
                    <p className="font-medium text-gray-900">{updated}</p>
                  </div>

                  <div>
                    <p className="text-xs text-gray-500">TOTAL SEASONS</p>
                    <p className="font-medium text-gray-900">{totalSeasons}</p>
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
                  <h5 className="font-semibold text-gray-900">
                    Episode {ep.episode || i + 1}:{" "}
                    {ep.title || "Untitled Episode"}
                  </h5>

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

                  {/* Audio player */}
                  {ep.file ? (
                    <audio
                      controls
                      src={ep.file}
                      className="mt-2 w-full"
                      onLoadedMetadata={(e) => {
                        const duration = e.target.duration;
                        if (!isNaN(duration)) {
                          setEpisodeDurations((prev) => ({
                            ...prev,
                            [i]: formatDuration(duration),
                          }));
                        }
                      }}
                      onError={() => {
                        setEpisodeDurations((prev) => ({
                          ...prev,
                          [i]: "Unknown length", // fallback if file info can't load. don't remove when i get it working
                        }));
                      }}
                    >
                      Your browser does not support the audio element.
                    </audio>
                  ) : (
                    <p className="text-xs text-gray-500 mt-2">
                      Audio not available.
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
