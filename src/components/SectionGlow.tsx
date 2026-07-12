import { useEffect, useRef } from "react";

/**
 * Amber glow that trails the cursor, painted INSIDE a section behind its
 * content: place it after the section's background layers and before the
 * (positioned) content container. All instances share one pointer tracker
 * and one eased rAF loop; each paints in its own local coordinates.
 */
const cursor = { x: 0, y: 0, tx: 0, ty: 0 };
const subscribers = new Set<(x: number, y: number) => void>();
let started = false;

function ensureTracker() {
  if (started || typeof window === "undefined") return;
  started = true;

  cursor.x = cursor.tx = window.innerWidth / 2;
  cursor.y = cursor.ty = window.innerHeight * 0.4;

  const notify = () => subscribers.forEach((fn) => fn(cursor.x, cursor.y));

  window.addEventListener("mousemove", (e) => {
    cursor.tx = e.clientX;
    cursor.ty = e.clientY;
    // rAF is suspended while the document is hidden — paint directly
    if (document.hidden) {
      cursor.x = cursor.tx;
      cursor.y = cursor.ty;
      notify();
    }
  });
  window.addEventListener(
    "touchmove",
    (e) => {
      if (e.touches[0]) {
        cursor.tx = e.touches[0].clientX;
        cursor.ty = e.touches[0].clientY;
      }
    },
    { passive: true }
  );

  const loop = () => {
    // Eased trail: the glow chases the pointer instead of snapping
    cursor.x += (cursor.tx - cursor.x) * 0.1;
    cursor.y += (cursor.ty - cursor.y) * 0.1;
    notify();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
}

export default function SectionGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ensureTracker();
    const el = ref.current;
    if (!el) return;

    const paint = (x: number, y: number) => {
      // Viewport cursor position -> this section's local coordinates
      const r = el.getBoundingClientRect();
      const lx = x - r.left;
      const ly = y - r.top;
      el.style.background = `
        radial-gradient(280px circle at ${lx}px ${ly}px, rgba(255, 196, 64, 0.16), transparent 70%),
        radial-gradient(640px circle at ${lx}px ${ly}px, rgba(255, 176, 36, 0.1), rgba(255, 160, 20, 0.04) 45%, transparent 72%)
      `;
    };

    paint(cursor.x, cursor.y);
    subscribers.add(paint);
    return () => {
      subscribers.delete(paint);
    };
  }, []);

  return <div ref={ref} className="absolute inset-0 pointer-events-none" aria-hidden="true" />;
}
