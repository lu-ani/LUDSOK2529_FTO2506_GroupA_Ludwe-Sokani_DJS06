import React, { useState, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Components
import App from "./App.jsx";
import PodcastPage from "./components/PodcastPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";

// Data
import fetchPodcasts from "./api/fetchData.js";

function Root() {
  const [podcasts, setPodcasts] = useState(null); // null means "not loaded yet"

  // Fetch podcasts on mount
  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const data = await fetchPodcasts();
        if (!mounted) return;
        setPodcasts(data || []);
      } catch (err) {
        console.error("Failed to fetch podcasts:", err);
        if (mounted) setPodcasts([]);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* Main podcast listing page */}
        <Route path="/" element={<App podcasts={podcasts} />} />
        <Route
          path="/genre/:genreId/page/:pageNum"
          element={<App podcasts={podcasts} />}
        />

        {/* Standalone podcast page */}
        <Route path="/show/:id" element={<PodcastPage podcasts={podcasts} />} />
        <Route path="/favorites" element={<FavoritesPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const root = createRoot(document.getElementById("root"));
root.render(<Root />);
