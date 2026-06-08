import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className="icon-button" onClick={toggleTheme} aria-label="Toggle theme">
      {theme === "dark" ? "☀" : "☾"}
    </button>
  );
};

export default ThemeToggle;

