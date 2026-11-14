// Sleeping: the engine's own SLEEP at run time, and a condition's hold on you as you act (ARCHITECTURE.md §5, "Sleep"; the arithmetic is
// js/sleep.js, the conditions' fields js/conditions.js). Moved out of js/engine.js, which hands over the few of its own functions this needs
// (`host`: apply one effect, the state's dice, the opening's test, the rules in play and whether one fits, the puzzles' `solved` and `met`,
// how a condition ends, the line of a health tick), so this file never imports the engine back. `makeSleeping(host)` returns { sleep,
// conditionHold }: what the engine calls. Everything inside is as it was in the engine.

import { worldTime, moveTo, parts, hhmm } from "./time.js?v=0.49.3";
import { lengthOf, kindOf, healOf, choicesAt, HEAL_GAP, DREAM_CHANCE, SOBERS } from "./sleep.js?v=0.49.3";
import { activeIds, conditionClass } from "./conditions.js?v=0.49.3";
import { RANGES } from "./fields.js?v=0.49.3";
import { clean, isLine } from "./shapes.js?v=0.49.3";
import { placeOf, person } from "./place.js?v=0.49.3";
import { isAction } from "./actions.js?v=0.49.3";
import { spoken, slurring, slur } from "./speech.js?v=0.49.3";
import { movementNow, stray } from "./movement.js?v=0.49.3";

