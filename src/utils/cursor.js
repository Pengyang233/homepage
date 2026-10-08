const supportsCustomCursor = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

export default function cursorInit() {
  if (!supportsCustomCursor()) return () => {};
  const cursor = document.createElement("div");
  cursor.id = "cursor";
  cursor.className = "hidden";
  cursor.setAttribute("aria-hidden", "true");
  document.body.appendChild(cursor);
  let frame = null;
  let x = 0;
  let y = 0;
  let active = false;
  const render = () => {
    frame = null;
    cursor.style.transform = `translate3d(${x - 9}px, ${y - 9}px, 0) scale(${active ? 0.5 : 1})`;
  };
  const move = (event) => {
    x = event.clientX;
    y = event.clientY;
    cursor.classList.remove("hidden");
    if (frame === null) frame = requestAnimationFrame(render);
  };
  const hide = () => cursor.classList.add("hidden");
  const down = () => { active = true; if (frame === null) frame = requestAnimationFrame(render); };
  const up = () => { active = false; if (frame === null) frame = requestAnimationFrame(render); };
  window.addEventListener("pointermove", move, { passive: true });
  document.addEventListener("pointerleave", hide);
  window.addEventListener("pointerdown", down);
  window.addEventListener("pointerup", up);
  return () => {
    window.removeEventListener("pointermove", move);
    document.removeEventListener("pointerleave", hide);
    window.removeEventListener("pointerdown", down);
    window.removeEventListener("pointerup", up);
    if (frame !== null) cancelAnimationFrame(frame);
    cursor.remove();
  };
}
