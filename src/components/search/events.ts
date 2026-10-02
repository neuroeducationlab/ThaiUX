/** Decoupled open/close for the search palette (header, tab bar and shortcuts all use it). */
export const OPEN_SEARCH_EVENT = "thaiux:open-search";

export function openSearch() {
  window.dispatchEvent(new CustomEvent(OPEN_SEARCH_EVENT));
}
