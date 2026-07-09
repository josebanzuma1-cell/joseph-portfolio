import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { AnimatedFall } from "@/components/ui/block-text";
import { process } from "../data";

export default function Process() {
  return (
    <section id="process" className="relative overflow-hidden bg-navy text-cream py-24 md:py-32">
      <div className="absolute -top-20 left-[10%] w-[460px] h-[460px] rounded-full bg-yellow/15 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-6%] w-[420px] h-[420px] rounded-full bg-navy-soft/60 blur-3xl pointer-events-none" />
      <div className="container-x relative">
        <Reveal>
          <p className="label-caps text-yellow mb-4">Fourth Stop</p>
          <AnimatedFall color="#ffd23f" className="mb-4">
            <h2 className="font-serif font-medium text-5xl md:text-6xl">
              Your Content Machine Starts Here
            </h2>
          </AnimatedFall>
          <p className="text-dim-on-navy text-lg max-w-xl mb-14">
            A simple system that takes a project from first conversation to
            compounding growth.
          </p>
        </Reveal>

        <div className="grid md:grid-cols-4 gap-5">
          {process.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.08}>
              <div className="glass-navy rounded-xl p-8 h-full flex flex-col min-h-[220px] hover:-translate-y-1 transition-transform duration-300">
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