export function makeSleeping(host) {
  const { apply, roll, rollBetween, isFixed, activeRules, fits, exitNow, solved, met, endCondition, saysOf } = host;

  // The engine's own SLEEP (ARCHITECTURE.md §5, "Sleep"; the arithmetic: js/sleep.js). A world writes nothing for it: a room may
  // refuse it with a line of its own (`sleep`, the standard std_sleep_refused), a room or a thing you sleep in may give a vision
  // (`dream`), and a rule of its own may send you to sleep its own way ({ "sleep": "next 07:30" }: a bed taken once a day).
  //   chosen: what the player chose ({ name } | { until } | { minutes }, read by the parser), null (the question), or a `time`
  //   form from a world's rule. The player's own sleep is refused where it can't be; a world's rule has decided already.
  function sleep(g, chosen, action, out, key) {
    const now = worldTime(g), theirs = typeof chosen === "string";
    if (!theirs) {
      if (sleepRefused(g, out)) {                                    // the stock "This is no time to sleep.": never offered
        apply(g, { say: "@sleep.notNow" }, action, out, key + ":no");
        out.answer = { ...out.answer, generic: true };
        return;
      }
      if (!chosen) return askHowLong(g, now, out);
    }
    let ms;
    if (theirs) {
      const r = moveTo(chosen, now);
      if (r.error) return out.refused.push({ effect: { sleep: chosen }, reason: r.error });
      ms = r.to - now;                                   // (the world's own time: its bed takes you until morning, however far that is)
    } else ms = lengthOf(chosen, now);                   // (the player's, at most LONGEST)
    if (!(ms > 0)) return out.refused.push({ effect: { sleep: chosen }, reason: "sleep for how long? " + JSON.stringify(chosen) });
    // "sleep in the bunk": in (or on) the thing named first, if it is one to get into, here and open to you
    const o = !theirs && action.obj ? g.world.objects[action.obj] : null;
    if (o?.enterable && placeOf(g, action.obj) === g.player.at && o.locked !== true && !(o.container && o.open === false)) g.player.in = action.obj;
    fallAsleep(g, ms, action, out, key);
  }

  // Where the player can't sleep now (the stock refusal): in the opening; over a question waiting (other than SLEEP's own); in a
  // conversation (the person you are talking to is here with you); or while something holds you (a world's rule answers every way
  // out of here: seated at a dinner you can't politely leave). A room's own refusal, its `sleep` line, is the standard rule's, before.
  function sleepRefused(g, out) {
    if (isFixed(g, g.player.at)) return true;
    if (out.waiting && out.waiting.ask !== "sleep") return true;
    const who = g.talkingTo;
    if (who && g.world.objects[who] && person(g.world.objects[who]) && placeOf(g, who) === g.player.at) return true;
    return pinnedHere(g);
  }
  // Something holds you (pinnedHere): the room has a way out, and every one of them is answered by a world's rule on going that isn't tied to one
  // direction (`match` with no `dir`: a hold reads a property its rules set, and answers every way while it holds).
  function pinnedHere(g) {
    const exits = g.world.rooms[g.player.at]?.exits || {}, dirs = Object.keys(exits).filter(d => exits[d]);
    const rules = activeRules(g).filter(r => !r.fixed && isAction(r) && r.match && r.match.dir === undefined);
    return dirs.length > 0 && dirs.every(dir => rules.some(r => fits(g, r, { verb: "go", dir })));
  }

  // "How long do you sleep?": the question, with its clickable answers (the narrator adds them, from the pack: `sleep.choices`),
  // then the dim line that says you may name a time. It waits in pending.question ({ ask: "sleep", choices }), answered from a set
  // like a yes/no one (`choosing`): the parser reads an answer as a SLEEP with its length; anything else drops it.
  function askHowLong(g, now, out) {
    const choices = choicesAt(now);
    g.pending.question = { ask: "sleep", choices };
    out.applied.push({ say: "@sleep.ask", choices: choices.map(c => "@sleep.choices." + c), at: now });
    out.applied.push({ say: "@sleep.or", style: "sys", at: now });
  }

  // The sleep itself, `ms` long (the player's at most LONGEST). The applied effects carry two marks for the screen (ui/scene.js plays the eyelids
  // and the dark between them, and the story is told in time with it, js/main.js): { sleep: <kind>, ms, wake, vision? } where the
  // eyes close, and { woke: true } where they open; what lies between is said in the dark (a dream, a vision's line).
  //   "You close your eyes." Then, in a harmful condition (one whose health hurts: poison, cold), you never wake: "You fall asleep, and
  //   do not wake.", and the death that follows is any death's (step(): its lines, its echo, the `died` ending). Otherwise, in the dark:
  //   a vision (the `dream` of the thing you are in, else of the room), or, in a sleep of a few hours or more, now and then a dream
  //   (DREAM_CHANCE: the first hint line of a puzzle the hints thing could hint now, each once). The clock moves on (what is scheduled
  //   in between runs after, js/engine.js runScheduled); "You wake. It is 07:00, day 2."; the conditions you are in live through the
  //   hours slept (sleptThrough); health comes back by the kind (healOf), if the last sleep that healed you is HEAL_GAP turns back;
  //   and step() describes the room, after the echoes.
  function fallAsleep(g, ms, action, out, key) {
    const done = (x) => out.applied.push(x), now = worldTime(g), kind = kindOf(ms);
    apply(g, { say: "@sleep.close" }, action, out, key + ":close");
    if (activeIds(g).some(id => conditionClass(g.conditions?.[id]) === "harmful")) {
      done({ sleep: kind, ms, wake: false });
      return apply(g, { hurt: g.player.health, says: "@sleep.never" }, action, out, key + ":never");
    }
    const slept = (g.slept ??= {});                       // (made with the first sleep: a game that never sleeps has no key)
    const vision = visionHere(g, slept);
    const dream = !vision && kind !== "nap" && roll(g) < DREAM_CHANCE ? dreamNow(g, slept) : null;
    done(clean({ sleep: kind, ms, wake: true, vision: vision?.d.picture && g.pictures[vision.d.picture] ? vision.d.picture : undefined }));
    if (vision) {
      if (vision.d.once === true) (slept.visions ??= []).push(vision.key);
      apply(g, { say: vision.d.says }, action, out, key + ":vision");
      if (vision.d.opens != null) apply(g, { know: vision.d.opens }, action, out, key + ":opens");
    } else if (dream) {
      (slept.dreamt ??= []).push(dream.id);
      apply(g, { say: "@sleep.dream", arg: dream.text }, action, out, key + ":dream");
    }
    done({ woke: true });
    g.time.shift = now + ms - g.clock;                    // the clock moves on (scheduled rules in between run after: runScheduled)
    done({ time: now + ms, from: now });
    const p0 = parts(now, g.time?.weekday), p = parts(now + ms, g.time?.weekday);
    apply(g, { say: "@sleep.wake", arg: { time: hhmm(p), hour: p.hour, minute: p.minute, day: p.day, newDay: p.day !== p0.day } }, action, out, key + ":wake");
    sleptThrough(g, ms, action, out, key);
    const heals = healOf(kind);
    if (heals && g.player.health < RANGES["player.health"][1] && !(slept.healed !== undefined && g.turn - slept.healed < HEAL_GAP)) {
      apply(g, { heal: heals }, action, out, key + ":heal");
      slept.healed = g.turn;
    }
    out.woke = g.player.at;
  }

  // The vision of where you sleep: the `dream` of the enterable thing you are in or on, else of the room; not one that is `once` and seen.
  function visionHere(g, slept) {
    const room = g.world.rooms[g.player.at], thing = g.player.in ? g.world.objects[g.player.in] : null;
    const fresh = (key, d) => d && typeof d === "object" && isLine(d.says) && !(d.once === true && (slept.visions || []).includes(key));
    return fresh(g.player.in, thing?.dream) ? { key: g.player.in, d: thing.dream } : fresh(g.player.at, room?.dream) ? { key: g.player.at, d: room.dream } : null;
  }
  // A dream: one of the puzzles the hints thing could hint now (unsolved, its needs met, not an ending), with a hint line, never one
  // dreamt before, picked with the game's own numbers; its first hint line. The hints thing's own count is left alone (g.hinted).
  function dreamNow(g, slept) {
    const pool = Object.entries(g.puzzles || {}).filter(([id, p]) => !p.ending && !solved(g, p) && (p.needs || []).every(n => met(g, n))
      && Array.isArray(p.hints) && isLine(p.hints[0]) && !(slept.dreamt || []).includes(id));
    if (!pool.length) return null;
    const [id, p] = pool[rollBetween(g, 0, pool.length - 1)];
    return { id, text: p.hints[0] };
  }

  // The conditions you are in live through the hours slept. They run on play time (state.clock), which a sleep doesn't move: so what
  // they would have done meanwhile is done here, and what is left of them is moved back by the hours slept (their times are play ms).
  //   neutral (no health: drunk): slept off by a sleep of SOBERS or more, or when its time runs out within the sleep;
  //   good (heals: warm): its heal ticks for the hours slept, within its time, as one heal with its line; it ends if its time runs out;
  //   harmful: never here (you don't wake: fallAsleep).
  // Turns don't pass while you sleep (it is one command), so what counts in turns goes on as it was.
  function sleptThrough(g, ms, action, out, key) {
    const end = g.clock + ms;
    for (const id of activeIds(g)) {
      const d = g.conditions?.[id], c = g.player.conditions?.[id];
      if (!d || !c) continue;
      const kind = conditionClass(d);
      if (kind === "neutral" && (ms >= SOBERS || (c.at !== undefined && c.at <= end))) { endCondition(g, id, action, out, key + ":" + id); continue; }
      if (kind === "good" && c.tickAt !== undefined) {
        const h = d.health, [min, max] = h.every.seconds || [0, 0];
        let ticks = 0, t = c.tickAt;
        while (h.every.seconds && t <= end && (c.at === undefined || t <= c.at)) { ticks++; t += rollBetween(g, min, max) * 1000; }
        if (ticks) {
          const says = saysOf(g, h, id);
          apply(g, { heal: ticks * h.heal, says }, action, out, key + ":" + id);
          c.tickAt = t;
        }
      }
      if (kind === "good" && c.at !== undefined && c.at <= end) { endCondition(g, id, action, out, key + ":" + id); continue; }
      if (c.at !== undefined) c.at -= ms;                 // what is left of it is left after waking
      if (c.tickAt !== undefined && kind === "good" && d.health?.every?.seconds) c.tickAt -= ms;
    }
  }

  // A condition's hold on you as you act, before the action runs: words said come out slurred (js/speech.js) and are read so
  // by the rules; leaving a room, you may take another way (js/movement.js). Each says so in a line of its own first.
  function conditionHold(g, action, out) {
    if (spoken(g, action) && slurring(g)) {
      const [said, rng] = slur(action.text, g.rng);
      g.rng = rng;
      apply(g, { say: "@slurred", arg: said }, action, out, "slurred");
      action.text = said;
    }
    const m = movementNow(g);
    if (m && action.verb === "go" && action.dir) {
      const [dir, rng] = stray(m, strayWays(g, action), g.rng);
      g.rng = rng;
      if (dir) { apply(g, { say: m.says }, action, out, "movement"); action.dir = dir; }
    }
  }
  // The other ways you could take by mistake, leaving a room the way you meant: only when that way is open and plain (it leads
  // to a room, and no rule of the world answers it), and only ways just as plain that lead to another room you have already
  // been to (never shut or locked, never somewhere you couldn't have seen, never the opening).
  function strayWays(g, action) {
    const here = g.player.at, room = g.world.rooms[here];
    const to = (dir) => exitNow(g, here, dir, { ...action, dir }).go;
    const plain = (dir) => typeof to(dir) === "string" && !!g.world.rooms[to(dir)] && !g.world.rooms[to(dir)].fixed
      && !activeRules(g).some(r => isAction(r) && fits(g, r, { ...action, dir }));
    if (!plain(action.dir)) return [];
    return Object.keys(room?.exits || {}).filter(d => d !== action.dir && plain(d) && to(d) !== to(action.dir) && g.seen.visited.includes(to(d)));
  }

  return { sleep, conditionHold };
}
