// Earlier commands: the commands the player ran, typed or clicked, stepped through with ↑ / ↓ (ui/prompt.js). Pure: no page.
// Kept: non-empty lines, trimmed; the same line sent twice in a row once; at most MAX. Lasts for this visit to the
// page (it carries across a new game and a loaded one) and is never saved.

export const MAX = 50;

export function makeHistory(max = MAX) {
  const lines = [];
  let at = null;            // null: not stepping (the line is the player's own); else an index into lines
  let draft = "";           // what was typed when ↑ was first pressed
  return {
    // A line was sent: remember it, and stop stepping.
    add(raw) {
      const t = raw.trim();
      at = null; draft = "";
      if (!t || lines[lines.length - 1] === t) return;
      lines.push(t);
      if (lines.length > max) lines.shift();
    },
    // ↑: the previous line (the oldest stays when there are no more). `current` is what's on the line now; it is
    // kept as the draft the first time. null when there is nothing earlier.
    back(current) {
      if (!lines.length) return null;
      if (at === null) { draft = current; at = lines.length - 1; }
      else if (at > 0) at--;
      return lines[at];
    },
    // ↓: the next line, and past the newest, the draft. null when not stepping.
    forward() {
      if (at === null) return null;
      if (at < lines.length - 1) return lines[++at];
      at = null;
      return draft;
    },
    // The player edited the line: it is theirs again (↑ afterwards keeps the new text as the draft).
    edited() { at = null; },
    all() { return lines.slice(); }
  };
}
