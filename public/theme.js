// Run before the stylesheet and React to avoid a light flash for dark-mode users.
(() => {
  let preference;
  try {
    preference = localStorage.getItem("terraprep-theme");
  } catch {
    // System preference remains available when browser storage is restricted.
  }
  const theme =
    preference === "light" || preference === "dark"
      ? preference
      : window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute("content", theme === "dark" ? "#101827" : "#f6f7fb");
})();
