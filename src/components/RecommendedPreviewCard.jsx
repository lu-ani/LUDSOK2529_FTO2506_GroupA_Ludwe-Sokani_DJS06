import { getGenreTitles } from "../utils/getGenreTitles";
import { formatDate } from "../utils/formatDate";
/**
 * PodcastPreviewCard component
 * Displays image, title, seasons, genres, and updated date
 * Replaces <podcast-preview> .
 */
export default function RecommendedPreviewCard({ podcast, genres, onClick }) {
  const genreTitles = getGenreTitles(podcast.genres, genres);

  return (
    <div
      className="w-[15%] bg-white rounded-lg p-4 shadow-sm transition-all duration-200 ease-in-out cursor-pointer flex flex-col gap-2 hover:shadow-md hover:scale-[1.02]"
      onClick={() => onClick(podcast)}
    >
      <img
        src={podcast.image}
        alt={podcast.title}
        className="w-full h-full object-cover rounded-lg bg-gray-200"
      />
      <h2 className="font-semibold text-gray-800 text-[80%]  whitespace-normal ">
        {podcast.title}
      </h2>
      <p className="text-gray-600 text-sm">📅 {podcast.seasons} seasons</p>
      <div className="flex flex-wrap gap-1">
        {genreTitles.map((g) => (
          <span
            key={g}
            className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full"
          >
            {g}
          </span>
        ))}
      </div>
      <p className="text-xs text-gray-500">{formatDate(podcast.updated)}</p>
    </div>
  );
}
