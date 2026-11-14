// Following the story: where the page is put and kept, on every phone and window. The page is the only thing that scrolls (css/layout.css),
// with the top (title bar and picture) and the bottom (prompt) sticking over it, so this works out where the story shows from where
// those two are: the top's bottom edge, and the bottom's top edge (less the space left for the fade). It follows new text (`toEnd`),
// puts a new story at its top (`toTop`), glides to a room's first line (`glideTo`) and holds the places the game itself put the
// page (the anchor, `settle`) until you scroll, touch or type. This is the fragile iPhone code (Safari's scroll leftovers, the keyboard,
// the bars): moved out of ui/log.js as it was, no rewrites; tests/follow.py plays it. The story's own DOM (paragraphs, phrases, visits)
// stays in ui/log.js, which asks this. Also here: `page()`, the measurements the debug panel's Page section shows (ui/debug.js).

import { reducedMotion, topMode } from "./media.js?v=0.49.2";

// Set up the following on the story's element. Returns toEnd(), atEnd(), toTop(), glideTo(), typing(), forget(), added(), suggesting() and page().
export function mount(root) {
  let gliding = false;           // the page is gliding to a new visit: don't follow new text meanwhile
  let glides = 0;                // (which glide is the latest: only its own end ends it)
  let unseen = null;             // the first paragraph added since the story was last followed (toEnd)
  let followed = null;           // the first paragraph the last toEnd showed (a suggestion after an answer is shown from it too)
  const layout = root.closest(".layout"), top = layout.querySelector(".top"), bottom = layout.querySelector(".bottom");

  // Where the story shows. Its top edge: under the top, if it sticks (ui/page.js reports --top-h as 0 when it scrolls
  // away with the story). On an upright phone the top is fixed: the edge is below it, its place plus --top-h.
  // (Not used while you type: keepLine.) Its bottom edge: where
  // the bottom begins, less the empty space kept after the newest text, so that text ends above the fade.
  const topEdge = () => {
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top-h"));
    if (!(h > 0)) return 0;
    const r = top.getBoundingClientRect();
    if (topMode(top) !== "fixed") return r.bottom;
    return r.top + h;
  };
  const bottomEdge = () => bottom.getBoundingClientRect().top;
  const fade = () => parseFloat(getComputedStyle(root).paddingBottom) || 0;

  // The newest line, and the first line of what is being followed: the last command and everything after it, or the run of
  // things the world said on its own at the end (they are set apart from the command before them: .aside).
  const lastLine = () => root.lastElementChild?.lastElementChild;
  function exchangeStart(visit) {
    for (let p = visit.lastElementChild; p; p = p.previousElementSibling) {
      if (p.classList.contains("cmd")) return p;
      if (p.classList.contains("aside") && !p.previousElementSibling?.classList.contains("aside")) return p;
    }
    return visit.firstElementChild;
  }

  // Is the newest text in view? (Then text the world adds on its own is followed; otherwise the story stays put.)
  const atEnd = () => {
    const last = lastLine();
    if (!last) return true;
    const end = last.getBoundingClientRect().bottom;
    if (typing()) return end <= seen().bottom + 2;                 // (while you type: on screen, above the keyboard)
    return end <= bottomEdge() + 2 && end > topEdge();
  };

  // Bring the newest command and its answer into view with a short smooth scroll, worked out from where they are (not
  // "to the end of the page", which can stop short: a phone's browser bars change the page's height while it scrolls).
  // If they fit between the top and the bottom, they end just above the fade; if they are taller, the command goes just
  // under the top, so you read the answer from its start. instant: no scroll animation, for a game being restored (main.js),
  // which goes to its newest text and is held there (the anchor, below) until you scroll, touch or type. The answer's whole
  // height exists as soon as it is added (it only fades in), so this can measure at once.
  function toEnd(instant) {
    const last = lastLine();
    if (gliding || !last) return;
    // What to show: everything added since the last follow (your command and its answer, a line the world said, the game's own
    // question), from its first paragraph. Not "from the last command": the options' "Restart the game?" is no command, and
    // following from the command before it, far up, showed that old command instead of the question (Diego, 27 Oct 2026).
    // Nothing new: a restored game (instant) shows the last command and what came after it, as before; anything else leaves the
    // page where it is. Not from the start of the exchange either: the world's lines on their own are one exchange however many
    // there are (.aside), so each tick of a condition that hurts made it taller, and once it was taller than the screen every
    // follow, or a moment that said nothing (a filter from the debug panel, a timed rule that is silent), took the page back UP
    // to its first line, while you typed always (Diego, 3 Nov 2026).
    const fresh = unseen && root.contains(unseen) ? unseen : null;
    if (!fresh && !instant) return;
    const first = fresh ?? exchangeStart(root.lastElementChild);
    unseen = null;
    followed = first;
    if (typing()) { keepLine(first); return; }
    let target = Math.max(0, endTarget(first, last, window.scrollY));
    window.scrollTo({ top: target, behavior: instant || reducedMotion.matches ? "instant" : "smooth" });
    moved("follow");
    anchor = instant ? { hold: true, at: () => endTarget(first, last, 0) }
                     : { hold: false, y: target, at: () => endTarget(first, last, window.scrollY) };
  }
  // Where the page goes to show from `first` to the newest line `last`: if they fit between the top and the bottom, `last` just
  // above the fade, but never further up than `floor` (following never moves the page back up); if they are taller, `first`
  // just under the top.
  function endTarget(first, last, floor) {
    const a = first.getBoundingClientRect(), b = last.getBoundingClientRect();
    const from = topEdge(), to = bottomEdge() - fade();
    const end = b.bottom + (parseFloat(getComputedStyle(last).marginBottom) || 0);
    return end - a.top > to - from ? window.scrollY + a.top - from : Math.max(floor, window.scrollY + end - to);
  }

  // The anchor: where the game itself last put the page, and how to work that place out again (at(): the scroll position for it
  // now). Every placing sets it: a new story (its top: toTop), a room entered (its first line under the picture: newVisit), a
  // loaded game (its newest text) and new text followed (toEnd). Your own scrolling, touching, clicking or typing drops it.
  //
  // A new story, a room or a loaded game HOLDS its place (hold: true): until you do something yourself, whatever moves the page
  // on its own puts it back there at once, in this one place (settle):
  //   - the browser moving it: Safari on an iPhone kept some of the list's scroll after the game had gone to the top (Diego,
  //     27 Oct 2026), and because a room taller than the screen can only scroll a line or two, that leftover put the page at the
  //     room's END, its first line under the picture: The Third Glass's opening, always (Diego, 3 Nov 2026);
  //   - the font finishing loading (the letters change size a little);
  //   - a change in the window's size (a phone's bars growing or shrinking as the page settles);
  //   - typing ending (the command line losing the focus: ui/page.js), which before put a long room at its end, from a stale
  //     "the newest text was in view" (wasAtEnd);
  //   - the glide to a room ending (or being cut short).
  // (Not during the glide, nor while you type: the browser decides then.) A loaded game was once sent back to the top by a
  // retry meant for the opening (Diego, 28 Oct 2026): now there is one anchor, and the loaded game's replaces the opening's.
  //
  // Following new text (after a command, or the world speaking while you were at the end) does not hold (hold: false), as
  // before: a change in the window's size does NOT move the page, the browser keeps the text where it was. (On a phone the
  // browser's bars grow and shrink as soon as you scroll, which is a size change: anything done then showed as jumps, pulling
  // you back to the start of a long answer, or the first lines under the picture. Diego, 27 Oct 2026.) Two exceptions:
  //   - you stop typing on a phone (ui/page.js marks <html data-typing> while you do): the prompt and the tabs stick again,
  //     so if the newest text was in view, the page moves just enough to show its last line above them (never back up: keepEnd);
  //   - the font finishing loading: the follow is redone, but only if the page hasn't moved since.
  let anchor = null;             // { hold, at(), y (following: where it put the page) }
  let firstScreen = null, shotTimer = 0, lastMove = "—", lastScroll = null;   // (the debug panel's Page section: page(), below)
  let wasAtEnd = true;
  for (const kind of ["touchstart", "pointerdown", "wheel", "keydown"]) {
    window.addEventListener(kind, () => { anchor = null; }, { passive: true, capture: true });   // you, not the browser
  }
  const holding = () => anchor?.hold && !gliding && !typing() && root.getClientRects().length > 0;   // (not under the list of games)
  function settle() {
    if (resyncing || !holding()) return;
    const y = Math.max(0, Math.min(anchor.at(), document.documentElement.scrollHeight - innerHeight));
    if (Math.abs(window.scrollY - y) < 2) return;
    window.scrollTo({ top: y, behavior: "instant" });
    moved("held: put back");
    resync(y);
  }
  // Safari on an iPhone (iOS 26) can ignore a scroll back to the top while the page is only a little way down, within a sticky
  // element's reach (WebKit bug 304489; our bottom is sticky), and go on SHOWING the page there while it reports the top:
  // after a new game started from further down the list of games, the page said it was at its top (scrollY 0, the first line
  // under the picture by its numbers) while it showed the story a little higher, its first line under the picture, and taps
  // landed where the numbers said things were (the command line opened the directions, the menu took several taps). So it
  // is moved one pixel and back, a frame apart, which makes Safari show it where it reports. Proven on Diego's iPhone, 4 Nov
  // 2026, with the debug panel's switch: off, all three came back; on, none.
  let resyncing = false;
  function resync(y) {
    if (resyncing || document.documentElement.hasAttribute("data-debug-no-nudge")) return;   // (the debug panel can turn it off, to test it)
    resyncing = true;
    // The nudge belongs to the anchor it was made for. If a follow takes over meanwhile (toEnd sets a new anchor: a command
    // typed or clicked in the frame or two between the steps), the second scroll, an instant one back to y, would cancel the
    // follow's smooth scroll on its first frame: the page stayed where it was and the answer was left below the story (found
    // by tests/follow.py at 1100x720, one run in three: the page had been moved a little by the command line taking the focus,
    // settle() put it back, and the command came in before the nudge ended). So then the nudge is dropped, not finished.
    const mine = anchor, taken = () => anchor && anchor !== mine;
    requestAnimationFrame(() => {
      if (taken()) { resyncing = false; return; }
      window.scrollTo({ top: y > 0 ? y - 1 : y + 1, behavior: "instant" });
      requestAnimationFrame(() => {
        if (!taken()) { window.scrollTo({ top: y, behavior: "instant" }); }
        resyncing = false;
      });
    });
  }
  window.addEventListener("scroll", () => { lastScroll = Math.round(window.scrollY); wasAtEnd = atEnd(); settle(); }, { passive: true });
  window.addEventListener("resize", settle);                      // (after ui/page.js has measured the bars: it was mounted first)
  function keepEnd() {
    const last = lastLine();
    if (gliding || !last) return;
    const end = last.getBoundingClientRect().bottom + (parseFloat(getComputedStyle(last).marginBottom) || 0);
    const to = bottomEdge() - fade();
    if (end > to) {
      const target = window.scrollY + end - to;
      window.scrollTo({ top: target, behavior: "instant" });
    }
  }
  // A new story starts at the top, and is held there (the anchor: Safari keeping the list's scroll, above).
  function toTop() {
    window.scrollTo(0, 0);
    anchor = { hold: true, at: () => 0 };
    moved("new game: top");
    resync(0);
    setTimeout(() => { if (holding()) resync(0); }, 400);   // (again once Safari has settled: its leftover scroll comes late)
    clearTimeout(shotTimer);
    shotTimer = setTimeout(() => { firstScreen = measurePage(); }, 2000);
  }

  // For the debug panel's Page section (ui/debug.js): the page as it is now, as it was 2 s after the last new game (before
  // anything is touched: opening the keyboard changes the layout), and what last moved it. Measured, not kept in the state.
  function moved(by) { lastMove = by + " (to " + Math.round(window.scrollY) + ")"; }
  function measurePage() {
    const html = document.documentElement, vv = window.visualViewport, n = (x) => Math.round(x * 10) / 10;
    const probe = document.createElement("div");
    probe.style.cssText = "position:absolute;top:0;width:0;height:100dvh;visibility:hidden;pointer-events:none";
    document.body.append(probe);
    const dvh = probe.getBoundingClientRect().height;
    probe.remove();
    const first = root.querySelector("p"), t = top.getBoundingClientRect();
    return {
      "scrolled": n(window.scrollY) + " of " + n(html.scrollHeight - innerHeight),
      "window": n(innerHeight) + " (100dvh " + n(dvh) + ")",
      "visible": vv ? n(vv.height) + " from " + n(vv.offsetTop) : "—",
      "top": "ends " + n(t.bottom) + ", --top-h " + getComputedStyle(html).getPropertyValue("--top-h").trim(),
      "first line": first ? "at " + n(first.getBoundingClientRect().top) : "—",
      "held": anchor?.hold ? "yes" : "no",
      "last moved": lastMove,
      "last scroll": lastScroll === null ? "—" : "to " + lastScroll
    };
  }

  // While you type on a phone (ui/page.js) the page is in its normal flow, and only the browser knows where its keyboard and
  // its view of the page are (with the keyboard up, Safari shows the page through a view of its own, which the page's own
  // scrolling can't move past the page's end: moving the page by an amount stopped short, Diego's iPhone, 28 Oct 2026). So new
  // text is shown by asking the browser to show things: if the exchange, from your command to the prompt, fits on screen, the
  // prompt (the browser puts it above its keyboard, the exchange just above it); if it is taller, your command at the top, and
  // you read the answer from its start (as when you don't type: toEnd). Clicking something after scrolling back to read does
  // the same. (Entering a room closes the keyboard instead: newVisit.)
  const typing = () => document.documentElement.hasAttribute("data-typing");
  const prompt = bottom.querySelector(".prompt");
  // What shows on screen, in the page's coordinates for getBoundingClientRect (the window, or the browser's view above its
  // keyboard where it reports one: visualViewport).
  const seen = () => {
    const vv = window.visualViewport;
    return vv ? { top: vv.offsetTop, bottom: vv.offsetTop + vv.height } : { top: 0, bottom: innerHeight };
  };
  // (Fits: in the space the browser shows the prompt in, the view less the page's scroll padding, css/base.css: it keeps that much
  // clear above and below whatever it scrolls to. Measured against the whole view, an exchange a little shorter than it but taller
  // than that space put the prompt there and cut off your command at the top, up to the bottom's height: Fadimata's long answer
  // about the tea, 4 Nov 2026.) The top has scrolled away with the story meanwhile, so nothing else changes, and when you stop
  // typing it is pinned again.
  function keepLine(first) {
    if (!first) return;
    const view = seen(), behavior = reducedMotion.matches ? "instant" : "smooth", html = getComputedStyle(document.documentElement);
    const above = parseFloat(html.scrollPaddingTop) || 0, below = parseFloat(html.scrollPaddingBottom) || 0;
    const a = first.getBoundingClientRect().top, b = prompt.getBoundingClientRect().bottom;
    const tall = b - a > view.bottom - view.top - above - below;
    (tall ? first : prompt).scrollIntoView({ block: tall ? "start" : "end", behavior });
  }
  // Typing ends (ui/page.js): the prompt sticks again. Held (a new story, a room, a loaded game, and you haven't done anything
  // since): back to the anchor. Otherwise the newest text, if it was in view, stays above the prompt and the tabs.
  new MutationObserver(() => requestAnimationFrame(() => {
    if (typing()) return;
    if (holding()) settle(); else if (wasAtEnd) keepEnd();
  })).observe(document.documentElement, { attributes: true, attributeFilter: ["data-typing"] });
  // The font has loaded: the letters change size a little. Held: back to the anchor. Following: redone if the page hasn't moved.
  document.fonts?.ready.then(() => {
    if (holding()) return settle();
    if (anchor && !anchor.hold && !gliding && Math.abs(window.scrollY - anchor.y) < 2) {
      const y = Math.max(0, anchor.at());
      window.scrollTo({ top: y, behavior: "instant" });
      anchor.y = y;
    }
  });

  // The page glides so a new visit starts just under the top (ui/log.js, newVisit; not for a restored game).
  function glideTo(visit) {
    // Held there (the anchor, above) until you scroll, touch or type: the room's first line under the picture, never its end.
    const at = () => visit.firstElementChild.getBoundingClientRect().top + window.scrollY - topEdge();
    const target = Math.max(0, at());
    anchor = { hold: true, at };
    gliding = true;
    const glide = ++glides;
    const done = () => { if (glide !== glides || !gliding) return; gliding = false; settle(); };   // (over, or cut short: is it there?)
    document.addEventListener("scrollend", done, { once: true });
    setTimeout(done, 1200);                                       // in case the browser has no scrollend
    window.scrollTo({ top: target, behavior: reducedMotion.matches ? "instant" : "smooth" });
    moved("new room");
  }

  return {
    toEnd, atEnd, toTop, typing, glideTo,
    // What is in the story now counts as seen (a new story, shown from the top: the next follow shows only what comes after it).
    forget() { unseen = null; },
    // A paragraph was added (not a restored game's: not new, see toEnd): the first one since the last follow is where the next follow starts.
    added(p, instant) { if (!instant && !(unseen && root.contains(unseen))) unseen = p; },
    // A suggestion belongs to the answer just followed: following it shows that answer again from its start (see ui/log.js, suggest).
    suggesting() { if (!(unseen && root.contains(unseen)) && followed && root.contains(followed)) unseen = followed; },
    // The page's measurements, for the debug panel: { first (2 s after the last new game, or null), now }.
    page() { return { first: firstScreen, now: measurePage() }; }
  };
}
