
/**
 * @typedef {Object} EpisodeData
 * @property {string} showId - The podcast show ID.
 * @property {number} season - The season number.
 * @property {number} episodeNumber - The episode number.
 * @property {string} title - The episode title.
 * @property {string} audioUrl - Audio stream URL.
 * @property {string} image - Episode or season artwork.
 * @property {string} showTitle - Podcast show title.
 */
const AudioPlayerContext = createContext(null);

const EPISODE_REGISTRY = {};
/**
 * Global persistent audio player provider.
 * Wrap your entire <App /> so player never unmounts between page transitions.
 *
 * Handles:
 * - audio loading
 * - playback state
 * - progress + duration
 * - persistence to localStorage
 * - restoring previous episode on refresh
 *
 * @param {{children: JSX.Element}} props
 * @returns {JSX.Element}
 */
export function AudioPlayerProvider({ children }) {
  // Audio element is created once and stays alive for the whole app lifetime.
  const audioRef = useRef(new Audio());

  /** Currently playing episode */
  const [currentEpisode, setCurrentEpisode] = useState(null);
  /** Is the player currently playing */
  const [isPlaying, setIsPlaying] = useState(false);
  /** Current progress in seconds */
  const [progress, setProgress] = useState(0);
  /** Total duration of the episode */
  const [duration, setDuration] = useState(0);
  /** Flag to indicate user manually clicked play */
  const [manualPlay, setManualPlay] = useState(false);

  /**
   * Restore last played episode + progress from localStorage on mount.
   */
  useEffect(() => {
    const stored = localStorage.getItem("global-player");
    if (!stored) return;

    const saved = JSON.parse(stored);

    //console.log("mounted");

    setCurrentEpisode(saved.currentEpisode || null);
    setProgress(saved.progress || 0);
    setIsPlaying(false);
  }, []);

  /**
   * Handles changes to the current episode.
   * - Pauses previous audio
   * - Loads new audio
   * - Resets progress
   * - Only auto-play if triggered manually by user
   */
  useEffect(() => {
    if (!currentEpisode) return;

    const a = audioRef.current;

    // only load audio automatically if not user-triggered
    if (!manualPlay) {
      a.src = currentEpisode.audioUrl;
      a.currentTime = progress || 0;

      // Stop previous episode
      a.pause();
      setIsPlaying(false);

      a.load();
    }
  }, [currentEpisode]);

  /**
   * Persist the current episode + progress to localStorage whenever they change.
   */
  useEffect(() => {
    localStorage.setItem(
      "global-player",
      JSON.stringify({
        currentEpisode,
        progress,
      })
    );
  }, [currentEpisode, progress]);

  /**
   * Set up audio element listeners:
   * - timeupdate → update progress
   * - loadedmetadata → update duration
   */
  useEffect(() => {
    const a = audioRef.current;

    const update = () => setProgress(a.currentTime);
    const loaded = () => setDuration(a.duration || 0);

    a.addEventListener("timeupdate", update);
    a.addEventListener("loadedmetadata", loaded);

    return () => {
      a.removeEventListener("timeupdate", update);
      a.removeEventListener("loadedmetadata", loaded);
    };
  }, []);

  /**
   * Move to the previous episode (episodeNumber - 1).
   *
   * If previous metadata doesn't exist, does nothing.
   */
  function prevEpisode() {
    if (!currentEpisode) return;

    const { showId, season, episodeNumber } = currentEpisode;

    const list = EPISODE_REGISTRY[showId]?.[season];
    if (!list) return;

    const currentIndex = list.findIndex(
      (ep) => ep.episodeNumber === episodeNumber
    );

    const prev = list[currentIndex - 1];
    if (prev) {
      playEpisode(prev);
    } // If there's no previous. do nothing
    else {
      return;
    }
  }

  /**
   * Request playback of a specific episode and immediately play it.
   *
   * This directly manipulates the audio element, and ensures `isPlaying` is updated.
   * Also sets the `manualPlay` flag to true so auto-loading logic does not interfere.
   *
   * @param {EpisodeData} episode - Episode to play
   */
  function playEpisode(episode) {
    const a = audioRef.current;

    // user clicked play
    setManualPlay(true);

    setCurrentEpisode(episode);
    a.currentTime = 0;
    a.src = episode.audioUrl;

    a.load();

    a.play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false)); // failsafe, e.g. autoplay restrictions
  }

  /**
   * Move to the next episode (episodeNumber + 1).
   *
   * If next episode metadata isn't available, fails safely.
   */
  function nextEpisode() {
    if (!currentEpisode) return;

    const { showId, season, episodeNumber } = currentEpisode;

    const list = EPISODE_REGISTRY[showId]?.[season];
    if (!list) return;

    const currentIndex = list.findIndex(
      (ep) => ep.episodeNumber === episodeNumber
    );

    const next = list[currentIndex + 1];
    if (next) {
      playEpisode(next);
    } else {
      return;
    }
  }

  /**
   * Toggle play/pause for the active episode.
   *
   * @returns {void}
   */
  function togglePlay() {
    const a = audioRef.current;

    if (a.paused) {
      a.play();
      setIsPlaying(true);
    } else {
      a.pause();
      setIsPlaying(false);
    }
  }

  /**
   * Seek the audio player to a specific time in seconds.
   *
   * @param {number} sec - Time in seconds to jump to
   */
  function seek(sec) {
    const a = audioRef.current;
    a.currentTime = sec;
    setProgress(sec);
  }

  /**
   * Register a full list of episodes so navigation (next/prev) works.
   *
   * @param {string} showId
   * @param {number} season
   * @param {EpisodeData[]} episodes
   */
  function registerEpisodes(showId, season, episodes) {
    if (!EPISODE_REGISTRY[showId]) {
      EPISODE_REGISTRY[showId] = {};
    }

    EPISODE_REGISTRY[showId][season] = episodes;
  }

  return (
    <AudioPlayerContext.Provider
      value={{
        currentEpisode,
        isPlaying,
        progress,
        duration,
        prevEpisode,
        playEpisode,
        nextEpisode,
        togglePlay,
        seek,
        registerEpisodes,
      }}
    >
      {children}
    </AudioPlayerContext.Provider>
  );
}

/**
 * Hook to access audio player state and controls.
 *
 * @returns {AudioPlayerContextValue} Current audio player state and control functions
 */
export function useAudioPlayer() {
  return useContext(AudioPlayerContext);
}
