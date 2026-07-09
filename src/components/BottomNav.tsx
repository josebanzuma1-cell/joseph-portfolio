import { useEffect, useState } from "react";
import { stops } from "../data";

export default function BottomNav() {
  const [active, setActive] = useState("top");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    stops.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <nav
      aria-label="Section stops"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-navy/95 backdrop-blur-md rounded-2xl md:rounded-full border border-navy-line shadow-2xl px-4 md:px-7 py-3"
    >
      <ul className="flex items-center gap-4 md:gap-7">
        {stops.map((s) => {
          const isActive = active === s.id;
          return (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="flex flex-col items-center gap-1.5 group"
                aria-current={isActive ? "true" : undefined}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                    isActive ? "bg-yellow" : "bg-dim-on-navy/50 group-hover:bg-dim-on-navy"
                  }`}
                />
                <span
                  className={`hidden md:block text-[10px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 whitespace-nowrap ${
                    isActive ? "text-cream" : "text-dim-on-navy group-hover:text-cream"
                  }`}
                >
                  {s.label}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
