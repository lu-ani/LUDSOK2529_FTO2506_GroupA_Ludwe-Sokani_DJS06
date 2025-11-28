import { Link } from "react-router-dom";
import { useAudioPlayer } from "./AudioPlayerProvider";

/**
 * Global sticky bottom audio player.
 *
 * @returns {JSX.Element|null}
 */
export default function GlobalPlayer() {
  const {
    currentEpisode,
    isPlaying,
    progress,
    duration,
    togglePlay,
    seek,
    prevEpisode,
    nextEpisode,
  } = useAudioPlayer();

  if (!currentEpisode) return null;

  const { showId, season, episodeNumber, image, title, showTitle } =
    currentEpisode;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-xl p-4 flex items-center gap-4 z-[9999]">
      {/* Left clickable show/episode info */}
      <Link
        to={`/show/${showId}?season=${season}`}
        className="flex items-center gap-3 cursor-pointer w-[33%]"
      >
        <img
          src={image}
          className="h-16 w-16 rounded-lg object-cover"
          alt="Episode artwork"
        />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-gray-600">{showTitle}</p>
        </div>
      </Link>

      {/* Buttons */}
      <div className="flex justify-between w-[20%] mr-[10%]">
        {/* PREVIOUS BUTTON */}
        <button
          onClick={prevEpisode}
          className="text-xl p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ⏮
        </button>
        {/* Play/Pause */}
        <button
          onClick={togglePlay}
          className=" text-2xl p-2 rounded-full bg-black text-white"
        >
          {isPlaying ? "⏸" : "▶"}
        </button>
        {/* NEXT BUTTON */}
        <button
          onClick={nextEpisode}
          className="text-xl p-2 rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ⏭
        </button>
      </div>

      {/* Progress bar */}
      <div className="flex-1 flex flex-col ml-4 w-[5%]">
        <input
          type="range"
          min={0}
          max={duration || 1}
          value={progress}
          onChange={(e) => seek(Number(e.target.value))}
          className="w-full accent-black"
        />

        <div className="flex justify-between text-xs text-gray-600">
          <span>{Math.floor(progress)}s</span>
          <span>{Math.floor(duration)}s</span>
        </div>
      </div>
    </div>
  );
}
