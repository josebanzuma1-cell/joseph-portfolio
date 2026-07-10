import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { AnimatedFall } from "@/components/ui/block-text";
import heroImg from "../assets/hero-joseph.png";

const SCRUB_SENSITIVITY = 0.8;
const MAX_TILT_DEG = 3;

// Image-normalized (0..1) geometry, measured on the computer-head portrait.
// MON is the crop box around the beige monitor (with padding so the tilting
// copy always covers the baked-in original). SCREEN is the dark CRT glass.
const MON = { left: 0.415, top: 0.02, width: 0.255, height: 0.33 };
const SCREEN = { cx: 0.52, cy: 0.16, w: 0.132, aspect: 1.3, rotDeg: 11 };

type Geometry = {
  mon: { left: number; top: number; width: number; height: number };
  bgSize: string;
  bgPos: string;
  screen: { left: number; top: number; width: number; height: number };
};

/**
 * The photo renders with object-fit: cover. Re-derive that transform
 * (uniform scale + centering offsets) to place the monitor crop and the
 * CRT screen in container pixels.
 */
function computeGeometry(container: HTMLElement, natW: number, natH: number): Geometry {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const s = Math.max(cw / natW, ch / natH);
  const offX = (cw - natW * s) / 2;
  const offY = (ch - natH * s) / 2;

  const monLeft = MON.left * natW * s + offX;
  const monTop = MON.top * natH * s + offY;
  const monW = MON.width * natW * s;
  const monH = MON.height * natH * s;

  const scrW = SCREEN.w * natW * s;
  const scrH = scrW / SCREEN.aspect;

  return {
    mon: { left: monLeft, top: monTop, width: monW, height: monH },
    // The crop shows the same photo, shifted so only the monitor is visible
    bgSize: `${natW * s}px ${natH * s}px`,
    bgPos: `${-(MON.left * natW * s)}px ${-(MON.top * natH * s)}px`,
    screen: {
      left: (SCREEN.cx - MON.left) * natW * s - scrW / 2,
      top: (SCREEN.cy - MON.top) * natH * s - scrH / 2,
      width: scrW,
      height: scrH,
    },
  };
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);
  const [progress, setProgress] = useState(0);

  // The monitor is "movable": it tilts a few degrees toward the cursor,
  // pivoting at its bottom edge so it stays planted on the neck.
  const tilt = useMotionValue(0);
  const smoothTilt = useSpring(tilt, { stiffness: 120, damping: 16 });

  useEffect(() => {
    const img = new Image();
    img.src = heroImg;

    const update = () => {
      if (!sectionRef.current || !img.naturalWidth) return;
      setGeo(computeGeometry(sectionRef.current, img.naturalWidth, img.naturalHeight));
    };

    img.decode().then(update).catch(() => {});
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Mouse-scrub + tilt, per the interaction spec
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

    const onTime = () => {
      if (video.duration) setProgress(video.currentTime / video.duration);
    };

    const onMove = (e: MouseEvent) => {
      tilt.set(((e.clientX / window.innerWidth) - 0.5) * 2 * MAX_TILT_DEG);
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
    video.addEventListener("timeupdate", onTime);
    window.addEventListener("mousemove", onMove);
    return () => {
      video.removeEventListener("loadedmetadata", onLoaded);
      video.removeEventListener("seeked", onSeeked);
      video.removeEventListener("timeupdate", onTime);
      window.removeEventListener("mousemove", onMove);
    };
  }, [geo, tilt]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-svh flex flex-col justify-end overflow-hidden cursor-ew-resize"
    >
      {/* Studio portrait backdrop (monitor already in the shot) */}
      <img
        src={heroImg}
        alt="Joseph in a suit with a vintage desktop computer for a head; its screen plays a video that scrubs with mouse movement"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Movable monitor: a crop of the same photo that tilts with the
          cursor, pivoting at the neck. The CRT video lives inside it. */}
      {geo && (
        <motion.div
          className="absolute z-[5]"
          style={{
            left: geo.mon.left,
            top: geo.mon.top,
            width: geo.mon.width,
            height: geo.mon.height,
            rotate: smoothTilt,
            transformOrigin: "50% 92%",
            backgroundImage: `url(${heroImg})`,
            backgroundSize: geo.bgSize,
            backgroundPosition: geo.bgPos,
            backgroundRepeat: "no-repeat",
          }}
        >
          {/* CRT glass, matched to the screen's tilt in the photo */}
          <div
            className="absolute overflow-hidden rounded-[8%] bg-black"
            style={{
              left: geo.screen.left,
              top: geo.screen.top,
              width: geo.screen.width,
              height: geo.screen.height,
              transform: `rotate(${SCREEN.rotDeg}deg)`,
            }}
          >
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
              className="absolute inset-0 pointer-events-none opacity-30 mix-blend-multiply"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(0,0,0,0.5) 0px, rgba(0,0,0,0.5) 1px, transparent 2px, transparent 4px)",
              }}
            />
            {/* Tube vignette */}
            <div
              className="absolute inset-0 pointer-events-none rounded-[inherit]"
              style={{ boxShadow: "inset 0 0 4vmin rgba(0,0,0,0.8)" }}
            />
            {/* Glass glare */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-white/12 via-transparent to-transparent" />
            {/* Scrub progress line */}
            <div className="absolute left-[8%] right-[8%] bottom-[6%] h-[3px] bg-white/15 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow rounded-full"
                style={{ width: `${progress * 100}%` }}
              />
            </div>
          </div>
        </motion.div>
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
              className="cream-pill cursor-pointer"
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
          Move your mouse left / right — the screen rewinds &amp; plays
        </motion.p>
      </div>
    </section>
  );
}
