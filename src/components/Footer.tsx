import { useState } from "react";
import Reveal from "./Reveal";
import { stops, socials } from "../data";
import { FaInstagram, FaLinkedin, FaYoutube, FaXTwitter, FaBehance } from "react-icons/fa6";

const iconMap: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram size={20} />,
  LinkedIn: <FaLinkedin size={20} />,
  YouTube: <FaYoutube size={20} />,
  "X / Twitter": <FaXTwitter size={20} />,
  Behance: <FaBehance size={20} />,
};

export default function Footer() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <footer id="corner" className="bg-navy-deep text-cream">
      <div className="container-x py-24">
        <Reveal>
          <div className="max-w-2xl mx-auto text-center">
            <p className="label-caps text-yellow mb-4">Content Corner</p>
            <h2 className="font-serif font-medium text-4xl md:text-5xl mb-5">
              One email a month. Real tools, real workflows, zero hype.
            </h2>
            <p className="text-dim-on-navy text-lg mb-10">
              Practical web &amp; content tips for founders and creators —
              straight from the projects I'm building.
            </p>

            {sent ? (
              <p className="text-yellow font-semibold text-lg">
                You're in. Check your inbox soon.
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row justify-center gap-3 max-w-lg mx-auto"
              >
                <input
                  required
                  type="email"
                  placeholder="you@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 rounded-full bg-navy border border-navy-line px-6 py-4 text-cream placeholder:text-dim-on-navy outline-none focus:border-yellow/60 transition-colors"
                />
                <button type="submit" className="yellow-pill cursor-pointer border-none">
                  Send Me The Letter
                </button>
              </form>
            )}
          </div>
        </Reveal>

        <div className="flex justify-center gap-6 mt-20 text-dim-on-navy">
          {socials.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              aria-label={s.label}
              className="hover:text-cream hover:-translate-y-0.5 transition-all"
            >
              {iconMap[s.label]}
            </a>
          ))}
        </div>

        <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 mt-8">
          {stops.map((s) => (
            <a
              key={s.id}
              href={`#${s.id}`}
              className="text-sm text-dim-on-navy hover:text-cream transition-colors"
            >
              {s.label}
            </a>
          ))}
        </nav>

        <div className="text-center mt-10 pb-16 text-sm text-dim-on-navy">
          <p>
            © {new Date().getFullYear()} Joseph — Web Developer &amp;
            Designer · Content Manager · Consultant · Social Media Manager
            · Content Creator
          </p>
          <p className="mt-2">Designed &amp; built by Joseph.</p>
        </div>
      </div>
    </footer>
  );
}
