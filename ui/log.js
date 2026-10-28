// Story log: adds paragraphs, turns story markup into clickable markers, and fades text in phrase by phrase.
//
// The story is ordinary page content: the page is the only thing that scrolls (css/layout.css), with the top (title bar
// and picture) and the bottom (prompt) sticking over it. So this file scrolls the page, and works out where the story
// shows from where those two are: the top's bottom edge, and the bottom's top edge (less the space left for the fade).
//
// Visits: the story is grouped by room, one <section class="visit"> for each time you enter a room (from the
// command that took you there). Entering a room starts a new visit: the page glides so it starts just under the top,
// and every earlier visit becomes past: grey, its pictures grey, nothing in it clickable (log.css). The current
// visit is always at least a screen of story high (log.css), so there's room to scroll its start up to there.
//
// Following new text: your own commands are always followed, and so is text the world adds on its own if you were
// at the end (atEnd). Following is a short smooth scroll, worked out from where the command and its answer actually are.
//
// The picture on an upright phone folds when you scroll back and opens at "the present" (ui/fold.js). This file knows when
// that is: following new text (toEnd) and entering a room (newVisit) open it, and it is told which scrolling is ours.
//
// Once the story has ended, the objects in it do nothing (the log gets the class "over", log.css); its commands still work,
// so `Begin again` does.
//
// Markup in story texts:
//   `Look`              a command → shown as <LOOK>; clicking runs it
//   {tin of mints|tin}  an object (label|id; just {door} when they're the same) → plain text; clicking examines it

// Phrase fade-in timing: each phrase starts a little after the one before (a short gap + a bit per character).
// The fade itself lasts --duration-phrase (tokens.css).
const PHRASE_GAP_BASE = 60;      // ms before the next phrase starts…
const PHRASE_GAP_PER_CHAR = 4;   // …plus this many ms per character of the phrase
const PARAGRAPH_GAP = 150;       // extra ms between paragraphs
// One phrase = text up to and including , ; : . ! ? … (and a closing quote), or the rest of the text.
const PHRASE_END = /[^,;:.!?…]*[,;:.!?…]+["»”]?\s*|[^,;:.!?…]+$/g;
// Punctuation right after a marker ("tin of mints+,"): kept on the same line as it, never wrapped on its own.
const GLUED = /^[,;:.!?…)\]"»”']+/;

