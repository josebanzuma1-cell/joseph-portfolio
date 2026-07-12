import { useState } from "react";
import Reveal from "./Reveal";
import NextStop from "./NextStop";
import SectionGlow from "./SectionGlow";
import Testimonials from "./Testimonials";
import { AnimatedFall } from "@/components/ui/block-text";

const CONTACT_EMAIL = "hello@josephbuilds.com";

export default function Connect() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project inquiry from ${form.name || "your website"}`);
    const body = encodeURIComponent(`${form.message}\n\n— ${form.name} (${form.email})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
  };

  return (
    <section id="connect" className="relative overflow-hidden bg-cream text-navy py-24 md:py-32">
      <div className="absolute top-[10%] left-[-8%] w-[440px] h-[440px] rounded-full bg-yellow/30 blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-12%] right-[-10%] w-[480px] h-[480px] rounded-full bg-navy/12 blur-3xl pointer-events-none" />
      <SectionGlow tone="navy" />
      <div className="container-x relative">
        <Testimonials />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <Reveal>
            <p className="label-caps text-dim-on-cream mb-4">Fifth Stop</p>
            <AnimatedFall color="#182342" className="mb-5">
              <h2 className="font-serif font-medium text-5xl md:text-6xl">
                Work With Joseph
              </h2>
            </AnimatedFall>
            <p className="text-navy/80 text-lg leading-relaxed max-w-md mb-8">
              Website builds, content systems, consulting, and social media
              management — tell me what you're working on and let's make it
              real.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="yellow-pill inline-flex">
              Work With Me
            </a>
            <p className="text-dim-on-cream text-sm mt-6">
              Or email directly: <span className="font-semibold text-navy">{CONTACT_EMAIL}</span>
              <br />
              (Swap this placeholder email with your real one before launch.)
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <form
              onSubmit={handleSubmit}
              className="glass-cream rounded-xl p-8 space-y-4"
            >
              <div className="grid sm:grid-cols-2 gap-4">
                <input
                  required
                  placeholder="Your name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-lg bg-cream border border-cream-line px-5 py-4 text-navy placeholder:text-dim-on-cream outline-none focus:border-navy/50 transition-colors w-full"
                />
                <input
                  required
                  type="email"
                  placeholder="Email address"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-lg bg-cream border border-cream-line px-5 py-4 text-navy placeholder:text-dim-on-cream outline-none focus:border-navy/50 transition-colors w-full"
                />
              </div>
              <textarea
                required
                rows={5}
                placeholder="Tell me about your project"
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                className="w-full rounded-lg bg-cream border border-cream-line px-5 py-4 text-navy placeholder:text-dim-on-cream outline-none focus:border-navy/50 transition-colors resize-none"
              />
              <button type="submit" className="next-stop border-none cursor-pointer">
                Send Message
              </button>
            </form>
          </Reveal>
        </div>

        <Reveal>
          <div className="mt-14">
            <NextStop href="#corner" label="Last Stop: Content Corner" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
