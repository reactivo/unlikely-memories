// Story log: adds paragraphs, turns story markup into clickable markers, and fades text in phrase by phrase.
//
// The story is ordinary page content: the page is the only thing that scrolls (css/layout.css), with the top (title bar
// and picture) and the bottom (prompt) sticking over it. Scrolling the page, and working out where the story shows from where
// those two are, is ui/follow.js (the fragile iPhone code); this file is the story itself: its paragraphs, phrases and visits.
//
// Visits: the story is grouped by room, one <section class="visit"> for each time you enter a room (from the
// command that took you there). Entering a room starts a new visit: the page glides so it starts just under the top,
// and every earlier visit becomes past: grey, its pictures grey, nothing in it clickable (log.css). The current
// visit is always at least a screen of story high (log.css), so there's room to scroll its start up to there.
//
// Following new text (ui/follow.js): your own commands are always followed, and so is text the world adds on its own if you
// were at the end (atEnd). Following is a short smooth scroll, worked out from where the command and its answer actually are.
// Where the game puts the page (a new story's top, a room's first line, a loaded game's newest text) is its anchor, and
// stays put until you scroll, touch or type: whatever moves the page on its own before that puts it back (settle, there).
//
// The picture on an upright phone is always the crop (ui/crop.js). This file tells it when a room is entered (newVisit: the
// crop starts in the middle).
//
// Once the story has ended, the objects in it do nothing (the log gets the class "over", log.css); its commands still work,
// so `Begin again` does.
//
// Markup in story texts:
//   `Look`              a command → shown as <LOOK>; clicking runs it
//   {tin of mints|tin}  an object (label|id; just {door} when they're the same) → plain text; clicking examines it

import { spriteSVG } from "./sprite.js?v=0.50.2";
import { mount as mountFollow } from "./follow.js?v=0.50.2";
import { figures } from "./crt.js?v=0.50.2";

// Phrase fade-in timing: each phrase starts a little after the one before (a short gap + a bit per character).
// The fade itself lasts --duration-phrase (tokens.css).
const PHRASE_GAP_BASE = 60;      // ms before the next phrase starts…
const PHRASE_GAP_PER_CHAR = 4;   // …plus this many ms per character of the phrase
const PARAGRAPH_GAP = 150;       // extra ms between paragraphs
// One phrase = text up to and including , ; : . ! ? … (and a closing quote), or the rest of the text.
const PHRASE_END = /[^,;:.!?…]*[,;:.!?…]+["»”]?\s*|[^,;:.!?…]+$/g;
// Punctuation right after a marker ("tin of mints+,"): kept on the same line as it, never wrapped on its own.
const GLUED = /^[,;:.!?…)\]"»”']+/;

// What goes in the small inventory slot of a line's `slot` ({ sprite: rows }): the sprite as SVG, or null when there is none
// to draw (no slot, an empty one, a sprite with no rows). Null: the line has no slot at all, just its words.
export const slotArt = (slot) => (slot && typeof slot === "object" ? spriteSVG(slot.sprite) : null);

