import { motion } from "framer-motion";
import { AnimatedFall } from "@/components/ui/block-text";

export default function Hero() {
  return (
    <section id="top" className="relative min-h-svh flex flex-col justify-end overflow-hidden">
      {/* Full-bleed cinematic background — swap for your own photo */}
      <img
        src="https://picsum.photos/seed/joseph-hero-city/1920/1080"
        alt="Placeholder hero backdrop — swap for a cinematic photo of you at work"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/95 via-navy-deep/30 to-navy-deep/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-navy-deep/50 via-transparent to-navy-deep/40" />

      <span className="absolute top-6 right-6 inline-flex items-center rounded-full bg-navy-deep/70 backdrop-blur-sm border border-dashed border-cream/50 px-3 py-1.5 text-[10px] uppercase tracking-widest text-cream z-10">
        Swap for your hero photo
      </span>

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
      </div>
    </section>
  );
}
