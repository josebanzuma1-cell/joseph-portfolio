import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedFall } from "@/components/ui/block-text";
import heroImg from "../assets/hero-joseph.png";

const SCRUB_SENSITIVITY = 0.8;

/**
 * Builds a black/transparent mask of the photo's subject by flood-filling
 * the (fairly uniform) studio backdrop inward from the image borders.
 * Everything the flood can't reach is the subject — returned as opaque
 * white so it can be used as a CSS mask for the video layer.
 */
function buildSubjectMask(img: HTMLImageElement): string {
  const W = 420;
  const H = Math.round((img.naturalHeight / img.naturalWidth) * W);
  const cv = document.createElement("canvas");
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext("2d", { willReadFrequently: true })!;
  ctx.drawImage(img, 0, 0, W, H);
  const { data } = ctx.getImageData(0, 0, W, H);

  // Sample backdrop reference colors along all four borders (the studio
  // backdrop vignettes, so one average color is not enough)
  const refs: number[][] = [];
  const step = Math.max(4, Math.floor(W / 40));
  const addRef = (x: number, y: number) => {
    const i = (y * W + x) * 4;
    refs.push([data[i], data[i + 1], data[i + 2]]);
  };
  for (let x = 0; x < W; x += step) {
    addRef(x, 0);
    addRef(x, H - 1);
  }
  for (let y = 0; y < H; y += step) {
    addRef(0, y);
    addRef(W - 1, y);
  }

  const T2 = 40 * 40;
  const isBgLike = (i: number) => {
    const r = data[i], g = data[i + 1], b = data[i + 2];
    for (const ref of refs) {
      const d =
        (r - ref[0]) * (r - ref[0]) +
        (g - ref[1]) * (g - ref[1]) +
        (b - ref[2]) * (b - ref[2]);
      if (d < T2) return true;
    }
    return false;
  };

  // Flood fill from the borders through backdrop-like pixels only
  const bg = new Uint8Array(W * H);
  const stack: number[] = [];
  const push = (x: number, y: number) => {
    const p = y * W + x;
    if (!bg[p] && isBgLike(p * 4)) {
      bg[p] = 1;
      stack.push(p);
    }
  };
  for (let x = 0; x < W; x++) {
    push(x, 0);
    push(x, H - 1);
  }
  for (let y = 0; y < H; y++) {
    push(0, y);
    push(W - 1, y);
  }
  while (stack.length) {
    const p = stack.pop()!;
    const x = p % W;
    const y = (p / W) | 0;
    if (x > 0) push(x - 1, y);
    if (x < W - 1) push(x + 1, y);
    if (y > 0) push(x, y - 1);
    if (y < H - 1) push(x, y + 1);
  }

  // Subject = anything the flood didn't reach
  const out = ctx.createImageData(W, H);
  for (let p = 0; p < W * H; p++) {
    const o = p * 4;
    out.data[o] = 255;
    out.data[o + 1] = 255;
    out.data[o + 2] = 255;
    out.data[o + 3] = bg[p] ? 0 : 255;
  }
  ctx.putImageData(out, 0, 0);

  // Feather the silhouette edge slightly
  const soft = document.createElement("canvas");
  soft.width = W;
  soft.height = H;
  const sctx = soft.getContext("2d")!;
  sctx.filter = "blur(1.5px)";
  sctx.drawImage(cv, 0, 0);
  return soft.toDataURL();
}

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [maskUrl, setMaskUrl] = useState<string | null>(null);

  // Build the subject mask once the hero photo is decoded
  useEffect(() => {
    const img = new Image();
    img.src = heroImg;
    img
      .decode()
      .then(() => setMaskUrl(buildSubjectMask(img)))
      .catch(() => setMaskUrl(null));
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

    // Queue the next seek if the target moved while we were seeking,
    // preventing seek-flooding
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
  }, [maskUrl]);

  return (
    <section id="top" className="relative min-h-svh flex flex-col justify-end overflow-hidden">
      {/* Studio portrait backdrop */}
      <img
        src={heroImg}
        alt="Joseph seated in a studio portrait; his silhouette plays an analog TV video that scrubs with mouse movement"
        className="absolute inset-0 w-full h-full object-cover object-center"
      />

      {/* Analog TV video revealed only inside the subject's silhouette.
          Same cover/center geometry as the photo so the mask stays aligned. */}
      {maskUrl && (
        <div
          className="absolute inset-0"
          style={{
            WebkitMaskImage: `url(${maskUrl})`,
            maskImage: `url(${maskUrl})`,
            WebkitMaskSize: "cover",
            maskSize: "cover",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
          }}
        >
          <video
            ref={videoRef}
            src="/hero-tv.mp4"
            muted
            playsInline
            preload="auto"
            className="w-full h-full object-cover object-center"
          />
        </div>
      )}

      {/* Legibility gradients over both layers */}
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/25 to-navy-deep/15 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/45 via-transparent to-navy-deep/35 pointer-events-none" />

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
          Move your mouse left / right — the TV inside the silhouette rewinds &amp; plays
        </motion.p>
      </div>
    </section>
  );
}
