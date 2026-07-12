import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const railStops = [
  { id: "top", label: "This Is Joseph", initial: "J" },
  { id: "about", label: "About", initial: "A" },
  { id: "work", label: "Work", initial: "W" },
  { id: "services", label: "Services", initial: "S" },
  { id: "process", label: "Process", initial: "P" },
  { id: "connect", label: "Connect", initial: "C" },
  { id: "corner", label: "Content Corner", initial: "CC" },
];

const BADGE_H = 36;

export default function Rail() {
  const [progress, setProgress] = useState(0);
  const [active, setActive] = useState(railStops[0]);
  const [expanded, setExpanded] = useState(false);
  const collapseTimer = useRef<number | undefined>(undefined);

  // Badge rides the line with scroll progress
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Announce the section on every boundary crossing, in either direction
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const stop = railStops.find((s) => s.id === entry.target.id);
          if (!stop) continue;
          setActive((prev) => {
            if (prev.id === stop.id) return prev;
            setExpanded(true);
            window.clearTimeout(collapseTimer.current);
            collapseTimer.current = window.setTimeout(() => setExpanded(false), 2200);
            return stop;
          });
        }
      },
      { rootMargin: "-40% 0px -50% 0px" }
    );
    railStops.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => {
      observer.disconnect();
      window.clearTimeout(collapseTimer.current);
    };
  }, []);

  return (
    <div className="fixed left-5 lg:left-10 top-0 bottom-0 z-40">
      <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px] lg:w-[3px] bg-yellow/90 pointer-events-none" />

      {/* Passed-track tint */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-[2px] lg:w-[3px] bg-navy-deep/30 pointer-events-none"
        style={{ height: `${progress * 100}%` }}
      />

      {/* Left edge sits half a badge left of the line: the collapsed circle is
          centered on the rail, and the expanded label grows rightward so long
          section names (e.g. Content Corner) never clip off-screen. */}
      <motion.div
        className="absolute left-1/2"
        style={{ x: -BADGE_H / 2 }}
        animate={{ top: `calc(${progress} * (100vh - ${BADGE_H}px))` }}
        transition={{ type: "tween", duration: 0.15, ease: "linear" }}
      >
        <motion.div
          layout
          className="h-9 rounded-full bg-yellow text-navy-deep flex items-center justify-center font-bold shadow-lg overflow-hidden whitespace-nowrap"
          style={{ minWidth: BADGE_H }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <AnimatePresence mode="wait" initial={false}>
            {expanded ? (
              <motion.span
                key={`label-${active.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="px-5 text-xs uppercase tracking-[0.18em]"
              >
                {active.label}
              </motion.span>
            ) : (
              <motion.span
                key={`initial-${active.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="px-3.5 text-sm"
              >
                {active.initial}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
    </div>
  );
}
