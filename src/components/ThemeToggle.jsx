import { useEffect, useState } from "react";

export default function ThemeToggle() {
  // Load initial state from localStorage or default to light
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    if (dark) root.classList.add("dark");
    else root.classList.remove("dark");
  }, [dark]);

  const toggleTheme = () => {
    setDark((prev) => {
      const next = !prev;
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };
  return (
    <div
      className="ml-auto cursor-pointer select-none px-3 py-1.5 rounded bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
      onClick={toggleTheme}
    >
      {dark ? "🌙" : "☀️"}
    </div>
  );
}
