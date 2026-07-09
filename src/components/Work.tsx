import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { work } from "../data";

export default function Work() {
  return (
    <section id="work" className="bg-navy text-cream py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="label-caps text-yellow mb-4">Second Stop</p>
          <h2 className="font-serif font-medium text-5xl md:text-6xl mb-4">Selected Work</h2>
          <p className="text-dim-on-navy text-lg max-w-xl mb-14">
            Web design, development, e-commerce, and content-led social
            growth for founders and small teams.
          </p>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {work.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <a href="#connect" className="group block">
                <div className="relative rounded-lg overflow-hidden border border-navy-line">
                  <img
                    src={item.image}
                    alt={`Placeholder for ${item.title} — swap for your project screenshot`}
                    className="w-full aspect-[10/7] object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    loading="lazy"
                  />
                  <span className="absolute top-3 left-3 inline-flex items-center rounded-full bg-navy-deep/80 backdrop-blur-sm border border-dashed border-cream/50 px-2.5 py-1 text-[9px] uppercase tracking-widest text-cream">
                    Swap for your project
                  </span>
                </div>
                <h3 className="font-serif text-2xl mt-4 group-hover:text-yellow transition-colors">
                  {item.title}
                </h3>
                <p className="label-caps text-dim-on-navy mt-1.5">{item.category}</p>
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
