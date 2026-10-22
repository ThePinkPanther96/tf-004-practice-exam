export function isFloydSearch(search: string) {
  return search.trim().toLowerCase().replace(/\s+/g, " ") === "pink floyd";
}
