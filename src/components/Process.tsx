import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { process } from "../data";

export default function Process() {
  return (
    <section id="process" className="bg-navy text-cream py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="label-caps text-yellow mb-4">Fourth Stop</p>
          <h2 className="font-serif font-medium text-5xl md:text-6xl mb-4">
            Your Content Machine Starts Here
          </h2>
          <p className="text-dim-on-navy text-lg max-w-xl mb-14">
            A simple system that takes a project from first conversation to
            compounding growth.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="rounded-xl border border-navy-line bg-navy-soft/40 p-8 h-full flex flex-col min-h-[220px]">
                <span className="font-serif italic text-4xl text-yellow mb-6">{step.n}</span>
                <h3 className="font-serif text-2xl mb-3">{step.title}</h3>
                <p className="text-dim-on-navy leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="mt-14">
            <NextStop href="#connect" label="Next Stop: Connect" onNavy />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
