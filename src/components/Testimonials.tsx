import { Quote } from "lucide-react";
import Reveal from "./Reveal";
import { testimonials } from "../data";

export default function Testimonials() {
  return (
    <div className="mb-20">
      <Reveal>
        <p className="label-caps text-dim-on-cream mb-4">Kind Words</p>
        <h2 className="font-serif font-medium text-4xl md:text-5xl mb-12 text-navy">
          Trusted by founders who needed it done right
        </h2>
      </Reveal>

      <div className="grid md:grid-cols-3 gap-5">
        {testimonials.map((t, i) => (
          <Reveal key={t.name} delay={i * 0.08}>
            <div className="rounded-xl border border-cream-line bg-cream-soft/60 p-8 h-full flex flex-col">
              <Quote className="text-navy/30 mb-5" size={24} />
              <p className="font-serif italic text-xl text-navy leading-relaxed flex-1">
                "{t.quote}"
              </p>
              <div className="mt-7 pt-5 border-t border-cream-line flex items-center gap-3">
                <img
                  src={t.avatar}
                  alt={`${t.name} — placeholder photo, swap for real client headshot`}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold text-navy text-sm">{t.name}</p>
                  <p className="text-xs text-dim-on-cream">{t.role}</p>
                </div>
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
