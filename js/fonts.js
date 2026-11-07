// The fonts the game can be shown in (ARCHITECTURE.md §7 "Styles", css/fonts/). m5x7 is the game's own font and the default:
// it is css/typography.css's, needs no file and no attribute. Every other font is one CSS file in css/fonts/ with its @font-face
// rules and a :root[data-font="<id>"] block that overrides the font tokens (--font-game, --letter-spacing, the --text-* sizes,
// the --line-* heights, the nudges, and the story's own --log-text and --log-line if it wants). Choosing one sets data-font on
// <html>, so every piece of the page follows. A font's file is loaded only when it is first chosen (a <link> added once), so the
// game never downloads a font it doesn't show.
//
// To add a font: its files in fonts/, its CSS file in css/fonts/ (copy pixel-code.css), and one line below.
// `rev`: bump it whenever the font's CSS file changes, so browsers fetch the new file instead of the one they keep (the
// file's address gets ?v=<rev>; Diego's browser kept showing an earlier font file, 4 Nov 2026).
// Used by the debug panel (ui/debug.js, Typography) today; the Options menu could offer the same list later.

export const DEFAULT = "m5x7";

export const FONTS = [
  { id: "m5x7",                name: "m5x7",                css: null },
  { id: "player-sans-mono",     name: "Player Sans Mono",     css: "css/fonts/player-sans-mono.css", rev: 1 },
  { id: "pixel-code",           name: "Pixel Code",           css: "css/fonts/pixel-code.css", rev: 1 },
  { id: "pixelify-sans",        name: "Pixelify Sans",        css: "css/fonts/pixelify-sans.css", rev: 1 },
  { id: "silver",               name: "Silver",               css: "css/fonts/silver.css", rev: 1 }
];

export const fontById = (id) => FONTS.find(f => f.id === id) ?? null;

const loaded = new Map();   // a CSS file's address → the promise of its <link> having loaded (one <link> per file, ever)

// Load a CSS file once: resolves when it has loaded (or failed: the page then simply keeps the tokens it has).
function sheet(href, rev, root) {
  const url = new URL("../" + href + (rev ? "?v=" + rev : ""), import.meta.url).href;
  if (!loaded.has(url)) loaded.set(url, new Promise((resolve) => {
    const link = root.createElement("link");
    link.rel = "stylesheet";
    link.href = url;
    link.dataset.font = "";
    link.addEventListener("load", () => resolve(true));
    link.addEventListener("error", () => resolve(false));
    root.head.append(link);
  }));
  return loaded.get(url);
}

// Show the page in a font: its CSS loaded (once), then data-font on <html> (none for the default). An unknown id is the default.
// Resolves when the font's tokens apply (its letters may still be loading: document.fonts.ready says when they have).
// The last call wins: a font chosen while another's file was still loading is not overwritten when that file arrives.
let latest = 0;
export async function useFont(id, root = document) {
  const font = fontById(id) ?? fontById(DEFAULT), html = root.documentElement, mine = ++latest;
  if (font.css) await sheet(font.css, font.rev, root);
  if (mine !== latest) return font.id;
  if (font.id === DEFAULT) html.removeAttribute("data-font");
  else html.dataset.font = font.id;
  return font.id;
}