// Set up the log on its element, with the picture's crop (ui/crop.js) it tells when a room starts. Returns
// update(), say(), clear(), suggest(), newVisit(), markup(), busy(), busyFor(), page(), seen(), toEnd() and atEnd().
export function mount(root, on, crop) {
  let revealAt = 0;              // when the next phrase may start (performance.now() time)
  const follow = mountFollow(root);   // where the page is put and kept (ui/follow.js)
  // The CRT look on each examine picture (ui/crt.js): its scanlines are as tall as the scene's rows, from the picture's box.
  const looks = figures(() => document.querySelector(".picture"));
  // The fading pieces of the reveal still going (the text and pictures phraseReveal has set to fade in); finishReveal ends only these,
  // never every .ph the story ever wrote. Dropped once everything has appeared (the next reveal starts a new list).
  let fading = [];
  // Cut a paragraph into phrases and give each a delayed fade-in, so they appear one after another.
  function phraseReveal(container, figure) {
    // Group the paragraph's pieces into phrases (markers stay inside their phrase).
    const groups = [[]];
    const last = () => groups[groups.length - 1];
    [...container.childNodes].forEach(n => {
      if (n.nodeType !== 3) {                                       // a marker (with its punctuation): keep it whole
        last().push(n);
        if (/[,;:.!?…]["»”]?$/.test(n.textContent)) groups.push([]); // …and its punctuation ends the phrase too
        return;
      }
      (n.textContent.match(PHRASE_END) || []).forEach(part => {
        last().push(document.createTextNode(part));
        if (/[,;:.!?…]["»”]?\s*$/.test(part)) groups.push([]);     // punctuation ends the phrase
      });
    });
    // Put each phrase in a fading <span>, each starting a little later than the one before.
    container.textContent = "";
    const now = performance.now();
    if (revealAt <= now) fading = [];                               // (all of the last reveal has appeared)
    let t = Math.max(now, revealAt);                                // wait for text still appearing
    if (figure) { figure.classList.add("ph"); figure.style.animationDelay = (t - now) + "ms"; fading.push(figure); }
    groups.filter(g => g.length).forEach(g => {
      const span = document.createElement("span"); span.className = "ph";
      span.append(...g);
      span.style.animationDelay = (t - now) + "ms";
      container.appendChild(span);
      fading.push(span);
      t += PHRASE_GAP_BASE + PHRASE_GAP_PER_CHAR * span.textContent.length;
    });
    revealAt = t + PARAGRAPH_GAP;
  }

  // Any key or click: show all text that is still fading in, at once.
  function finishReveal() {
    if (revealAt <= performance.now()) return;                      // nothing pending
    for (const el of fading) el.style.animation = "none";
    fading = [];
    revealAt = 0;
  }
  document.addEventListener("keydown", finishReveal, true);
  document.addEventListener("pointerdown", finishReveal, true);

  // The visit being written: the last one (a new one if the log is empty).
  function current() {
    if (root.lastElementChild) return root.lastElementChild;
    const visit = document.createElement("section"); visit.className = "visit";
    return root.appendChild(visit);
  }

  // A new visit starts at this paragraph (the command that took you to the room, or the first line said there):
  // it and everything after it move into a new visit; all earlier ones become past. Then the page glides so the new
  // visit starts just under the top (instant: no glide, for a restored game).
  function newVisit(from, instant) {
    if (!from || !root.contains(from)) return;
    const before = from.parentElement, visit = document.createElement("section");
    visit.className = "visit";
    for (let p = from; p; ) { const next = p.nextElementSibling; visit.append(p); p = next; }
    before.after(visit);
    if (!before.children.length) before.remove();               // the whole visit moved: nothing left of it
    for (const v of root.children) {
      if (v === visit || v.classList.contains("past")) continue;
      v.classList.add("past");
      v.querySelectorAll("button").forEach(b => { b.disabled = true; });   // past text: nothing to click
    }
    // Typing on a phone: the keyboard closes, so the room starts as a new page, with its picture (Diego, 28 Oct 2026).
    if (follow.typing()) document.activeElement?.blur();
    crop.room();                                                  // a new room: the picture's crop starts in the middle
    follow.forget();                                              // (the glide shows it, from its first line)
    if (instant) return;
    follow.glideTo(visit);
  }

  // Add a paragraph to the story (to the current visit). Returns it.
  // cls: "cmd" = an echoed command (appears at once), "sys" = dim text. art: optional SVG shown on the left.
  // instant: show it at once, no fading in (a restored game's earlier text).
  // level: a health line (an echo, STATUS) gets the five health bars before it, the first `level` filled (0 to 5; 0 is all empty).
  // slot: the echo of a thing you gained or lost gets a small inventory slot before it, with the thing's sprite: { sprite: rows }
  // (no sprite: no slot at all, just the words; also for a saved line that kept an empty slot).
  function say(text, cls, art, instant, level, slot) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    let into = p;                                                   // where the text goes
    if (art) {                                                      // picture on the left, text on the right
      p.classList.add("with-image");
      const fig = document.createElement("span"); fig.className = "figure"; fig.innerHTML = art;
      into = document.createElement("span"); into.className = "text";
      p.append(fig, into);
    }
    if (level >= 0 && level <= 5) into.appendChild(bars(level));    // (older saves have no level: plain text)
    const inSlot = slotArt(slot);
    if (inSlot) into.appendChild(held(inSlot));                     // (older saves have no slot: plain text)
    build(into, text);
    if (!instant && !(cls && cls.split(" ").includes("cmd"))) phraseReveal(into, p.querySelector(".figure"));
    current().appendChild(p);
    if (art) looks.add(p.querySelector(".figure"));                 // (drawn when it has a size, before it is first painted)
    follow.added(p, instant);                                       // (restored text is not new: see toEnd)
    return p;
  }

  // The five health bars before a health line (log.css): one shared piece for echoes and STATUS. Decoration only: the
  // phrase says it, so it is hidden from screen readers.
  function bars(level) {
    const b = document.createElement("span");
    b.className = "bars"; b.setAttribute("aria-hidden", "true");
    for (let i = 1; i <= 5; i++) { const bar = document.createElement("i"); if (i <= level) bar.className = "on"; b.appendChild(bar); }
    return b;
  }

  // The small inventory slot before the echo of a thing you gained or lost (log.css, `.held`): a box on the font's pixel grid
  // with the thing's sprite in it, one sprite pixel to one font pixel. It takes no height in the line, so the line is as tall
  // as any other. Decoration only: the phrase names the thing, so it is hidden from screen readers.
  function held(svg) {
    const mark = document.createElement("span");
    mark.className = "held"; mark.setAttribute("aria-hidden", "true");
    const box = document.createElement("span");
    box.className = "held-box";
    box.innerHTML = svg;
    mark.appendChild(box);
    return mark;
  }

  // Build story text into an element: plain parts, `commands` (buttons that run them) and {objects} (buttons that
  // examine them), punctuation right after a marker kept with it.
  function build(into, text) {
    String(text).split(/(`[^`]*`|\{[^}]*\})/).forEach(part => {
      if (!part) return;
      if (part[0] === "`") {                                        // `Command` → <COMMAND> button
        const cmdText = part.slice(1, -1);
        const c = document.createElement("button");
        c.type = "button"; c.className = "command text-command"; c.textContent = cmdText;
        c.addEventListener("click", () => on.useCommand(cmdText));
        into.appendChild(c);
      } else if (part[0] === "{") {                                 // {label|id} → object button
        const [label, id] = part.slice(1, -1).split("|");
        const o = document.createElement("button");
        o.type = "button"; o.className = "object"; o.textContent = label;
        o.addEventListener("click", () => { if (!root.classList.contains("over")) on.showObject(id || label, label); });
        into.appendChild(o);
      }
      else {                                                        // plain text
        const glued = part.match(GLUED)?.[0], marker = into.lastChild;
        if (glued && marker?.nodeName === "BUTTON") {               // punctuation right after a marker: join them
          const keep = document.createElement("span"); keep.className = "keep";
          into.replaceChild(keep, marker); keep.append(marker, glued);
          part = part.slice(glued.length);
        }
        if (part) into.appendChild(document.createTextNode(part));
      }
    });
  }

  return {
    // On a language change: the log's label for screen readers. When the story is over: its objects go inert.
    update(prev, next) {
      if (!prev || prev.state.lang !== next.state.lang) root.setAttribute("aria-label", next.pack.a11y.story);
      root.classList.toggle("over", !!next.state.ended);
    },
    say, newVisit,
    // Story text built outside the log, with working markers (the hint beside the prompt). Returns a fragment.
    markup(text) { const f = document.createDocumentFragment(); build(f, text); return f; },
    // Is text still fading in? (The world waits for it before acting on its own.)
    busy() { return revealAt > performance.now(); },
    // How long until all of it has appeared (ms; 0 if nothing is fading in).
    busyFor() { return Math.max(0, revealAt - performance.now()); },
    // Empty the log (new story): the page starts at its top again, with the picture open and its crop in the middle.
    clear() { looks.clear(); root.innerHTML = ""; follow.forget(); follow.toTop(); crop.room(); },
    // The page's measurements, for the debug panel: { first (2 s after the last new game, or null), now }.
    page: follow.page,
    // What is in the story now counts as seen (a new story, shown from the top: the next follow shows only what comes after it).
    seen: follow.forget,
    // Bring the newest command and its answer into view (smoothly; instant = true: at once).
    toEnd: follow.toEnd,
    // Is the newest text in view? (Then text the world adds on its own is followed; otherwise the story stays put.)
    atEnd: follow.atEnd,
    // Add a dim suggestion line, unless it's the same as the line just above.
    suggest(text) {
      const last = root.lastElementChild?.lastElementChild;
      if (last && last.dataset.suggest === text) return;
      // It belongs to the answer just shown: following it shows that answer again from its start, not from the suggestion
      // (which scrolled the command and the object's picture under the picture: Diego, 27 Oct 2026). Only once that
      // answer has been followed (a clicked object: the examine was followed first). An answer not followed yet (the topics
      // line after Talk or Ask comes before its command is followed) is followed with its suggestion, from its own first line:
      // reaching back to the follow before it showed an old line at the top, from a room or two back (the opening's last
      // command when you talked to Fadimata, and every topic after: Diego, 4 Nov 2026).
      follow.suggesting();
      say(text, "sys suggest").dataset.suggest = text;
    }
  };
}
