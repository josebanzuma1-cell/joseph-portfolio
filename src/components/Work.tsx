import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { AnimatedFall } from "@/components/ui/block-text";
import { work } from "../data";

export default function Work() {
  return (
    <section id="work" className="relative overflow-hidden bg-navy text-cream py-24 md:py-32">
      <div className="absolute -top-24 right-[5%] w-[460px] h-[460px] rounded-full bg-yellow/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-18%] left-[-8%] w-[440px] h-[440px] rounded-full bg-navy-soft/70 blur-3xl pointer-events-none" />
      <div className="container-x relative">
        <Reveal>
          <p className="label-caps text-yellow mb-4">Second Stop</p>
          <AnimatedFall color="#ffd23f" className="mb-4">
            <h2 className="font-serif font-medium text-5xl md:text-6xl">Selected Work</h2>
          </AnimatedFall>
          <p className="text-dim-on-navy text-lg max-w-xl mb-14">
            A curated shelf of award-winning builds I study and benchmark
            against — the bar every project I take on aims for. (Swap in
            your own client work before pitching.)
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {work.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <a
                href={item.url}
                target="_blank"
                rel="noreferrer"
                className="group block glass-navy rounded-xl p-4 hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="relative rounded-lg overflow-hidden">
                  <img
                    src={item.image}
                    alt={`Live screenshot of ${item.title} — an award-winning reference site`}
                    className="w-full aspect-[10/7] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-navy-deep/80 backdrop-blur-sm border border-dashed border-cream/50 px-2.5 py-1 text-[9px] uppercase tracking-widest text-cream">
                    Reference · swap with your work
                  </span>
                </div>
                <h3 className="font-serif text-2xl mt-4 group-hover:text-yellow transition-colors">
                  {item.title}
                </h3>
                <p className="label-caps text-dim-on-navy mt-1.5 pb-1">{item.category}</p>
              </a>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <NextStop href="#services" label="Next Stop: Services" onNavy />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
