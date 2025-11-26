import { useEffect, useMemo, useState } from "react";
import { useSearchParams, useParams, useNavigate } from "react-router-dom";

// Components
import SearchBar from "./components/SearchBar.jsx";
import SortSelect from "./components/SortSelect.jsx";
import GenreFilter from "./components/GenreFilter.jsx";
import PodcastPreviewCard from "./components/PodcastPreviewCard.jsx";
import Pagination from "./components/Pagination.jsx";

// API fetch helper
import fetchPodcasts from "./api/fetchData.js";

// Utility hook to sync query params with state
import useQueryState from "./utils/useQueryState.js";

// Static genre mapping
import { genreList } from "./utils/genreMap.js";

/**
 * Main App component: displays podcast listings with search, filter, sort, and pagination
 *
 * Path params:
 *  - /genre/:genreId/page/:pageNum
 *
 * Query params:
 *  - search: string
 *  - sort: "newest" | "title-asc" | "title-desc"
 *
 * @param {{ podcasts?: Array }} props Optional pre-fetched podcasts
 * @returns {JSX.Element}
 */
export default function App({ podcasts: initialPodcasts = null }) {
  /** --------------------
   * STATE
   * ------------------- */
  const [podcasts, setPodcasts] = useState(initialPodcasts || []);
  const [loading, setLoading] = useState(!initialPodcasts);
  const [error, setError] = useState(null);

  /** --------------------
   * ROUTER / QUERY PARAMS
   * ------------------- */
  const { genreId, pageNum } = useParams();
  const genre = genreId || "all"; // fallback to "all" genres
  const page = Math.max(1, Number(pageNum) || 1);

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useQueryState("search", "", [
    searchParams,
    setSearchParams,
  ]);
  const [sort, setSort] = useQueryState("sort", "newest", [
    searchParams,
    setSearchParams,
  ]);

  const ITEMS_PER_PAGE = 10;

  /** --------------------
   * FETCH PODCASTS
   * ------------------- */
  useEffect(() => {
    if (initialPodcasts) return; // hoping it skips if preloaded

    let mounted = true;
    async function load() {
      try {
        const data = await fetchPodcasts();
        if (!mounted) return;
        setPodcasts(data || []);
      } catch (err) {
        setError(err.message || String(err));
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();

    return () => {
      mounted = false;
    };
  }, [initialPodcasts]);

  /** --------------------
   * FILTER / SEARCH / SORT PODCASTS
   * ------------------- */
  const processed = useMemo(() => {
    if (!podcasts) return [];

    let list = [...podcasts];

    // Filter by genre
    if (genre !== "all") {
      const gid = Number(genre);
      list = list.filter((p) => (p.genres || []).includes(gid));
    }

    // Search by title
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((p) => (p.title || "").toLowerCase().includes(q));
    }

    // Sort
    if (sort === "title-asc") {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === "title-desc") {
      list.sort((a, b) => b.title.localeCompare(a.title));
    } else {
      // newest first
      list.sort((a, b) => new Date(b.updated) - new Date(a.updated));
    }

    return list;
  }, [podcasts, genre, search, sort]);

  const totalPages = Math.max(1, Math.ceil(processed.length / ITEMS_PER_PAGE));
  const visibleItems = processed.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE
  );

  /** --------------------
   * NAVIGATION HANDLERS
   * ------------------- */
  const handlePageChange = (nextPage) => {
    navigate(`/genre/${genre}/page/${nextPage}${window.location.search}`);
  };

  const handleGenreChange = (next) => {
    const g = next || "all";
    navigate(`/genre/${g}/page/1?${searchParams.toString()}`);
  };

  const handleSearchChange = (next) => {
    setSearch(next);

    const params = new URLSearchParams([...searchParams]);
    if (next) params.set("search", next);
    else params.delete("search");

    navigate(`/genre/${genre}/page/1?${params.toString()}`);
  };

  const handleSortChange = (next) => {
    setSort(next);

    const params = new URLSearchParams([...searchParams]);
    params.set("sort", next);

    navigate(`/genre/${genre}/page/1?${params.toString()}`);
  };

  /** --------------------
   * CONDITIONAL RENDERING FOR LOADING / ERROR STATES
   * ------------------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-gray-600">Loading podcasts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  /** --------------------
   * MAIN RENDER
   * ------------------- */
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Header part*/}
      <header className="fixed w-full bg-white px-6 py-4 shadow-sm z-[999]">
        <div className="flex justify-between ">
          <div className="flex items-center space-x-3">
            <img
              className="h-8 w-8"
              src="https://www.kindpng.com/picc/m/220-2202531_icon-apple-podcast-logo-hd-png-download.png"
              alt="Podcast Logo"
            />
            <h1 className="text-xl font-semibold text-gray-800">PodcastApp</h1>
          </div>

          <div className="w-[40%]">
            <SearchBar value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Filters part*/}
        <section className="bg-white  py-4 flex flex-wrap items-center gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Filter</span>
            {/* Genre dropdown using static genreList */}
            <GenreFilter
              value={genre === "all" ? null : genre}
              onChange={handleGenreChange}
              genres={genreList}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="font-medium text-gray-700">Sort</span>
            <SortSelect value={sort} onChange={handleSortChange} />
          </div>

          {/* Made this a buttno instead of trying to use <link>.  */}
          <div
            className="ml-2 bg-black text-white px-3 py-1.5 rounded hover:bg-gray-500 transition cursor-pointer text-center"
            onClick={() => navigate("/favorites")}
          >
            View Favorites
          </div>

          <div className="ml-auto text-sm text-gray-500">
            Showing <strong>{processed.length}</strong> result
            {processed.length !== 1 ? "s" : ""}
          </div>
        </section>
      </header>

      {/* Podcast Grid */}
      <main className="mt-[50%] md:mt-[18%] lg:mt-[13.5%] xl:mt-[10%] p-6">
        {processed.length === 0 ? (
          <div className="text-center text-gray-600 mt-20">
            No podcasts match your criteria.
          </div>
        ) : (
          <>
            <div className="grid gap-6 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleItems.map((p) => (
                <PodcastPreviewCard
                  key={p.id}
                  podcast={p}
                  genres={genreList}
                  onClick={() => navigate(`/show/${p.id}`)}
                />
              ))}
            </div>

            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={handlePageChange}
            />
          </>
        )}
      </main>
    </div>
  );
}
