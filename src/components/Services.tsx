import Reveal from "./Reveal";
import NextStop from "./NextStop";
import SectionGlow from "./SectionGlow";
import { AnimatedFall } from "@/components/ui/block-text";
import { services } from "../data";
import servicesBg from "../assets/services-bg.png";

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-cream text-navy py-24 md:py-32">
      {/* Portrait backdrop, multiplied into the cream at low opacity; the
          cream gradient keeps the left text/cards zone clean while the
          subject ghosts through on the right */}
      <img
        src={servicesBg}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover object-[75%_20%] opacity-50 mix-blend-multiply pointer-events-none select-none"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-cream via-cream/75 to-cream/25 pointer-events-none" />
      <div className="absolute -top-24 right-[-10%] w-[480px] h-[480px] rounded-full bg-yellow/35 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-15%] left-[-8%] w-[420px] h-[420px] rounded-full bg-navy/15 blur-3xl pointer-events-none" />
      <SectionGlow />
      <div className="container-x relative">
        <Reveal>
          <p className="label-caps text-dim-on-cream mb-4">Third Stop</p>
          <AnimatedFall color="#182342" className="mb-14">
            <h2 className="font-serif font-medium text-5xl md:text-6xl">What I Do</h2>
          </AnimatedFall>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="glass-cream rounded-xl p-8 h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <span className="font-serif italic text-3xl text-navy/40 mb-5">{s.n}</span>
                <h3 className="font-serif text-2xl mb-3">{s.title}</h3>
                <p className="text-navy/75 leading-relaxed flex-1">{s.desc}</p>
                <div className="flex flex-wrap gap-2 mt-6">
                  {s.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-[10px] font-semibold uppercase tracking-[0.15em] rounded-full border border-navy/20 px-3 py-1.5 text-navy/60"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <NextStop href="#process" label="Next Stop: Process" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
