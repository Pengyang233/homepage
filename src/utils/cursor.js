const INTERACTIVE_SELECTOR = [
  "a", "button", "select", "summary", "label[for]", ".menu",
  'input[type="button"]', 'input[type="submit"]', 'input[type="reset"]',
  'input[type="checkbox"]', 'input[type="radio"]', 'input[type="range"]',
  'input[type="file"]', '[role="button"]', '[role="link"]',
  "[data-cursor-interactive]",
].join(", ");

const TEXT_SELECTOR = [
  "textarea", '[contenteditable="true"]', '[contenteditable=""]',
  "input:not([type])", 'input[type="text"]', 'input[type="search"]',
  'input[type="email"]', 'input[type="password"]', 'input[type="url"]',
  'input[type="number"]', 'input[type="tel"]',
].join(", ");

const ENABLED_CLASS = "custom-cursor-enabled";

export default function cursorInit() {
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const forcedColors = window.matchMedia("(forced-colors: active)");
  const canUseCursor = () => finePointer.matches && !reducedMotion.matches && !forcedColors.matches;

  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "hidden";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);

  let frame = null;
  let x = 0;
  let y = 0;
  const position = () => {
    frame = null;
    cursor.style.transform = \`translate3d(\${x - 9}px, \${y - 9}px, 0)\`;
  };
  const hide = () => {
    cursor.classList.add("hidden");
    cursor.classList.remove("is-interactive", "is-text", "is-pressed");
    document.documentElement.classList.remove(ENABLED_CLASS);
    if (frame !== null) {
      window.cancelAnimationFrame(frame);
      frame = null;
    }
  };
  const move = (event) => {
    if (!canUseCursor() || (event.pointerType && event.pointerType !== "mouse")) {
      hide();
      return;
    }

    x = event.clientX;
    y = event.clientY;
    const target = event.target;
    const canInspect = target && typeof target.closest === "function";
    const onText = canInspect && Boolean(target.closest(TEXT_SELECTOR));
    const onInteractive = !onText && canInspect && Boolean(target.closest(INTERACTIVE_SELECTOR));
    cursor.classList.toggle("is-text", Boolean(onText));
    cursor.classList.toggle("is-interactive", Boolean(onInteractive));

    const wasHidden = cursor.classList.contains("hidden");
    if (wasHidden) position();
    cursor.classList.remove("hidden");
    document.documentElement.classList.add(ENABLED_CLASS);
    if (!wasHidden && frame === null) frame = window.requestAnimationFrame(position);
  };
  const down = (event) => {
    if (event.pointerType && event.pointerType !== "mouse") {
      hide();
    } else if (canUseCursor() && !cursor.classList.contains("hidden")) {
      cursor.classList.add("is-pressed");
    }
  };
  const up = () => cursor.classList.remove("is-pressed");
  const onVisibilityChange = () => { if (document.hidden) hide(); };
  const onMediaChange = () => { if (!canUseCursor()) hide(); };
  const queries = [finePointer, reducedMotion, forcedColors];

  window.addEventListener("pointermove", move, { passive: true });
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  window.addEventListener("pointercancel", hide);
  window.addEventListener("blur", hide);
  document.addEventListener("pointerleave", hide);
  document.addEventListener("visibilitychange", onVisibilityChange);
  queries.forEach((query) => {
    if (query.addEventListener) query.addEventListener("change", onMediaChange);
    else query.addListener?.(onMediaChange);
  });

  return () => {
    hide();
    window.removeEventListener("pointermove", move);
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    window.removeEventListener("pointercancel", hide);
    window.removeEventListener("blur", hide);
    document.removeEventListener("pointerleave", hide);
    document.removeEventListener("visibilitychange", onVisibilityChange);
    queries.forEach((query) => {
      if (query.removeEventListener) query.removeEventListener("change", onMediaChange);
      else query.removeListener?.(onMediaChange);
    });
    cursor.remove();
  };
}
