import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { services } from "../data";

export default function Services() {
  return (
    <section id="services" className="bg-cream text-navy py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="label-caps text-dim-on-cream mb-4">Third Stop</p>
          <h2 className="font-serif font-medium text-5xl md:text-6xl mb-14">What I Do</h2>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {services.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="rounded-xl border border-cream-line bg-cream-soft/60 p-8 h-full flex flex-col hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
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
