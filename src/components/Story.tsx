import Reveal from "./Reveal";
import NextStop from "./NextStop";
import { AnimatedFall } from "@/components/ui/block-text";
import { socials } from "../data";
import portrait from "../assets/joseph-portrait.png";
import { FaInstagram, FaLinkedin, FaYoutube, FaXTwitter, FaBehance } from "react-icons/fa6";

const iconMap: Record<string, React.ReactNode> = {
  Instagram: <FaInstagram size={22} />,
  LinkedIn: <FaLinkedin size={22} />,
  YouTube: <FaYoutube size={22} />,
  "X / Twitter": <FaXTwitter size={22} />,
  Behance: <FaBehance size={22} />,
};

export default function Story() {
  return (
    <section id="about" className="bg-cream text-navy py-24 md:py-32">
      <div className="container-x">
        <Reveal>
          <p className="label-caps text-dim-on-cream mb-4">First Stop</p>
          <AnimatedFall color="#182342" className="mb-14">
            <h2 className="font-serif font-medium text-5xl md:text-6xl">This Is Joseph</h2>
          </AnimatedFall>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          <Reveal>
            <div className="relative rounded-xl overflow-hidden border border-cream-line shadow-xl">
              <img
                src={portrait}
                alt="Joseph — web developer and designer, seated with laptop"
                className="w-full aspect-4/5 object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="space-y-5 text-lg leading-relaxed text-navy/90">
              <p>
                Joseph is a web developer &amp; designer, content manager,
                and social media strategist helping founders and small
                teams build a presence that actually grows.
              </p>
              <p>
                His core belief is simple: a website is a foundation, not a
                finish line — it only works when the content and community
                around it keep moving.
              </p>
              <p>
                He started out designing and coding sites for small
                businesses that needed more than a template. Along the way
                he picked up the content and social side too, because a
                beautiful site with no audience doesn't grow anything.
                Today he works across the whole stack — design,
                development, content management, consulting, and social
                strategy. One person, one point of contact, no hand-offs
                lost in translation.
              </p>
            </div>

            <div className="flex items-center gap-5 mt-8 text-navy">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="hover:text-navy-soft hover:-translate-y-0.5 transition-all"
                >
                  {iconMap[s.label]}
                </a>
              ))}
            </div>

            <div className="mt-12">
              <NextStop href="#work" label="Next Stop: Work" />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