// Set up the log on its element, with the folding picture (ui/fold.js) it tells when the story is at the present. Returns
// update(), say(), clear(), suggest(), newVisit(), markup(), busy(), busyFor(), toEnd() and atEnd().
export function mount(root, on, header) {
  let revealAt = 0;              // when the next phrase may start (performance.now() time)
  let gliding = false;           // the page is gliding to a new visit: don't follow new text meanwhile
  let unseen = null;             // the first paragraph added since the story was last followed (toEnd)
  let followed = null;           // the first paragraph the last toEnd showed (a suggestion after an answer is shown from it too)
  const calm = matchMedia("(prefers-reduced-motion: reduce)");
  const layout = root.closest(".layout"), top = layout.querySelector(".top"), bottom = layout.querySelector(".bottom");

  // Where the story shows. Its top edge: under the top, if it sticks (ui/page.js reports --top-h as 0 when it scrolls
  // away with the story). While you type on a phone the top scrolls away too: the edge is its bottom edge, or once it has
  // gone, the window's top.
  // On an upright phone the top is fixed and its picture folds and opens: open, the edge is below the OPEN top, its place plus --top-h (the height it has open, even while it is still opening: a new room opens it); folded,
  // it is under the folded top as it is (new text doesn't open it). Its bottom edge: where the bottom begins, less the
  // empty space kept after the newest text, so that text ends above the fade.
  const topEdge = () => {
    const r = top.getBoundingClientRect();
    if (document.documentElement.hasAttribute("data-keyboard")) return Math.max(0, r.bottom);
    const h = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--top-h"));
    if (!(h > 0)) return 0;
    return getComputedStyle(top).position === "fixed" && !top.hasAttribute("data-folded") ? r.top + h : r.bottom;
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
    return end <= bottomEdge() + 2 && end <= innerHeight && end > topEdge();   // (while you type the prompt is in the flow: it can be out of view too)
  };

  // Bring the newest command and its answer into view with a short smooth scroll, worked out from where they are (not
  // "to the end of the page", which can stop short: a phone's browser bars change the page's height while it scrolls).
  // If they fit between the top and the bottom, they end just above the fade; if they are taller, the command goes just
  // under the top, so you read the answer from its start. instant: no scroll animation (a game being restored, a window
  // changing size). The answer's whole height exists as soon as it is added (it only fades in), so this can measure at once.
  function toEnd(instant) {
    const last = lastLine();
    if (gliding || !last) return;
    if (typing()) { keepLine(); unseen = null; return; }
    // What to show: everything added since the last follow (your command and its answer, a line the world said, the game's own
    // question), from its first paragraph. Not "from the last command": the settings' "Start a new game?" is no command, and
    // following from the command before it, far up, showed that old command instead of the question (Diego, 27 Oct 2026).
    // Nothing new (a restored game, the font loading): the last command and what came after it, as before.
    const first = unseen && root.contains(unseen) ? unseen : exchangeStart(root.lastElementChild);
    unseen = null;
    followed = first;
    const a = first.getBoundingClientRect(), b = last.getBoundingClientRect();
    const from = topEdge(), to = bottomEdge() - fade();
    const end = b.bottom + (parseFloat(getComputedStyle(last).marginBottom) || 0);
    const target = end - a.top > to - from
      ? window.scrollY + a.top - from
      : Math.max(window.scrollY, window.scrollY + end - to);
    window.scrollTo({ top: Math.max(0, target), behavior: instant || calm.matches ? "instant" : "smooth" });
    header.scrolling(target);                                     // (that scrolling is ours, not the reader's: it never folds the picture)
    placed = { y: Math.max(0, target), again: () => toEnd(true) };
  }

  // A change in the window's size does NOT move the page: the browser keeps the text where it was. (On a phone the browser's
  // bars grow and shrink as soon as you scroll, which is a size change: anything done here then showed as jumps, pulling you
  // back to the start of a long answer, or the first lines under the picture. Diego, 27 Oct 2026.) Two exceptions:
  //   - you stop typing on a phone (ui/page.js marks <html data-keyboard> while you type): the prompt and the tabs stick again,
  //     so if the newest text was in view, the page moves just enough to show its last line above them (never back up);
  //   - the font finishing loading: the letters change size a little, so where the game last put the page (following new
  //     text, gliding to a room) is redone, but only if you haven't scrolled since.
  let wasAtEnd = true;
  let placed = null;             // where the game itself last put the page, and how to do it again: { y, again }
  window.addEventListener("scroll", () => { wasAtEnd = atEnd(); }, { passive: true });
  function keepEnd() {
    const last = lastLine();
    if (gliding || !last) return;
    const end = last.getBoundingClientRect().bottom + (parseFloat(getComputedStyle(last).marginBottom) || 0);
    const to = bottomEdge() - fade();
    if (end > to) {
      const target = window.scrollY + end - to;
      window.scrollTo({ top: target, behavior: "instant" });
      header.scrolling(target);
    }
  }
  // A new story starts at the top. Safari on an iPhone, coming from the list of games scrolled down to a card's button, kept some
  // of that scroll after the game had gone to the top, so the opening started under the picture (Diego, 27 Oct 2026): so the
  // top is asked for again a moment later, unless you have touched or scrolled the page by then.
  let touched = false;
  for (const kind of ["touchstart", "wheel", "keydown"]) window.addEventListener(kind, () => { touched = true; }, { passive: true });
  function toTop() {
    touched = false;
    const again = () => { if (!touched && window.scrollY !== 0) { window.scrollTo(0, 0); header.scrolling(0); } };
    window.scrollTo(0, 0);
    header.scrolling(0);
    placed = { y: 0, again };
    requestAnimationFrame(again);
    setTimeout(again, 300);
  }

  // While you type on a phone (ui/page.js) the page is in its normal flow and the browser has brought the prompt up above its
  // keyboard; the game can't see where that is (browsers report it differently, or not at all inside the claude.ai frame). So
  // new text doesn't scroll to a target: the page moves by as much as the text grew, so the prompt stays exactly where it
  // was, and the new text appears just above it, pushing older text up. If you had scrolled back to read and clicked something
  // there, the prompt goes back to where the browser had put it, the new text above it. (Entering a room closes the keyboard
  // instead: newVisit. Diego's iPhone, 28 Oct 2026.)
  const typing = () => document.documentElement.hasAttribute("data-keyboard");
  let lineAt = null;             // while you type: where the prompt goes back to after the new text (say)
  let home = null;               // while you type: where the browser put the prompt, its top on screen, last time it was known
  // (On screen: Safari, with its keyboard up, moves its view of the page as well as the page when you scroll, so where its
  // view starts, the visual viewport's offset, counts too; elsewhere it is 0.)
  const lineTop = () => bottom.getBoundingClientRect().top - (window.visualViewport?.offsetTop || 0);
  bottom.addEventListener("input", () => { home = lineTop(); });   // (you are typing on it: it is in view)
  bottom.addEventListener("focusin", () => setTimeout(() => { if (typing() && home === null) home = lineTop(); }, 600));   // (once the browser has brought it up)
  function keepLine() {
    if (lineAt === null) return;
    const grew = lineTop() - lineAt;
    home = lineAt;
    lineAt = null;
    if (grew) window.scrollTo({ top: window.scrollY + grew, behavior: calm.matches ? "instant" : "smooth" });
  }
  // Typing ends (ui/page.js): the prompt sticks again, so the newest text, if it was in view, stays above it and the tabs.
  // (While you type nothing is done: the page is in its normal flow and the browser brings the prompt into view.)
  new MutationObserver(() => requestAnimationFrame(() => {
    if (typing()) return;
    lineAt = home = null;
    if (wasAtEnd) keepEnd();
  })).observe(document.documentElement, { attributes: true, attributeFilter: ["data-keyboard"] });
  document.fonts?.ready.then(() => {
    if (placed && !gliding && Math.abs(window.scrollY - placed.y) < 2) placed.again();
  });

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
    let t = Math.max(now, revealAt);                                // wait for text still appearing
    if (figure) { figure.classList.add("ph"); figure.style.animationDelay = (t - now) + "ms"; }
    groups.filter(g => g.length).forEach(g => {
      const span = document.createElement("span"); span.className = "ph";
      span.append(...g);
      span.style.animationDelay = (t - now) + "ms";
      container.appendChild(span);
      t += PHRASE_GAP_BASE + PHRASE_GAP_PER_CHAR * span.textContent.length;
    });
    revealAt = t + PARAGRAPH_GAP;
  }

  // Any key or click: show all text that is still fading in, at once.
  function finishReveal() {
    if (revealAt <= performance.now()) return;                      // nothing pending
    root.querySelectorAll(".ph").forEach(el => { el.style.animation = "none"; });
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
    if (typing()) { lineAt = null; document.activeElement?.blur(); }
    header.room();                                                // a new room opens the picture, its crop in the middle
    unseen = null;                                                // (the glide shows it, from its first line)
    if (instant) return;
    const target = Math.max(0, visit.firstElementChild.getBoundingClientRect().top + window.scrollY - topEdge());
    placed = {
      y: target,
      again: () => {
        const y = Math.max(0, visit.firstElementChild.getBoundingClientRect().top + window.scrollY - topEdge());
        window.scrollTo({ top: y, behavior: "instant" });
        header.scrolling(y);
        placed.y = y;
      }
    };
    gliding = true;
    const done = () => { gliding = false; };
    document.addEventListener("scrollend", done, { once: true });
    setTimeout(done, 1200);                                       // in case the browser has no scrollend
    window.scrollTo({ top: target, behavior: calm.matches ? "instant" : "smooth" });
    header.scrolling(target);                                     // (the glide is not the reader scrolling: it never folds the picture)
  }

  // Add a paragraph to the story (to the current visit). Returns it.
  // cls: "cmd" = an echoed command (appears at once), "sys" = dim text. art: optional SVG shown on the left.
  // instant: show it at once, no fading in (a restored game's earlier text).
  function say(text, cls, art, instant) {
    const p = document.createElement("p");
    if (cls) p.className = cls;
    let into = p;                                                   // where the text goes
    if (art) {                                                      // picture on the left, text on the right
      p.classList.add("with-image");
      const fig = document.createElement("span"); fig.className = "figure"; fig.innerHTML = art;
      into = document.createElement("span"); into.className = "text";
      p.append(fig, into);
    }
    build(into, text);
    if (!instant && !(cls && cls.split(" ").includes("cmd"))) phraseReveal(into, p.querySelector(".figure"));
    const fresh = !instant && !(unseen && root.contains(unseen));   // the first paragraph since the last follow (restored text is not new: see toEnd)
    if (fresh && typing()) lineAt = home ?? lineTop();           // (where the prompt goes back to: keepLine)
    current().appendChild(p);
    if (fresh) unseen = p;
    return p;
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
    clear() { root.innerHTML = ""; unseen = null; toTop(); header.room(); },
    // What is in the story now counts as seen (a new story, shown from the top: the next follow shows only what comes after it).
    seen() { unseen = null; },
    // Bring the newest command and its answer into view (smoothly; instant = true: at once).
    toEnd,
    // Is the newest text in view? (Then text the world adds on its own is followed; otherwise the story stays put.)
    atEnd,
    // Add a dim suggestion line, unless it's the same as the line just above.
    suggest(text) {
      const last = root.lastElementChild?.lastElementChild;
      if (last && last.dataset.suggest === text) return;
      // It belongs to the answer just shown: following it shows that answer again from its start, not from the suggestion
      // (which scrolled the command and the object's picture under the folded picture: Diego, 27 Oct 2026).
      if (followed && root.contains(followed)) unseen = followed;
      say(text, "sys suggest").dataset.suggest = text;
    }
  };
}
