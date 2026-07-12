import { useEffect, useRef } from "react";

/**
 * Amber radial glow that trails the cursor (or touch) across every
 * section. A single fixed layer above the section backgrounds, painted
 * with a soft eased lag so it reads as light following the hand.
 */
export default function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let x = window.innerWidth / 2;
    let y = window.innerHeight * 0.35;
    let tx = x;
    let ty = y;
    let raf = 0;

    const paint = () => {
      el.style.background = `
        radial-gradient(280px circle at ${x}px ${y}px, rgba(255, 196, 64, 0.16), transparent 70%),
        radial-gradient(640px circle at ${x}px ${y}px, rgba(255, 176, 36, 0.1), rgba(255, 160, 20, 0.04) 45%, transparent 72%)
      `;
    };

    const onMouse = (e: MouseEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      // rAF is suspended while the document is hidden — paint directly
      if (document.hidden) {
        x = tx;
        y = ty;
        paint();
      }
    };
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) {
        tx = e.touches[0].clientX;
        ty = e.touches[0].clientY;
      }
    };

    const loop = () => {
      // Eased trail: the glow chases the pointer instead of snapping
      x += (tx - x) * 0.1;
      y += (ty - y) * 0.1;
      paint();
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    paint(); // visible immediately, even before the first frame
    raf = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(raf);
    };
  }, []);

  return <div ref={ref} className="fixed inset-0 z-30 pointer-events-none" aria-hidden="true" />;
}
