import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";
import { AnimatedFall } from "@/components/ui/block-text";
import heroImg from "../assets/hero-joseph.png";

const MAX_TILT_DEG = 2.5;
const MD_QUERY = "(min-width: 768px)"; // Tailwind md — image switches contain -> cover here

// Image-normalized (0..1) geometry, measured on the computer-head portrait.
// MON is the crop box around the beige monitor (with padding so the tilting
// copy always covers the baked-in original). SCREEN is the dark CRT glass.
const MON = { left: 0.415, top: 0.02, width: 0.255, height: 0.33 };
// Measured from the photo's dark-glass pixels (centroid + edge line fits),
// with a hair of inset so the glass edge vignette stays visible.
const SCREEN = { cx: 0.5194, cy: 0.1622, w: 0.121, aspect: 1.45, rotDeg: 12.5 };

type Geometry = {
  mon: { left: number; top: number; width: number; height: number };
  bgSize: string;
  bgPos: string;
  screen: { left: number; top: number; width: number; height: number };
};

/**
 * Mirror the CSS object-fit math (cover on md+, contain below) so the
 * monitor overlay lands exactly on the photographed monitor at any
 * viewport size — desktop and phone alike.
 */
function computeGeometry(
  container: HTMLElement,
  natW: number,
  natH: number,
  cover: boolean
): Geometry {
  const cw = container.clientWidth;
  const ch = container.clientHeight;
  const s = cover ? Math.max(cw / natW, ch / natH) : Math.min(cw / natW, ch / natH);
  const offX = (cw - natW * s) / 2;
  // Anchor top on cover (desktop) so the computer head is never cropped;
  // bias 30% from the top on contain (phones) so the portrait sits clear
  // of the hero text. Must match the img's object-position classes.
  const offY = cover ? 0 : (ch - natH * s) * 0.3;

  const scrW = SCREEN.w * natW * s;
  const scrH = scrW / SCREEN.aspect;

  return {
    mon: {
      left: MON.left * natW * s + offX,
      top: MON.top * natH * s + offY,
      width: MON.width * natW * s,
      height: MON.height * natH * s,
    },
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

/** Low-res pixel-eye renderer: pupils track the cursor, dilate on fast
 *  movement, blink on a timer, and wander when the cursor goes idle. */
const GRID_W = 44;
const GRID_H = 33;

function drawEyes(
  ctx: CanvasRenderingContext2D,
  look: { x: number; y: number },
  dilate: number,
  blink: number // 0 open .. 1 closed
) {
  // Transparent canvas: the photo's real CRT glass is the screen — we only
  // paint the glowing pixels, so there is no rectangle edge to mismatch.
  ctx.clearRect(0, 0, GRID_W, GRID_H);

  const eyes = [
    { cx: 14, cy: 16 },
    { cx: 30, cy: 16 },
  ];
  const eyeH = 11;

  for (const e of eyes) {
    // Pupil: blocky, offset toward the cursor, dilating with speed
    const pr = 1 + Math.round(dilate); // pupil "radius" in cells
    const px = e.cx + Math.round(look.x * 2.5) - pr;
    const py = e.cy + Math.round(look.y * 3) - pr;
    const size = pr * 2 + 1;

    // Eyelid: blinking clips the pupil from the top instead of painting
    // a lid, keeping everything outside the pupil transparent
    const lidY = e.cy - Math.floor(eyeH / 2) + blink * eyeH;
    const visTop = Math.max(py, Math.ceil(lidY));
    const visH = py + size - visTop;
    if (visH <= 0) continue;

    ctx.fillStyle = "#ffd23f"; // rail yellow
    ctx.fillRect(px, visTop, size, visH);
    if (py + pr >= visTop) {
      ctx.fillStyle = "#ffedb0";
      ctx.fillRect(px + pr, py + pr, 1, 1); // hot core pixel
    }
  }
}

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [geo, setGeo] = useState<Geometry | null>(null);

  // Cursor state shared with the render loop (no re-renders)
  const cursor = useRef({ nx: 0, ny: 0, speed: 0, lastMove: 0 });

  // The monitor tilts a few degrees toward the cursor, pivoting at its
  // bottom edge so it stays planted on the neck.
  const tilt = useMotionValue(0);
  const smoothTilt = useSpring(tilt, { stiffness: 120, damping: 16 });

  // Geometry: recompute on any section resize and on the md breakpoint flip
  useEffect(() => {
    const img = new Image();
    img.src = heroImg;
    const mq = window.matchMedia(MD_QUERY);

    const update = () => {
      if (!sectionRef.current || !img.naturalWidth) return;
      setGeo(
        computeGeometry(sectionRef.current, img.naturalWidth, img.naturalHeight, mq.matches)
      );
    };

    // decode() can reject sporadically even when the image is usable;
    // fall through to update() either way, and also listen for load.
    img.decode().then(update).catch(update);
    img.addEventListener("load", update);
    const ro = new ResizeObserver(update);
    if (sectionRef.current) ro.observe(sectionRef.current);
    mq.addEventListener("change", update);
    return () => {
      img.removeEventListener("load", update);
      ro.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  // Pointer tracking (mouse + touch) for tilt and the pixel eyes
  useEffect(() => {
    let prevX: number | null = null;
    let prevY: number | null = null;

    const track = (clientX: number, clientY: number) => {
      tilt.set(((clientX / window.innerWidth) - 0.5) * 2 * MAX_TILT_DEG);

      const cv = canvasRef.current;
      if (cv) {
        const r = cv.getBoundingClientRect();
        const dx = (clientX - (r.left + r.width / 2)) / (r.width / 2);
        const dy = (clientY - (r.top + r.height / 2)) / (r.height / 2);
        cursor.current.nx = Math.max(-1, Math.min(1, dx / 6));
        cursor.current.ny = Math.max(-1, Math.min(1, dy / 6));
      }
      if (prevX !== null && prevY !== null) {
        const d = Math.hypot(clientX - prevX, clientY - prevY);
        cursor.current.speed = Math.min(1, cursor.current.speed + d / 260);
      }
      prevX = clientX;
      prevY = clientY;
      cursor.current.lastMove = performance.now();
    };

    const onMouse = (e: MouseEvent) => track(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      if (e.touches[0]) track(e.touches[0].clientX, e.touches[0].clientY);
    };
    window.addEventListener("mousemove", onMouse);
    window.addEventListener("touchmove", onTouch, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, [tilt]);

  // Pixel-eye render loop
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    cv.width = GRID_W;
    cv.height = GRID_H;
    const ctx = cv.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let blink = 0;
    let blinkPhase: "open" | "closing" | "opening" = "open";
    let nextBlink = performance.now() + 2200 + Math.random() * 3000;
    const wander = { x: 0, y: 0, next: 0 };

    const loop = (t: number) => {
      const c = cursor.current;
      c.speed *= 0.92; // decay

      // Blink scheduling
      if (blinkPhase === "open" && t > nextBlink) blinkPhase = "closing";
      if (blinkPhase === "closing") {
        blink = Math.min(1, blink + 0.34);
        if (blink === 1) blinkPhase = "opening";
      } else if (blinkPhase === "opening") {
        blink = Math.max(0, blink - 0.25);
        if (blink === 0) {
          blinkPhase = "open";
          nextBlink = t + 2200 + Math.random() * 3600;
        }
      }

      // Idle cursor: eyes wander on their own
      const idle = t - c.lastMove > 3500;
      if (idle && t > wander.next) {
        wander.x = (Math.random() - 0.5) * 1.6;
        wander.y = (Math.random() - 0.5) * 1.2;
        wander.next = t + 900 + Math.random() * 1600;
      }
      const look = idle ? wander : { x: c.nx * 6, y: c.ny * 6 };

      drawEyes(ctx, { x: Math.max(-1, Math.min(1, look.x)), y: Math.max(-1, Math.min(1, look.y)) }, c.speed * 1.6, blink);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [geo]);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative min-h-svh flex flex-col justify-end overflow-hidden bg-[#5e3517]"
    >
      {/* Backdrop-matched wash behind the contain-fit on phones */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          background:
            "radial-gradient(ellipse 90% 70% at 50% 42%, #8a5326 0%, #6b3d1a 55%, #4a2810 100%)",
        }}
      />

      {/* Studio portrait: cover on desktop, contain on phones so the
          computer head is always fully in frame */}
      <img
        src={heroImg}
        alt="Joseph in a suit with a vintage desktop computer for a head; its pixel eyes follow your cursor"
        className="absolute inset-0 w-full h-full object-contain md:object-cover object-[50%_30%] md:object-[50%_0%]"
      />

      {/* Movable monitor: a feathered crop of the same photo that tilts
          with the cursor, pivoting at the neck. Feathering melts its
          edges into the backdrop so no rectangular seam shows. */}
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
            WebkitMaskImage:
              "radial-gradient(ellipse closest-side at 50% 46%, black 68%, transparent 96%)",
            maskImage:
              "radial-gradient(ellipse closest-side at 50% 46%, black 68%, transparent 96%)",
          }}
        >
          {/* Pixel eyes drawn on a transparent canvas over the photo's own
              CRT glass — the real screen provides the black, so nothing
              can misalign with the bezel */}
          <div
            className="absolute"
            style={{
              left: geo.screen.left,
              top: geo.screen.top,
              width: geo.screen.width,
              height: geo.screen.height,
              transform: `rotate(${SCREEN.rotDeg}deg)`,
            }}
          >
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full"
              style={{
                imageRendering: "pixelated",
                filter: "drop-shadow(0 0 6px rgba(255,210,63,0.55))",
              }}
            />
          </div>
        </motion.div>
      )}

      {/* Legibility gradients */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/20 to-navy-deep/10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/40 via-transparent to-navy-deep/30 pointer-events-none" />

      <div className="container-x relative z-10 pb-32 md:pb-40">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-10">
          {/* No motion wrapper here: SplitText rewrites the inner DOM, which
              orphans any framer-motion-animated child and leaves it stuck at
              its initial style. The falling blocks are the entrance. */}
          <AnimatedFall color="#ffd23f" delay={1.6}>
            <h1 className="font-serif font-medium text-cream leading-[0.95] text-[clamp(3.4rem,11vw,9rem)]">
              Call
              <br />
              Joseph
            </h1>
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
          Wave your cursor — the screen is watching
        </motion.p>
      </div>
    </section>
  );
}
