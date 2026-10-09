import test from "node:test";
import assert from "node:assert/strict";
import cursorInit from "../src/utils/cursor.js";

function createEventTarget() {
  const handlers = new Map();
  return {
    addEventListener(type, fn) {
      if (!handlers.has(type)) handlers.set(type, new Set());
      handlers.get(type).add(fn);
    },
    removeEventListener(type, fn) { handlers.get(type)?.delete(fn); },
    emit(type, event = {}) { for (const fn of handlers.get(type) ?? []) fn(event); },
    listenerCount(type) { return handlers.get(type)?.size ?? 0; },
  };
}

function createClassList() {
  const names = new Set();
  return {
    add(...items) { items.forEach((item) => names.add(item)); },
    remove(...items) { items.forEach((item) => names.delete(item)); },
    contains(item) { return names.has(item); },
    toggle(item, enabled) {
      if (enabled) names.add(item);
      else names.delete(item);
    },
  };
}

function setup(t) {
  const previousWindow = globalThis.window;
  const previousDocument = globalThis.document;
  const win = createEventTarget();
  const doc = createEventTarget();
  const classes = createClassList();
  const cursor = {
    id: "", style: {}, classList: createClassList(), removed: false,
    set className(value) { this.classList.add(...value.split(" ")); },
    setAttribute() {},
    remove() { this.removed = true; },
  };
  const media = new Map();
  for (const [query, initial] of [
    ["(hover: hover) and (pointer: fine)", true],
    ["(prefers-reduced-motion: reduce)", false],
    ["(forced-colors: active)", false],
  ]) {
    const mql = createEventTarget();
    mql.matches = initial;
    mql.set = (enabled) => { mql.matches = enabled; mql.emit("change"); };
    media.set(query, mql);
  }
  let nextFrame = 1;
  const frames = new Map();
  win.matchMedia = (query) => media.get(query);
  win.requestAnimationFrame = (fn) => { const id = nextFrame++; frames.set(id, fn); return id; };
  win.cancelAnimationFrame = (id) => frames.delete(id);
  doc.documentElement = { classList: classes };
  doc.body = { appendChild(node) { assert.equal(node, cursor); } };
  doc.createElement = () => cursor;
  doc.hidden = false;
  globalThis.window = win;
  globalThis.document = doc;
  t.after(() => {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
    if (previousDocument === undefined) delete globalThis.document;
    else globalThis.document = previousDocument;
  });
  const move = (target, pointerType = "mouse") => win.emit("pointermove", {
    clientX: 30, clientY: 50, target, pointerType,
  });
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((fn) => fn());
  };
  return { win, doc, cursor, classes, media, frames, move, flushFrames };
}

const plain = { closest: () => null };
const button = { closest: (selector) => selector.includes("button") ? button : null };
const textInput = { closest: (selector) => selector.includes("textarea") ? textInput : null };

test("cursor activates only after mouse movement and follows without a frame of initial offset", (t) => {
  const env = setup(t);
  const dispose = cursorInit();
  assert.equal(env.cursor.classList.contains("hidden"), true);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.move(plain);
  assert.equal(env.cursor.style.transform, "translate3d(21px, 41px, 0)");
  assert.equal(env.cursor.classList.contains("hidden"), false);
  assert.equal(env.classes.contains("custom-cursor-enabled"), true);
  env.move(plain);
  env.move(plain);
  assert.equal(env.frames.size, 1);
  env.flushFrames();
  assert.equal(env.cursor.style.transform, "translate3d(21px, 41px, 0)");
  dispose();
});

test("interactive hover, text focus area and pressed state remain separate from position", (t) => {
  const env = setup(t);
  const dispose = cursorInit();
  env.move(button);
  assert.equal(env.cursor.classList.contains("is-interactive"), true);
  env.win.emit("pointerdown", { pointerType: "mouse" });
  assert.equal(env.cursor.classList.contains("is-pressed"), true);
  env.win.emit("pointerup", { pointerType: "mouse" });
  assert.equal(env.cursor.classList.contains("is-pressed"), false);
  env.move(textInput);
  assert.equal(env.cursor.classList.contains("is-text"), true);
  assert.equal(env.cursor.classList.contains("is-interactive"), false);
  env.move(plain);
  assert.equal(env.cursor.classList.contains("is-text"), false);
  dispose();
});

test("touch, reduced motion, coarse pointer and forced colors use the native pointer", (t) => {
  const env = setup(t);
  const dispose = cursorInit();
  env.move(plain, "touch");
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.move(plain);
  assert.equal(env.classes.contains("custom-cursor-enabled"), true);
  const reduced = env.media.get("(prefers-reduced-motion: reduce)");
  reduced.set(true);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.move(plain);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  reduced.set(false);
  const fine = env.media.get("(hover: hover) and (pointer: fine)");
  fine.set(false);
  env.move(plain);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  fine.set(true);
  const forced = env.media.get("(forced-colors: active)");
  forced.set(true);
  env.move(plain);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  forced.set(false);
  env.move(plain);
  assert.equal(env.classes.contains("custom-cursor-enabled"), true);
  env.move(plain, "pen");
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  dispose();
});

test("leaving, hiding tab and cleanup restore the native pointer and remove listeners", (t) => {
  const env = setup(t);
  const dispose = cursorInit();
  env.move(button);
  env.move(button);
  assert.equal(env.frames.size, 1);
  env.doc.emit("pointerleave");
  assert.equal(env.frames.size, 0);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.move(plain);
  env.doc.hidden = true;
  env.doc.emit("visibilitychange");
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.doc.hidden = false;
  env.move(plain);
  env.win.emit("blur");
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  env.move(plain);
  dispose();
  assert.equal(env.cursor.removed, true);
  assert.equal(env.classes.contains("custom-cursor-enabled"), false);
  assert.equal(env.win.listenerCount("pointermove"), 0);
  for (const mql of env.media.values()) assert.equal(mql.listenerCount("change"), 0);
});
