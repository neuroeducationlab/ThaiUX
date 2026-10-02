/** Shared by the inline <head> script and the theme switcher. */
export const THEME_KEY = "thaiux:theme";

/** Applies the saved theme before first paint (no flash of the wrong theme). */
export const themeScript = `(function(){try{var t=localStorage.getItem("${THEME_KEY}");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
