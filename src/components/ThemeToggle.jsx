import { useEffect, useState } from "react";
import { FiSun, FiMoon } from "react-icons/fi";

const ThemeToggle = () => {
  const [theme, setTheme] = useState(() =>
    typeof window !== "undefined" && localStorage.getItem("theme") === "dark"
      ? "dark"
      : "light"
  );

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const toggleTheme = () =>
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));

  return (
    <button
      onClick={toggleTheme}
      className="cursor-pointer p-2 rounded-full bg-violet-200/70 dark:bg-gray-700 text-violet-800 transition shadow hover:shadow-md dark:text-white"
      aria-label="Toggle theme"
    >
      {theme === "dark" ? (
        <FiSun className="text-xl dark:text-yellow-400" />
      ) : (
        <FiMoon className="text-xl" />
      )}
    </button>
  );
};

export default ThemeToggle;
