import { useEffect, useState } from "react";

type Theme = "light" | "dark";
const systemTheme = (): Theme =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
function savedTheme(): Theme | null {
  try {
    const value = localStorage.getItem("terraprep-theme");
    return value === "light" || value === "dark" ? value : null;
  } catch {
    return null;
  }
}

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() =>
    document.documentElement.dataset.theme === "dark" ? "dark" : "light",
  );
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute("content", theme === "dark" ? "#101827" : "#f6f7fb");
  }, [theme]);
  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const onSystemChange = () => {
      if (!savedTheme()) setTheme(systemTheme());
    };
    const onStorage = (event: StorageEvent) => {
      if (event.key === "terraprep-theme" || event.key === null)
        setTheme(savedTheme() ?? systemTheme());
    };
    media.addEventListener("change", onSystemChange);
    window.addEventListener("storage", onStorage);
    return () => {
      media.removeEventListener("change", onSystemChange);
      window.removeEventListener("storage", onStorage);
    };
  }, []);
  function toggleTheme() {
    const next = theme === "dark" ? "light" : "dark";
    try {
      localStorage.setItem("terraprep-theme", next);
    } catch {
      /* The toggle still works for this visit. */
    }
    setTheme(next);
  }
  return { theme, toggleTheme };
}
