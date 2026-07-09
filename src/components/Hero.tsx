import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedFall } from "@/components/ui/block-text";
import heroImg from "../assets/hero-joseph.png";

const SCRUB_SENSITIVITY = 0.8;

// Where the head sits inside the hero photo, in image-normalized
// coordinates (0..1). Tuned for the black-suit chair portrait.
const HEAD = {
  cx: 0.512, // head center, x
  top: 0.02, // just above the hair
  bottom: 0.3, // neck / collar line, where the TV "sits"
};
const TV_ASPECT = 1.3; // classic 4:3-ish CRT, slightly wide

type Box = { left: number; top: number; width: number; height: number };

/**
 * The photo renders with object-fit: cover, so to pin the TV to the head
 * we re-derive the cover transform (uniform scale + centering offsets)
 * and convert the head's image-space box into container pixels.
 */
function computeTvBox(
  container: HTMLElement,
  natW: number,
  natH: number
): Box {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const scale = Math.max(cw / natW, ch / natH);
  const offX = (cw - natW * scale) / 2;
  const offY = (ch - natH * scale) / 2;

  const height = (HEAD.bottom - HEAD.top) * natH * scale;
  const width = height * TV_ASPECT;
  const left = HEAD.cx * natW * scale + offX - width / 2;
  const top = HEAD.top * natH * scale + offY;
  return { left, top, width, height };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [tvBox, setTvBox] = useState<Box | null>(null);

  // Keep the TV pinned to the head across resizes
  useEffect(() => {
    const img = new Image();
    img.src = heroImg;

    const update = () => {
      if (!sectionRef.current || !img.naturalWidth) return;
      setTvBox(computeTvBox(sectionRef.current, img.naturalWidth, img.naturalHeight));
    };

    img.decode().then(update).catch(() => {});
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse-scrub: horizontal movement seeks the video forward/backward
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let prevX: number | null = null;
    let targetTime = 0;
    let seeking = false;

    const seekTo = (t: number) => {
      seeking = true;
      video.currentTime = t;
    };

    const onLoaded = () => {
      targetTime = video.duration / 2;
      seekTo(targetTime);
    };

    // Queue the next seek if the target moved while seeking (no flooding)
    const onSeeked = () => {
      seeking = false;
      if (Math.abs(video.currentTime - targetTime) > 0.05) seekTo(targetTime);
    };

    const onMove = (e: MouseEvent) => {
      if (prevX === null) {
        prevX = e.clientX;
        return;
      }
      const delta = e.clientX - prevX;
      prevX = e.clientX;
      if (!video.duration) return;
      targetTime = Math.min(
        video.duration,
        Math.max(0, targetTime + (delta / window.innerWidth) * SCRUB_SENSITIVITY * video.duration)
      );
      if (!seeking) seekTo(targetTime);
    };

    video.addEventListener("loadedmetadata", onLoaded);
    video.addEventListener("seeked", onSeeked);
    window.addEventListener("mousemove", onMove);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      window.removeEventListener("mousemove", onMove);
    };
  }, [tvBox]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-svh flex flex-col justify-end overflow-hidden"
    >
      {/* Studio portrait backdrop */}
      <img
        src={heroImg}
        alt="Joseph seated in a suit with an analog TV over his head; the TV scrubs with mouse movement"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Analog TV replacing the head */}
      {tvBox && (
        <div
          className="absolute z-[5]"
          style={{
            left: tvBox.left,
            top: tvBox.top,
            width: tvBox.width,
            height: tvBox.height,
          }}
        >
          {/* Antennas */}
          <div className="absolute left-1/2 -top-[34%] h-[36%] w-[2.5%] min-w-[3px] origin-bottom -rotate-[24deg] rounded-full bg-neutral-800">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-700" />
          </div>
          <div className="absolute left-1/2 -top-[34%] h-[36%] w-[2.5%] min-w-[3px] origin-bottom rotate-[24deg] rounded-full bg-neutral-800">
            <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-neutral-700" />
          </div>

          {/* Bezel */}
          <div className="absolute inset-0 rounded-[14%] bg-gradient-to-b from-neutral-800 via-neutral-900 to-black shadow-[0_18px_50px_rgba(0,0,0,0.6)] p-[4.5%]">
            {/* CRT screen */}
            <div className="relative w-full h-full rounded-[11%] overflow-hidden bg-black">
              <video
                ref={videoRef}
                src="/hero-tv.mp4"
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 w-full h-full object-cover"
              />
              {/* Scanlines */}
              <div
                className="absolute inset-0 pointer-events-none opacity-35 mix-blend-multiply"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(0deg, rgba(0,0,0,0.55) 0px, rgba(0,0,0,0.55) 1px, transparent 2px, transparent 4px)",
                }}
              />
              {/* CRT vignette + curvature shading */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  boxShadow: "inset 0 0 6vmin rgba(0,0,0,0.85)",
                  borderRadius: "inherit",
                }}
              />
              {/* Glass glare */}
              <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/15 via-transparent to-transparent" />
            </div>
          </div>
        </div>
      )}

      {/* Legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/20 to-navy-deep/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/40 via-transparent to-navy-deep/30 pointer-events-none" />

      <div className="container-x relative z-10 pb-32 md:pb-40">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          <AnimatedFall color="#ffd23f" delay={1.6}>
            <motion.h1
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className="font-serif font-medium text-cream leading-[0.95] text-[clamp(4rem,11vw,9rem)]"
            >
              Call
              <br />
              Joseph
            </motion.h1>
          </AnimatedFall>

          <div className="flex flex-col items-start md:items-end gap-8 md:pb-6">
            <motion.p
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.3 }}
              className="font-serif italic text-2xl md:text-3xl text-cream leading-snug md:text-right max-w-md"
            >
              The bridge between your brand
              <br className="hidden md:block" /> and the people it's built for
            </motion.p>
            <motion.a
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              href="#connect"
              className="cream-pill"
            >
              Work With Me
            </motion.a>
          </div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          className="label-caps text-cream/70 mt-10 hidden md:block"
        >
          Move your mouse left / right — the TV rewinds &amp; plays
        </motion.p>
      </div>
    </section>
  );
}
